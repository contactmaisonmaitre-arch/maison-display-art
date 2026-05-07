// Scène dédiée au matcha de cérémonie d'Uji que la boutique sert sur place.
export const MatchaScene = () => (
  <div className="absolute inset-0 overflow-hidden" style={{ background: "#0E1A0E" }}>
    {/* Image de fond — ken burns lent */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "url(/scenes/matcha.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        animation: "mm-cave-kenburns 18s ease-out forwards",
      }}
    />

    {/* Voile vert sombre éditorial */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(105deg, rgba(8,16,8,0.82) 0%, rgba(8,16,8,0.55) 38%, rgba(8,16,8,0.18) 70%, rgba(8,16,8,0.40) 100%)",
      }}
    />

    {/* Halo vert/or */}
    <div
      className="pointer-events-none absolute"
      style={{
        top: "-22%",
        right: "-12%",
        width: 800,
        height: 800,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(120,170,90,0.22) 0%, transparent 65%)",
        animation: "mm-glow 13s ease-in-out infinite",
      }}
    />
    <div
      className="pointer-events-none absolute"
      style={{
        bottom: "-30%",
        left: "-10%",
        width: 700,
        height: 700,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 65%)",
        animation: "mm-glow 16s ease-in-out infinite reverse",
      }}
    />

    <div
      className="relative flex h-full flex-col justify-center px-28 pb-28 pt-40"
      style={{ animation: "mm-slide-up 1.2s ease-out 0.3s both" }}
    >
      <div className="flex items-center gap-6">
        <div
          style={{
            width: 88,
            height: 2,
            background: "linear-gradient(90deg, transparent, #C5D9A3)",
          }}
        />
        <div
          className="mm-eyebrow"
          style={{ fontSize: 20, color: "#C5D9A3", letterSpacing: "0.42em" }}
        >
          Cérémonie · Matcha d'Uji
        </div>
      </div>

      <h2
        className="mt-10 max-w-[1480px] font-serif-display leading-[0.94]"
        style={{
          fontSize: 132,
          color: "hsl(var(--linen))",
          textShadow: "0 4px 30px rgba(0,0,0,0.6)",
        }}
      >
        <span
          className="font-semibold"
          style={{ animation: "mm-letter-rise 1s ease-out 0.4s both", display: "inline-block" }}
        >
          La voie du{" "}
        </span>
        <span
          className="italic font-light"
          style={{
            color: "#D4E4B0",
            animation: "mm-letter-rise 1s ease-out 0.7s both",
            display: "inline-block",
          }}
        >
          matcha.
        </span>
      </h2>

      <div
        className="mt-8"
        style={{
          width: 160,
          height: 1,
          background:
            "linear-gradient(90deg, #C5D9A3, transparent)",
        }}
      />

      <p
        className="mt-8 max-w-[1240px] font-serif-display italic"
        style={{
          fontSize: 38,
          color: "rgba(242,237,228,0.92)",
          lineHeight: 1.32,
          textShadow: "0 2px 20px rgba(0,0,0,0.55)",
        }}
      >
        Servi sur place — un matcha de cérémonie cultivé à Uji, près de Kyoto,
        depuis le XIIᵉ siècle. Préparé au chasen, fouetté à la main, dans le bol qu'il faut.
      </p>

      {/* Bandeau de spécifications en bas — pierres, eau, geste */}
      <div
        className="mt-12 flex items-stretch gap-10 max-w-[1320px]"
        style={{ animation: "mm-slide-up 1s ease-out 0.65s both" }}
      >
        {[
          { label: "Origine", value: "Uji, Kyoto" },
          { label: "Grade", value: "Cérémonie" },
          { label: "Préparation", value: "Chasen · 80 °C" },
          { label: "Au salon", value: "Tasse 7 €" },
        ].map((s, i, arr) => (
          <div key={s.label} className="flex items-stretch gap-10">
            <div>
              <div
                className="font-sans-ui uppercase"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.36em",
                  color: "rgba(197,217,163,0.85)",
                }}
              >
                {s.label}
              </div>
              <div
                className="mt-2 font-serif-display italic"
                style={{
                  fontSize: 30,
                  color: "hsl(var(--linen))",
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </div>
            </div>
            {i < arr.length - 1 && (
              <div
                style={{
                  width: 1,
                  background:
                    "linear-gradient(180deg, transparent, rgba(197,217,163,0.45), transparent)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        className="mt-10 mm-eyebrow"
        style={{ fontSize: 14, color: "rgba(197,217,163,0.7)" }}
      >
        Maison Maitre · Salon de thé, à Dole
      </div>
    </div>
  </div>
);
