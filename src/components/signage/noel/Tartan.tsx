import type { CSSProperties, ReactNode } from "react";

/** Motif tartan de Noël (image légère, répétée : rien d'animé, rien de lourd pour la TV). */
export const TARTAN_URL = "/noel/tartan.webp";

export const tartanBg = (tile = 488): CSSProperties => ({
  backgroundColor: "#7A1424",
  backgroundImage: `url(${TARTAN_URL})`,
  backgroundSize: `${tile}px ${tile}px`,
  backgroundRepeat: "repeat",
});

/** Ruban tartan bordé d'un filet doré, horizontal. */
export const TartanRibbon = ({ height = 14, style }: { height?: number; style?: CSSProperties }) => (
  <div
    aria-hidden
    style={{
      height,
      ...tartanBg(244),
      borderTop: "1px solid #C9A45C",
      borderBottom: "1px solid #C9A45C",
      boxShadow: "0 6px 18px -8px rgba(0,0,0,0.6)",
      ...style,
    }}
  />
);

/** Double filet bordeaux + or, comme sur le menu de Noël imprimé. */
export const DoubleFilet = ({ inset = 22, wine = "#6B1424", gold = "#C9A45C" }: { inset?: number; wine?: string; gold?: string }) => (
  <>
    <div aria-hidden className="pointer-events-none absolute" style={{ inset, border: `1px solid ${wine}` }} />
    <div aria-hidden className="pointer-events-none absolute" style={{ inset: inset + 8, border: `1px solid ${gold}` }} />
  </>
);

/** Ligne « —— TITRE —— » avec filets dorés. */
export const FiletTitle = ({ children, color = "#6B1424", size = 22 }: { children: ReactNode; color?: string; size?: number }) => (
  <div className="flex items-center" style={{ gap: 18 }}>
    <span style={{ flexGrow: 1, height: 1, background: "#C9A45C" }} />
    <span className="mm-eyebrow" style={{ fontSize: size, color, letterSpacing: "0.32em" }}>
      {children}
    </span>
    <span style={{ flexGrow: 1, height: 1, background: "#C9A45C" }} />
  </div>
);
