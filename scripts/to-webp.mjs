// Conversion JPEG/PNG → WebP des assets statiques. One-shot, lance avec :
//   node scripts/to-webp.mjs
// Conserve les originaux côte à côte (au cas où). Le code applicatif référence
// les .webp en priorité ; les originaux peuvent être retirés une fois validé.

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const ROOT = new URL("../public/", import.meta.url).pathname;

// Dossiers à traiter et qualité associée.
const TARGETS = [
  { dir: "scenes", quality: 75, alpha: false },
  { dir: "cave", quality: 78, alpha: false },
  { dir: "products", quality: 85, alpha: true },
];

const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png"]);

async function convert(file, quality) {
  const out = file.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  await sharp(file).webp({ quality, effort: 5 }).toFile(out);
  const [a, b] = await Promise.all([stat(file), stat(out)]);
  const pct = ((1 - b.size / a.size) * 100).toFixed(0);
  return { file, out, before: a.size, after: b.size, pct };
}

const fmt = (n) => (n / 1024).toFixed(0) + "K";

let totalBefore = 0;
let totalAfter = 0;

for (const target of TARGETS) {
  const dir = join(ROOT, target.dir);
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    console.log(`(skip ${target.dir} — no folder)`);
    continue;
  }
  console.log(`\n— ${target.dir}/ (q=${target.quality})`);
  for (const name of entries) {
    const ext = parse(name).ext.toLowerCase();
    if (!SOURCE_EXT.has(ext)) continue;
    const file = join(dir, name);
    const r = await convert(file, target.quality);
    totalBefore += r.before;
    totalAfter += r.after;
    console.log(`  ${name.padEnd(36)} ${fmt(r.before).padStart(6)} → ${fmt(r.after).padStart(6)}  (-${r.pct}%)`);
  }
}

console.log(
  `\nTotal : ${fmt(totalBefore)} → ${fmt(totalAfter)}  (-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`
);
