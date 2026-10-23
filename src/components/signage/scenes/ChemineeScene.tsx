import { CHEMINEE_POSTER, CHEMINEE_SRC } from "@/data/scenes";

/** Braises en CSS : ce qu'on voit si les images du feu ne chargent pas. */
const Braises = () => (
  <div className="absolute inset-0" style={{ background: "#140604" }}>
    <div
      className="absolute"
      style={{
        left: "50%",
        bottom: "-30%",
        width: 1400,
        height: 1000,
        transform: "translateX(-50%)",
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 70%, rgba(255,150,60,0.55) 0%, rgba(200,70,20,0.35) 30%, rgba(90,20,8,0.15) 55%, transparent 70%)",
        animation: "mm-braises 3.2s ease-in-out infinite alternate",
      }}
    />
    <div
      className="absolute"
      style={{
        left: "50%",
        bottom: "-12%",
        width: 700,
        height: 420,
        transform: "translateX(-50%)",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,200,120,0.5) 0%, rgba(255,120,40,0.2) 45%, transparent 70%)",
        animation: "mm-braises 1.9s ease-in-out infinite alternate-reverse",
      }}
    />
  </div>
);

/**
 * Feu de cheminée plein écran — joué en interlude entre les scènes
 * (playlist.json → "interlude") ou comme scène normale (type "cheminee").
 */
export const ChemineeScene = ({ src, poster }: { active: boolean; src?: string; poster?: string }) => (
  <div className="absolute inset-0 overflow-hidden" style={{ background: "#140604" }}>
    {/* Empilés : braises, puis image fixe, puis feu animé — chacun masque le précédent s'il charge. */}
    <Braises />
    {[poster ?? CHEMINEE_POSTER, src ?? CHEMINEE_SRC].map((img) => (
      <img
        key={img}
        src={img}
        alt=""
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: "cover" }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    ))}
    {/* Vignette douce pour fondre le feu dans la charte */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 45%, rgba(20,5,7,0.65) 100%)" }}
    />
    <img
      src="/brand/logo-white.png"
      alt=""
      className="pointer-events-none absolute"
      style={{ right: 64, bottom: 48, height: 54, opacity: 0.55 }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  </div>
);
