#!/usr/bin/env node
// Récupère les dernières publications Instagram de @maison_maitre et les
// prépare pour la TV : public/instagram-feed/*.webp + public/data/instagram.json
//
// Nécessite le secret GitHub IG_ACCESS_TOKEN (jeton longue durée de l'API
// Instagram, voir TV-README.md). Sans jeton : rien ne change, la TV garde
// les 25 photos sélectionnées à la main (public/instagram/).
//
// Pour écarter une publication de la TV : mettre #notv dans sa légende.
// Le jeton expire au bout de 60 jours : le script le prolonge chaque lundi
// et l'écrit dans $IG_TOKEN_OUT pour que le workflow mette à jour le secret.

import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import sharp from "sharp";

const TOKEN = process.env.IG_ACCESS_TOKEN;
const MAX = Number(process.env.IG_MAX ?? 24);
const DIR = new URL("../public/instagram-feed/", import.meta.url);
const OUT = new URL("../public/data/instagram.json", import.meta.url);

if (!TOKEN) {
  console.log("Pas de IG_ACCESS_TOKEN — photos Instagram inchangées.");
  process.exit(0);
}

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Instagram ${res.status}: ${await res.text()}`);
  return res.json();
};

const main = async () => {
  const fields = "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp";
  const { data = [] } = await get(
    `https://graph.instagram.com/me/media?fields=${fields}&limit=50&access_token=${TOKEN}`,
  );

  const picks = data
    .filter((m) => !/#notv\b/i.test(m.caption ?? ""))
    .map((m) => ({ ...m, image: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url }))
    .filter((m) => m.image)
    .slice(0, MAX);

  if (picks.length === 0) throw new Error("Aucune publication exploitable");

  await mkdir(DIR, { recursive: true });
  const keep = new Set();
  for (const m of picks) {
    const file = `${m.id}.webp`;
    keep.add(file);
    const existing = await readFile(new URL(file, DIR)).catch(() => null);
    if (existing) continue; // déjà téléchargée
    const res = await fetch(m.image);
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(
      new URL(file, DIR),
      await sharp(buf).resize(1080, 1080, { fit: "cover" }).webp({ quality: 78 }).toBuffer(),
    );
  }
  for (const f of await readdir(DIR)) {
    if (f.endsWith(".webp") && !keep.has(f)) await unlink(new URL(f, DIR));
  }

  const photos = picks
    .filter((m) => keep.has(`${m.id}.webp`))
    .map((m) => ({ src: `instagram-feed/${m.id}.webp`, permalink: m.permalink, date: m.timestamp }));

  const prev = JSON.parse(await readFile(OUT, "utf8").catch(() => "{}"));
  const same = JSON.stringify(prev.photos) === JSON.stringify(photos);
  await writeFile(
    OUT,
    `${JSON.stringify({ account: "maison_maitre", fetchedAt: same ? prev.fetchedAt : new Date().toISOString(), photos }, null, 2)}\n`,
  );
  console.log(`${photos.length} photos Instagram prêtes.`);

  // Prolongation du jeton (chaque lundi).
  if (new Date().getUTCDay() === 1 && process.env.IG_TOKEN_OUT) {
    const r = await get(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`,
    ).catch((e) => (console.warn("Jeton non prolongé:", e.message), null));
    if (r?.access_token) {
      await writeFile(process.env.IG_TOKEN_OUT, r.access_token);
      console.log("Jeton Instagram prolongé.");
    }
  }
};

main().catch((e) => {
  console.error("fetch-instagram:", e.message);
  process.exit(1);
});
