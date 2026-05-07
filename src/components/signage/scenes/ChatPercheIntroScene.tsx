// Scène 1/2 du Week-end Gourmand du Chat Perché — annonce / affiche.
export const ChatPercheIntroScene = () => (
  <div className="absolute inset-0 overflow-hidden" style={{ background: "#0A0A0A" }}>
    {/* Halo doré */}
    <div
      className="pointer-events-none absolute"
      style={{
        top: "-25%",
        right: "-15%",
        width: 900,
        height: 900,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(201,168,76,0.22) 0%, transparent 65%)",
        animation: "mm-glow 12s ease-in-out infinite",
      }}
    />
    <div
      className="pointer-events-none absolute"
      style={{
        bottom: "-30%",
        left: "-10%",
        width: 760,
        height: 760,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(116,42,42,0.18) 0%, transparent 65%)",
        animation: "mm-glow 14s ease-in-out infinite reverse",
      }}
    />

    <div
      className="relative flex h-full items-center"
      style={{ animation: "mm-slide-up 1.2s ease-out 0.25s both" }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 1280,
          padding: "0 96px",
          borderLeft: "4px solid hsl(var(--gold))",
          paddingLeft: 56,
        }}
      >
        <div
          className="mm-eyebrow"
          style={{
            fontSize: 16,
            color: "hsl(var(--gold))",
            letterSpacing: "0.42em",
          }}
        >
          Événement · Maison Maitre soutient
        </div>

        <h1
          className="font-serif-display mt-8"
          style={{ fontSize: 108, lineHeight: 1.0, color: "#F5EFE2" }}
        >
          <span className="font-light">Le Week-end Gourmand</span>
          <br />
          <span className="font-semibold italic" style={{ color: "hsl(var(--gold))" }}>
            du Chat Perché
          </span>
        </h1>

        <div
          className="font-serif-display italic mt-7"
          style={{ fontSize: 42, color: "hsl(var(--gold-lt))", fontWeight: 400 }}
        >
          12ᵉ édition · 25-26-27 septembre 2026
        </div>

        <div
          className="mt-8"
          style={{
            width: 140,
            height: 1,
            background: "linear-gradient(90deg, hsl(var(--gold)), transparent)",
          }}
        />

        <p
          className="mm-body font-serif-display italic mt-8"
          style={{
            fontSize: 32,
            lineHeight: 1.4,
            color: "rgba(245,239,226,0.85)",
            maxWidth: 980,
          }}
        >
          Le Grand Festival des Rencontres — à la rencontre des patrimoines
          et des saveurs, au cœur de Dole.
        </p>

        <div className="mt-12 flex items-center gap-6 flex-wrap">
          <div
            className="font-sans-ui uppercase"
            style={{
              fontSize: 13,
              letterSpacing: "0.32em",
              color: "#0A0A0A",
              background: "hsl(var(--gold))",
              padding: "14px 28px",
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: "0 18px 40px -12px hsl(var(--gold) / 0.55)",
            }}
          >
            ★ Entrée libre
          </div>
          <div
            className="font-serif-display italic"
            style={{
              fontSize: 24,
              color: "rgba(245,239,226,0.7)",
            }}
          >
            ★ Hommage à Marcel Aymé
          </div>
        </div>

        <div
          className="mt-14 font-sans-ui uppercase"
          style={{
            fontSize: 12,
            letterSpacing: "0.36em",
            color: "rgba(201,168,76,0.65)",
          }}
        >
          weekend-gourmand-dole.fr · Dole, Jura
        </div>
      </div>
    </div>
  </div>
);
