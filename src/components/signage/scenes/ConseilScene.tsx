import { useMemo } from "react";
import { useNoel } from "@/hooks/useNoel";
import { tartanBg } from "../noel/Tartan";

const GOLD = "#C9A45C";
const GOLD_LT = "#D9B865";

const rise = (delay: number) => ({ animation: `mm-slide-up 0.9s ease-out ${delay}s both` });

/**
 * « Le conseil du barista » : un conseil par passage (public/data/noel.json → conseils),
 * qui change à chaque tour.
 */
export const ConseilScene = ({ index }: { index: number }) => {
  const noel = useNoel();
  const list = noel.conseils ?? [];
  // Décalage selon l'heure : la TV ne repart pas toujours sur le même conseil.
  const offset = useMemo(() => Math.floor(Date.now() / 600_000), []);
  if (!list.length) return null;
  const n = (index + offset) % list.length;
  const c = list[n];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(ellipse at 70% 50%, #5A1424 0%, #2E0B14 100%)" }}>
      {/* Bande tartan à gauche, avec le numéro du conseil */}
      <div className="absolute flex flex-col items-center justify-center" style={{ left: 0, top: 0, bottom: 0, width: 560, ...tartanBg(488) }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(20,6,10,0.15), rgba(20,6,10,0.45))" }} />
        <div
          className="relative flex flex-col items-center justify-center"
          style={{
            width: 330,
            height: 330,
            borderRadius: "50%",
            background: "#F6F0E3",
            border: `2px solid ${GOLD}`,
            boxShadow: "0 0 0 10px rgba(246,240,227,0.35), 0 30px 60px -20px rgba(0,0,0,0.7)",
            ...rise(0.1),
          }}
        >
          <div className="mm-eyebrow" style={{ fontSize: 16, color: "#6B1424" }}>
            Conseil
          </div>
          <div className="font-serif-display italic" style={{ fontSize: 150, lineHeight: 1, color: "#6B1424" }}>
            № {n + 1}
          </div>
          {c.theme && (
            <div className="mm-eyebrow" style={{ fontSize: 16, color: "#8A7468" }}>
              {c.theme}
            </div>
          )}
        </div>
      </div>
      <div aria-hidden className="absolute" style={{ left: 560, top: 0, bottom: 0, width: 2, background: GOLD }} />

      <div className="absolute flex flex-col justify-center" style={{ left: 680, right: 120, top: 150, bottom: 110 }}>
        <div className="flex items-center" style={{ gap: 22, ...rise(0.25) }}>
          <div style={{ width: 88, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
          <div className="mm-eyebrow" style={{ fontSize: 20, color: GOLD_LT }}>
            Le conseil du barista
          </div>
        </div>
        <h2 className="font-serif-display" style={{ marginTop: 30, fontSize: 108, lineHeight: 0.98, color: "#F4F0E7", fontWeight: 600, ...rise(0.4) }}>
          {c.title}
        </h2>
        <div style={{ marginTop: 34, width: 140, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        <p className="font-serif-display italic" style={{ marginTop: 30, fontSize: 46, lineHeight: 1.3, color: "rgba(244,240,231,0.9)", maxWidth: 1060, ...rise(0.6) }}>
          {c.text}
        </p>
        <div className="mm-eyebrow" style={{ marginTop: 44, fontSize: 15, color: "rgba(232,201,169,0.7)", ...rise(0.8) }}>
          Une question ? Demandez à l'équipe, on adore en parler.
        </div>
      </div>
    </div>
  );
};
