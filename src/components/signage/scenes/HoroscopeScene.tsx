import { useMemo } from "react";
import { BOARD, allItems } from "@/data/carte";
import { SIGNES, horoscopeDuJour } from "@/data/horoscope";
import { useCarte } from "@/hooks/useCarte";

const PER_PAGE = 6;

// « L'horoscope du café » — pour sourire. 6 signes par passage, avec une
// boisson porte-bonheur tirée de la carte.
export const HoroscopeScene = ({ page = 0 }: { page?: number }) => {
  const carte = useCarte();
  const drinks = useMemo(
    () => allItems(carte).filter((i) => i.price && i.section !== "Glouglou" && i.section !== "Miam").map((i) => i.name),
    [carte],
  );
  const dayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const start = (page % 2) * PER_PAGE;
  const signs = SIGNES.slice(start, start + PER_PAGE);

  return (
    <div className="absolute inset-0 overflow-hidden flex" style={{ background: BOARD.cream, paddingTop: 118 }}>
      <div className="flex flex-col justify-center shrink-0" style={{ width: 470, padding: "0 30px 40px 80px" }}>
        <div className="font-serif-display uppercase" style={{ fontSize: 15, letterSpacing: "0.3em", color: BOARD.orange, fontWeight: 700 }}>
          Pour sourire ✦
        </div>
        <div className="font-serif-display mt-5" style={{ fontSize: 70, lineHeight: 0.95, color: BOARD.wine, fontWeight: 600, letterSpacing: "-0.02em" }}>
          L'horoscope
          <br />
          <span className="italic" style={{ fontWeight: 400 }}>du café</span>
        </div>
        <div className="font-serif-display italic mt-6" style={{ fontSize: 24, color: BOARD.muted, lineHeight: 1.35 }}>
          Signes {start === 0 ? "du Bélier à la Vierge" : "de la Balance aux Poissons"} · avec la boisson porte-bonheur du jour.
        </div>
      </div>
      <div className="grid flex-1" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(3, minmax(0, 1fr))", gap: 20, padding: "40px 90px 56px 30px" }}>
        {signs.map((s, k) => {
          const h = horoscopeDuJour(start + k, dayKey, drinks);
          return (
            <div
              key={s.name}
              className="flex items-center gap-5 rounded-[22px]"
              style={{ background: "#FFFFFF", boxShadow: "0 0 0 1px #E3D6BC inset", padding: "20px 24px", animation: `mm-slide-up 0.8s ease-out ${0.12 + k * 0.08}s both`, minHeight: 0 }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: 78, height: 78, borderRadius: "50%", background: BOARD.wine, color: BOARD.sand, fontSize: 40 }}
              >
                {`${s.symbol}\uFE0E`}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif-display" style={{ fontSize: 32, fontWeight: 600, color: BOARD.wine }}>{s.name}</span>
                  <span className="font-serif-display italic" style={{ fontSize: 16, color: BOARD.muted }}>{s.dates}</span>
                </div>
                <div className="font-serif-display" style={{ fontSize: 25, lineHeight: 1.32, color: BOARD.wine, marginTop: 4 }}>{h.phrase}</div>
                {h.drink && (
                  <div className="font-serif-display italic" style={{ fontSize: 21, color: BOARD.orange, marginTop: 8 }}>
                    Boisson porte-bonheur : {h.drink}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
