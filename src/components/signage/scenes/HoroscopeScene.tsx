import { useMemo } from "react";
import { BOARD, allItems } from "@/data/carte";
import { SIGNES, horoscopeDuJour } from "@/data/horoscope";
import { useCarte } from "@/hooks/useCarte";

// « L'horoscope du café » — pour sourire. Les 12 signes sur une seule page
// (4 colonnes × 3 lignes), avec une boisson porte-bonheur tirée de la carte.
export const HoroscopeScene = () => {
  const carte = useCarte();
  const drinks = useMemo(
    () => allItems(carte).filter((i) => i.price && i.section !== "Glouglou" && i.section !== "Miam").map((i) => i.name),
    [carte],
  );
  const dayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });

  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col" style={{ background: BOARD.cream, paddingTop: 118 }}>
      <div className="flex items-end justify-between shrink-0" style={{ padding: "26px 80px 0" }}>
        <div className="flex items-baseline gap-6">
          <div className="font-serif-display" style={{ fontSize: 60, lineHeight: 1, color: BOARD.wine, fontWeight: 600, letterSpacing: "-0.02em" }}>
            L'horoscope <span className="italic" style={{ fontWeight: 400 }}>du café</span>
          </div>
          <div className="font-serif-display uppercase" style={{ fontSize: 15, letterSpacing: "0.3em", color: BOARD.orange, fontWeight: 700 }}>
            Pour sourire ✦
          </div>
        </div>
        <div className="font-serif-display italic" style={{ fontSize: 24, color: BOARD.muted }}>
          avec la boisson porte-bonheur du jour
        </div>
      </div>
      <div
        className="grid flex-1"
        style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gridTemplateRows: "repeat(3, minmax(0, 1fr))", gap: 16, padding: "22px 80px 40px" }}
      >
        {SIGNES.map((s, k) => {
          const h = horoscopeDuJour(k, dayKey, drinks);
          return (
            <div
              key={s.name}
              className="flex flex-col rounded-[20px]"
              style={{ background: "#FFFFFF", boxShadow: "0 0 0 1px #E3D6BC inset", padding: "18px 22px", animation: `mm-slide-up 0.8s ease-out ${0.1 + k * 0.06}s both`, minHeight: 0 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 52, height: 52, borderRadius: "50%", background: BOARD.wine, color: BOARD.sand, fontSize: 28 }}
                >
                  {`${s.symbol}\uFE0E`}
                </div>
                <div className="min-w-0">
                  <div className="font-serif-display" style={{ fontSize: 32, lineHeight: 1, fontWeight: 600, color: BOARD.wine }}>{s.name}</div>
                  <div className="font-serif-display italic mt-1" style={{ fontSize: 16, color: BOARD.muted }}>{s.dates}</div>
                </div>
              </div>
              <div className="font-serif-display mt-3" style={{ fontSize: 26, lineHeight: 1.26, color: BOARD.wine }}>{h.phrase}</div>
              {h.drink && (
                <div className="font-serif-display italic mt-auto pt-2" style={{ fontSize: 20, color: BOARD.orange }}>
                  Boisson porte-bonheur : {h.drink}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
