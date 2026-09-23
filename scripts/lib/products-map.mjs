// Transforme un produit Shopify (format public /products.json) en produit
// affichable sur la TV. Partagé par fetch-products.mjs et les tests.

const BRAND_BY_TYPE = {
  "café": "Café des Maitre",
  "thé noir": "Thé des Maitre · Noir",
  "thé vert": "Thé des Maitre · Vert",
  "thé blanc": "Thé des Maitre · Blanc",
  "infusion": "Infusion des Maitre",
  "rooibos": "Thé des Maitre · Rooibos",
  "maté": "Thé des Maitre · Maté",
  "accessoire": "Boutique",
};

const SEP = /\s+[—–-]\s+/;

const stripNoise = (s) =>
  s
    .replace(/\|\s*.*$/, "") // « | Maison Maitre », « | Sapidité »
    .replace(/Thé des Maitre/gi, "")
    .replace(/Café des Maitre/gi, "")
    .replace(/\b\d+\s?(g|kg)\b/gi, "")
    .replace(/\bPRO\b/g, "")
    .replace(/[,\s]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

export const parseWeight = (title, variantTitle = "") => {
  const m = `${title} ${variantTitle}`.match(/(\d+(?:[.,]\d+)?)\s?(g|kg)\b/i);
  return m ? `${m[1]} ${m[2].toLowerCase()}` : null;
};

export const formatPrice = (amount) => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  const txt = Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
  return `${txt} €`;
};

const firstSentence = (html = "") => {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();
  // Shopify colle parfois les phrases (« durer.Ce gobelet ») → on coupe aussi
  // devant une majuscule.
  const sentence = (text.match(/^.*?[.!?](?=\s|$|[A-ZÀ-Ý])/) ?? [text])[0].trim();
  return sentence.length > 90 ? `${sentence.slice(0, 87).replace(/\s+\S*$/, "")}…` : sentence;
};

/** Produit exclu de la rotation TV (formats pro, 1 kg, sans type…). */
export const isTvEligible = (raw) => {
  const t = raw.title ?? "";
  if (!raw.product_type) return false;
  if (/\b1\s?kg\b|\bPRO\b/i.test(t)) return false;
  if (/carte[- ]cadeau/i.test(t)) return false;
  return true;
};

/**
 * @param raw  { handle, title, product_type, vendor, body_html, images:[{src}],
 *               variants:[{title, price, available}] }
 */
export const mapProduct = (raw) => {
  const type = (raw.product_type ?? "").trim().toLowerCase();
  const house = (raw.title.match(/\|\s*(.+)$/)?.[1] ?? "").trim();
  const parts = raw.title.split(SEP).map(stripNoise).filter(Boolean);
  const name = parts[0] ?? raw.title;
  const rest = parts.slice(1).join(" · ");
  const variant =
    raw.variants?.find((v) => v.available !== false) ?? raw.variants?.[0] ?? {};
  const weight = parseWeight(raw.title, variant.title);
  // Cafés d'un autre torréfacteur (« | Sapidité ») : on le crédite.
  const guest = house && !/maison maitre|des maitre/i.test(house) ? house : null;
  const brand = guest ? `Sélection · ${guest}` : BRAND_BY_TYPE[type] ?? "Maison Maitre";
  // « Café de spécialité Pérou–Honduras » → « Pérou–Honduras »
  const origin = rest
    .replace(/^(Café|Thé|Infusion|Rooibos|Maté)\s+(de spécialité\s+|du\s+|noir\s+|vert\s+|blanc\s+)?/i, "")
    .replace(/^(bio\s+)/i, "Bio ")
    .replace(/^./, (c) => c.toUpperCase());
  const cat = type === "accessoire" || !origin ? brand : `${brand} · ${origin}`;
  const img = raw.images?.[0]?.src ?? null;
  return {
    handle: raw.handle,
    name,
    cat,
    type,
    notes: (() => {
      const n = firstSentence(raw.body_html);
      return n.length >= 20 ? n : origin;
    })(),
    price: [formatPrice(variant.price), weight].filter(Boolean).join(" · "),
    img,
    available: raw.variants?.some((v) => v.available !== false) ?? true,
    vendor: raw.vendor ?? "",
  };
};
