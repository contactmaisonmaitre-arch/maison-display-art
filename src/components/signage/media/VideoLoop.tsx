import { useEffect, useRef, useState, type ReactNode } from "react";

interface VideoLoopProps {
  src: string;
  /** Image fixe montrée pendant le chargement et si la vidéo ne passe pas. */
  poster?: string;
  /** La scène est à l'écran : on lit. Sinon on met en pause. */
  active: boolean;
  /** Ce qu'on affiche à la place de la vidéo (par défaut : le poster). */
  fallback?: ReactNode;
  fit?: "cover" | "contain";
}

type State = "loading" | "playing" | "failed";

/**
 * Boucle vidéo pensée pour le navigateur d'une TV :
 * - toujours muette + playsinline (sinon la lecture auto est bloquée) ;
 * - la vidéo n'est chargée que tant que la scène est montée, puis vraiment
 *   libérée (src retiré + load()) pour ne pas saturer la mémoire de la TV ;
 * - si elle ne démarre pas en 4 s ou plante, on garde l'image fixe :
 *   jamais d'écran noir ;
 * - boucle « à la main » en plus de l'attribut loop, que certains
 *   navigateurs de TV ignorent.
 */
export const VideoLoop = ({ src, poster, active, fallback, fit = "cover" }: VideoLoopProps) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<State>("loading");

  // Chargement / libération de la vidéo.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.src = src;
    v.load();
    setState("loading");
    return () => {
      v.pause();
      v.removeAttribute("src");
      v.load();
    };
  }, [src]);

  // Lecture quand la scène est active, pause sinon.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!active) {
      v.pause();
      return;
    }
    let cancelled = false;
    let tries = 0;
    const tryPlay = () => {
      if (cancelled) return;
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          if (!cancelled && tries++ < 3) window.setTimeout(tryPlay, 800);
        });
      }
    };
    tryPlay();
    const watchdog = window.setTimeout(() => {
      if (cancelled) return;
      if (v.paused || v.readyState < 3) setState((s) => (s === "playing" ? s : "failed"));
    }, 4000);
    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
    };
  }, [active, src]);

  const showFallback = state !== "playing";

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#120507" }}>
      {showFallback &&
        (fallback ??
          (poster ? (
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full"
              style={{ objectFit: fit }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null))}
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        onPlaying={() => setState("playing")}
        onError={() => setState("failed")}
        onEnded={(e) => {
          const v = e.currentTarget;
          v.currentTime = 0;
          void v.play().catch(() => undefined);
        }}
        className="absolute inset-0 h-full w-full"
        style={{
          objectFit: fit,
          opacity: state === "playing" ? 1 : 0,
          transition: "opacity 800ms ease",
        }}
      />
    </div>
  );
};
