#!/usr/bin/env node
// Met à jour public/data/the-des-maitre.json (scène « thedesmaitre ») avec les
// prix et formats de la boutique Shopify Thé des Maitre (catalogue public
// /products.json, sans clé API).
//
// Seuls prix et format sont touchés : la liste des thés, leurs images et les
// textes restent ceux du fichier (modifiables à la main). Un thé introuvable
// sur la boutique garde ses valeurs. Le stock en ligne n'est pas repris : il ne
// dit pas ce que la boutique physique a en rayon.

import { readFile, writeFile } from "node:fs/promises";

const STORE = process.env.TDM_SHOP_URL ?? "https://wcqtpq-0h.myshopify.com";
const FILE = new URL("../public/data/the-des-maitre.json", import.meta.url);

const norm = (s) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "'")
    .toLowerCase()
    .trim();

const eur = (amount) => {
  const n = Number(amount);
  return Number.isFinite(n) ? `${n.toFixed(2).replace(".", ",")} €` : null;
};

const main = async () => {
  const res = await fetch(`${STORE}/products.json?limit=250`, {
    headers: { "User-Agent": "MaisonMaitreTV/1.0 (+https://maisonmaitre.com)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { products } = await res.json();
  if (!products?.length) throw new Error("Catalogue vide — on ne touche à rien.");
  const byName = new Map(products.map((p) => [norm(p.title), p]));

  const data = JSON.parse(await readFile(FILE, "utf8"));
  const before = JSON.stringify(data);
  let found = 0;
  const update = (item) => {
    const p = item && byName.get(norm(item.nom));
    if (!p) return;
    found++;
    const v = p.variants[0];
    item.prix = eur(v.price) ?? item.prix;
    if (v.title && v.title !== "Default Title") item.format = v.title;
  };
  update(data.coffret);
  data.teas.forEach(update);

  if (JSON.stringify(data) === before) {
    console.log(`Aucun changement (${found} produits retrouvés).`);
    return;
  }
  await writeFile(FILE, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Mis à jour : ${found} produits retrouvés sur ${data.teas.length + (data.coffret ? 1 : 0)}.`);
};

main().catch((e) => {
  console.error("fetch-the-des-maitre:", e.message);
  process.exit(1);
});
