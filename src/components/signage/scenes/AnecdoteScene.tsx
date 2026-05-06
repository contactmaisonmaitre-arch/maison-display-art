import { COFFEE_ANECDOTES } from "@/data/anecdotes";

export const AnecdoteScene = ({ anecdoteIndex = 0 }: { anecdoteIndex?: number }) => {
  const a = COFFEE_ANECDOTES[anecdoteIndex % COFFEE_ANECDOTES.length];
  return (
    <div className="mm-noir-warm mm-grid absolute inset-0 overflow-hidden">
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-20%", right: "-15%", width: 900, height: 900, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.28) 0%, transparent 65%)",
          animation: "mm-glow 11s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-30%", left: "-15%", width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(116,42,42,0.22) 0%, transparent 65%)",
          animation: "mm-glow 13s ease-in-out infinite reverse",
        }}
      />
      {/* Giant editorial coffee glyph */}
      <div
        className="pointer-events-none absolute font-serif-display italic select-none"
        style={{ right: -60, bottom: -120, fontSize: 720, color: "rgba(201,168,76,0.06)", lineHeight: 1 }}
      >
        ☕
      </div>
      <div
        className="relative flex h-full flex-col justify-center px-28 pb-24 pt-36"
        style={{ animation: "mm-slide-up 1.2s ease-out 0.3s both" }}
      >
        <div className="flex items-center gap-5">
          <div className="mm-glass-dark flex items-center justify-center rounded-full" style={{ width: 76, height: 76, fontSize: 38 }}>☕</div>
          <div style={{ width: 96, height: 2, background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          <div className="mm-eyebrow" style={{ fontSize: 20, color: "hsl(var(--gold))" }}>
            {a.tag} · L'art du café
          </div>
        </div>
        <h2
          className="mt-10 max-w-[1500px] font-serif-display leading-[1.02]"
          style={{ fontSize: 138, fontWeight: 600, color: "hsl(var(--linen))", textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
        >
          {a.title}
        </h2>
        <div className="mt-8" style={{ width: 160, height: 1, background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
        <p
          className="mt-8 max-w-[1360px] font-serif-display italic"
          style={{ fontSize: 48, lineHeight: 1.3, color: "rgba(242,237,228,0.86)" }}
        >
          {a.body}
        </p>
        <div className="mt-12 mm-eyebrow" style={{ fontSize: 17, color: "rgba(201,168,76,0.7)" }}>
          Maison Maitre · Le café autrement
        </div>
      </div>
      <div
        className="font-sans-ui uppercase"
        style={{
          position: "absolute",
          bottom: 32,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "#C9A84C",
          opacity: 0.65,
        }}
      >
        Maison Maître · La référence du café de spécialité à Dole
      </div>
    </div>
  );
};
