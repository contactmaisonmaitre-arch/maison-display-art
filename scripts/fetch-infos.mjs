#!/usr/bin/env node
// Infos du jour pour la TV → public/data/infos.json
//  - prochaines vacances scolaires (académie de Besançon, zone A) :
//    data.education.gouv.fr (open data, sans clé)
//  - « Ce jour-là » : éphémérides de Wikipédia en français, filtrées pour
//    écarter guerres, attentats, catastrophes… (écran de boutique, pas un JT)
// Chaque bloc est indépendant : si une source échoue, on garde l'ancien.

import { readFile, writeFile } from "node:fs/promises";

const OUT = new URL("../public/data/infos.json", import.meta.url);
const UA = { "User-Agent": "MaisonMaitreTV/1.0 (maisonmaitre.com)" };

const BLOCK =
  /guerre|bataille|attentat|massacre|meurtre|assassin|tu[ée]s?\b|mort|décè|exécut|bombard|catastroph|crash|accident|séisme|tremblement|génocide|terror|otage|nazi|coup d'[ÉE]tat|émeute|fusill|invasion|annex|armée|militaire|arme|nucléaire|victime|naufrage|incendie|épidémie|attaque|shoah|déport|élection|référendum|président|parti|gouvernement|premier ministre|dictat|révolution/i;

const today = new Date();
const paris = today.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" }); // AAAA-MM-JJ
const [, mm, dd] = paris.split("-");

async function vacances() {
  const where = encodeURIComponent(`location="Besançon" and end_date>="${paris}"`);
  const url = `https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?where=${where}&order_by=start_date&limit=4&select=description,start_date,end_date,zones`;
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`vacances HTTP ${res.status}`);
  const { results = [] } = await res.json();
  const seen = new Set();
  return results
    .filter((r) => !seen.has(r.description) && seen.add(r.description))
    .map((r) => ({
      name: r.description,
      // Les dates API sont en UTC (22h/23h la veille) → date de Paris.
      start: new Date(r.start_date).toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" }),
      end: new Date(r.end_date).toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" }),
      zone: r.zones,
    }));
}

async function ephemerides() {
  const res = await fetch(`https://fr.wikipedia.org/api/rest_v1/feed/onthisday/all/${mm}/${dd}`, { headers: UA });
  if (!res.ok) throw new Error(`wikipedia HTTP ${res.status}`);
  const data = await res.json();
  const clean = (t) => t.replace(/\s+/g, " ").trim();
  const events = [...(data.selected ?? []), ...(data.events ?? [])]
    .filter((e) => e.year && e.text && e.text.length < 190 && !BLOCK.test(e.text))
    .map((e) => ({ year: e.year, text: clean(e.text), kind: "event" }));
  const births = (data.births ?? [])
    .filter((e) => e.year && e.text && e.text.length < 150 && !BLOCK.test(e.text) && e.year > 1500)
    .map((e) => ({ year: e.year, text: clean(e.text), kind: "birth" }));
  const uniq = (arr) => arr.filter((e, i) => arr.findIndex((x) => x.text === e.text) === i);
  return { date: paris, events: uniq(events).slice(0, 6), births: uniq(births).slice(0, 6) };
}

const main = async () => {
  const prev = JSON.parse(await readFile(OUT, "utf8").catch(() => "{}"));
  const out = { ...prev };
  try {
    out.vacances = await vacances();
  } catch (e) {
    console.warn("vacances :", e.message);
  }
  try {
    out.ephemerides = await ephemerides();
  } catch (e) {
    console.warn("éphémérides :", e.message);
  }
  const { fetchedAt: _ignore, ...a } = prev;
  const { fetchedAt: _ignore2, ...b } = out;
  if (JSON.stringify(a) === JSON.stringify(b)) return console.log("Infos inchangées.");
  out.fetchedAt = new Date().toISOString();
  await writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`Vacances : ${out.vacances?.length ?? 0} · éphémérides : ${out.ephemerides?.events?.length ?? 0} faits.`);
};

main().catch((e) => {
  console.error("fetch-infos:", e.message);
  process.exit(1);
});
