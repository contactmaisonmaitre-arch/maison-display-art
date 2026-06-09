// Scraper de la grille TF1 depuis programme-tv.net.
// Sort un JSON sous public/data/tf1.json avec les programmes du soir.
//
// Utilisation :
//   node scripts/fetch-tf1.mjs
//
// Exécuté quotidiennement par .github/workflows/daily-tf1.yml.

import { writeFile, mkdir } from "node:fs/promises";

const TF1_URL =
  "https://www.programme-tv.net/programme/chaine/programme-tf1-19.html";

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

// Découpe le HTML en blocs "mainBroadcastCard" (1 par programme).
// On localise chaque ouverture et on extrait jusqu'à la prochaine (ou la fin
// de la section channelGrid-broadcasts) — l'imbrication HTML est trop touffue
// pour un regex de matching équilibré.
const splitCards = (html) => {
  // Restreint à la grille principale
  const gridStart = html.indexOf("channelGrid-broadcasts");
  const grid = gridStart >= 0 ? html.slice(gridStart) : html;

  const cards = [];
  const re = /data-broadcast-id="([^"]+)"/g;
  const indices = [];
  for (const m of grid.matchAll(re)) indices.push({ idx: m.index, id: m[1] });
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].idx;
    const end = i + 1 < indices.length ? indices[i + 1].idx : Math.min(grid.length, start + 8000);
    cards.push({ id: indices[i].id, html: grid.slice(start, end) });
  }
  return cards;
};

const pick = (html, re) => {
  const m = html.match(re);
  return m ? stripTags(m[1]) : null;
};

const parseCard = ({ id, html }) => {
  const hour = pick(html, /mainBroadcastCard-startingHour[^>]*>\s*([^<]+?)\s*</);
  const title = pick(
    html,
    /<h3 class="mainBroadcastCard-title">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/
  );
  const subtitle = pick(
    html,
    /<p class="mainBroadcastCard-subtitle">([\s\S]*?)<\/p>/
  );
  const format = pick(
    html,
    /<p class="mainBroadcastCard-format">([\s\S]*?)<\/p>/
  );
  const duration = pick(
    html,
    /<span class="mainBroadcastCard-durationContent">([\s\S]*?)<\/span>/
  );
  const isRebroadcast = /mainBroadcastCard-rebroadcast/.test(html);
  if (!hour || !title) return null;
  return {
    id,
    start: hour, // "20h05"
    title,
    subtitle: subtitle || undefined,
    format: format || undefined,
    duration: duration || undefined,
    rebroadcast: isRebroadcast,
  };
};

// Convertit "20h05" en minutes depuis minuit pour pouvoir filtrer le prime time.
const toMin = (hhmm) => {
  const m = /^(\d{1,2})h(\d{2})$/.exec(hhmm);
  if (!m) return -1;
  return Number(m[1]) * 60 + Number(m[2]);
};

const main = async () => {
  console.log(`Fetching ${TF1_URL}…`);
  const html = await fetchHtml(TF1_URL);
  console.log(`  → ${html.length} bytes`);

  const cards = splitCards(html);
  console.log(`Found ${cards.length} program cards.`);

  const programs = cards.map(parseCard).filter(Boolean);

  // Prime time : 19h00 → 00h30 (le lendemain). On garde aussi les programmes
  // de fin de soirée (jusqu'à 1h du matin) qu'on remappera en > 24h.
  const primeTime = programs
    .map((p) => {
      let mins = toMin(p.start);
      // Si l'heure est < 12h, on suppose c'est le lendemain (rebascule au-dessus de 24h)
      if (mins >= 0 && mins < 720) mins += 24 * 60;
      return { ...p, mins };
    })
    .filter((p) => p.mins >= 19 * 60 && p.mins <= 26 * 60)
    .sort((a, b) => a.mins - b.mins)
    .map(({ mins, ...rest }) => rest);

  const out = {
    channel: "TF1",
    source: TF1_URL,
    fetchedAt: new Date().toISOString(),
    primeTime,
  };

  const dir = new URL("../public/data/", import.meta.url).pathname;
  await mkdir(dir, { recursive: true });
  const path = `${dir}tf1.json`;
  await writeFile(path, JSON.stringify(out, null, 2) + "\n");

  console.log(`\nWrote ${path} — ${primeTime.length} prime-time programs.`);
  for (const p of primeTime.slice(0, 8)) {
    console.log(
      `  ${p.start.padEnd(6)} ${(p.format || "?").padEnd(14)} ${p.title}${p.subtitle ? ` — ${p.subtitle}` : ""}`
    );
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
