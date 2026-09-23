import { useMemo } from "react";
import {
  FEATURED_COFFEE,
  FEATURED_TEA,
  NON_FEATURED,
  PRODUCTS_TO_TRY,
  type Product,
} from "@/data/products";

// Packshots retouchés à la main (public/products/) : prioritaires sur la
// photo Shopify quand le nom correspond. Les « placeholder » sont ignorés.
const PLACEHOLDERS = new Set(["aguacero", "hojicha bio", "genmaicha", "au coin du feu"]);
const CURATED = new Map(
  PRODUCTS_TO_TRY.filter((p) => !PLACEHOLDERS.has(p.name.toLowerCase())).map((p) => [p.name.toLowerCase(), p]),
);
import { useRemoteJson } from "./useRemoteJson";

// Produit tel qu'écrit par scripts/fetch-products.mjs (catalogue Shopify).
export interface ShopProduct {
  handle: string;
  name: string;
  cat: string;
  type: string;
  notes: string;
  price: string;
  img: string | null;
  available: boolean;
  online?: boolean;
}

interface ProductsJson {
  fetchedAt: string;
  products: ShopProduct[];
}

export interface ProductsConfig {
  featuredTea?: string;
  featuredCoffee?: string;
  rotationTypes?: string[];
  include?: string[];
  exclude?: string[];
  notes?: Record<string, string>;
}

export interface ProductSelection {
  featuredTea?: Product;
  featuredCoffee?: Product;
  pool: Product[];
}

/** Image Shopify redimensionnée (évite de charger des 3000 px sur la TV). */
const sized = (url: string | null) => {
  if (!url) return "";
  if (!url.includes("cdn.shopify.com")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}width=640`;
};

export const selectProducts = (
  data: ProductsJson | null,
  cfg: ProductsConfig | null,
): ProductSelection => {
  const fallback = {
    featuredTea: FEATURED_TEA,
    featuredCoffee: FEATURED_COFFEE,
    pool: NON_FEATURED,
  };
  if (!data?.products?.length) return fallback;

  const notes = cfg?.notes ?? {};
  const exclude = new Set(cfg?.exclude ?? []);
  const include = new Set(cfg?.include ?? []);
  const types = new Set((cfg?.rotationTypes ?? []).map((t) => t.toLowerCase()));

  const toProduct = (p: ShopProduct, featured?: Product["featured"]): Product => {
    const curated = CURATED.get(p.name.toLowerCase());
    return {
      cat: p.cat,
      name: p.name,
      notes: notes[p.handle] ?? p.notes,
      price: p.price,
      img: curated?.img ?? sized(p.img),
      fallbackImg: curated ? sized(p.img) : undefined,
      bleed: curated?.bleed,
      featured,
    };
  };

  const byHandle = new Map(data.products.map((p) => [p.handle, p]));
  const tea = cfg?.featuredTea ? byHandle.get(cfg.featuredTea) : undefined;
  const coffee = cfg?.featuredCoffee ? byHandle.get(cfg.featuredCoffee) : undefined;

  const pool = data.products
    .filter((p) => p.available !== false && p.img)
    .filter((p) => !exclude.has(p.handle))
    .filter((p) => p.handle !== tea?.handle && p.handle !== coffee?.handle)
    .filter((p) => include.has(p.handle) || types.size === 0 || types.has(p.type))
    .map((p) => toProduct(p));

  return {
    featuredTea: tea ? toProduct(tea, "tea") : fallback.featuredTea,
    featuredCoffee: coffee ? toProduct(coffee, "coffee") : fallback.featuredCoffee,
    pool: pool.length > 0 ? pool : fallback.pool,
  };
};

export const useProducts = (): ProductSelection => {
  const data = useRemoteJson<ProductsJson>("data/products.json", 60 * 60 * 1000);
  const cfg = useRemoteJson<ProductsConfig>("data/coups-de-coeur.json", 30 * 60 * 1000);
  return useMemo(() => selectProducts(data, cfg), [data, cfg]);
};
