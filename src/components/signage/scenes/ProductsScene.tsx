import { useState } from "react";
import {
  FEATURED_TEA,
  FEATURED_COFFEE,
  NON_FEATURED,
  PRODUCTS_TO_TRY,
  type Product,
} from "@/data/products";

const FEATURED_LABEL: Record<NonNullable<Product["featured"]>, string> = {
  tea: "★ Coup de cœur thé",
  coffee: "★ Coup de cœur café",
};

const ProductImage = ({ p }: { p: Product }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    // Placeholder élégant si l'image n'est pas (encore) déposée dans /public/products/
    return (
      <div
        className="flex items-center justify-center h-full w-full"
        style={{
          background:
            "linear-gradient(135deg, #F8F2E4 0%, #E5D5B0 100%)",
          padding: 18,
        }}
      >
        <div
          className="font-serif-display italic text-center"
          style={{
            fontSize: 28,
            color: "rgba(46,36,25,0.55)",
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          {p.name}
        </div>
      </div>
    );
  }
  return (
    <img
      src={p.img}
      alt={p.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full"
      style={{
        objectFit: "contain",
        padding: 18,
        filter: "drop-shadow(0 14px 24px rgba(46,36,25,0.25))",
      }}
    />
  );
};

const ProductCard = ({ p, index }: { p: Product; index: number }) => (
  <div
    className="mm-noise relative grid overflow-hidden rounded-2xl"
    style={{
      gridTemplateColumns: "300px 1fr",
      background: "linear-gradient(180deg, #FFFFFF 0%, #FBF6EC 100%)",
      border: p.featured ? "1.5px solid hsl(var(--gold))" : "1px solid rgba(201,168,76,0.25)",
      boxShadow: p.featured
        ? "0 30px 60px -20px rgba(46,36,25,0.35), 0 0 0 1px rgba(255,255,255,0.6) inset, 0 0 0 3px rgba(201,168,76,0.18)"
        : "0 30px 60px -20px rgba(46,36,25,0.30), 0 0 0 1px rgba(255,255,255,0.6) inset",
      animation: `mm-slide-up 0.9s ease-out ${0.2 + index * 0.15}s both`,
    }}
  >
    {p.featured && (
      <div
        className="font-sans-ui uppercase absolute z-10"
        style={{
          top: 14,
          right: 14,
          background: "linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(var(--gold-lt)) 100%)",
          color: "hsl(var(--ink))",
          fontSize: 12,
          letterSpacing: "0.18em",
          fontWeight: 600,
          padding: "7px 14px",
          borderRadius: 999,
          boxShadow:
            "0 8px 18px -6px rgba(201,168,76,0.55), 0 0 0 1px rgba(255,255,255,0.4) inset",
        }}
      >
        {FEATURED_LABEL[p.featured]}
      </div>
    )}
    <div
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F8F2E4 0%, #EFE4CC 100%)" }}
    >
      <ProductImage p={p} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.10) 0%, transparent 60%)" }}
      />
    </div>
    <div className="relative flex flex-col justify-center p-8 overflow-hidden">
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
        0{index + 1}
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <div className="mm-eyebrow" style={{ fontSize: 13, color: "hsl(var(--gold))" }}>
          {p.cat}
        </div>
        <div
          className="mt-3 font-serif-display leading-tight"
          style={{ fontSize: 40, color: "hsl(var(--espresso))" }}
        >
          {p.name}
        </div>
        <div
          className="mt-4 font-serif-display italic"
          style={{ fontSize: 22, color: "hsl(var(--taupe))" }}
        >
          {p.notes}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div style={{ width: 28, height: 1, backgroundColor: "hsl(var(--gold))" }} />
          <div
            className="font-sans-ui tabular-nums"
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "hsl(var(--gold))",
              letterSpacing: "0.02em",
            }}
          >
            {p.price}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ProductsScene = ({ productOffset = 0 }: { productOffset?: number }) => {
  // Toujours montrer : coup de cœur thé + coup de cœur café + 1 produit qui tourne.
  const fallbackPool = NON_FEATURED.length > 0 ? NON_FEATURED : PRODUCTS_TO_TRY;
  const rotating = fallbackPool[productOffset % fallbackPool.length];

  const items: Product[] = [
    FEATURED_TEA,
    FEATURED_COFFEE,
    rotating,
  ].filter((p): p is Product => Boolean(p));

  return (
    <div className="mm-cream mm-grid-light absolute inset-0 px-24 pb-20 pt-32 overflow-hidden">
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-25%",
          right: "-15%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.20) 0%, transparent 65%)",
          animation: "mm-glow 12s ease-in-out infinite",
        }}
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
            <h2
              className="mt-10 font-serif-display"
              style={{
                fontSize: 168,
                lineHeight: 0.9,
                color: "hsl(var(--ink))",
                letterSpacing: "-0.02em",
              }}
            >
              <span className="font-light">Nos</span><br />
              <span className="font-semibold">coups de</span><br />
              <span className="italic font-light" style={{ color: "hsl(var(--copper))" }}>cœur.</span>
            </h2>
            <div className="mt-10" style={{ width: 120, height: 1, background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
            <p
              className="mt-8 font-serif-display italic"
              style={{ fontSize: 30, lineHeight: 1.35, color: "hsl(var(--taupe))", maxWidth: 460 }}
            >
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
            <ProductCard key={p.name} p={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
