import { useMemo } from "react";
import { useCarte, useDispo } from "@/hooks/useCarte";
import {
  BOARD,
  TAG_LABEL,
  currentMoment,
  slug,
  type CarteItem,
  type CarteSection,
  type CarteTag,
} from "@/data/carte";
import { QrCode } from "@/components/signage/QrCode";
import { MOBILE_CARTE_URL } from "@/lib/signage/site";

const Leaf = ({ size = 22, color = BOARD.sand }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
    <path d="M5 19l8-8" />
  </svg>
);

// Pastilles affichées sur la carte TV (« Aussi en glacé » reste réservé à la vedette).
const SHOWN_TAGS: CarteTag[] = ["nouveau", "coeur", "vegetal"];

export const TagPill = ({ tag, dark = false }: { tag: CarteTag; dark?: boolean }) => {
  const style: Record<CarteTag, { bg: string; fg: string }> = {
    nouveau: { bg: BOARD.orange, fg: BOARD.wine },
    coeur: { bg: dark ? BOARD.sand : BOARD.wine, fg: dark ? BOARD.wine : "#FFFFFF" },
    vegetal: { bg: "#FFFFFF", fg: "#3E5A48" },
    glace: { bg: "#DCE6EA", fg: "#2F4B57" },
  };
  const s = style[tag];
  return (
    <span
      className="font-serif-display uppercase inline-flex items-center gap-1"
      style={{
        fontSize: 11,
        letterSpacing: "0.18em",
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 999,
        background: s.bg,
        color: s.fg,
        whiteSpace: "nowrap",
        transform: "translateY(-3px)",
      }}
    >
      {tag === "coeur" ? "♥ " : tag === "vegetal" ? <Leaf size={11} color={s.fg} /> : null}
      {TAG_LABEL[tag]}
    </span>
  );
};

const Item = ({
  it,
  dark = false,
  size = 34,
  soldOut = false,
}: {
  it: CarteItem;
  dark?: boolean;
  size?: number;
  soldOut?: boolean;
}) => {
  const main = dark ? "#FFFFFF" : BOARD.wine;
  const sub = dark ? BOARD.sand : BOARD.muted;
  const tags = (it.tags ?? []).filter((t) => SHOWN_TAGS.includes(t));
  return (
    <div style={{ opacity: soldOut ? 0.42 : 1, transition: "opacity 0.6s" }}>
      <div className="font-serif-display flex items-baseline flex-wrap" style={{ columnGap: 12, rowGap: 4, lineHeight: 1.15 }}>
        {it.leaf && (
          <span style={{ alignSelf: "center" }}>
            <Leaf size={size * 0.62} />
          </span>
        )}
        <span style={{ fontSize: size, fontWeight: 600, color: main, textDecoration: soldOut ? "line-through" : "none", textDecorationThickness: 2 }}>
          {it.name}
        </span>
        {it.size && <span style={{ fontSize: size * 0.6, fontWeight: 500, color: sub }}>{it.size}</span>}
        {it.price && !soldOut && (
          <span className="tabular-nums" style={{ fontSize: size * 0.82, fontWeight: 500, color: sub }}>
            {it.price}
          </span>
        )}
        {soldOut ? (
          <span
            className="font-serif-display uppercase"
            style={{ fontSize: 11, letterSpacing: "0.18em", fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: BOARD.muted, color: "#FFFFFF", transform: "translateY(-3px)" }}
          >
            Épuisé
          </span>
        ) : (
          tags.map((t) => <TagPill key={t} tag={t} dark={dark} />)
        )}
      </div>
      {it.desc && !soldOut && (
        <div className="font-serif-display italic" style={{ fontSize: size * 0.62, color: sub, marginTop: 2, lineHeight: 1.25 }}>
          {it.desc}
        </div>
      )}
    </div>
  );
};

const Section = ({
  s,
  delay,
  focus,
  epuises,
}: {
  s: CarteSection;
  delay: number;
  focus: boolean;
  epuises: string[];
}) => (
  <div
    className="relative"
    style={{
      animation: `mm-slide-up 0.9s ease-out ${delay}s both`,
      // Section mise en avant à cette heure-ci : léger fond sable.
      background: focus ? "rgba(232,201,169,0.28)" : "transparent",
      boxShadow: focus ? "0 0 0 1px rgba(212,136,92,0.35) inset" : "none",
      borderRadius: 22,
      padding: focus ? "22px 26px 26px" : "22px 26px 26px",
      margin: "-22px -26px 0",
    }}
  >
    {focus && (
      <div
        className="font-serif-display uppercase absolute"
        style={{ top: -13, right: 22, fontSize: 12, letterSpacing: "0.22em", fontWeight: 700, padding: "5px 12px", borderRadius: 999, background: BOARD.orange, color: BOARD.wine, whiteSpace: "nowrap" }}
      >
        En ce moment
      </div>
    )}
    <div className="font-serif-display" style={{ fontSize: 68, fontWeight: 600, lineHeight: 1, color: BOARD.wine, letterSpacing: "-0.01em" }}>
      {s.title}
    </div>
    <div style={{ height: 2, background: BOARD.rule, margin: "16px 0 18px" }} />
    {s.note && (
      <div className="font-serif-display italic" style={{ fontSize: 22, color: BOARD.muted, marginBottom: 14, lineHeight: 1.3 }}>
        {s.note}
      </div>
    )}
    <div className="flex flex-col" style={{ gap: 20 }}>
      {s.groups.map((g, gi) => (
        <div key={gi} className="flex flex-col" style={{ gap: 11 }}>
          {g.label && (
            <div className="font-serif-display uppercase" style={{ fontSize: 15, letterSpacing: "0.3em", color: BOARD.muted, fontWeight: 600 }}>
              {g.label}
            </div>
          )}
          {g.items.map((it) => (
            <Item key={it.name} it={it} soldOut={epuises.includes(slug(it.name))} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Scène « La carte » — mise en page de la carte imprimée, qui met en avant
// les sections de circonstance selon l'heure, grise les boissons épuisées
// et renvoie vers la carte mobile par QR code.
export const CarteScene = () => {
  const carte = useCarte();
  const epuises = useDispo();
  const moment = useMemo(() => currentMoment(carte), [carte]);
  if (!carte) return <div className="absolute inset-0" style={{ background: BOARD.cream }} />;
  const focus = new Set(moment?.focus ?? []);

  return (
    <div className="absolute inset-0 overflow-hidden flex" style={{ background: BOARD.cream }}>
      {/* Panneau bordeaux */}
      <div
        className="relative flex flex-col shrink-0"
        style={{ width: 470, background: BOARD.wine, padding: "150px 56px 40px 64px", animation: "mm-fade-in 0.8s ease-out both" }}
      >
        <div className="font-serif-display" style={{ fontSize: 118, lineHeight: 0.88, color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.02em" }}>
          La<br />Carte
        </div>
        {moment ? (
          <div className="mt-6">
            <div className="font-serif-display uppercase" style={{ fontSize: 13, letterSpacing: "0.3em", color: BOARD.orange, fontWeight: 700 }}>
              {moment.label}
            </div>
            <div className="font-serif-display italic mt-1" style={{ fontSize: 28, lineHeight: 1.25, color: BOARD.sand }}>
              {moment.titre}
            </div>
          </div>
        ) : (
          carte.tagline && (
            <div className="font-serif-display italic mt-6" style={{ fontSize: 26, lineHeight: 1.35, color: BOARD.sand }}>
              {carte.tagline.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          )
        )}
        <div style={{ height: 1, background: "rgba(232,201,169,0.35)", margin: "26px 0 22px" }} />
        <div className="flex flex-col" style={{ gap: 20 }}>
          {carte.side?.map((g) => (
            <div key={g.label} className="flex flex-col" style={{ gap: 8 }}>
              <div className="font-serif-display uppercase" style={{ fontSize: 13, letterSpacing: "0.3em", color: BOARD.sand, fontWeight: 600 }}>
                {g.label}
              </div>
              {g.items.map((it) => (
                <Item key={it.name} it={it} dark size={25} />
              ))}
            </div>
          ))}
        </div>
        {/* QR vers la carte mobile */}
        <div className="mt-auto flex items-center gap-4" style={{ paddingTop: 18 }}>
          <div style={{ padding: 8, background: BOARD.cream, borderRadius: 12 }}>
            <QrCode value={MOBILE_CARTE_URL} size={96} />
          </div>
          <div className="font-serif-display" style={{ fontSize: 19, lineHeight: 1.3, color: "#FFFFFF" }}>
            La carte sur
            <br />
            votre téléphone
            <div className="italic" style={{ fontSize: 15, color: BOARD.sand }}>
              compositions & végétal
            </div>
          </div>
        </div>
      </div>

      {/* Colonnes */}
      <div
        className="grid flex-1"
        style={{
          gridTemplateColumns: `repeat(${carte.columns.length}, minmax(0, 1fr))`,
          columnGap: 64,
          padding: "160px 90px 40px 86px",
        }}
      >
        {carte.columns.map((col, ci) => (
          <div key={ci} className="flex flex-col" style={{ gap: 40 }}>
            {col.map((s, si) => (
              <Section key={s.title} s={s} delay={0.15 + ci * 0.12 + si * 0.08} focus={focus.has(s.title)} epuises={epuises} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
