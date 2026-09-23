// Types de public/data/carte.json (carte des boissons, recopiée de la carte
// imprimée au-dessus du comptoir).
export interface CarteItem {
  name: string;
  price?: string;
  size?: string;
  desc?: string;
  leaf?: boolean;
}
export interface CarteGroup {
  label?: string;
  items: CarteItem[];
}
export interface CarteSection {
  title: string;
  note?: string;
  groups: CarteGroup[];
}
export interface Ephemere {
  name: string;
  tagline?: string;
  desc?: string;
  price?: string;
  tags?: string[];
  vegan?: boolean;
  image?: string;
  bg?: string;
}
export interface CarteJson {
  tagline?: string[];
  side?: { label: string; items: CarteItem[] }[];
  columns: CarteSection[][];
  ephemeres?: {
    from?: string;
    until?: string;
    badge?: string;
    eyebrow?: string;
    title?: string[];
    intro?: string;
    footnote?: string;
    items: Ephemere[];
  };
  footer?: string[];
}

// Palette de la carte imprimée (bordeaux / crème).
export const BOARD = {
  wine: "#46121F",
  cream: "#F4F0E7",
  rule: "#E3D6BC",
  muted: "#8A5A62",
  sand: "#E8C9A9",
  orange: "#D4885C",
};

const todayIso = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });

/** Vrai si les éphémères sont à la carte aujourd'hui. */
export const ephemeresActive = (c: CarteJson | null) => {
  const e = c?.ephemeres;
  if (!e || e.items.length === 0) return false;
  const t = todayIso();
  return (!e.from || t >= e.from) && (!e.until || t <= e.until);
};

