import { useEffect, useRef, useState } from "react";
import { dayOffset } from "@/lib/signage/day-offset";

// Les photos sont dans /public/instagram/ sous le nom insta-NN.webp.
// Curation manuelle (audit visuel) — uniquement café / cave / boutique.
// Pour ajouter de nouvelles photos : drop dans VISUEL, lancer convert-insta,
// auditer le contenu, déposer la suite ici en incrémentant NN.
const TOTAL_PHOTOS = 25;
const ALL_PHOTOS = Array.from(
  { length: TOTAL_PHOTOS },
  (_, i) => `/instagram/insta-${String(i + 1).padStart(2, "0")}.webp`
);

const SLIDE_MS = 5000; // une photo toutes les 5 secondes pendant la scène

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

// Détecte les photos qui ne se chargent pas (404), pour ne pas afficher de cadre vide.
const usePhotos = () => {
  const [available, setAvailable] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      ALL_PHOTOS.map(
        (src) =>
          new Promise<string | null>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((results) => {
      if (cancelled) return;
      const ok = results.filter((s): s is string => Boolean(s));
      setAvailable(ok.length > 0 ? ok : ALL_PHOTOS);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return available;
};

export const InstagramScene = ({ active, reelIndex = 0 }: { active: boolean; reelIndex?: number }) => {
  void reelIndex; // gardé pour compatibilité signature, plus utilisé dans le calcul
  const photos = usePhotos();

  // À chaque réactivation de la scène, on note le tick courant comme point de
  // départ. Pendant l'affichage (active), on avance d'une photo par SLIDE_MS.
  // → Visit 1 montre [T..T+5], Visit 2 (~90s plus tard) montre [T+18..T+23],
  //   Visit 3 montre [T+36..T+41]. Sur 25 photos = pas d'overlap intra-cycle,
  //   et le startTick suivant est encore décalé → cycles suivants montrent
  //   d'autres photos. Le dayOffset garantit la variation jour par jour.
  const [, forceRender] = useState(0);
  const startTickRef = useRef<number>(Math.floor(Date.now() / SLIDE_MS));

  useEffect(() => {
    if (active) {
      startTickRef.current = Math.floor(Date.now() / SLIDE_MS);
      forceRender((n) => n + 1);
    }
    if (!active || photos.length <= 1) return;
    const id = setInterval(() => forceRender((n) => n + 1), SLIDE_MS);
    return () => clearInterval(id);
  }, [active, photos.length]);

  const currentTick = Math.floor(Date.now() / SLIDE_MS);
  const within = active ? Math.max(0, currentTick - startTickRef.current) : 0;

  const idx =
    photos.length > 0
      ? (startTickRef.current + within + dayOffset()) % photos.length
      : 0;
  const currentSrc = photos[idx] ?? ALL_PHOTOS[0];

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

      {/* Layout côte à côte : photo à gauche, panneau Suivez-nous à droite */}
      <div
        className="relative h-full grid items-center px-16 pb-10 pt-32 gap-14"
        style={{
          gridTemplateColumns: "1.55fr 1fr",
          animation: "mm-fade-in 0.8s ease-out both",
        }}
      >
        {/* Cadre photo style "post Instagram" */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "1 / 1",
            width: "100%",
            maxHeight: "100%",
            margin: "0 auto",
            borderRadius: 24,
            boxShadow:
              "0 50px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.45), 0 0 0 4px rgba(201,168,76,0.10)",
            background: "#000",
          }}
        >
          {/* Slideshow : on rend les photos en pile, on bascule l'opacité */}
          {photos.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: src === currentSrc ? 1 : 0,
                transition: "opacity 900ms ease",
                background: "#000",
              }}
            />
          ))}

          {/* Header post — profil + handle, façon flux IG */}
          <div
            className="absolute top-0 left-0 right-0 flex items-center gap-3 px-5 py-4"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)",
            }}
          >
            <InstagramLogo size={32} />
            <div className="flex flex-col">
              <span
                className="font-sans-ui"
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "0.01em",
                }}
              >
                maison_maitre
              </span>
              <span
                className="font-sans-ui uppercase mt-1"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.32em",
                  color: "rgba(201,168,76,0.95)",
                }}
              >
                Dole · Jura
              </span>
            </div>
            <div className="ml-auto" style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", letterSpacing: "0.18em" }}>
              · · ·
            </div>
          </div>

          {/* Footer post — like / comment / share + compteur */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center gap-5 px-5 py-4"
            style={{
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
            }}
          >
            {/* Heart */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {/* Comment */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            {/* Share */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>

            <div
              className="ml-auto font-sans-ui uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.32em",
                color: "rgba(201,168,76,0.95)",
                padding: "6px 12px",
                border: "1px solid rgba(201,168,76,0.45)",
                borderRadius: 999,
                background: "rgba(0,0,0,0.55)",
              }}
            >
              {idx + 1} / {photos.length || TOTAL_PHOTOS}
            </div>
          </div>
        </div>

        {/* Panneau "Suivez-nous" — Instagram XXL */}
        <aside
          className="relative h-full flex flex-col justify-center"
          style={{ animation: "mm-slide-up 1s ease-out 0.2s both" }}
        >
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
              whiteSpace: "nowrap",
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
