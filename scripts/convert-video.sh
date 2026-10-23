#!/bin/bash
# Prépare une vidéo pour l'écran TV : MP4 H.264 1080p, sans son, ~4 Mbit/s,
# lecture immédiate (+faststart), + une image fixe .webp (poster).
#
#   scripts/convert-video.sh ~/Movies/feu.mov cheminee      → public/videos/cheminee.mp4 + .webp
#   scripts/convert-video.sh ~/Movies/torref.mp4 torrefaction 20   → coupe à 20 s
#
# Besoin de ffmpeg (Mac : brew install ffmpeg).
set -e
IN="$1"; NAME="$2"; MAX="$3"
if [ -z "$IN" ] || [ -z "$NAME" ]; then
  echo "Usage : $0 <vidéo source> <nom> [durée max en s]"; exit 1
fi
cd "$(dirname "$0")/.."
mkdir -p public/videos
OUT="public/videos/$NAME.mp4"
DUR=()
[ -n "$MAX" ] && DUR=(-t "$MAX")
ffmpeg -y -i "$IN" "${DUR[@]}" -an \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30" \
  -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p \
  -preset slow -b:v 4M -maxrate 5M -bufsize 8M -g 60 \
  -movflags +faststart "$OUT"
ffmpeg -y -ss 1 -i "$OUT" -frames:v 1 -vf "scale=1920:-2" -c:v libwebp -quality 80 "public/videos/$NAME.webp"
echo "OK : $OUT ($(du -h "$OUT" | cut -f1)) + public/videos/$NAME.webp"
echo "Pour une boucle sans à-coup : choisir un plan fixe, sans mouvement de caméra."
