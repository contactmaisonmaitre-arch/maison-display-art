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

// Produits réels — extraits de maisonmaitre.com
// Le Chat Heureux est le coup de cœur thé.
// Altiplano est le coup de cœur café (Pérou-Honduras).
export const PRODUCTS_TO_TRY: Product[] = [
  {
    cat: "Thé des Maitre · Vert",
    name: "Le Chat Heureux",
    notes: "Notre incontournable",
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
    cat: "Café des Maitre · Éthiopie",
    name: "Yirgacheffe Heirloom",
    notes: "Jasmin · Pêche · Miel",
    price: "14,50 € / 100g",
    img: "/products/cafe-ethiopie.webp",
  },
  {
    cat: "Café des Maitre · Colombie",
    name: "Huila Bourbon Rose",
    notes: "Cerise · Framboise · Cacao",
    price: "16 € / 100g",
    img: "/products/cafe-colombie-bourbon.webp",
  },
  {
    cat: "Café des Maitre · Colombie",
    name: "Huila Castillo Semi-Lavé",
    notes: "Chocolat · Noisette · Caramel",
    price: "14,50 € / 100g",
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
    cat: "Infusion des Maitre",
    name: "Délice des Vergers",
    notes: "Framboise · Hibiscus",
    price: "9,35 € / 100g",
    img: "/products/infusion-vergers.webp",
  },
  {
    cat: "Thé des Maitre · Floral",
    name: "Eden Floral",
    notes: "Rose & Pivoine",
    price: "11,50 € / 100g",
    img: "/products/eden-floral.webp",
  },
  {
    cat: "Thé des Maitre · Caramel",
    name: "Douceur Salée",
    notes: "Caramel beurre salé",
    price: "12,25 € / 100g",
    img: "/products/douceur-salee.webp",
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
