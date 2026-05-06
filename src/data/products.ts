export interface Product {
  cat: string;
  name: string;
  notes: string;
  price: string;
  img: string;
  featured?: boolean;
}

// Produits réels — extraits de maisonmaitre.com (prix au 100g pour les thés/infusions)
// Le Chat Heureux est en vedette : toujours en première position (featured: true)
export const PRODUCTS_TO_TRY: Product[] = [
  { cat: "Thé des Maitre · Vert",       name: "Le Chat Heureux",          notes: "Notre incontournable",         price: "9,50 € / 100g",  img: "/products/the-chat.png", featured: true },
  { cat: "Café des Maitre · Éthiopie",  name: "Yirgacheffe Heirloom",     notes: "Jasmin · Pêche · Miel",        price: "14,50 € / 100g", img: "/products/cafe-ethiopie.png" },
  { cat: "Café des Maitre · Colombie",  name: "Huila Bourbon Rose",       notes: "Cerise · Framboise · Cacao",   price: "16 € / 100g",    img: "/products/cafe-colombie-bourbon.png" },
  { cat: "Café des Maitre · Colombie",  name: "Huila Castillo Semi-Lavé", notes: "Chocolat · Noisette · Caramel",price: "14,50 € / 100g", img: "/products/cafe-colombie-castillo.gif" },
  { cat: "Thé des Maitre · Noir",       name: "Banquet des Tsars",        notes: "Bergamote & agrumes",          price: "10,90 € / 100g", img: "/products/the-tsars.png" },
  { cat: "Infusion des Maitre",         name: "Délice des Vergers",       notes: "Framboise · Hibiscus",         price: "9,35 € / 100g",  img: "/products/infusion-vergers.png" },
  { cat: "Thé des Maitre · Floral",     name: "Eden Floral",              notes: "Rose & Pivoine",               price: "11,50 € / 100g", img: "/products/eden-floral.png" },
  { cat: "Thé des Maitre · Caramel",    name: "Douceur Salée",            notes: "Caramel beurre salé",          price: "12,25 € / 100g", img: "/products/douceur-salee.png" },
  { cat: "Boutique",                    name: "Mug Émaillé",              notes: "« Buvez un bon café »",        price: "20 €",           img: "/products/mug-emaille.png" },
];
