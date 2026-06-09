export type FeaturedKind = "tea" | "coffee";

export interface Product {
  cat: string;
  name: string;
  notes: string;
  price: string;
  img: string;
  featured?: FeaturedKind;
  /**
   * Si true, l'image remplit toute la zone visuelle de la tuile (objectFit: cover),
   * sans padding ni dégradé doré par-dessus — pour un packshot qui a déjà son
   * propre décor de fond (ex. l'Altiplano sur fond rayé vert/blanc).
   */
  bleed?: boolean;
}

// Produits réels — extraits du catalogue maisonmaitre.com (juin 2026).
// Le Chat Heureux est le coup de cœur thé/infusion.
// Altiplano est le coup de cœur café.
export const PRODUCTS_TO_TRY: Product[] = [
  {
    cat: "Infusion des Maitre · Agrumes & Plantes",
    name: "Le Chat Heureux",
    notes: "Notre incontournable maison",
    price: "9,50 € / 100g",
    img: "/products/the-chat.webp",
    featured: "tea",
  },
  {
    cat: "Café des Maitre · Pérou & Honduras",
    name: "Altiplano",
    notes: "Cacao · Caramel · Notes douces d'altitude",
    price: "10,50 € / 250g",
    img: "/products/cafe-altiplano.webp",
    featured: "coffee",
    bleed: true,
  },
  {
    cat: "Café des Maitre · Mexique Chiapas",
    name: "Aguacero",
    notes: "Pluie de Chiapas — rond, doux, équilibré",
    price: "11,25 € / 250g",
    img: "/products/cafe-ethiopie.webp", // placeholder visuel — à remplacer
  },
  {
    cat: "Café des Maitre · Éthiopie",
    name: "Moka Sidamo",
    notes: "Fruité, floral, notes d'agrumes",
    price: "12 € / 250g",
    img: "/products/cafe-ethiopie.webp",
  },
  {
    cat: "Café des Maitre · Colombie Huila",
    name: "Bourbon Rose Nature",
    notes: "Cerise · Framboise · Cacao",
    price: "16 € / 250g",
    img: "/products/cafe-colombie-bourbon.webp",
  },
  {
    cat: "Café des Maitre · Colombie Huila",
    name: "Castillo Semi Lavé",
    notes: "Chocolat · Noisette · Caramel",
    price: "14,50 € / 250g",
    img: "/products/cafe-colombie-castillo.gif",
  },
  {
    cat: "Thé des Maitre · Noir",
    name: "Banquet des Tsars",
    notes: "Bergamote & agrumes",
    price: "10,90 € / 100g",
    img: "/products/the-tsars.webp",
  },
  {
    cat: "Thé des Maitre · Noir",
    name: "Eden Floral",
    notes: "Rose & Pivoine",
    price: "8,20 € / 100g",
    img: "/products/eden-floral.webp",
  },
  {
    cat: "Thé des Maitre · Noir",
    name: "Douceur Salée",
    notes: "Caramel beurre salé",
    price: "12,25 € / 100g",
    img: "/products/douceur-salee.webp",
  },
  {
    cat: "Thé des Maitre · Vert · Japon",
    name: "Hojicha Bio",
    notes: "Thé vert japonais torréfié — sucré, doux",
    price: "14,75 € / 100g",
    img: "/products/the-tsars.webp", // placeholder
  },
  {
    cat: "Thé des Maitre · Vert · Japon",
    name: "Genmaicha",
    notes: "Vert japonais au riz soufflé",
    price: "12,95 € / 100g",
    img: "/products/the-tsars.webp", // placeholder
  },
  {
    cat: "Infusion des Maitre",
    name: "Délice des Vergers",
    notes: "Framboise · Hibiscus",
    price: "9,35 € / 100g",
    img: "/products/infusion-vergers.webp",
  },
  {
    cat: "Infusion des Maitre",
    name: "Au Coin du Feu",
    notes: "Épices & Orange — l'hiver en tasse",
    price: "7,45 € / 100g",
    img: "/products/infusion-vergers.webp", // placeholder
  },
  {
    cat: "Boutique",
    name: "Mug Émaillé",
    notes: "« Buvez un bon café »",
    price: "20 €",
    img: "/products/mug-emaille.webp",
  },
];

export const FEATURED_TEA = PRODUCTS_TO_TRY.find((p) => p.featured === "tea");
export const FEATURED_COFFEE = PRODUCTS_TO_TRY.find((p) => p.featured === "coffee");
export const NON_FEATURED = PRODUCTS_TO_TRY.filter((p) => !p.featured);
