import { PRODUCTS_TO_TRY } from "@/data/products";

export const ProductsScene = ({ productOffset = 0 }: { productOffset?: number }) => {
  const featured = PRODUCTS_TO_TRY.find((p) => p.featured);
  const others = PRODUCTS_TO_TRY.filter((p) => !p.featured);
  const total = others.length;
  const rest = Array.from({ length: 2 }, (_, i) => others[(productOffset + i) % total]);
  const items = featured ? [featured, ...rest] : Array.from({ length: 3 }, (_, i) => PRODUCTS_TO_TRY[(productOffset + i) % PRODUCTS_TO_TRY.length]);
  return (
  <div className="mm-cream mm-grid-light absolute inset-0 px-24 pb-20 pt-32 overflow-hidden">
    <div
      className="pointer-events-none absolute"
      style={{ top: "-25%", right: "-15%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.20) 0%, transparent 65%)", animation: "mm-glow 12s ease-in-out infinite" }}
    />
    <div className="relative grid h-full gap-16" style={{ gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.4fr)" }}>
      {/* Left — title */}
      <div className="flex flex-col justify-between" style={{ animation: "mm-slide-up 1s ease-out both" }}>
        <div>
          <div className="flex items-center gap-5">
            <div style={{ width: 64, height: 2, background: "linear-gradient(90deg, transparent, hsl(var(--gold)))" }} />
            <div className="mm-eyebrow" style={{ fontSize: 16, color: "hsl(var(--gold))" }}>
              À découvrir
            </div>
          </div>
          <h2 className="mt-10 font-serif-display" style={{ fontSize: 168, lineHeight: 0.9, color: "hsl(var(--ink))", letterSpacing: "-0.02em" }}>
            <span className="font-light">Nos</span><br />
            <span className="font-semibold">coups de</span><br />
            <span className="italic font-light" style={{ color: "hsl(var(--copper))" }}>cœur.</span>
          </h2>
          <div className="mt-10" style={{ width: 120, height: 1, background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          <p className="mt-8 font-serif-display italic" style={{ fontSize: 30, lineHeight: 1.35, color: "hsl(var(--taupe))", maxWidth: 460 }}>
            Une sélection signée la Maison, à savourer sur place ou à emporter.
          </p>
        </div>
        <div className="mm-eyebrow" style={{ fontSize: 14, color: "hsl(var(--mink))" }}>
          Commande en ligne · maisonmaitre.com
        </div>
      </div>

      {/* Right — product grid */}
      <div className="grid gap-6" style={{ gridTemplateRows: "repeat(3, minmax(0, 1fr))" }}>
        {items.map((p, i) => (
          <div
            key={p.name}
            className="mm-noise relative grid overflow-hidden rounded-2xl"
            style={{
              gridTemplateColumns: "300px 1fr",
              background: "linear-gradient(180deg, #FFFFFF 0%, #FBF6EC 100%)",
              border: p.featured ? "1.5px solid hsl(var(--gold))" : "1px solid rgba(201,168,76,0.25)",
              boxShadow: p.featured
                ? "0 30px 60px -20px rgba(46,36,25,0.35), 0 0 0 1px rgba(255,255,255,0.6) inset, 0 0 0 3px rgba(201,168,76,0.18)"
                : "0 30px 60px -20px rgba(46,36,25,0.30), 0 0 0 1px rgba(255,255,255,0.6) inset",
              animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.15}s both`,
            }}
          >
            {p.featured && (
              <div
                className="font-sans-ui uppercase absolute z-10"
                style={{
                  top: 14, right: 14,
                  background: "linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(var(--gold-lt)) 100%)",
                  color: "hsl(var(--ink))",
                  fontSize: 12, letterSpacing: "0.18em", fontWeight: 600,
                  padding: "7px 14px", borderRadius: 999,
                  boxShadow: "0 8px 18px -6px rgba(201,168,76,0.55), 0 0 0 1px rgba(255,255,255,0.4) inset",
                }}
              >
                ★ Coup de cœur
              </div>
            )}
            <div className="relative w-full overflow-hidden" style={{ background: "linear-gradient(180deg, #F8F2E4 0%, #EFE4CC 100%)" }}>
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="h-full w-full"
                style={{
                  objectFit: "contain",
                  padding: 18,
                  filter: "drop-shadow(0 14px 24px rgba(46,36,25,0.25))",
                }}
              />
              {/* Overlay doré subtil — préserve les vraies couleurs du produit */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.10) 0%, transparent 60%)" }}
              />
            </div>
            <div className="relative flex flex-col justify-center p-8 overflow-hidden">
              {/* Numéro géant en filigrane */}
              <div
                aria-hidden
                className="pointer-events-none absolute font-serif-display italic select-none"
                style={{
                  right: -18,
                  bottom: -48,
                  fontSize: 280,
                  lineHeight: 1,
                  fontWeight: 300,
                  letterSpacing: "-0.05em",
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(201,168,76,0.28)",
                  zIndex: 0,
                }}
              >
                0{i + 1}
              </div>

              <div className="relative" style={{ zIndex: 1 }}>
                <div className="mm-eyebrow" style={{ fontSize: 13, color: "hsl(var(--gold))" }}>
                  {p.cat}
                </div>
                <div className="mt-3 font-serif-display leading-tight" style={{ fontSize: 40, color: "hsl(var(--espresso))" }}>
                  {p.name}
                </div>
                <div className="mt-4 font-serif-display italic" style={{ fontSize: 22, color: "hsl(var(--taupe))" }}>
                  {p.notes}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div style={{ width: 28, height: 1, backgroundColor: "hsl(var(--gold))" }} />
                  <div className="font-sans-ui tabular-nums" style={{ fontSize: 22, fontWeight: 500, color: "hsl(var(--gold))", letterSpacing: "0.02em" }}>
                    {p.price}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};
