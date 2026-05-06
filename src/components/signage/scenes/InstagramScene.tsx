import { useEffect, useRef, useState } from "react";

// Reels Instagram @maison_maitre
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

// Précharge la vidéo et le poster pour minimiser le flash entre reels
const preloadReelAssets = (reelId: string) => {
  if (typeof window === "undefined") return;
  const links: { href: string; as: string; type?: string }[] = [
    { href: `${REELS_PATH}/${reelId}.mp4`, as: "video", type: "video/mp4" },
    { href: `${REELS_PATH}/${reelId}.jpg`, as: "image" },
  ];
  for (const { href, as, type } of links) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = as;
    if (type) link.type = type;
    link.href = href;
    document.head.appendChild(link);
  }
};
if (typeof window !== "undefined") INSTAGRAM_REELS.forEach(preloadReelAssets);

type FallbackStage = "video" | "webp" | "gif" | "jpg";

export const InstagramScene = ({ active, reelIndex = 0 }: { active: boolean; reelIndex?: number }) => {
  const idx = reelIndex % INSTAGRAM_REELS.length;
  const reelId = INSTAGRAM_REELS[idx];
  const nextId = INSTAGRAM_REELS[(idx + 1) % INSTAGRAM_REELS.length];

  const [stage, setStage] = useState<FallbackStage>("video");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reset à chaque changement de reel + précharge le suivant
  useEffect(() => {
    setStage("video");
    preloadReelAssets(reelId);
    preloadReelAssets(nextId);
  }, [reelId, nextId]);

  // Pause la vidéo quand la scène devient inactive (économise CPU/GPU sur TV)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => setStage("webp"));
    } else {
      v.pause();
    }
  }, [active, stage]);

  const fallbackTo = (next: FallbackStage) => setStage(next);

  // Source d'image fallback selon l'étape
  const fallbackSrc =
    stage === "webp"
      ? `${REELS_PATH}/${reelId}.webp`
      : stage === "gif"
        ? `${REELS_PATH}/${reelId}.gif`
        : `${REELS_PATH}/${reelId}.jpg`;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #14110C 0%, #050505 70%)",
      }}
    >
      {/* halos doux pour habiller le fond */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-20%",
          left: "-10%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-25%",
          right: "-10%",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(116,42,82,0.10) 0%, transparent 65%)",
        }}
      />

      {/* Cadre central — portrait 9:16, jamais coupé */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "mm-fade-in 0.8s ease-out both" }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "9 / 16",
            height: "92%",
            maxWidth: "92%",
            borderRadius: 28,
            boxShadow:
              "0 50px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.45), 0 0 0 4px rgba(201,168,76,0.10)",
            background: "#000",
          }}
        >
          {stage === "video" ? (
            <video
              ref={videoRef}
              key={reelId}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={`${REELS_PATH}/${reelId}.jpg`}
              onError={() => fallbackTo("webp")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                background: "#000",
                display: "block",
              }}
            >
              <source src={`${REELS_PATH}/${reelId}.mp4`} type="video/mp4" />
            </video>
          ) : (
            <img
              key={`${reelId}-${stage}`}
              src={fallbackSrc}
              alt=""
              onError={() => {
                if (stage === "webp") fallbackTo("gif");
                else if (stage === "gif") fallbackTo("jpg");
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                background: "#000",
                display: "block",
              }}
            />
          )}

          {/* Compteur Reel X/N — top right */}
          <div
            className="absolute top-6 right-6 font-sans-ui uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "0.32em",
              color: "rgba(201,168,76,0.95)",
              padding: "8px 14px",
              border: "1px solid rgba(201,168,76,0.45)",
              borderRadius: 999,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
            }}
          >
            Reel {idx + 1} / {INSTAGRAM_REELS.length}
          </div>

          {/* Overlay bas — handle + CTA */}
          <div
            className="absolute left-0 right-0 bottom-0 flex items-center gap-5 px-8 pb-8 pt-28"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.92) 100%)",
            }}
          >
            <InstagramLogo size={48} />
            <div className="flex flex-col">
              <div
                className="font-serif-display"
                style={{
                  fontSize: 34,
                  lineHeight: 1,
                  color: "#fff",
                  letterSpacing: "0.01em",
                  textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                }}
              >
                @maison_maitre
              </div>
              <div
                className="font-sans-ui uppercase mt-2"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  color: "rgba(201,168,76,0.92)",
                }}
              >
                Cafés · Thés · Vins nature
              </div>
            </div>
            <div
              className="ml-auto font-sans-ui uppercase"
              style={{
                fontSize: 13,
                letterSpacing: "0.3em",
                color: "hsl(var(--gold))",
                padding: "14px 26px",
                border: "1.5px solid hsl(var(--gold))",
                borderRadius: 2,
                background: "rgba(0,0,0,0.4)",
                whiteSpace: "nowrap",
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
