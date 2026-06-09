import sharp from "sharp";
import { readFile } from "node:fs/promises";

const SRC_DIR = "/Users/maximemaitre/Desktop/VISUEL";
const OUT_DIR = "/Users/maximemaitre/maison-display-art/public/instagram";

const list = (await readFile("/tmp/insta-list.txt", "utf8"))
  .trim()
  .split("\n")
  .map((s) => s.replace(/^\.\//, ""));

console.log(`Converting ${list.length} photos…`);
let totalBefore = 0;
let totalAfter = 0;

for (let i = 0; i < list.length; i++) {
  const inPath = `${SRC_DIR}/${list[i]}`;
  const outPath = `${OUT_DIR}/insta-${String(i + 1).padStart(2, "0")}.webp`;
  const meta = await sharp(inPath).metadata();
  // Cap max longest side to 1600px — bien assez pour fullscreen TV
  const opts =
    meta.width && meta.width > meta.height
      ? { width: Math.min(meta.width, 1600) }
      : { height: Math.min(meta.height ?? 1600, 1600) };
  await sharp(inPath)
    .rotate() // respecte l'orientation EXIF
    .resize(opts)
    .webp({ quality: 78, effort: 5 })
    .toFile(outPath);
  const { statSync } = await import("node:fs");
  const sIn = statSync(inPath).size;
  const sOut = statSync(outPath).size;
  totalBefore += sIn;
  totalAfter += sOut;
  console.log(
    `  ${String(i + 1).padStart(2, "0")}  ${(sIn / 1024).toFixed(0).padStart(6)}K → ${(sOut / 1024).toFixed(0).padStart(5)}K  (${list[i]})`
  );
}

console.log(
  `\nTotal : ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB`
);
