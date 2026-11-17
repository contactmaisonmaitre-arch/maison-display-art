import { FeuCanvas } from "./FeuCanvas";
import { useNoelActive } from "@/hooks/useNoel";
import { tartanBg } from "../noel/Tartan";

/** Braises en CSS : ce qu'on voit si WebGL n'est pas disponible sur la TV. */
const Braises = () => (
  <div className="absolute inset-0" style={{ background: "#140604" }}>
    <div
      className="absolute"
      style={{
        left: "50%",
        bottom: "-30%",
        width: "75%",
        height: "95%",
        transform: "translateX(-50%)",
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 70%, rgba(255,150,60,0.55) 0%, rgba(200,70,20,0.35) 30%, rgba(90,20,8,0.15) 55%, transparent 70%)",
        animation: "mm-braises 3.2s ease-in-out infinite alternate",
      }}
    />
  </div>
);

/**
 * Feu de cheminée plein écran, seul à l'écran pendant l'interlude.
 *
 * Avant : une vidéo MP4 de 15 Mo, recréée à chaque passage — le navigateur du
 * Fire TV Stick l'affichait noire ou saccadée. Maintenant le feu est dessiné
 * en direct (FeuCanvas, WebGL) : rien à télécharger, rien à décoder, et il ne
 * peut plus « figer ». Pendant Noël : cadre tartan + logo.
 */
export const FireOverlay = ({ scale = 1 }: { src?: string; poster?: string; scale?: number }) => {
  const noel = useNoelActive();
  const band = Math.round(30 * scale);
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 9999, background: "#140604" }} aria-hidden>
      <div className="absolute" style={noel ? { inset: band } : { inset: 0 }}>
        <FeuCanvas fallback={<Braises />} />
      </div>
      {noel && (
        <>
          {/* Cadre tartan + filet doré, comme le menu de Noël */}
          <div className="absolute inset-0 pointer-events-none" style={{ ...tartanBg(Math.round(244 * scale)), clipPath: `polygon(0 0,100% 0,100% 100%,0 100%,0 0,${band}px ${band}px,${band}px calc(100% - ${band}px),calc(100% - ${band}px) calc(100% - ${band}px),calc(100% - ${band}px) ${band}px,${band}px ${band}px)` }} />
          <div className="absolute pointer-events-none" style={{ inset: band, border: "2px solid #C9A45C" }} />
        </>
      )}
      <div className="absolute flex flex-col items-center" style={{ left: 0, right: 0, top: Math.round((noel ? 78 : 52) * scale), gap: Math.round(14 * scale) }}>
        <img
          src="/brand/logo-white.png"
          alt=""
          style={{ height: Math.round(64 * scale), opacity: 0.7 }}
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
        {noel && (
          <div className="font-serif-display italic" style={{ fontSize: Math.round(40 * scale), color: "rgba(246,232,205,0.85)", textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
            Joyeuses fêtes au coin du feu
          </div>
        )}
      </div>
    </div>
  );
};
