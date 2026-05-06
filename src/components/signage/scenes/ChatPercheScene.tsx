// ============ Chat Perché — événement Maison Maître ============
export const ChatPercheScene = () => (
  <div className="absolute inset-0 flex items-center" style={{ background: "#0A0A0A" }}>
    <div
      className="mx-auto"
      style={{
        maxWidth: 1200,
        padding: "0 96px",
        borderLeft: "4px solid hsl(var(--gold))",
        paddingLeft: 56,
      }}
    >
      <div
        className="mm-eyebrow"
        style={{ fontSize: 16, color: "hsl(var(--gold))", letterSpacing: "0.42em" }}
      >
        Événement · Maison Maître
      </div>
      <h1
        className="font-serif-display mt-8"
        style={{ fontSize: 96, lineHeight: 1.02, color: "#F5EFE2" }}
      >
        Le Week-end Gourmand<br />du Chat Perché
      </h1>
      <div
        className="font-serif-display italic mt-6"
        style={{ fontSize: 42, color: "hsl(var(--gold))", fontWeight: 400 }}
      >
        Un événement unique à Dole
      </div>
      <p
        className="mm-body mt-10"
        style={{ fontSize: 26, lineHeight: 1.55, color: "rgba(245,239,226,0.78)", maxWidth: 880 }}
      >
        Chaque week-end, Maison Maître vous invite à une expérience sensorielle
        autour du café de spécialité, du thé d'exception et des vins nature.
      </p>
      <div
        className="inline-block font-sans-ui uppercase mt-12"
        style={{
          fontSize: 13,
          letterSpacing: "0.32em",
          color: "#0A0A0A",
          background: "hsl(var(--gold))",
          padding: "14px 28px",
          borderRadius: 2,
          fontWeight: 600,
        }}
      >
        ★ À ne pas manquer
      </div>
    </div>
  </div>
);
