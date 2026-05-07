interface TextSlideProps {
  /** Dégradé / couleur de fond utilisé quand bgImage n'est pas fourni (ou en backup) */
  bg: string;
  tag: string;
  titleStart: string;
  titleItalic: string;
  body: string;
  /** Image de fond optionnelle (chemin /scenes/...) */
  bgImage?: string;
  /** Position de l'image (object-position equivalent) — par défaut center */
  bgPosition?: string;
}

export const TextSlide = ({
  bg,
  tag,
  titleStart,
  titleItalic,
  body,
  bgImage,
  bgPosition = "center",
}: TextSlideProps) => (
  <div className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
    {/* Image de fond optionnelle avec ken-burns lent */}
    {bgImage && (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: bgPosition,
          animation: "mm-cave-kenburns 16s ease-out forwards",
        }}
      />
    )}
    {/* Pan animation du fond gradient — uniquement si pas d'image (sinon redondant) */}
    {!bgImage && (
      <div
        className="absolute inset-0"
        style={{
          background: bg,
          animation: "mm-pan 22s ease-in-out infinite",
          filter: "blur(2px)",
        }}
      />
    )}

    {/* Voile de lecture — plus opaque côté gauche pour le texte, plus transparent côté droit */}
    <div
      className="absolute inset-0"
      style={{
        background: bgImage
          ? "linear-gradient(105deg, rgba(8,5,3,0.78) 0%, rgba(8,5,3,0.55) 35%, rgba(8,5,3,0.20) 70%, rgba(8,5,3,0.45) 100%)"
          : "linear-gradient(105deg, rgba(10,7,4,0.55) 0%, rgba(10,7,4,0.15) 35%, rgba(251,247,238,0.92) 62%, rgba(251,247,238,0.99) 100%)",
      }}
    />

    {/* Halo doré */}
    <div
      className="pointer-events-none absolute"
      style={{
        top: "-25%",
        left: "-15%",
        width: 760,
        height: 760,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(201,168,76,0.28) 0%, transparent 65%)",
        animation: "mm-glow 9s ease-in-out infinite",
      }}
    />

    <div
      className="relative flex h-full flex-col justify-center px-28 pb-28 pt-40"
      style={{ animation: "mm-slide-up 1.2s ease-out 0.25s both" }}
    >
      <div className="flex items-center gap-6">
        <div
          style={{
            width: 88,
            height: 2,
            background: "linear-gradient(90deg, transparent, hsl(var(--gold)))",
          }}
        />
        <div className="mm-eyebrow" style={{ fontSize: 20, color: "hsl(var(--gold))" }}>
          {tag}
        </div>
      </div>
      <h2
        className="mt-10 max-w-[1380px] font-serif-display leading-[0.94]"
        style={{
          fontSize: 134,
          color: bgImage ? "hsl(var(--linen))" : "hsl(var(--ink))",
          textShadow: bgImage ? "0 4px 30px rgba(0,0,0,0.6)" : undefined,
        }}
      >
        <span
          className="font-semibold"
          style={{ animation: "mm-letter-rise 1s ease-out 0.4s both", display: "inline-block" }}
        >
          {titleStart}{" "}
        </span>
        <span
          className="italic font-light"
          style={{
            color: bgImage ? "hsl(var(--gold-lt))" : "hsl(var(--copper))",
            animation: "mm-letter-rise 1s ease-out 0.7s both",
            display: "inline-block",
          }}
        >
          {titleItalic}
        </span>
      </h2>
      <div
        className="mt-8"
        style={{
          width: 140,
          height: 1,
          background: bgImage
            ? "linear-gradient(90deg, hsl(var(--gold)), transparent)"
            : "linear-gradient(90deg, hsl(var(--copper)), transparent)",
        }}
      />
      <p
        className="mt-8 max-w-[1180px] font-serif-display italic"
        style={{
          fontSize: 42,
          color: bgImage ? "rgba(242,237,228,0.92)" : "hsl(var(--taupe))",
          lineHeight: 1.28,
          textShadow: bgImage ? "0 2px 20px rgba(0,0,0,0.55)" : undefined,
        }}
      >
        {body}
      </p>
    </div>
  </div>
);
