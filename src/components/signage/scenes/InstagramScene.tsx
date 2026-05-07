import { useEffect, useRef, useState } from "react";

// Reels Instagram @maison_maitre
const INSTAGRAM_REELS = ["DXtn06bIgtd", "DXjAgNRirlr", "DXPVGNDioOU"];
const REELS_PATH = "/reels-tv";

// Logo Instagram (caméra) en SVG, gradient officiel
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

  useEffect(() => {
    setStage("video");
    preloadReelAssets(reelId);
    preloadReelAssets(nextId);
  }, [reelId, nextId]);

  // Watchdog : si la vidéo ne démarre pas en 2,5 s, fallback webp animé.
  useEffect(() => {
    if (stage !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    if (!active) {
      v.pause();
      return;
    }
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => setStage("webp"));
    const watchdog = window.setTimeout(() => {
      if (v.paused || v.currentTime < 0.05) setStage("webp");
    }, 2500);
    return () => window.clearTimeout(watchdog);
  }, [active, stage, reelId]);

  const fallbackTo = (next: FallbackStage) => setStage(next);

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
      {/* halos doux */}
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
            "radial-gradient(circle, rgba(228,64,95,0.10) 0%, transparent 65%)",
        }}
      />

      {/* Layout côte à côte : reel à gauche, panneau Suivez-nous à droite */}
      <div
        className="relative h-full grid items-center px-16 pb-10 pt-32 gap-14"
        style={{
          gridTemplateColumns: "1.55fr 1fr",
          animation: "mm-fade-in 0.8s ease-out both",
        }}
      >
        {/* Cadre vidéo 16:9 */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "16 / 9",
            width: "100%",
            maxHeight: "100%",
            borderRadius: 24,
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
            className="absolute top-5 right-5 font-sans-ui uppercase"
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
        </div>

        {/* Panneau "Suivez-nous" — Instagram XXL */}
        <aside
          className="relative h-full flex flex-col justify-center"
          style={{ animation: "mm-slide-up 1s ease-out 0.2s both" }}
        >
          {/* Logo IG géant */}
          <div style={{ filter: "drop-shadow(0 20px 60px rgba(247,113,51,0.35))" }}>
            <InstagramLogo size={148} />
          </div>

          <div
            className="mt-8 mm-eyebrow"
            style={{ fontSize: 16, letterSpacing: "0.42em", color: "hsl(var(--gold))" }}
          >
            Sur Instagram
          </div>

          <div
            className="mt-3 font-serif-display"
            style={{
              fontSize: 92,
              lineHeight: 0.95,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            <span className="font-light">@</span>
            <span className="font-semibold italic">maison_maitre</span>
          </div>

          <div
            className="mt-7"
            style={{
              width: 120,
              height: 1,
              background: "linear-gradient(90deg, hsl(var(--gold)), transparent)",
            }}
          />

          <div
            className="mt-7 font-serif-display italic"
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "rgba(245,239,226,0.82)",
              maxWidth: 540,
            }}
          >
            Cafés, thés, vins nature — la vie de la Maison à Dole, en image.
          </div>

          <div
            className="mt-12 inline-flex self-start items-center gap-5 font-sans-ui uppercase"
            style={{
              fontSize: 18,
              letterSpacing: "0.36em",
              color: "#0A0A0A",
              background:
                "linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(var(--gold-lt)) 100%)",
              padding: "20px 36px",
              borderRadius: 4,
              fontWeight: 600,
              boxShadow:
                "0 18px 40px -10px rgba(201,168,76,0.55), 0 0 0 1px rgba(255,255,255,0.4) inset",
            }}
          >
            ★ Suivez-nous
          </div>

          <div
            className="mt-8 font-sans-ui uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "0.42em",
              color: "rgba(201,168,76,0.65)",
            }}
          >
            instagram.com / maison_maitre
          </div>
        </aside>
      </div>
    </div>
  );
};
