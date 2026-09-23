#!/usr/bin/env node
// Met à jour public/data/reviews.json avec la VRAIE note Google et les
// derniers avis 5 étoiles, via l'API Google Places (New).
//
// Nécessite le secret GitHub GOOGLE_PLACES_API_KEY (voir TV-README.md).
// Sans clé : le script ne fait rien et la TV garde le fichier actuel.
// Google ne renvoie que 5 avis par appel → on les accumule jour après jour
// (20 max, les plus récents d'abord).

import { readFile, writeFile } from "node:fs/promises";

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const OUT = new URL("../public/data/reviews.json", import.meta.url);
const QUERY = "Maison Maitre, 16 rue de Besançon, 39100 Dole";

if (!KEY) {
  console.log("Pas de GOOGLE_PLACES_API_KEY — avis inchangés.");
  process.exit(0);
}

const api = async (url, init) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`);
  return res.json();
};

const shortName = (full = "") => {
  const [first, ...rest] = full.trim().split(/\s+/);
  if (!first) return "Client";
  const cap = first.charAt(0).toUpperCase() + first.slice(1);
  return rest.length ? `${cap} ${rest[rest.length - 1].charAt(0).toUpperCase()}.` : cap;
};

const main = async () => {
  const prev = JSON.parse(await readFile(OUT, "utf8").catch(() => "{}"));
  let placeId = process.env.GOOGLE_PLACE_ID || prev.placeId;
  if (!placeId) {
    const found = await api("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": KEY,
        "X-Goog-FieldMask": "places.id,places.displayName",
      },
      body: JSON.stringify({ textQuery: QUERY, languageCode: "fr" }),
    });
    placeId = found.places?.[0]?.id;
    if (!placeId) throw new Error("Fiche Google introuvable");
  }

  const place = await api(
    `https://places.googleapis.com/v1/places/${placeId}?languageCode=fr`,
    { headers: { "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri" } },
  );

  const fresh = (place.reviews ?? [])
    .filter((r) => r.rating === 5)
    .map((r) => ({
      name: shortName(r.authorAttribution?.displayName),
      text: (r.originalText?.text ?? r.text?.text ?? "").replace(/\s+/g, " ").trim(),
      date: r.publishTime ?? null,
    }))
    .filter((r) => r.text.length >= 30 && r.text.length <= 280);

  const key = (r) => `${r.name}|${r.text.slice(0, 40)}`;
  const merged = new Map();
  for (const r of [...fresh, ...(prev.reviews ?? [])]) if (!merged.has(key(r))) merged.set(key(r), r);
  const reviews = [...merged.values()]
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, 20);

  const out = {
    source: "Google Places API",
    placeId,
    url: prev.url ?? place.googleMapsUri,
    rating: place.rating ?? prev.rating,
    count: place.userRatingCount ?? prev.count,
    reviews,
  };
  const sig = (o) => JSON.stringify([o.rating, o.count, o.reviews]);
  const same = sig(out) === sig(prev) && prev.placeId === placeId;
  await writeFile(OUT, `${JSON.stringify({ ...out, fetchedAt: same ? prev.fetchedAt : new Date().toISOString() }, null, 2)}\n`);
  console.log(`Note ${out.rating} (${out.count} avis), ${reviews.length} avis 5★ en stock.`);
};

main().catch((e) => {
  console.error("fetch-reviews:", e.message);
  process.exit(1);
});
