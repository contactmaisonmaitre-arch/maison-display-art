import { useEffect, useState, type CSSProperties } from "react";
import { useRemoteJson } from "@/hooks/useRemoteJson";
import fallbackClub from "../../../../public/data/club.json";

type Finish = "creme" | "or" | "platine" | "bronze" | "noir";

interface ClubTier {
  name: string;
  rate?: string;
  threshold?: number;
  condition?: string;
  gain?: string;
  extra?: string;
  finish?: Finish;
}

interface ClubStep {
  title: string;
  text?: string;
}

export interface ClubJson {
  eyebrow?: string;
  title?: string;
  titleItalic?: string;
  steps?: ClubStep[];
  gaugeTitle?: string;
  tiers: ClubTier[];
  footer?: string;
  cta?: string;
}

// Rendu « matière » de chaque carte.
const FINISHES: Record<Finish, { bg: string; ink: string; soft: string; edge: string }> = {
  creme: {
    bg: "linear-gradient(135deg, #FBF6EC 0%, #EFE4CF 55%, #E2D2B4 100%)",
    ink: "#46121F",
    soft: "rgba(70,18,31,0.55)",
    edge: "rgba(70,18,31,0.18)",
  },
  bronze: {
    bg: "linear-gradient(135deg, #E7B98C 0%, #B07444 45%, #7A4520 100%)",
    ink: "#2B1206",
    soft: "rgba(43,18,6,0.6)",
    edge: "rgba(255,230,200,0.5)",
  },
  or: {
    bg: "linear-gradient(135deg, #F6E3A8 0%, #D9B45C 35%, #B88A2E 65%, #E9CB7A 100%)",
    ink: "#3A2306",
    soft: "rgba(58,35,6,0.6)",
    edge: "rgba(255,244,210,0.7)",
  },
  platine: {
    bg: "linear-gradient(135deg, #F4F5F7 0%, #C9CDD3 30%, #9BA1AA 55%, #E3E6EA 80%, #B5BAC2 100%)",
    ink: "#1E2228",
    soft: "rgba(30,34,40,0.6)",
    edge: "rgba(255,255,255,0.85)",
  },
  noir: {
    bg: "linear-gradient(135deg, #2A2A2E 0%, #121214 60%, #3A3A40 100%)",
    ink: "#E9CB7A",
    soft: "rgba(233,203,122,0.7)",
    edge: "rgba(233,203,122,0.35)",
  },
};

const GOLD = "hsl(var(--gold))";
const GOLD_LT = "hsl(var(--gold-lt))";
const CREAM = "rgba(244,240,231,0.85)";

/** Carte de fidélité au format carte bancaire ; `width` fixe toutes les tailles. */
const Card = ({ tier, width, sheenDelay, style }: { tier: ClubTier; width: number; sheenDelay: number; style?: CSSProperties }) => {
  const f = FINISHES[tier.finish ?? "creme"] ?? FINISHES.creme;
  const k = width / 440;
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height: Math.round(width * 0.63),
        borderRadius: 22 * k,
        background: f.bg,
        border: `1px solid ${f.edge}`,
        boxShadow: "0 40px 70px -25px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.35)",
        ...style,
      }}
    >
      {/* Reflet qui passe sur la carte */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{
          width: "45%",
          left: "-60%",
          background: "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
          animation: `mm-club-sheen 5s ease-in-out ${sheenDelay}s infinite`,
        }}
      />
      <div className="relative flex h-full flex-col justify-between" style={{ padding: `${30 * k}px ${34 * k}px` }}>
        <div className="font-sans-ui uppercase" style={{ fontSize: 14 * k, letterSpacing: "0.38em", color: f.soft }}>
          Maison Maitre
        </div>
        <div className="font-serif-display italic" style={{ fontSize: 76 * k, lineHeight: 1, color: f.ink }}>
          {tier.name}
        </div>
        <div className="flex items-end justify-between">
          <div className="font-sans-ui uppercase" style={{ fontSize: 12 * k, letterSpacing: "0.32em", color: f.soft }}>
            Le Club
          </div>
          {tier.rate && (
            <div className="font-serif-display" style={{ fontSize: 40 * k, lineHeight: 1, color: f.ink, fontWeight: 600 }}>
              {tier.rate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** 1er temps : les cartes en éventail + les étapes qui apparaissent une à une. */
const HowItWorks = ({ club }: { club: ClubJson }) => {
  const tiers = club.tiers.slice(0, 4);
  const mid = (tiers.length - 1) / 2;
  const steps = club.steps ?? [];
  return (
    <div className="relative flex h-full items-center" style={{ paddingTop: 118, paddingLeft: 90, paddingRight: 110 }}>
      {/* Éventail de cartes, qui flotte doucement */}
      <div className="relative shrink-0" style={{ width: 760, height: 620 }}>
        <div className="absolute inset-0" style={{ animation: "mm-club-float 7s ease-in-out infinite" }}>
          {tiers.map((t, i) => {
            const d = i - mid;
            return (
              <div
                key={t.name + i}
                className="absolute"
                style={{
                  left: 120 + d * 120,
                  top: 150 + Math.abs(d) * 34,
                  zIndex: tiers.length - i,
                  transform: `rotate(${d * 11 - 3}deg)`,
                }}
              >
                <div style={{ animation: `mm-club-deal 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${0.3 + (tiers.length - 1 - i) * 0.25}s both` }}>
                  <Card tier={t} width={500} sheenDelay={2 + i * 0.6} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1" style={{ paddingLeft: 40 }}>
        <div style={{ animation: "mm-slide-up 1s ease-out 0.1s both" }}>
          {club.eyebrow && (
            <div className="mm-eyebrow" style={{ fontSize: 16, color: GOLD, letterSpacing: "0.42em" }}>
              {club.eyebrow}
            </div>
          )}
          <h1 className="font-serif-display mt-5" style={{ fontSize: 88, lineHeight: 1, color: "#FFFFFF" }}>
            <span className="font-light">{club.title} </span>
            <span className="font-semibold italic" style={{ color: GOLD }}>
              {club.titleItalic}
            </span>
          </h1>
        </div>

        <div className="mt-14 flex flex-col" style={{ gap: 34 }}>
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-start" style={{ gap: 28, animation: `mm-slide-up 0.9s ease-out ${1.4 + i * 1.6}s both` }}>
              <div
                className="flex shrink-0 items-center justify-center font-serif-display"
                style={{ width: 66, height: 66, borderRadius: "50%", border: `2px solid ${GOLD}`, color: GOLD, fontSize: 34, fontWeight: 600 }}
              >
                {i + 1}
              </div>
              <div>
                <div className="font-serif-display" style={{ fontSize: 42, lineHeight: 1.1, color: "#FFFFFF" }}>
                  {s.title}
                </div>
                {s.text && (
                  <div className="font-serif-display italic mt-2" style={{ fontSize: 28, lineHeight: 1.3, color: CREAM }}>
                    {s.text}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** 2e temps : les niveaux en escalier, la jauge des seuils qui se remplit, l'appel à l'action. */
const Levels = ({ club }: { club: ClubJson }) => {
  const tiers = club.tiers.slice(0, 4);
  const max = Math.max(...tiers.map((t) => t.threshold ?? 0));
  const FILL_S = 3.5;
  const fillStart = 0.8;
  const cardWidth = tiers.length > 3 ? 340 : 400;
  return (
    <div className="relative flex h-full flex-col items-center" style={{ paddingTop: 150 }}>
      {club.gaugeTitle && (
        <h2 className="font-serif-display italic" style={{ fontSize: 64, lineHeight: 1, color: "#FFFFFF", animation: "mm-slide-up 0.9s ease-out 0.1s both" }}>
          {club.gaugeTitle}
        </h2>
      )}

      {/* Jauge : 12 mois d'achats, avec un repère par seuil */}
      {max > 0 && (
        <div className="relative mt-14" style={{ width: 1400, height: 70, animation: "mm-fade-in 0.8s ease-out 0.4s both" }}>
          <div className="absolute left-0 right-0" style={{ top: 18, height: 8, borderRadius: 8, background: "rgba(244,240,231,0.15)" }} />
          <div
            className="absolute left-0 right-0"
            style={{
              top: 18,
              height: 8,
              borderRadius: 8,
              background: `linear-gradient(90deg, #B07444 0%, #D9B45C 50%, #E3E6EA 100%)`,
              transformOrigin: "left center",
              animation: `mm-club-fill ${FILL_S}s cubic-bezier(0.45, 0, 0.2, 1) ${fillStart}s both`,
            }}
          />
          {tiers.map((t, i) => {
            const pos = (t.threshold ?? 0) / max;
            return (
              <div
                key={t.name + i}
                className="absolute flex flex-col items-center"
                style={{ left: `${pos * 100}%`, top: 0, transform: "translateX(-50%)", animation: `mm-club-pop 0.6s ease-out ${fillStart + pos * FILL_S}s both` }}
              >
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: FINISHES[t.finish ?? "creme"]?.bg, boxShadow: "0 0 0 4px #46121F, 0 0 24px rgba(232,201,169,0.6)" }} />
                <div className="font-sans-ui uppercase mt-3 whitespace-nowrap" style={{ fontSize: 14, letterSpacing: "0.25em", color: GOLD_LT }}>
                  {(t.threshold ?? 0).toLocaleString("fr-FR")} € · {t.name}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Les cartes en escalier : chaque niveau un peu plus haut */}
      <div className="mt-16 flex items-end justify-center" style={{ gap: 60 }}>
        {tiers.map((t, i) => (
          <div
            key={t.name + i}
            className="flex flex-col items-center"
            style={{ marginBottom: i * 30, animation: `mm-slide-up 1s ease-out ${fillStart + ((t.threshold ?? 0) / (max || 1)) * FILL_S}s both` }}
          >
            <Card tier={t} width={cardWidth} sheenDelay={5 + i * 0.6} />
            <div className="mt-7 text-center" style={{ maxWidth: cardWidth + 40 }}>
              {t.condition && (
                <div className="font-sans-ui uppercase" style={{ fontSize: 14, letterSpacing: "0.2em", color: GOLD_LT }}>
                  {t.condition}
                </div>
              )}
              {t.gain && (
                <div className="font-serif-display mt-3" style={{ fontSize: 34, lineHeight: 1.15, color: "#FFFFFF" }}>
                  {t.gain}
                </div>
              )}
              {t.extra && (
                <div className="font-serif-display italic mt-2" style={{ fontSize: 26, color: GOLD }}>
                  {t.extra}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center" style={{ animation: `mm-slide-up 1s ease-out ${fillStart + FILL_S + 0.8}s both` }}>
        {club.footer && (
          <p className="font-serif-display italic text-center" style={{ fontSize: 30, color: CREAM }}>
            {club.footer}
          </p>
        )}
        {club.cta && (
          <div
            className="mt-6 font-sans-ui uppercase"
            style={{
              fontSize: 16,
              letterSpacing: "0.3em",
              color: "#46121F",
              background: GOLD,
              padding: "16px 34px",
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: "0 18px 40px -12px hsl(var(--gold) / 0.55)",
            }}
          >
            {club.cta}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Programme de fidélité « Maison Maitre, le Club » (public/data/club.json),
 * en deux temps sur la durée de la scène : comment ça marche, puis les niveaux.
 */
export const ClubScene = ({ active = true, duration = 30_000 }: { active?: boolean; duration?: number }) => {
  const remote = useRemoteJson<ClubJson>("data/club.json", 30 * 60 * 1000);
  const club: ClubJson = remote?.tiers?.length ? remote : (fallbackClub as ClubJson);
  const hasSteps = (club.steps?.length ?? 0) > 0;

  // La scène est montée en avance (préchargement) : on relance les animations
  // à chaque fois qu'elle arrive à l'écran, et on passe aux niveaux à mi-parcours.
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!active) return;
    setRun((r) => r + 1);
    setPhase(0);
    if (!hasSteps) return;
    const id = window.setTimeout(() => setPhase(1), duration / 2);
    return () => window.clearTimeout(id);
  }, [active, duration, hasSteps]);

  const showLevels = !hasSteps || phase === 1;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#46121F" }}>
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-30%",
          left: "50%",
          width: 1400,
          height: 1000,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,201,169,0.20) 0%, transparent 65%)",
          animation: "mm-glow 12s ease-in-out infinite",
        }}
      />
      <div key={`${run}-${showLevels}`} className="absolute inset-0" style={{ animation: "mm-fade-in 0.7s ease-out both" }}>
        {showLevels ? <Levels club={club} /> : <HowItWorks club={club} />}
      </div>
    </div>
  );
};
