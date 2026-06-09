// Scraper grille TV pour les 5 chaînes phares depuis programme-tv.net.
// Sort un JSON sous public/data/tv-tonight.json avec, pour chaque chaîne,
// le programme prime-time du soir (filtré des fillers : météo, jeux courts…)
//
// Utilisation :    node scripts/fetch-tv-tonight.mjs
// Auto (cron) :    .github/workflows/daily-tv.yml

import { writeFile, mkdir } from "node:fs/promises";

const CHANNELS = [
  { name: "TF1", url: "https://www.programme-tv.net/programme/chaine/programme-tf1-19.html" },
  { name: "France 2", url: "https://www.programme-tv.net/programme/chaine/programme-france-2-6.html" },
  { name: "France 5", url: "https://www.programme-tv.net/programme/chaine/programme-france-5-9.html" },
  { name: "Arte", url: "https://www.programme-tv.net/programme/chaine/programme-arte-337.html" },
  { name: "M6", url: "https://www.programme-tv.net/programme/chaine/programme-m6-12.html" },
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const fetchHtml = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`fetch ${url} → HTTP ${res.status}`);
  return res.text();
};

const stripTags = (s) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Programmes "filler" qu'on ne veut pas considérer comme le hero du soir.
// Note : on évite les heuristiques de longueur — Koh-Lanta (9 lettres,
// format "Autre") tombait dans le filtre alors qu'on veut le voir.
const isFiller = (title) => {
  const t = title.toLowerCase();
  if (/^météo\b/i.test(title) || /^meteo\b/i.test(t)) return true;
  if (/^journal\b|^jt\b|^le 20h\b|^le 19\/20\b|^le 12h\b/i.test(t)) return true;
  if (/^my million\b/.test(t)) return true;
  if (/^petits plats/i.test(t)) return true;
  if (/^demain à la une\b/i.test(t)) return true;
  if (/^une minute pour /i.test(t)) return true;
  if (/^un si grand soleil$/i.test(t)) return true; // ce n'est pas un hero
  return false;
};

// Parse les blocs "mainBroadcastCard" — découpe par data-broadcast-id.
const parseCards = (html) => {
  const gridStart = html.indexOf("channelGrid-broadcasts");
  const grid = gridStart >= 0 ? html.slice(gridStart) : html;
  const indices = [];
  const re = /data-broadcast-id="([^"]+)"/g;
  for (const m of grid.matchAll(re)) indices.push({ idx: m.index, id: m[1] });
  const blocks = [];
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].idx;
    const end = i + 1 < indices.length ? indices[i + 1].idx : Math.min(grid.length, start + 8000);
    blocks.push({ id: indices[i].id, html: grid.slice(start, end) });
  }
  return blocks
    .map(({ id, html: b }) => {
      const hour = (b.match(/mainBroadcastCard-startingHour[^>]*>\s*([^<]+?)\s*</) || [])[1];
      const titleMatch = b.match(/<h3 class="mainBroadcastCard-title">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
      const subtitleMatch = b.match(/<p class="mainBroadcastCard-subtitle">([\s\S]*?)<\/p>/);
      const formatMatch = b.match(/<p class="mainBroadcastCard-format">([\s\S]*?)<\/p>/);
      const durationMatch = b.match(/<span class="mainBroadcastCard-durationContent">([\s\S]*?)<\/span>/);
      const isRebroadcast = /mainBroadcastCard-rebroadcast/.test(b);
      if (!hour || !titleMatch) return null;
      return {
        id,
        start: hour,
        title: stripTags(titleMatch[1]),
        subtitle: subtitleMatch ? stripTags(subtitleMatch[1]) : undefined,
        format: formatMatch ? stripTags(formatMatch[1]) : undefined,
        duration: durationMatch ? stripTags(durationMatch[1]) : undefined,
        rebroadcast: isRebroadcast,
      };
    })
    .filter(Boolean);
};

const toMin = (hhmm) => {
  const m = /^(\d{1,2})h(\d{2})$/.exec(hhmm);
  if (!m) return -1;
  return Number(m[1]) * 60 + Number(m[2]);
};

// Pour 1 chaîne : retourne le hero prime-time + le programme suivant (en seconde
// partie de soirée).
const pickPrimeTime = (programs) => {
  const enriched = programs
    .map((p) => {
      let mins = toMin(p.start);
      if (mins >= 0 && mins < 720) mins += 24 * 60; // après minuit
      return { ...p, mins };
    })
    .filter((p) => p.mins >= 19 * 60 && p.mins <= 26 * 60)
    .filter((p) => !isFiller(p.title))
    .sort((a, b) => a.mins - b.mins);

  // Hero = premier programme à partir de 21h00 — ça évite les interludes
  // courts de 20h50-20h55 ("Le dessous des cartes : l'essentiel" 1 min,
  // "Basique l'essentiel" 5 min, "Scènes de ménages" épisode de 4 min…)
  // qui précèdent le vrai prime-time.
  const hero = enriched.find((p) => p.mins >= 21 * 60) ?? enriched[0];
  const next = enriched.find((p) => p.mins > (hero?.mins ?? 0) + 30);

  const clean = (p) => p && {
    start: p.start,
    title: p.title,
    subtitle: p.subtitle,
    format: p.format,
    duration: p.duration,
    rebroadcast: p.rebroadcast,
  };

  return {
    hero: clean(hero) ?? null,
    next: clean(next) ?? null,
  };
};

const fetchChannel = async ({ name, url }) => {
  try {
    const html = await fetchHtml(url);
    const programs = parseCards(html);
    const { hero, next } = pickPrimeTime(programs);
    return { name, url, hero, next, error: null };
  } catch (e) {
    return { name, url, hero: null, next: null, error: String(e) };
  }
};

const main = async () => {
  console.log(`Fetching ${CHANNELS.length} channels…\n`);
  const channels = [];
  for (const ch of CHANNELS) {
    process.stdout.write(`  ${ch.name.padEnd(10)} … `);
    const res = await fetchChannel(ch);
    if (res.error) {
      console.log(`ERROR ${res.error}`);
    } else if (res.hero) {
      console.log(`${res.hero.start} ${res.hero.title}${res.hero.subtitle ? " — " + res.hero.subtitle : ""}`);
    } else {
      console.log("(no prime-time program found)");
    }
    channels.push(res);
  }

  const out = {
    fetchedAt: new Date().toISOString(),
    channels,
  };

  const dir = new URL("../public/data/", import.meta.url).pathname;
  await mkdir(dir, { recursive: true });
  const path = `${dir}tv-tonight.json`;
  await writeFile(path, JSON.stringify(out, null, 2) + "\n");

  const ok = channels.filter((c) => c.hero).length;
  console.log(`\nWrote ${path} — ${ok}/${channels.length} channels with prime-time hero.`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
