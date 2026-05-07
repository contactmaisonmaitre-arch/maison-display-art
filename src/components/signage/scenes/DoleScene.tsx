import { useEffect, useState } from "react";
import { DOLE_FACTS } from "@/data/dole-facts";

export const DoleScene = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % DOLE_FACTS.length), 20000);
    return () => clearInterval(id);
  }, []);
  const f = DOLE_FACTS[idx];
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#0A0A0A" }}>
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-20%", left: "-10%", width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.16) 0%, transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-25%", right: "-15%", width: 900, height: 900, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(116,42,62,0.14) 0%, transparent 65%)",
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center px-20 text-center">
        <div
          className="font-sans-ui uppercase"
          style={{ fontSize: 11, letterSpacing: "0.3em", color: "#C9A84C" }}
        >
          Dole · Le saviez-vous ?
        </div>

        <div
          key={idx}
          className="flex flex-col items-center"
          style={{ animation: "mm-fade-in 0.6s ease-out both", marginTop: 28 }}
        >
          <div style={{ fontSize: 96, lineHeight: 1 }}>{f.emoji}</div>
          <h2
            className="font-serif-display italic"
            style={{ fontSize: "2.8rem", color: "#C9A84C", marginTop: 28, lineHeight: 1.1, letterSpacing: "-0.01em" }}
          >
            {f.title}
          </h2>
          <p
            className="mt-8 font-sans-ui"
            style={{ fontSize: "1.1rem", color: "#F5F0E8", maxWidth: "42rem", opacity: 0.8, lineHeight: 1.55 }}
          >
            {f.body}
          </p>
        </div>

        {/* Indicateur de progression */}
        <div className="mt-12 flex gap-1.5">
          {DOLE_FACTS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === idx ? 24 : 6,
                height: 3,
                borderRadius: 2,
                background: i === idx ? "#C9A84C" : "rgba(201,168,76,0.25)",
                transition: "all 0.4s",
              }}
            />
          ))}
        </div>

        {/* Signature Maison Maitre */}
        <div
          className="font-serif-display italic"
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 13,
            color: "#C9A84C",
            opacity: 0.6,
          }}
        >
          Maison Maitre · Café de spécialité à Dole
        </div>
      </div>
    </div>
  );
};
