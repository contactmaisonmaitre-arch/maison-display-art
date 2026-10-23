import { useRemoteJson } from "@/hooks/useRemoteJson";
import fallbackClub from "../../../../public/data/club.json";

type Finish = "creme" | "or" | "platine" | "bronze" | "noir";

interface ClubTier {
  name: string;
  condition?: string;
  gain?: string;
  extra?: string;
  finish?: Finish;
}

export interface ClubJson {
  eyebrow?: string;
  title?: string;
  titleItalic?: string;
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

const Card = ({ tier, delay }: { tier: ClubTier; delay: number }) => {
  const f = FINISHES[tier.finish ?? "creme"] ?? FINISHES.creme;
  return (
    <div className="flex flex-col items-center" style={{ animation: `mm-slide-up 1s ease-out ${delay}s both` }}>
      <div
        className="relative overflow-hidden"
        style={{
          width: 440,
          height: 277, // format carte bancaire
          borderRadius: 22,
          background: f.bg,
          border: `1px solid ${f.edge}`,
          boxShadow: "0 40px 70px -25px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      >
        {/* Reflet qui passe sur la carte */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{
            width: "45%",
            left: "-60%",
            background: "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            animation: `mm-club-sheen 5s ease-in-out ${1.5 + delay}s infinite`,
          }}
        />
        <div className="relative flex h-full flex-col justify-between" style={{ padding: "30px 34px" }}>
          <div className="font-sans-ui uppercase" style={{ fontSize: 14, letterSpacing: "0.38em", color: f.soft }}>
            Maison Maitre
          </div>
          <div>
            <div className="font-serif-display italic" style={{ fontSize: 76, lineHeight: 1, color: f.ink }}>
              {tier.name}
            </div>
            <div className="font-sans-ui uppercase mt-3" style={{ fontSize: 12, letterSpacing: "0.32em", color: f.soft }}>
              Le Club
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center" style={{ maxWidth: 460 }}>
        {tier.condition && (
          <div className="font-sans-ui uppercase" style={{ fontSize: 15, letterSpacing: "0.2em", color: "hsl(var(--gold-lt))" }}>
            {tier.condition}
          </div>
        )}
        {tier.gain && (
          <div className="font-serif-display mt-4" style={{ fontSize: 40, lineHeight: 1.15, color: "#FFFFFF" }}>
            {tier.gain}
          </div>
        )}
        {tier.extra && (
          <div className="font-serif-display italic mt-3" style={{ fontSize: 30, color: "hsl(var(--gold))" }}>
            {tier.extra}
          </div>
        )}
      </div>
    </div>
  );
};

/** Programme de fidélité « Maison Maitre, le Club » (public/data/club.json). */
export const ClubScene = () => {
  const remote = useRemoteJson<ClubJson>("data/club.json", 30 * 60 * 1000);
  const club: ClubJson = remote?.tiers?.length ? remote : (fallbackClub as ClubJson);

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
      <div className="relative flex h-full flex-col items-center justify-center pt-12">
        <div style={{ animation: "mm-slide-up 1s ease-out 0.1s both" }} className="text-center">
          {club.eyebrow && (
            <div className="mm-eyebrow" style={{ fontSize: 16, color: "hsl(var(--gold))", letterSpacing: "0.42em" }}>
              {club.eyebrow}
            </div>
          )}
          <h1 className="font-serif-display mt-5" style={{ fontSize: 84, lineHeight: 1, color: "#FFFFFF" }}>
            <span className="font-light">{club.title} </span>
            <span className="font-semibold italic" style={{ color: "hsl(var(--gold))" }}>
              {club.titleItalic}
            </span>
          </h1>
        </div>

        <div className="mt-16 flex items-start justify-center" style={{ gap: 70 }}>
          {club.tiers.slice(0, 4).map((t, i) => (
            <Card key={t.name + i} tier={t} delay={0.4 + i * 0.25} />
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center" style={{ animation: "mm-slide-up 1s ease-out 1.4s both" }}>
          {club.footer && (
            <p className="font-serif-display italic text-center" style={{ fontSize: 32, color: "rgba(244,240,231,0.85)" }}>
              {club.footer}
            </p>
          )}
          {club.cta && (
            <div
              className="mt-8 font-sans-ui uppercase"
              style={{
                fontSize: 15,
                letterSpacing: "0.3em",
                color: "#46121F",
                background: "hsl(var(--gold))",
                padding: "15px 30px",
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
    </div>
  );
};
