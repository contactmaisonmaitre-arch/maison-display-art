// Scraper événements Dole depuis sortiradole.fr.
// Sort un JSON sous public/data/dole-events.json avec les événements
// marquants des prochaines semaines.
//
// Utilisation :   node scripts/fetch-dole-events.mjs
// Auto :          .github/workflows/weekly-dole-events.yml

import { writeFile, mkdir } from "node:fs/promises";

const URL_ROOT = "https://www.sortiradole.fr/";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const fetchHtml = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`fetch ${url} → HTTP ${res.status}`);
  return res.text();
};

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&Agrave;/g, "À")
    .replace(/&agrave;/g, "à")
    .replace(/&Eacute;/g, "É")
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/&ecirc;/g, "ê")
    .replace(/&icirc;/g, "î")
    .replace(/&ocirc;/g, "ô")
    .replace(/&ucirc;/g, "û")
    .replace(/&ccedil;/g, "ç")
    .replace(/&[a-zA-Z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Lieux concurrents qu'on ne veut PAS promouvoir sur l'écran Maison Maitre.
// Toute occurrence (lieu OU titre) bloque l'événement. Ajouter ici les
// nouveaux établissements concurrents dont on veut filtrer les events.
const COMPETITOR_PATTERNS = [
  /au\s*d[ée]tour/i, // Au Détour (bar à Dole)
];

const isCompetitor = (title, location) => {
  const txt = `${title} ${location}`;
  return COMPETITOR_PATTERNS.some((re) => re.test(txt));
};

// Devine un emoji par catégorie / lieu / titre — purement éditorial.
const guessEmoji = (title, location) => {
  const t = (title + " " + location).toLowerCase();
  if (/musée|expo|peindre|art|art\b/.test(t)) return "🎨";
  if (/concert|musique|jazz|rock|gala/.test(t)) return "🎶";
  if (/danse|ballet/.test(t)) return "🩰";
  if (/match|sport|rugby|tournoi|football/.test(t)) return "🏆";
  if (/marché|march|brocante|foire/.test(t)) return "🥖";
  if (/théâtre|spectacle/.test(t)) return "🎭";
  if (/festival|fête|fête de/.test(t)) return "🎉";
  if (/médiathèque|bibliothèque|livre|histoire/.test(t)) return "📚";
  if (/archéologie|patrimoine/.test(t)) return "🏺";
  if (/cinéma|film/.test(t)) return "🎬";
  if (/parent|enfant|famille|atelier/.test(t)) return "👨‍👩‍👧";
  if (/vins?|vigneron|bar/.test(t)) return "🍷";
  if (/café/.test(t)) return "☕";
  return "📍";
};

const parseEvents = (html) => {
  // Découpe la frise en cases jour
  const cases = html.split(/<li id="c\d+" class="casesSly"/).slice(1);
  const seen = new Map(); // uid → {date, title, location, isAlaune}

  for (const block of cases) {
    // Date du jour : data-datetitre="MARDI 02 JUIN"
    const dateMatch = block.match(/data-datetitre="([^"]+)"/);
    const date = dateMatch ? decode(dateMatch[1]) : "";

    // Chaque event est un <a class="clickEvts blocEvents...">
    const eventRe =
      /<a[^>]*data-uid="(\d+)"[^>]*class="clickEvts blocEvents([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
    for (const m of block.matchAll(eventRe)) {
      const uid = m[1];
      const isAutre = /blocEventsAutres/.test(m[2]);
      const inner = m[3];
      const titleMatch = inner.match(/<p class="niv1">([\s\S]*?)<\/p>/);
      const locMatch = inner.match(/<div class="categorie[^>]*>\s*<p>([\s\S]*?)<\/p>/);
      if (!titleMatch) continue;
      const title = decode(titleMatch[1]);
      const location = locMatch ? decode(locMatch[1].replace(/<br\s*\/?>/g, " · ")) : "";
      if (!seen.has(uid)) {
        seen.set(uid, {
          uid,
          date,
          title,
          location,
          isAlaune: !isAutre, // les "À la une" sont les blocEvents principaux (pas blocEventsAutres)
        });
      } else if (!isAutre && !seen.get(uid).isAlaune) {
        // Si on revoit l'event en "À la une" alors qu'il était juste listé,
        // on upgrade.
        seen.get(uid).isAlaune = true;
      }
    }
  }

  return Array.from(seen.values());
};

const main = async () => {
  console.log(`Fetching ${URL_ROOT}…`);
  const html = await fetchHtml(URL_ROOT);
  console.log(`  → ${html.length} bytes`);

  const rawEvents = parseEvents(html);
  console.log(`Found ${rawEvents.length} unique events.`);

  // Filtre concurrents — Au Détour & cie qu'on ne veut pas mettre en avant.
  const blocked = rawEvents.filter((e) => isCompetitor(e.title, e.location));
  if (blocked.length > 0) {
    console.log(`  Filtered ${blocked.length} competitor events :`);
    for (const b of blocked) console.log(`    × ${b.title} — ${b.location}`);
  }
  const allEvents = rawEvents.filter((e) => !isCompetitor(e.title, e.location));

  // On garde uniquement les "À la une" + on cap à 16 pour ne pas noyer
  // la rotation DoleScene.
  const featured = allEvents.filter((e) => e.isAlaune);
  const picked = (featured.length >= 8 ? featured : allEvents).slice(0, 16);

  const facts = picked.map((e) => {
    // Body : "Date — Lieu. (lien sortiradole.fr)"
    const dateClean = e.date ? e.date.toLowerCase() : "";
    const where = e.location ? ` à ${e.location}` : "";
    const body = dateClean
      ? `${dateClean.charAt(0).toUpperCase()}${dateClean.slice(1)}${where}.`
      : `${e.location}.`;
    return {
      emoji: guessEmoji(e.title, e.location),
      title: e.title,
      body,
    };
  });

  const out = {
    source: URL_ROOT,
    fetchedAt: new Date().toISOString(),
    facts,
  };

  const dir = new URL("../public/data/", import.meta.url).pathname;
  await mkdir(dir, { recursive: true });
  const path = `${dir}dole-events.json`;
  await writeFile(path, JSON.stringify(out, null, 2) + "\n");

  console.log(`\nWrote ${path} — ${facts.length} events.`);
  for (const f of facts.slice(0, 8)) {
    console.log(`  ${f.emoji}  ${f.title.padEnd(50)} ${f.body}`);
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
