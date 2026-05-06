import { useEffect, useState } from "react";
import { GOOD_NEWS_OF_THE_DAY } from "@/data/good-news";

export const GoodNewsScene = ({ newsOffset = 0 }: { newsOffset?: number }) => {
  const [rotation, setRotation] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  const [, setTick] = useState(0);

  useEffect(() => {
    const refresh = setInterval(() => {
      setRotation((r) => r + 3);
      setLastUpdated(new Date());
    }, 5 * 60 * 1000);
    const tick = setInterval(() => setTick((t) => t + 1), 30 * 1000);
    return () => {
      clearInterval(refresh);
      clearInterval(tick);
    };
  }, []);

  const items = [0, 1, 2].map(
    (i) => GOOD_NEWS_OF_THE_DAY[(newsOffset + rotation + i) % GOOD_NEWS_OF_THE_DAY.length]
  );
  const minutesAgo = Math.max(0, Math.floor((Date.now() - lastUpdated.getTime()) / 60000));
  const updatedLabel =
    minutesAgo < 1 ? "Mis à jour à l'instant" : `Mis à jour il y a ${minutesAgo} min`;
  return (
    <div className="absolute inset-0 px-28 pb-24 pt-36" style={{ background: "linear-gradient(135deg, #F2EDE4 0%, #E5DDD0 100%)" }}>
      <div className="flex items-center gap-5">
        <div style={{ fontSize: 54 }}>✦</div>
        <div style={{ width: 96, height: 2, backgroundColor: "hsl(var(--gold))" }} />
        <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.4em", color: "hsl(var(--gold))" }}>
          Trois bonnes nouvelles du jour
        </div>
      </div>
      <h2 className="mt-6 font-serif-display leading-[1]" style={{ fontSize: 106, color: "hsl(var(--ink))" }}>
        <span className="font-semibold">Le monde va</span>{" "}
        <span className="italic font-light" style={{ color: "hsl(var(--copper))" }}>aussi bien.</span>
      </h2>

      <div className="mt-12 grid grid-cols-3 gap-9" style={{ height: 545 }}>
        {items.map((n, i) => (
          <div
            key={i}
            className="relative flex flex-col overflow-hidden rounded-sm p-9"
            style={{
              backgroundColor: "rgba(46,36,25,0.05)",
              border: "1px solid rgba(46,36,25,0.15)",
              borderTop: "3px solid transparent",
              backgroundImage: "linear-gradient(rgba(46,36,25,0.05), rgba(46,36,25,0.05)), linear-gradient(90deg, hsl(var(--copper)) 0%, hsl(var(--gold)) 50%, hsl(var(--gold-lt)) 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.15}s both`,
            }}
          >
            {/* Numéro géant doré en filigrane */}
            <div
              aria-hidden
              className="pointer-events-none absolute font-serif-display select-none"
              style={{
                top: -42,
                left: -10,
                fontSize: 220,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: "-0.05em",
                background: "linear-gradient(180deg, hsl(var(--gold)) 0%, hsl(var(--copper)) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                opacity: 0.18,
              }}
            >
              0{i + 1}
            </div>

            <div className="relative font-sans-ui uppercase" style={{ fontSize: 13, letterSpacing: "0.42em", color: "hsl(var(--gold))" }}>
              {n.tag}
            </div>
            <div className="relative mt-5" style={{ height: 1, background: "linear-gradient(90deg, hsl(var(--gold)) 0%, hsl(var(--gold) / 0.4) 60%, transparent 100%)" }} />
            <h3
              className="relative mt-5 font-serif-display leading-[1.05]"
              style={{ fontSize: 52, fontWeight: 600, color: "hsl(var(--espresso))", letterSpacing: "-0.01em" }}
            >
              {n.title}
            </h3>
            <div className="relative mt-5" style={{ width: 48, height: 1, backgroundColor: "hsl(var(--gold))" }} />
            <p
              className="relative mt-5 font-serif-display italic"
              style={{ fontSize: 26, lineHeight: 1.4, color: "hsl(var(--taupe))", fontWeight: 300 }}
            >
              {n.body}
            </p>
          </div>
        ))}
      </div>
      <div
        className="absolute bottom-6 right-10 font-sans-ui uppercase"
        style={{ fontSize: 11, letterSpacing: "0.32em", color: "hsl(var(--taupe) / 0.7)" }}
      >
        ◦ {updatedLabel}
      </div>
    </div>
  );
};
