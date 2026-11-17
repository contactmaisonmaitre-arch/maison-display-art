import { useNoel } from "@/hooks/useNoel";
import { DoubleFilet, tartanBg } from "../noel/Tartan";

const WINE = "#6B1424";
const GOLD = "#C9A45C";

const rise = (delay: number) => ({ animation: `mm-slide-up 1s ease-out ${delay}s both` });

/**
 * Scène d'ouverture de Noël : la vraie photo des mains dans le café, à côté
 * d'une carte crème. Photo : noel.json → photo (par défaut /scenes/cafe.webp).
 */
export const GrainScene = () => {
  const noel = useNoel();
  const photo = noel.photo || "/scenes/cafe.webp";
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#2E0B14" }}>
      {/* La photo, à droite, avec un lent zoom */}
      <div className="absolute overflow-hidden" style={{ left: 720, top: 0, right: 0, bottom: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${photo})`,
            backgroundSize: "cover",
            backgroundPosition: "38% 50%",
            animation: "mm-cave-kenburns 18s ease-out forwards",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(46,11,20,0.55) 0%, transparent 22%, transparent 80%, rgba(46,11,20,0.35) 100%)" }} />
      </div>

      {/* Bande tartan entre la carte et la photo */}
      <div className="absolute" style={{ left: 700, top: 0, bottom: 0, width: 26, ...tartanBg(244), borderLeft: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` }} />

      {/* Carte crème */}
      <div className="absolute flex flex-col justify-center" style={{ left: 0, top: 0, bottom: 0, width: 700, background: "#F6F0E3", padding: "160px 78px 110px" }}>
        <DoubleFilet inset={24} />
        <div className="mm-eyebrow" style={{ fontSize: 18, color: WINE, ...rise(0.2) }}>
          Café de spécialité
        </div>
        <h2 className="font-serif-display" style={{ marginTop: 26, fontSize: 118, lineHeight: 0.94, color: "#2A1A1C", ...rise(0.35) }}>
          <span style={{ fontWeight: 600 }}>Du grain</span>
          <br />
          <span className="italic" style={{ color: WINE }}>
            à la tasse.
          </span>
        </h2>
        <div style={{ marginTop: 34, width: 140, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        <p className="font-serif-display italic" style={{ marginTop: 30, fontSize: 38, lineHeight: 1.3, color: "#5A4A44", ...rise(0.6) }}>
          Des cafés choisis chez les meilleurs producteurs, torréfiés artisanalement, goûtés et suivis jusqu'à votre tasse.
        </p>
        <div className="mm-eyebrow" style={{ marginTop: 40, fontSize: 15, color: "#8A7468", ...rise(0.8) }}>
          Maison Maitre · Dole · depuis 2022
        </div>
      </div>
    </div>
  );
};
