import { BOARD } from "@/data/carte";
import { LIEUX } from "@/data/dole-pratique";

// « Dole à pied » : pour les touristes, bilingue FR / EN.
export const DoleAPiedScene = () => (
  <div className="absolute inset-0 overflow-hidden flex" style={{ background: BOARD.wine, paddingTop: 118 }}>
    <div className="flex flex-col justify-center shrink-0" style={{ width: 600, padding: "0 50px 40px 90px" }}>
      <div className="font-serif-display uppercase" style={{ fontSize: 15, letterSpacing: "0.3em", color: BOARD.orange, fontWeight: 700 }}>
        Bienvenue · Welcome
      </div>
      <div className="font-serif-display mt-5" style={{ fontSize: 118, lineHeight: 0.9, color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.02em" }}>
        Dole
        <br />
        <span className="italic" style={{ fontWeight: 400, color: BOARD.sand }}>à pied</span>
      </div>
      <div className="font-serif-display italic mt-7" style={{ fontSize: 28, lineHeight: 1.35, color: BOARD.sand }}>
        Ville d'art et d'histoire, ville natale de Pasteur. Tout se visite à pied depuis la boutique.
      </div>
      <div className="font-serif-display mt-3" style={{ fontSize: 20, color: "rgba(232,201,169,0.7)" }}>
        Pasteur's hometown — the whole old town is a short walk from here.
      </div>
    </div>
    <div className="grid flex-1 content-center" style={{ gridTemplateColumns: "1fr 1fr", gap: "22px 26px", padding: "30px 90px 50px 20px" }}>
      {LIEUX.map((l, i) => (
        <div
          key={l.name}
          className="rounded-[22px]"
          style={{ background: "rgba(244,240,231,0.07)", boxShadow: "0 0 0 1px rgba(232,201,169,0.25) inset", padding: "22px 26px", animation: `mm-slide-up 0.8s ease-out ${0.15 + i * 0.08}s both` }}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-serif-display" style={{ fontSize: 22, color: BOARD.orange, fontWeight: 700 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-serif-display" style={{ fontSize: 34, color: "#FFFFFF", fontWeight: 600, lineHeight: 1.1 }}>
              {l.name}
            </span>
          </div>
          <div className="font-serif-display mt-2" style={{ fontSize: 20, lineHeight: 1.4, color: "rgba(244,240,231,0.85)" }}>
            {l.fr}
          </div>
          <div className="font-serif-display italic mt-1" style={{ fontSize: 17, color: "rgba(232,201,169,0.7)" }}>
            {l.en} — {l.enText}
          </div>
        </div>
      ))}
    </div>
  </div>
);
