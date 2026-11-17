import { useEffect, useRef } from "react";

/**
 * Vidéo du feu de cheminée en plein écran, posée par-dessus tout l'affichage.
 *
 * Le navigateur du Fire TV Stick (Silk / Chrome 102) dessine la vidéo en noir
 * dès qu'elle n'est pas dans le cas le plus simple. Ce qui marche (vérifié
 * avec public/test-feu.html) : une <video> plein écran, visible dès sa
 * création, en lecture automatique, sans rien d'agrandi, en fondu ou caché
 * autour. On reproduit exactement ça :
 * - la vidéo est créée à chaque passage du feu et retirée ensuite (pas de
 *   vidéo préchargée cachée : Android coupe son rendu et elle reste noire) ;
 * - aucun transform / opacity / visibility sur elle ni sur ses parents ;
 * - pendant le feu, SignageDisplay retire le reste de l'affichage (display: none).
 * L'image fixe dessous couvre le temps de démarrage.
 */
export const FireOverlay = ({ src, poster }: { src: string; poster?: string }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
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
      v.pause();
      v.removeAttribute("src");
      v.load();
    };
  }, [src]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 9999, background: "#140604" }} aria-hidden>
      {poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full" style={{ objectFit: "cover" }} />}
      <video
        ref={ref}
        src={src}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        poster={poster}
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};
