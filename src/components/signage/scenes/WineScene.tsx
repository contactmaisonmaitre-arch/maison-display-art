import { useEffect, useState } from "react";

// Dépose tes photos dans /public/cave/ avec ces noms — la scène utilise
// uniquement celles qui existent (les autres sont silencieusement ignorées).
const CANDIDATE_PHOTOS = [
  "/cave/cave-1.webp",
  "/cave/cave-2.webp",
  "/cave/cave-3.webp",
  "/cave/cave-4.webp",
  "/cave/cave-5.webp",
  "/cave/cave-6.webp",
];

const SLIDE_MS = 4500; // une photo toutes les 4,5 secondes

const useCellarPhotos = () => {
  const [available, setAvailable] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      CANDIDATE_PHOTOS.map(
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
      setAvailable(results.filter((s): s is string => Boolean(s)));
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return available;
};

export const WineScene = () => {
  const photos = useCellarPhotos();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % photos.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [photos.length]);

  const hasPhotos = photos.length > 0;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: hasPhotos
          ? "#0A0606"
          : "linear-gradient(135deg, #C0A8B0, #704050, #2A1020)",
      }}
    >
      {/* Diapo de photos avec ken-burns + crossfade */}
      {hasPhotos &&
        photos.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === idx ? 1 : 0,
              transition: "opacity 1400ms ease",
              animation: i === idx ? "mm-cave-kenburns 9s ease-out forwards" : undefined,
            }}
          />
        ))}

      {/* Voile sombre + dégradé éditorial pour la lisibilité du texte */}
      <div
        className="absolute inset-0"
        style={{
          background: hasPhotos
            ? "linear-gradient(105deg, rgba(8,4,4,0.85) 0%, rgba(8,4,4,0.55) 38%, rgba(8,4,4,0.20) 70%, rgba(8,4,4,0.55) 100%)"
            : "linear-gradient(105deg, rgba(10,6,6,0.55) 0%, rgba(10,6,6,0.15) 35%, rgba(251,247,238,0.92) 62%, rgba(251,247,238,0.99) 100%)",
        }}
      />

      {/* Halo doré */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-20%",
          left: "-10%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.22) 0%, transparent 65%)",
          animation: "mm-glow 12s ease-in-out infinite",
        }}
      />

      <div
        className="relative flex h-full flex-col justify-center px-28 pb-28 pt-40"
        style={{ animation: "mm-slide-up 1.2s ease-out 0.25s both" }}
      >
        <div className="flex items-center gap-6">
          <div
            style={{
              width: 88,
              height: 2,
              background:
                "linear-gradient(90deg, transparent, hsl(var(--gold)))",
            }}
          />
          <div
            className="mm-eyebrow"
            style={{ fontSize: 20, color: "hsl(var(--gold))" }}
          >
            Vins Naturels · La cave de Maison Maitre
          </div>
        </div>

        <h2
          className="mt-10 max-w-[1380px] font-serif-display leading-[0.94]"
          style={{
            fontSize: 134,
            color: hasPhotos ? "hsl(var(--linen))" : "hsl(var(--ink))",
            textShadow: hasPhotos ? "0 4px 30px rgba(0,0,0,0.55)" : undefined,
          }}
        >
          <span
            className="font-semibold"
            style={{
              animation: "mm-letter-rise 1s ease-out 0.4s both",
              display: "inline-block",
            }}
          >
            Le vin comme{" "}
          </span>
          <span
            className="italic font-light"
            style={{
              color: hasPhotos ? "hsl(var(--gold-lt))" : "hsl(var(--copper))",
              animation: "mm-letter-rise 1s ease-out 0.7s both",
              display: "inline-block",
            }}
          >
            il devrait être.
          </span>
        </h2>

        <div
          className="mt-8"
          style={{
            width: 140,
            height: 1,
            background:
              "linear-gradient(90deg, hsl(var(--copper)), transparent)",
          }}
        />

        <p
          className="mt-8 max-w-[1180px] font-serif-display italic"
          style={{
            fontSize: 38,
            color: hasPhotos ? "rgba(242,237,228,0.92)" : "hsl(var(--taupe))",
            lineHeight: 1.28,
            textShadow: hasPhotos ? "0 2px 20px rgba(0,0,0,0.55)" : undefined,
          }}
        >
          Vignerons engagés — Marcel Lapierre, Jean Foillard, Overnoy-Houillon,
          Yvon Métras.
        </p>

        {hasPhotos && (
          <div
            className="mt-12 font-sans-ui uppercase flex items-center gap-4"
            style={{
              fontSize: 12,
              letterSpacing: "0.42em",
              color: "rgba(201,168,76,0.92)",
            }}
          >
            <span
              className="rounded-full"
              style={{
                width: 8,
                height: 8,
                background: "hsl(var(--gold))",
                boxShadow: "0 0 10px hsl(var(--gold))",
              }}
            />
            <span>
              Maxime, dans la cave · {idx + 1} / {photos.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
