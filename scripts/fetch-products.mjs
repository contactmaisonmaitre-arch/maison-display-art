#!/usr/bin/env node
// Récupère le catalogue public de maisonmaitre.com (Shopify /products.json,
// sans clé API) et écrit public/data/products.json pour la TV.
//
// Fusion : les produits vus aujourd'hui sont mis à jour (prix, photo, stock).
// Ceux qui ne sont plus publiés en ligne (ex. thés désactivés du site) sont
// conservés avec `online: false` — la boutique physique les vend toujours.
// Pour en retirer un de la TV : l'ajouter à `exclude` dans
// public/data/coups-de-coeur.json.

import { readFile, writeFile } from "node:fs/promises";
import { isTvEligible, mapProduct } from "./lib/products-map.mjs";

const STORE = process.env.SHOP_URL ?? "https://maisonmaitre.com";
const OUT = new URL("../public/data/products.json", import.meta.url);

async function fetchAll() {
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(`${STORE}/products.json?limit=250&page=${page}`, {
      headers: { "User-Agent": "MaisonMaitreTV/1.0 (+https://maisonmaitre.com)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} sur la page ${page}`);
    const { products } = await res.json();
    all.push(...products);
    if (products.length < 250) break;
  }
  return all;
}

const readJson = async (url, fallback) => {
  try {
    return JSON.parse(await readFile(url, "utf8"));
  } catch {
    return fallback;
  }
};

const main = async () => {
  const previous = await readJson(OUT, { products: [] });
  const raw = await fetchAll();
  if (raw.length === 0) throw new Error("Catalogue vide — on ne touche à rien.");

  const fresh = raw.filter(isTvEligible).map((p) => ({ ...mapProduct(p), online: true }));
  const seen = new Set(fresh.map((p) => p.handle));
  const kept = (previous.products ?? [])
    .filter((p) => !seen.has(p.handle))
    .map((p) => ({ ...p, online: false }));

  const products = [...fresh, ...kept];
  const unchanged = JSON.stringify(products) === JSON.stringify(previous.products);
  const out = {
    source: STORE,
    // On ne bouge la date que si le catalogue a changé → pas de commit inutile.
    fetchedAt: unchanged && previous.fetchedAt ? previous.fetchedAt : new Date().toISOString(),
    products,
  };
  await writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`${fresh.length} produits en ligne, ${kept.length} conservés hors ligne.`);
};

main().catch((e) => {
  console.error("fetch-products:", e.message);
  process.exit(1);
});
