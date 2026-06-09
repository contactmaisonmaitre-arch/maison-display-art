import { memo, useEffect, useState } from "react";
import { GOOD_NEWS_OF_THE_DAY } from "@/data/good-news";
import { dayOffset } from "@/lib/signage/day-offset";

const ROTATION_MS = 6000; // 1 nouvelle remplacée toutes les 6 secondes
const TOTAL = GOOD_NEWS_OF_THE_DAY.length;

export const GoodNewsScene = memo(({ newsOffset = 0 }: { newsOffset?: number }) => {
  // Important : le tick est dérivé de Date.now(), pas d'un useState local.
  // Avec le lazy mount, la scène est démontée entre deux apparitions, donc
  // un state interne repartait à 0 à chaque fois → on voyait toujours les
  // 3 mêmes news en ouverture. En lisant le temps réel, on attaque toujours
  // sur des news différentes au gré du temps écoulé + un décalage journalier.
  const [, forceRender] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceRender((n) => n + 1), ROTATION_MS);
    return () => clearInterval(id);
  }, []);

  const tick = Math.floor(Date.now() / ROTATION_MS) + dayOffset();
  const items = [0, 1, 2].map(
    (i) => GOOD_NEWS_OF_THE_DAY[(newsOffset + tick + i) % TOTAL]
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden px-24 pb-24 pt-32"
      style={{
        background:
          "linear-gradient(135deg, #0E0805 0%, #1A1410 50%, #0A0805 100%)",
      }}
    >
      {/* halos d'ambiance */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-25%",
          left: "-10%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 65%)",
          animation: "mm-glow 14s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-30%",
          right: "-15%",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(80,112,64,0.10) 0%, transparent 65%)",
          animation: "mm-glow 17s ease-in-out infinite reverse",
        }}
      />

      {/* Header — pulse "En direct" + titre */}
      <div className="relative flex items-center gap-5">
        <span
          className="rounded-full"
          style={{
            width: 12,
            height: 12,
            background: "#16a34a",
            boxShadow: "0 0 14px #16a34a",
            animation: "mm-glow 1.6s ease-in-out infinite",
          }}
        />
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
            letterSpacing: "0.42em",
            color: "hsl(var(--gold))",
          }}
        >
          En direct · Bonnes nouvelles du monde
        </div>
      </div>

      <h2
        className="relative mt-7 font-serif-display leading-[0.96]"
        style={{ fontSize: 96, color: "hsl(var(--linen))" }}
      >
        <span className="font-semibold">Le monde,</span>{" "}
        <span
          className="italic font-light"
          style={{ color: "hsl(var(--gold-lt))" }}
        >
          ce qui va bien aujourd'hui.
        </span>
      </h2>

      <div
        className="relative mt-10 grid grid-cols-3 gap-8"
        style={{ height: 540 }}
      >
        {items.map((n, i) => (
          <article
            key={`${tick}-${i}`}
            className="relative flex flex-col overflow-hidden rounded-sm p-9"
            style={{
              backgroundColor: "rgba(242,237,228,0.045)",
              border: "1px solid rgba(201,168,76,0.28)",
              boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)",
              animation: `mm-news-card-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.18}s both`,
            }}
          >
            {/* trait or vertical à gauche, façon citation */}
            <div
              aria-hidden
              className="absolute"
              style={{
                left: 0,
                top: 28,
                bottom: 28,
                width: 3,
                background:
                  "linear-gradient(180deg, hsl(var(--gold) / 0.05), hsl(var(--gold) / 0.85), hsl(var(--gold) / 0.05))",
              }}
            />

            {/* numéro géant en filigrane */}
            <div
              aria-hidden
              className="pointer-events-none absolute font-serif-display select-none"
              style={{
                right: -8,
                bottom: -36,
                fontSize: 200,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: "-0.05em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(201,168,76,0.18)",
              }}
            >
              0{i + 1}
            </div>

            <div
              className="relative font-sans-ui uppercase"
              style={{
                fontSize: 12,
                letterSpacing: "0.4em",
                color: "hsl(var(--gold))",
              }}
            >
              {n.tag}
            </div>
            <div
              className="relative mt-4"
              style={{
                width: 36,
                height: 1,
                backgroundColor: "hsl(var(--gold))",
              }}
            />

            <h3
              className="relative mt-5 font-serif-display leading-[1.06]"
              style={{
                fontSize: 42,
                fontWeight: 600,
                color: "hsl(var(--linen))",
                letterSpacing: "-0.005em",
              }}
            >
              {n.title}
            </h3>

            <p
              className="relative mt-5 font-serif-display italic"
              style={{
                fontSize: 22,
                lineHeight: 1.42,
                color: "rgba(242,237,228,0.78)",
                fontWeight: 300,
              }}
            >
              {n.body}
            </p>

            <div
              className="relative mt-auto pt-6 font-sans-ui uppercase flex items-center justify-between"
              style={{
                fontSize: 11,
                letterSpacing: "0.32em",
                color: "rgba(201,168,76,0.6)",
                borderTop: "1px solid rgba(201,168,76,0.18)",
              }}
            >
              <span>Maison Maitre · Veille</span>
              <span style={{ color: "hsl(var(--gold))" }}>
                {String(((newsOffset + tick + i) % TOTAL) + 1).padStart(2, "0")} / {TOTAL}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div
        className="relative mt-8 font-sans-ui uppercase"
        style={{
          fontSize: 11,
          letterSpacing: "0.42em",
          color: "rgba(242,237,228,0.45)",
          textAlign: "center",
        }}
      >
        ◦ Sélection éditoriale rafraîchie en continu ◦
      </div>
    </div>
  );
});
GoodNewsScene.displayName = "GoodNewsScene";
