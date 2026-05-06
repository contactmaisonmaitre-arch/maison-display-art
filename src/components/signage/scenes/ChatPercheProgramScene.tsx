interface InfoCard {
  eyebrow: string;
  number: string;
  title: string;
  body: string;
}

const CARDS: InfoCard[] = [
  {
    eyebrow: "Bourgogne-Franche-Comté",
    number: "150",
    title: "Exposants",
    body: "Producteurs, artisans des métiers de bouche, AOC · AOP · IGP — toute une région à déguster.",
  },
  {
    eyebrow: "Le week-end durant",
    number: "≈ 50",
    title: "Animations",
    body: "Concerts, démonstrations culinaires, dégustations, lectures gourmandes, spectacles familiaux.",
  },
  {
    eyebrow: "Commanderie de Dole",
    number: "Banquet",
    title: "Du Chat Gourmand",
    body: "Haute gastronomie bourgui-comtoise par les chefs étoilés et bistrots locaux engagés.",
  },
  {
    eyebrow: "Invités d'honneur 2026",
    number: "★",
    title: "Beaujolais & Charolles",
    body: "Le Beaujolais comme territoire invité, Charolles comme ville invitée — vins, terroir, savoir-faire.",
  },
];

// Scène 2/2 du Week-end Gourmand du Chat Perché — programme & infos pratiques.
export const ChatPercheProgramScene = () => (
  <div
    className="absolute inset-0 overflow-hidden px-24 pb-20 pt-32"
    style={{
      background:
        "linear-gradient(135deg, #0E0805 0%, #1A1410 50%, #2E2419 100%)",
    }}
  >
    <div
      className="pointer-events-none absolute"
      style={{
        top: "-15%",
        left: "-10%",
        width: 800,
        height: 800,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(201,168,76,0.16) 0%, transparent 65%)",
      }}
    />

    <div className="relative">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div style={{ fontSize: 48 }}>🎪</div>
        <div
          style={{
            width: 96,
            height: 2,
            backgroundColor: "hsl(var(--gold))",
          }}
        />
        <div
          className="font-sans-ui uppercase"
          style={{
            fontSize: 18,
            letterSpacing: "0.4em",
            color: "hsl(var(--gold))",
          }}
        >
          Chat Perché · Le programme
        </div>
      </div>

      <h2
        className="mt-7 font-serif-display leading-[0.98]"
        style={{ fontSize: 92, color: "hsl(var(--linen))" }}
      >
        <span className="font-semibold">Trois jours de fête,</span>{" "}
        <span
          className="italic font-light"
          style={{ color: "hsl(var(--gold-lt))" }}
        >
          un seul rendez-vous.
        </span>
      </h2>

      <p
        className="mt-5 max-w-[1240px] font-serif-display italic"
        style={{
          fontSize: 26,
          lineHeight: 1.35,
          color: "rgba(242,237,228,0.72)",
        }}
      >
        25-26-27 septembre 2026 · Dole · Entrée libre · Pass jour 22 €
      </p>

      <div
        className="mt-10 grid grid-cols-4 gap-7"
        style={{ height: 460 }}
      >
        {CARDS.map((c, i) => (
          <div
            key={c.title}
            className="relative flex flex-col rounded-sm p-7 overflow-hidden"
            style={{
              backgroundColor: "rgba(242,237,228,0.06)",
              border: "1px solid rgba(201,168,76,0.28)",
              animation: `mm-slide-up 0.9s ease-out ${0.25 + i * 0.12}s both`,
            }}
          >
            {/* numéro géant en filigrane */}
            <div
              aria-hidden
              className="pointer-events-none absolute font-serif-display italic select-none"
              style={{
                right: -14,
                bottom: -42,
                fontSize: 230,
                lineHeight: 1,
                fontWeight: 300,
                letterSpacing: "-0.05em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(201,168,76,0.22)",
              }}
            >
              0{i + 1}
            </div>

            <div
              className="relative font-sans-ui uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.34em",
                color: "hsl(var(--gold))",
              }}
            >
              {c.eyebrow}
            </div>
            <div
              className="relative mt-4"
              style={{
                width: 32,
                height: 1,
                backgroundColor: "hsl(var(--gold))",
              }}
            />

            <div
              className="relative mt-5 font-serif-display leading-[0.95]"
              style={{
                fontSize: 64,
                fontWeight: 600,
                color: "hsl(var(--gold-lt))",
                letterSpacing: "-0.01em",
              }}
            >
              {c.number}
            </div>
            <div
              className="relative mt-2 font-serif-display italic"
              style={{
                fontSize: 28,
                color: "hsl(var(--linen))",
                lineHeight: 1.15,
              }}
            >
              {c.title}
            </div>
            <p
              className="relative mt-auto pt-5 font-serif-display"
              style={{
                fontSize: 17,
                lineHeight: 1.4,
                color: "rgba(242,237,228,0.72)",
              }}
            >
              {c.body}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-10 flex items-center justify-between gap-8"
        style={{ animation: "mm-slide-up 0.9s ease-out 0.85s both" }}
      >
        <div
          className="font-serif-display italic"
          style={{ fontSize: 22, color: "rgba(242,237,228,0.7)" }}
        >
          ✦ Banquet, dîner mystère, forum « Du champ à l'assiette », menus
          spéciaux dans les restaurants de Dole.
        </div>
        <div
          className="font-sans-ui uppercase whitespace-nowrap"
          style={{
            fontSize: 13,
            letterSpacing: "0.36em",
            color: "hsl(var(--gold))",
            padding: "12px 22px",
            border: "1.5px solid hsl(var(--gold))",
            borderRadius: 2,
          }}
        >
          weekend-gourmand-dole.fr
        </div>
      </div>
    </div>
  </div>
);
