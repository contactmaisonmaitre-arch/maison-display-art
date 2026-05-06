import { useEffect, useState } from "react";

// Reels Instagram @maison_maitre — images animées, plus compatibles avec les navigateurs TV que les MP4.
const INSTAGRAM_REELS = ["DXtn06bIgtd", "DXjAgNRirlr", "DXPVGNDioOU"];
const REELS_PATH = "/reels-tv";

// Vrai logo Instagram (caméra) en SVG, gradient officiel
const InstagramLogo = ({ size = 72 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FED576" />
        <stop offset="26%" stopColor="#F47133" />
        <stop offset="61%" stopColor="#BC3081" />
        <stop offset="100%" stopColor="#4F5BD5" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#ig-grad)" />
    <rect x="12" y="12" width="40" height="40" rx="11" fill="none" stroke="#fff" strokeWidth="3.2" />
    <circle cx="32" cy="32" r="9" fill="none" stroke="#fff" strokeWidth="3.2" />
    <circle cx="46" cy="18" r="2.8" fill="#fff" />
  </svg>
);

// Précharge uniquement les formats image : certaines TV affichent un écran noir au lieu de lire les MP4.
const preloadReelAssets = (reelId: string) => {
  if (typeof window === "undefined") return;
  [`${REELS_PATH}/${reelId}.webp`, `${REELS_PATH}/${reelId}.gif`, `${REELS_PATH}/${reelId}.jpg`].forEach((href) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    document.head.appendChild(link);
  });
};
if (typeof window !== "undefined") INSTAGRAM_REELS.forEach(preloadReelAssets);

export const InstagramScene = ({ active, reelIndex = 0 }: { active: boolean; reelIndex?: number }) => {
  const idx = reelIndex % INSTAGRAM_REELS.length;
  const reelId = INSTAGRAM_REELS[idx];
  const nextId = INSTAGRAM_REELS[(idx + 1) % INSTAGRAM_REELS.length];
  const [fallbackSrc, setFallbackSrc] = useState<string>(`${REELS_PATH}/${reelId}.webp`);

  useEffect(() => {
    setFallbackSrc(`${REELS_PATH}/${reelId}.webp`);
    preloadReelAssets(reelId);
    preloadReelAssets(nextId);
  }, [reelId, nextId]);

  // Cette prop est conservée pour permettre des optimisations futures (lazy mount, autoplay).
  void active;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Backdrop flouté avec la même image — pour habiller les bandes latérales */}
      <img
        aria-hidden
        src={fallbackSrc}
        alt=""
        className="absolute inset-0 h-full w-full"
        style={{
          objectFit: "cover",
          filter: "blur(48px) brightness(0.45) saturate(1.2)",
          transform: "scale(1.15)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.75) 100%)" }}
      />

      {/* Reel plein écran, ratio 9:16 conservé, jamais coupé */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "mm-fade-in 0.8s ease-out both" }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "9 / 16",
            height: "96%",
            maxWidth: "96%",
            borderRadius: 24,
            boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.35)",
            background: "#000",
          }}
        >
          <img
            key={fallbackSrc}
            src={fallbackSrc}
            alt=""
            className="h-full w-full"
            onError={() => setFallbackSrc((src) => src.endsWith(".webp") ? `${REELS_PATH}/${reelId}.gif` : `${REELS_PATH}/${reelId}.jpg`)}
            style={{ objectFit: "contain", background: "#000" }}
          />

          {/* Compteur REEL X/3 — top right */}
          <div
            className="absolute top-6 right-6 font-sans-ui uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "0.32em",
              color: "rgba(201,168,76,0.95)",
              padding: "8px 14px",
              border: "1px solid rgba(201,168,76,0.45)",
              borderRadius: 2,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
            }}
          >
            Reel {idx + 1} / {INSTAGRAM_REELS.length}
          </div>

          {/* Overlay bas — logo Instagram + handle + thème + CTA */}
          <div
            className="absolute left-0 right-0 bottom-0 flex items-center gap-5 px-8 pb-8 pt-24"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.9) 100%)",
            }}
          >
            <InstagramLogo size={44} />
            <div className="flex flex-col">
              <div
                className="font-serif-display"
                style={{ fontSize: 32, lineHeight: 1, color: "#fff", letterSpacing: "0.01em", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
              >
                @maison_maitre
              </div>
              <div
                className="font-sans-ui uppercase mt-2"
                style={{ fontSize: 11, letterSpacing: "0.3em", color: "rgba(201,168,76,0.9)" }}
              >
                Cafés · Thés · Vins nature
              </div>
            </div>
            <div
              className="ml-auto font-sans-ui uppercase"
              style={{
                fontSize: 13,
                letterSpacing: "0.28em",
                color: "hsl(var(--gold))",
                padding: "14px 26px",
                border: "1.5px solid hsl(var(--gold))",
                borderRadius: 2,
                background: "rgba(0,0,0,0.35)",
              }}
            >
              Suivez-nous
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
