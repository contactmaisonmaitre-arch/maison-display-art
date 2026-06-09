import { useEffect, useMemo, useState } from "react";
import { WINE_REGIONS } from "@/data/wine-regions";
import { dayOffset } from "@/lib/signage/day-offset";

const ROTATION_MS = 4500;

// Outline simplifiée de la France métropolitaine (viewBox 0 0 100 100).
// C'est volontairement stylisé : sur un display TV, l'effet "carte" prime sur
// la précision géographique.
const FRANCE_OUTLINE =
  "M 28 12 Q 38 8 50 9 Q 62 11 73 18 Q 80 22 85 30 Q 88 38 87 48 Q 86 56 84 62 Q 88 68 86 74 Q 84 80 80 84 Q 76 86 72 85 Q 68 88 62 90 Q 58 95 52 96 Q 44 92 40 88 Q 32 90 28 86 Q 24 80 22 72 Q 16 66 14 56 Q 12 46 14 36 Q 18 24 28 12 Z";

export const WineMapScene = () => {
  // Offset journalier : la scène commence sur la région du jour (puis cycle
  // sur toutes les autres). Le passant qui voit la TV chaque jour découvre
  // une région différente en ouverture.
  const startIdx = useMemo(() => dayOffset() % WINE_REGIONS.length, []);
  const [idx, setIdx] = useState(startIdx);
  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % WINE_REGIONS.length);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, []);
  const active = WINE_REGIONS[idx];

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 50%, #1A0E0E 0%, #0A0606 70%, #050303 100%)",
      }}
    >
      {/* Halo coloré qui suit la région active */}
      <div
        key={active.id}
        className="pointer-events-none absolute"
        style={{
          top: "20%",
          left: "10%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${active.color}33 0%, transparent 65%)`,
          animation: "mm-fade-in 1.4s ease-out both",
        }}
      />

      <div
        className="relative h-full grid items-stretch px-20 pb-16 pt-32 gap-12"
        style={{ gridTemplateColumns: "1.05fr 0.95fr" }}
      >
        {/* === Colonne gauche : carte === */}
        <div className="relative flex flex-col">
          <div
            className="mm-eyebrow"
            style={{ fontSize: 16, color: "hsl(var(--gold))" }}
          >
            Carte des terroirs · Vin nature
          </div>
          <h2
            className="mt-4 font-serif-display leading-[0.95]"
            style={{
              fontSize: 78,
              color: "hsl(var(--linen))",
            }}
          >
            <span className="font-semibold">La France,</span>{" "}
            <span
              className="italic font-light"
              style={{ color: "hsl(var(--gold-lt))" }}
            >
              région par région.
            </span>
          </h2>

          <div className="relative flex-1 mt-6">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
            >
              {/* Voile sombre du fond carte */}
              <defs>
                <radialGradient id="map-bg" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="rgba(201,168,76,0.10)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="map-blur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.4" />
                </filter>
              </defs>

              {/* Outline France — fond + trait or */}
              <path
                d={FRANCE_OUTLINE}
                fill="rgba(242,237,228,0.04)"
                stroke="rgba(201,168,76,0.55)"
                strokeWidth="0.45"
                strokeLinejoin="round"
              />
              {/* Glow doré derrière la carte */}
              <path
                d={FRANCE_OUTLINE}
                fill="url(#map-bg)"
                filter="url(#map-blur)"
              />

              {/* Région active : halo pulsant */}
              <circle
                cx={active.cx}
                cy={active.cy}
                r={active.r * 2.4}
                fill={active.color}
                opacity="0.18"
                style={{
                  transformOrigin: `${active.cx}px ${active.cy}px`,
                  animation: "mm-glow 2.2s ease-in-out infinite",
                }}
              />

              {/* Marqueurs régions — toutes affichées en ton mineur */}
              {WINE_REGIONS.map((r) => {
                const isActive = r.id === active.id;
                return (
                  <g key={r.id}>
                    <circle
                      cx={r.cx}
                      cy={r.cy}
                      r={isActive ? r.r : r.r * 0.55}
                      fill={isActive ? r.color : "rgba(242,237,228,0.30)"}
                      stroke={isActive ? "#fff" : "rgba(242,237,228,0.6)"}
                      strokeWidth={isActive ? 0.4 : 0.18}
                      style={{
                        transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    />
                    {/* Label de la région — toujours visible, plus gros pour l'active */}
                    <text
                      x={r.cx}
                      y={r.cy + (isActive ? r.r + 3.5 : 2.8)}
                      textAnchor="middle"
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontStyle: "italic",
                        fontSize: isActive ? 3.5 : 1.9,
                        fontWeight: isActive ? 600 : 300,
                        fill: isActive ? "#fff" : "rgba(242,237,228,0.55)",
                        transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                        paintOrder: "stroke",
                        stroke: "rgba(0,0,0,0.7)",
                        strokeWidth: isActive ? 0.35 : 0.1,
                      }}
                    >
                      {r.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Compteur en bas gauche */}
          <div
            className="mt-6 font-sans-ui uppercase flex items-center justify-between"
            style={{
              fontSize: 11,
              letterSpacing: "0.36em",
              color: "rgba(201,168,76,0.6)",
            }}
          >
            <span>Maison Maitre · Sélection vin nature</span>
            <span style={{ color: "hsl(var(--gold))" }}>
              {String(idx + 1).padStart(2, "0")} / {WINE_REGIONS.length}
            </span>
          </div>
        </div>

        {/* === Colonne droite : détails de la région active === */}
        <aside
          key={active.id}
          className="relative flex flex-col justify-center"
          style={{
            animation:
              "mm-region-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <div
            className="mm-eyebrow"
            style={{
              fontSize: 14,
              letterSpacing: "0.42em",
              color: active.color,
            }}
          >
            Région · {String(idx + 1).padStart(2, "0")} / {WINE_REGIONS.length}
          </div>

          <h3
            className="mt-5 font-serif-display leading-[0.94]"
            style={{
              fontSize: 138,
              color: "hsl(var(--linen))",
              textShadow: "0 4px 30px rgba(0,0,0,0.55)",
              letterSpacing: "-0.01em",
            }}
          >
            {active.name}
          </h3>

          <div
            className="mt-5"
            style={{
              width: 120,
              height: 2,
              background: `linear-gradient(90deg, ${active.color}, transparent)`,
            }}
          />

          <div
            className="mt-5 font-sans-ui uppercase"
            style={{
              fontSize: 14,
              letterSpacing: "0.32em",
              color: "rgba(242,237,228,0.65)",
            }}
          >
            {active.terroir}
          </div>

          <p
            className="mt-7 font-serif-display italic"
            style={{
              fontSize: 30,
              lineHeight: 1.38,
              color: "rgba(242,237,228,0.88)",
              maxWidth: 700,
            }}
          >
            {active.blurb}
          </p>

          <div className="mt-10">
            <div
              className="font-sans-ui uppercase"
              style={{
                fontSize: 12,
                letterSpacing: "0.36em",
                color: "hsl(var(--gold))",
              }}
            >
              ✦ Vignerons en boutique
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {active.producers.map((p) => (
                <div
                  key={p}
                  className="font-serif-display"
                  style={{
                    fontSize: 32,
                    color: "hsl(var(--linen))",
                    lineHeight: 1.1,
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
