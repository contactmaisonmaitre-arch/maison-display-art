import { useMemo } from "react";
import { useCarte, useDispo } from "@/hooks/useCarte";
import { BOARD, TAG_LABEL, currentMoment, vedettePool, type CarteTag } from "@/data/carte";
import { dayOffset } from "@/lib/signage/day-offset";
import { remoteUrl } from "@/lib/signage/remote";

const img = (src?: string) => {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return import.meta.env.DEV ? `/${src.replace(/^\//, "")}` : remoteUrl(src);
};

const PILL: Record<CarteTag, { bg: string; fg: string }> = {
  nouveau: { bg: BOARD.orange, fg: BOARD.wine },
  coeur: { bg: BOARD.sand, fg: BOARD.wine },
  vegetal: { bg: "#FFFFFF", fg: "#3E5A48" },
  glace: { bg: "#DCE6EA", fg: "#2F4B57" },
};

// Scène « boisson vedette » : une boisson en grand à chaque passage, choisie
// parmi les sections de circonstance (matin : cafés ; après-midi : glacés et
// lattes ; fin de journée : glouglou) + les éphémères. Jamais une épuisée.
export const VedetteScene = ({ vedetteIndex = 0 }: { vedetteIndex?: number }) => {
  const carte = useCarte();
  const epuises = useDispo();
  const hour = new Date().getHours();
  const pool = useMemo(() => vedettePool(carte, epuises), [carte, epuises]);
  const moment = currentMoment(carte);
  if (pool.length === 0) return <div className="absolute inset-0" style={{ background: BOARD.wine }} />;
  const it = pool[(vedetteIndex + dayOffset() + hour) % pool.length];
  const photo = img(it.image);
  const tags = (it.tags ?? []) as CarteTag[];

  return (
    <div className="absolute inset-0 overflow-hidden flex" style={{ background: BOARD.wine }}>
      {/* Visuel */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: 860, background: photo ? it.bg ?? "#EFE6DA" : BOARD.cream, paddingTop: 118 }}
      >
        {photo ? (
          // Même cadrage que la carte imprimée : la pastille prix recouvre
          // exactement celle de la photo d'origine.
          <div className="relative" style={{ width: 640, aspectRatio: "696 / 661", animation: "mm-slide-up 1.1s ease-out 0.1s both" }}>
            <img src={photo} alt={it.name} className="block h-full w-full" style={{ objectFit: "contain" }} />
            {it.price && (
              <div
                className="absolute flex items-center justify-center font-serif-display"
                style={{
                  width: "28%",
                  aspectRatio: "1",
                  left: "81.2%",
                  top: "2.1%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background: BOARD.wine,
                  color: "#FFFFFF",
                  fontSize: 88,
                  fontWeight: 600,
                  fontVariantNumeric: "lining-nums",
                  boxShadow: `0 0 0 8px ${it.bg ?? "#EFE6DA"}`,
                }}
              >
                {it.price}
              </div>
            )}
          </div>
        ) : (
          // Sans photo : composition typographique (grande initiale + filets)
          <div className="relative flex items-center justify-center" style={{ width: 620, height: 620 }}>
            <div
              className="absolute inset-0"
              style={{ borderRadius: "50%", border: `2px solid ${BOARD.rule}`, animation: "mm-fade-in 1.2s ease-out both" }}
            />
            <div
              className="absolute"
              style={{ inset: 40, borderRadius: "50%", background: "rgba(232,201,169,0.35)" }}
            />
            <div
              className="relative font-serif-display italic"
              style={{ fontSize: 420, lineHeight: 1, color: BOARD.wine, fontWeight: 500, animation: "mm-slide-up 1.1s ease-out 0.15s both" }}
            >
              {it.name.charAt(0)}
            </div>
          </div>
        )}
        {it.price && !photo && (
          <div
            className="absolute flex items-center justify-center font-serif-display"
            style={{
              right: 70,
              bottom: 80,
              width: 190,
              height: 190,
              borderRadius: "50%",
              background: BOARD.wine,
              color: "#FFFFFF",
              fontSize: 84,
              fontWeight: 600,
              fontVariantNumeric: "lining-nums",
              boxShadow: "0 24px 50px -18px rgba(46,11,20,0.6)",
              animation: "mm-slide-up 0.9s ease-out 0.5s both",
            }}
          >
            {it.price}
          </div>
        )}
      </div>

      {/* Texte */}
      <div className="flex flex-col justify-center" style={{ padding: "150px 110px 60px 96px", animation: "mm-slide-up 1s ease-out 0.25s both" }}>
        <div className="font-serif-display uppercase" style={{ fontSize: 15, letterSpacing: "0.32em", color: BOARD.orange, fontWeight: 700 }}>
          {it.ephemere ? "Éphémère · recette de saison" : `${moment?.label ?? "À la carte"} · ${it.section}`}
        </div>
        <div className="font-serif-display mt-6" style={{ fontSize: it.name.length > 18 ? 104 : 136, lineHeight: 0.95, color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.02em" }}>
          {it.name}
        </div>
        {it.pitch && (
          <div className="font-serif-display italic mt-8" style={{ fontSize: 40, lineHeight: 1.3, color: BOARD.sand, maxWidth: 820 }}>
            {it.pitch}
          </div>
        )}
        {it.desc && it.ephemere && (
          <div className="font-serif-display mt-6" style={{ fontSize: 24, lineHeight: 1.45, color: "rgba(244,240,231,0.75)", maxWidth: 800 }}>
            {it.desc}
          </div>
        )}
        {tags.length > 0 && (
          <div className="mt-10 flex gap-3 flex-wrap">
            {tags.map((t) => (
              <span
                key={t}
                className="font-serif-display uppercase"
                style={{ fontSize: 15, letterSpacing: "0.22em", fontWeight: 700, padding: "9px 20px", borderRadius: 999, background: PILL[t].bg, color: PILL[t].fg }}
              >
                {t === "coeur" ? "♥ " : ""}
                {TAG_LABEL[t]}
              </span>
            ))}
          </div>
        )}
        <div className="mt-14 font-serif-display italic" style={{ fontSize: 22, color: "rgba(232,201,169,0.75)" }}>
          À commander au comptoir
        </div>
      </div>
    </div>
  );
};
