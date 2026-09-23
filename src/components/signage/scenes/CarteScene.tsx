import { useRemoteJson } from "@/hooks/useRemoteJson";
import { BOARD, type CarteItem, type CarteJson, type CarteSection } from "@/data/carte";

const Leaf = ({ size = 22, color = BOARD.sand }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
    <path d="M5 19l8-8" />
  </svg>
);

const Item = ({ it, dark = false, size = 34 }: { it: CarteItem; dark?: boolean; size?: number }) => {
  const main = dark ? "#FFFFFF" : BOARD.wine;
  const sub = dark ? BOARD.sand : BOARD.muted;
  return (
    <div>
      <div className="font-serif-display flex items-baseline flex-wrap" style={{ gap: 12, lineHeight: 1.15 }}>
        {it.leaf && <span style={{ alignSelf: "center" }}><Leaf size={size * 0.62} /></span>}
        <span style={{ fontSize: size, fontWeight: 600, color: main }}>{it.name}</span>
        {it.size && <span style={{ fontSize: size * 0.6, fontWeight: 500, color: sub }}>{it.size}</span>}
        {it.price && (
          <span className="tabular-nums" style={{ fontSize: size * 0.82, fontWeight: 500, color: sub }}>
            {it.price}
          </span>
        )}
      </div>
      {it.desc && (
        <div className="font-serif-display italic" style={{ fontSize: size * 0.62, color: sub, marginTop: 2, lineHeight: 1.25 }}>
          {it.desc}
        </div>
      )}
    </div>
  );
};

const Section = ({ s, delay }: { s: CarteSection; delay: number }) => (
  <div style={{ animation: `mm-slide-up 0.9s ease-out ${delay}s both` }}>
    <div className="font-serif-display" style={{ fontSize: 72, fontWeight: 600, lineHeight: 1, color: BOARD.wine, letterSpacing: "-0.01em" }}>
      {s.title}
    </div>
    <div style={{ height: 2, background: BOARD.rule, margin: "18px 0 20px" }} />
    {s.note && (
      <div className="font-serif-display italic" style={{ fontSize: 22, color: BOARD.muted, marginBottom: 16, lineHeight: 1.3 }}>
        {s.note}
      </div>
    )}
    <div className="flex flex-col" style={{ gap: 22 }}>
      {s.groups.map((g, gi) => (
        <div key={gi} className="flex flex-col" style={{ gap: 12 }}>
          {g.label && (
            <div className="font-serif-display uppercase" style={{ fontSize: 15, letterSpacing: "0.3em", color: BOARD.muted, fontWeight: 600 }}>
              {g.label}
            </div>
          )}
          {g.items.map((it) => (
            <Item key={it.name} it={it} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Scène « La carte » — même mise en page que la carte imprimée du comptoir.
export const CarteScene = () => {
  const carte = useRemoteJson<CarteJson>("data/carte.json", 30 * 60 * 1000);
  if (!carte) return <div className="absolute inset-0" style={{ background: BOARD.cream }} />;

  return (
    <div className="absolute inset-0 overflow-hidden flex" style={{ background: BOARD.cream }}>
      {/* Panneau bordeaux */}
      <div
        className="relative flex flex-col justify-center shrink-0"
        style={{ width: 470, background: BOARD.wine, padding: "150px 56px 48px 64px", animation: "mm-fade-in 0.8s ease-out both" }}
      >
        <div className="font-serif-display" style={{ fontSize: 132, lineHeight: 0.88, color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.02em" }}>
          La<br />Carte
        </div>
        {carte.tagline && (
          <div className="font-serif-display italic mt-6" style={{ fontSize: 26, lineHeight: 1.35, color: BOARD.sand }}>
            {carte.tagline.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        )}
        <div style={{ height: 1, background: "rgba(232,201,169,0.35)", margin: "32px 0 28px" }} />
        <div className="flex flex-col" style={{ gap: 26 }}>
          {carte.side?.map((g) => (
            <div key={g.label} className="flex flex-col" style={{ gap: 10 }}>
              <div className="font-serif-display uppercase" style={{ fontSize: 14, letterSpacing: "0.3em", color: BOARD.sand, fontWeight: 600 }}>
                {g.label}
              </div>
              {g.items.map((it) => (
                <Item key={it.name} it={it} dark size={28} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Colonnes */}
      <div
        className="grid flex-1"
        style={{
          gridTemplateColumns: `repeat(${carte.columns.length}, minmax(0, 1fr))`,
          columnGap: 64,
          padding: "160px 90px 40px 80px",
        }}
      >
        {carte.columns.map((col, ci) => (
          <div key={ci} className="flex flex-col" style={{ gap: 44 }}>
            {col.map((s, si) => (
              <Section key={s.title} s={s} delay={0.15 + ci * 0.12 + si * 0.08} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
