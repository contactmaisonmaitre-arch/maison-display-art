import { useMemo } from "react";
import { useRemoteJson } from "@/hooks/useRemoteJson";
import fallbackProducts from "../../../../public/data/products.json";

interface ShopProduct {
  handle: string;
  name: string;
  cat: string;
  type: string;
  price: string;
  img: string | null;
  available: boolean;
  vendor: string;
  online?: boolean;
  createdAt?: string | null;
}

// Nouveauté = créée sur maisonmaitre.com depuis moins de 5 mois.
const WINDOW_DAYS = 150;
const MAX = 4;

/** Les produits les plus récents de la boutique (hors boissons à emporter), avec photo. */
export const pickNouveautes = (products: ShopProduct[], now = new Date()): ShopProduct[] => {
  const since = new Date(now.getTime() - WINDOW_DAYS * 86_400_000).toISOString().slice(0, 10);
  return products
    .filter((p) => p.createdAt && p.createdAt >= since && p.img && p.available && p.online !== false)
    .filter((p) => p.type !== "boisson à emporter")
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, MAX);
};

// « Ataco, café du Salvador » → nom « Ataco », sous-titre « café du Salvador ».
const splitName = (name: string) => {
  const i = name.indexOf(",");
  return i > 0 ? { title: name.slice(0, i), sub: name.slice(i + 1).trim() } : { title: name, sub: "" };
};

/** Scène « Les nouveautés Maison Maitre » (public/data/products.json, mis à jour chaque jour). */
export const NouveautesScene = () => {
  const remote = useRemoteJson<{ products: ShopProduct[] }>("data/products.json", 60 * 60 * 1000);
  const all = remote?.products?.length ? remote.products : (fallbackProducts.products as ShopProduct[]);
  const items = useMemo(() => pickNouveautes(all), [all]);

  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col items-center" style={{ background: "#46121F", paddingTop: 150 }}>
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-35%",
          left: "50%",
          width: 1500,
          height: 1000,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,201,169,0.18) 0%, transparent 65%)",
        }}
      />
      <div className="relative text-center" style={{ animation: "mm-slide-up 1s ease-out 0.1s both" }}>
        <div className="mm-eyebrow" style={{ fontSize: 16, color: "hsl(var(--gold))", letterSpacing: "0.42em" }}>
          Tout juste arrivés · maisonmaitre.com
        </div>
        <h1 className="font-serif-display mt-5" style={{ fontSize: 84, lineHeight: 1, color: "#FFFFFF" }}>
          <span className="font-light">Les nouveautés </span>
          <span className="font-semibold italic" style={{ color: "hsl(var(--gold))" }}>
            Maison Maitre
          </span>
        </h1>
      </div>

      <div className="relative mt-16 flex items-start justify-center" style={{ gap: 56 }}>
        {items.map((p, i) => {
          const { title, sub } = splitName(p.name);
          return (
            <div key={p.handle} className="flex flex-col items-center text-center" style={{ width: 360, animation: `mm-slide-up 1s ease-out ${0.4 + i * 0.25}s both` }}>
              <div
                className="relative overflow-hidden"
                style={{ width: 360, height: 360, borderRadius: 24, background: "#F4F0E7", boxShadow: "0 40px 70px -25px rgba(0,0,0,0.75), 0 0 0 1px rgba(232,201,169,0.4)" }}
              >
                <img src={p.img ?? ""} alt={p.name} className="absolute inset-0 h-full w-full" style={{ objectFit: "cover" }} />
                <div
                  className="absolute font-sans-ui uppercase"
                  style={{ top: 18, left: 18, fontSize: 13, letterSpacing: "0.28em", fontWeight: 600, color: "#46121F", background: "hsl(var(--gold))", padding: "8px 14px", borderRadius: 999 }}
                >
                  Nouveau
                </div>
              </div>
              <div className="font-serif-display mt-7" style={{ fontSize: 46, lineHeight: 1.05, color: "#FFFFFF" }}>
                {title}
              </div>
              {sub && (
                <div className="font-serif-display italic mt-2" style={{ fontSize: 26, lineHeight: 1.25, color: "rgba(244,240,231,0.82)" }}>
                  {sub}
                </div>
              )}
              <div className="font-sans-ui uppercase mt-3" style={{ fontSize: 14, letterSpacing: "0.22em", color: "hsl(var(--gold-lt))" }}>
                {p.cat}
              </div>
              <div className="font-serif-display mt-3" style={{ fontSize: 32, color: "hsl(var(--gold))" }}>
                {p.price}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
