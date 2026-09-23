import { useEffect, useMemo, useState } from "react";
import { DOLE_FACTS } from "@/data/dole-facts";
import { dayOffset } from "@/lib/signage/day-offset";
import { eventDate, useDoleEvents } from "@/hooks/useDoleEvents";

const ROTATION_MS = 20000;

export const DoleScene = () => {
  const events = useDoleEvents();

  // Pool combiné : faits historiques + événements frais scrapés chaque semaine
  // depuis sortiradole.fr. Les events frais passent en tête de pool pour avoir
  // un peu plus de visibilité, mais le dayOffset mélange tout naturellement.
  const pool = useMemo(
    () => (events.length > 0 ? [...events, ...DOLE_FACTS] : DOLE_FACTS),
    [events]
  );

  // Tick dérivé du temps réel (Date.now) plutôt que d'un state local —
  // sinon avec le lazy mount on revoyait toujours le même fait en ouverture.
  const [, forceRender] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceRender((n) => n + 1), ROTATION_MS);
    return () => clearInterval(id);
  }, []);

  const offset = dayOffset();
  const idx = (offset + Math.floor(Date.now() / ROTATION_MS)) % pool.length;
  const f = pool[idx];
  const iso = eventDate(f, new Date());
  const when = iso ? new Date(`${iso}T12:00:00`) : null;
  const long = f.title.length > 60;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#46121F" }}>
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-20%",
          left: "-10%",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,201,169,0.16) 0%, transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-25%",
          right: "-15%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(116,42,62,0.14) 0%, transparent 65%)",
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center px-24 text-center" style={{ paddingTop: 118 }}>
        <div
          className="mm-eyebrow"
          style={{
            fontSize: 18,
            letterSpacing: "0.42em",
            color: "hsl(var(--gold))",
          }}
        >
          {when ? "À faire à Dole" : "Dole · Le saviez-vous ?"}
        </div>

        <div
          key={`${offset}-${idx}`}
          className="flex flex-col items-center"
          style={{
            animation: "mm-fade-in 0.6s ease-out both",
            marginTop: 36,
          }}
        >
          {/* Événement : médaillon date façon carte ; anecdote : emoji */}
          {when ? (
            <div
              className="flex flex-col items-center justify-center font-serif-display"
              style={{
                width: 170,
                height: 170,
                borderRadius: "50%",
                background: "#F4F0E7",
                color: "#46121F",
                boxShadow: "0 0 0 8px rgba(232,201,169,0.18)",
              }}
            >
              <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 0.9, fontVariantNumeric: "lining-nums" }}>{when.getDate()}</div>
              <div className="uppercase" style={{ fontSize: 17, letterSpacing: "0.24em", fontWeight: 600, marginTop: 6 }}>
                {when.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 120, lineHeight: 1 }}>{f.emoji}</div>
          )}

          {/* Titre — passe de 2.8rem à un ~6rem responsive (≈ 96-110px) */}
          <h2
            className="font-serif-display mt-10"
            style={{
              fontSize: long ? 84 : 108,
              color: "#FFFFFF",
              fontWeight: 600,
              lineHeight: 1.04,
              letterSpacing: "-0.015em",
              maxWidth: "1500px",
            }}
          >
            {f.title}
          </h2>

          {/* Petit séparateur or */}
          <div
            className="mt-8"
            style={{
              width: 140,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)",
            }}
          />

          {/* Body — passe de 1.1rem à ~1.8rem (≈ 30px) */}
          <p
            className="mt-8 font-serif-display"
            style={{
              fontSize: "clamp(26px, 1.9vw, 36px)",
              color: "hsl(var(--gold-lt))",
              maxWidth: "1280px",
              opacity: 0.92,
              lineHeight: 1.45,
              fontWeight: 300,
            }}
          >
            {f.body}
          </p>
        </div>

        {/* Indicateur de progression */}
        <div className="mt-12 flex gap-1.5">
          {pool.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === idx ? 32 : 8,
                height: 4,
                borderRadius: 2,
                background:
                  i === idx ? "hsl(var(--gold))" : "rgba(232,201,169,0.25)",
                transition: "all 0.5s",
              }}
            />
          ))}
        </div>

        {/* Signature Maison Maitre */}
        <div
          className="font-serif-display italic"
          style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 16,
            color: "hsl(var(--gold))",
            opacity: 0.65,
            letterSpacing: "0.02em",
          }}
        >
          Maison Maitre · Café de spécialité à Dole
        </div>
      </div>
    </div>
  );
};
