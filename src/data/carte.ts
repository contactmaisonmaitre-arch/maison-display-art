// Types de public/data/carte.json (carte des boissons, recopiée de la carte
// imprimée au-dessus du comptoir).
export type CarteTag = "nouveau" | "vegetal" | "coeur" | "glace";

export interface CarteItem {
  name: string;
  price?: string;
  size?: string;
  desc?: string;
  leaf?: boolean;
  /** Phrase courte pour la scène « vedette ». */
  pitch?: string;
  /** Peut passer en grand dans la scène « vedette ». */
  vedette?: boolean;
  image?: string;
  tags?: CarteTag[];
  allergenes?: string[];
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
  pitch?: string;
  vedette?: boolean;
  allergenes?: string[];
  tagline?: string;
  desc?: string;
  price?: string;
  tags?: string[];
  vegan?: boolean;
  image?: string;
  bg?: string;
}
export interface Moment {
  from: string; // "HH:MM"
  to: string;
  label: string;
  titre?: string;
  focus: string[]; // titres de sections mises en avant
}

export interface CarteJson {
  moments?: Moment[];
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


/** Identifiant stable d'une boisson : « Chaï latte » → « chai-latte ». */
export const slug = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const hhmm = (now: Date) =>
  now.toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" });

/** Moment de la journée en cours (matin, après-midi, fin de journée). */
export const currentMoment = (c: CarteJson | null, now = new Date()): Moment | null => {
  const t = hhmm(now);
  return c?.moments?.find((m) => t >= m.from && t < m.to) ?? null;
};

export interface FlatItem extends CarteItem {
  id: string;
  /** Couleur de fond associée à la photo (éphémères). */
  bg?: string;
  section: string;
  ephemere?: boolean;
}

/** Toutes les boissons à plat (sections + éphémères actifs). */
export const allItems = (c: CarteJson | null): FlatItem[] => {
  if (!c) return [];
  const out: FlatItem[] = [];
  for (const col of c.columns)
    for (const s of col)
      for (const g of s.groups) for (const it of g.items) out.push({ ...it, id: slug(it.name), section: s.title });
  if (ephemeresActive(c))
    for (const e of c.ephemeres!.items)
      out.push({
        name: e.name,
        price: e.price,
        desc: e.desc,
        pitch: e.pitch ?? e.tagline,
        image: e.image,
        bg: e.bg,
        vedette: e.vedette ?? true,
        tags: [
          ...(e.tags ?? []).map((t) => t.toLowerCase()).filter((t): t is CarteTag => t in TAG_LABEL),
          ...(e.vegan ? (["vegetal"] as CarteTag[]) : []),
        ],
        allergenes: e.allergenes,
        id: slug(e.name),
        section: "Éphémères",
        ephemere: true,
      });
  return out;
};

/**
 * Boissons candidates pour la scène « vedette » : d'abord celles des sections
 * mises en avant à cette heure-ci, puis les éphémères. Les épuisées sont exclues.
 */
export const vedettePool = (c: CarteJson | null, epuises: string[], now = new Date()): FlatItem[] => {
  const items = allItems(c).filter((i) => i.vedette && !epuises.includes(i.id));
  const focus = currentMoment(c, now)?.focus ?? [];
  const inFocus = items.filter((i) => focus.includes(i.section));
  const eph = items.filter((i) => i.ephemere);
  const pool = [...eph, ...inFocus.filter((i) => !i.ephemere)];
  return pool.length > 0 ? pool : items;
};

export const TAG_LABEL: Record<CarteTag, string> = {
  nouveau: "Nouveau",
  vegetal: "100 % végétal",
  coeur: "Coup de cœur",
  glace: "Aussi en glacé",
};
