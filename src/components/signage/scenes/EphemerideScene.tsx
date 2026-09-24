import { BOARD } from "@/data/carte";
import { useInfos } from "@/hooks/useInfos";

// « Ce jour-là » : éphémérides de Wikipédia (filtrées), + une naissance.
export const EphemerideScene = () => {
  const infos = useInfos();
  const e = infos?.ephemerides;
  const items = e ? [...e.events.slice(0, 2), ...e.births.slice(0, 1)] : [];
  const dateLabel = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  return (
    <div className="absolute inset-0 overflow-hidden flex" style={{ background: BOARD.wine, paddingTop: 118 }}>
      <div className="flex flex-col justify-center shrink-0" style={{ width: 560, padding: "0 40px 40px 90px" }}>
        <div className="font-serif-display uppercase" style={{ fontSize: 15, letterSpacing: "0.3em", color: BOARD.orange, fontWeight: 700 }}>
          Éphéméride
        </div>
        <div className="font-serif-display mt-5" style={{ fontSize: 92, lineHeight: 0.95, color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          Ce jour-là
        </div>
        <div className="font-serif-display italic mt-5" style={{ fontSize: 40, color: BOARD.sand }}>
          un {dateLabel}…
        </div>
        <div className="font-serif-display mt-10" style={{ fontSize: 16, color: "rgba(232,201,169,0.6)" }}>
          Source : Wikipédia
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center" style={{ gap: 26, padding: "30px 110px 60px 30px" }}>
        {items.map((it, i) => (
          <div key={it.text} className="flex gap-8 items-baseline" style={{ animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.15}s both` }}>
            <div className="font-serif-display shrink-0" style={{ width: 170, fontSize: 64, fontWeight: 600, color: BOARD.orange, fontVariantNumeric: "lining-nums" }}>
              {it.year}
            </div>
            <div>
              {it.kind === "birth" && (
                <div className="font-serif-display uppercase" style={{ fontSize: 13, letterSpacing: "0.26em", color: BOARD.sand, fontWeight: 700 }}>
                  Naissance
                </div>
              )}
              <div className="font-serif-display" style={{ fontSize: 32, lineHeight: 1.35, color: "#FFFFFF" }}>
                {it.text.charAt(0).toUpperCase() + it.text.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
