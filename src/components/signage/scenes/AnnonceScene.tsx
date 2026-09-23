import { useAnnonces } from "@/hooks/useAnnonces";
import { dayOffset } from "@/lib/signage/day-offset";

// Scène générique pour les événements / annonces datés
// (public/data/annonces.json). Même langage visuel que les scènes Chat Perché.
export const AnnonceScene = ({ annonceIndex = 0 }: { annonceIndex?: number }) => {
  const annonces = useAnnonces();
  if (annonces.length === 0) return <div className="absolute inset-0" style={{ background: "#46121F" }} />;
  const a = annonces[(annonceIndex + dayOffset()) % annonces.length];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#46121F" }}>
      {a.image && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${a.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              animation: "mm-cave-kenburns 16s ease-out forwards",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(100deg, rgba(40,9,17,0.92) 0%, rgba(40,9,17,0.7) 45%, rgba(40,9,17,0.25) 100%)" }}
          />
        </>
      )}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-25%",
          right: "-15%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,201,169,0.22) 0%, transparent 65%)",
          animation: "mm-glow 12s ease-in-out infinite",
        }}
      />
      <div className="relative flex h-full items-center pt-16" style={{ animation: "mm-slide-up 1.2s ease-out 0.2s both" }}>
        <div style={{ maxWidth: 1400, marginLeft: 150, borderLeft: "4px solid hsl(var(--gold))", paddingLeft: 56 }}>
          {a.eyebrow && (
            <div className="mm-eyebrow" style={{ fontSize: 16, color: "hsl(var(--gold))", letterSpacing: "0.42em" }}>
              {a.eyebrow}
            </div>
          )}
          <h1 className="font-serif-display mt-8" style={{ fontSize: 112, lineHeight: 1.0, color: "#FFFFFF" }}>
            <span className="font-light">{a.title}</span>
            {a.titleItalic && (
              <>
                <br />
                <span className="font-semibold italic" style={{ color: "hsl(var(--gold))" }}>
                  {a.titleItalic}
                </span>
              </>
            )}
          </h1>
          {a.subtitle && (
            <div className="font-serif-display italic mt-7" style={{ fontSize: 44, color: "hsl(var(--gold-lt))" }}>
              {a.subtitle}
            </div>
          )}
          <div className="mt-8" style={{ width: 140, height: 1, background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          {a.body && (
            <p
              className="font-serif-display italic mt-8"
              style={{ fontSize: 34, lineHeight: 1.4, color: "rgba(244,240,231,0.85)", maxWidth: 1050 }}
            >
              {a.body}
            </p>
          )}
          {a.badge && (
            <div
              className="mt-12 inline-block font-sans-ui uppercase"
              style={{
                fontSize: 14,
                letterSpacing: "0.3em",
                color: "#46121F",
                background: "hsl(var(--gold))",
                padding: "14px 28px",
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "0 18px 40px -12px hsl(var(--gold) / 0.55)",
              }}
            >
              {a.badge}
            </div>
          )}
          {a.footer && (
            <div className="mt-14 font-sans-ui uppercase" style={{ fontSize: 13, letterSpacing: "0.36em", color: "rgba(232,201,169,0.65)" }}>
              {a.footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
