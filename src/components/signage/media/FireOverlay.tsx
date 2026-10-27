import { useEffect, useRef, useState } from "react";

/**
 * Vidéo du feu de cheminée en plein écran, posée PAR-DESSUS tout l'affichage
 * (hors de la scène mise à l'échelle et des fondus entre scènes).
 *
 * Pourquoi : le navigateur du Fire TV Stick (Silk / Chrome 102) lit la vidéo
 * mais la dessine en noir dès qu'elle est dans un bloc agrandi (transform)
 * ou en fondu (opacity). Seule, en plein écran, elle passe (test-feu.html).
 * Donc : jamais de transform ni d'opacity sur la vidéo ou ses parents, on
 * l'affiche / la cache avec visibility. Le fondu d'entrée est un voile noir
 * posé au-dessus, pas une opacité sur la vidéo.
 *
 * Toujours montée (chargée une fois, gardée en mémoire) : elle démarre tout
 * de suite à chaque passage du feu.
 */
export const FireOverlay = ({ active, src, poster }: { active: boolean; src: string; poster?: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [entry, setEntry] = useState(0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!active) {
      v.pause();
      return;
    }
    setEntry((n) => n + 1);
    let cancelled = false;
    let tries = 0;
    const tryPlay = () => {
      if (cancelled) return;
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          if (!cancelled && tries++ < 5) window.setTimeout(tryPlay, 800);
        });
      }
    };
    tryPlay();
    return () => {
      cancelled = true;
    };
  }, [active, src]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 9999, background: "#140604", visibility: active ? "visible" : "hidden", pointerEvents: "none" }}
      aria-hidden
    >
      {poster && (
        <img src={poster} alt="" className="absolute inset-0 h-full w-full" style={{ objectFit: "cover" }} />
      )}
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        onPlaying={() => setPlaying(true)}
        onEnded={(e) => {
          const v = e.currentTarget;
          v.currentTime = 0;
          void v.play().catch(() => undefined);
        }}
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: "cover", visibility: playing ? "inherit" : "hidden" }}
      />
      {/* Vignette douce pour fondre le feu dans la charte */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 45%, rgba(20,5,7,0.65) 100%)" }}
      />
      <img
        src="/brand/logo-white.png"
        alt=""
        className="absolute"
        style={{ right: "3.3vw", bottom: "4.4vh", height: "5vh", opacity: 0.55 }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Voile noir qui s'efface à chaque arrivée du feu (fondu d'entrée) */}
      {active && (
        <div key={entry} className="absolute inset-0" style={{ background: "#140604", animation: "mm-fire-reveal 1.2s ease-out both" }} />
      )}
    </div>
  );
};
