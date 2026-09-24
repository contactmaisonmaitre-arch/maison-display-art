// Infos pratiques Dole — sources vérifiées le 24/09/2026 :
// marchés : marchesdedole.fr/infos-pratiques ; lieux : jura-tourism.com,
// doledujura.fr. À mettre à jour ici si les horaires changent.

export interface MarketSlot {
  name: string;
  days: number[]; // 0 = dimanche … 6 = samedi
  from: string; // "08:00"
  to: string;
}

export const MARKETS: MarketSlot[] = [
  { name: "Marché couvert (Halles)", days: [2, 4], from: "08:00", to: "13:00" },
  { name: "Marché couvert (Halles)", days: [5], from: "14:00", to: "19:00" },
  { name: "Marché couvert (Halles)", days: [6], from: "08:00", to: "13:30" },
  { name: "Marché de plein air, place Nationale", days: [4, 6], from: "08:00", to: "13:00" },
];

const hhmm = (d: Date) =>
  d.toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" });
const parisDay = (d: Date) =>
  new Date(`${d.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" })}T12:00:00`).getDay();

const fmtH = (s: string) => s.replace(":00", "h").replace(":", "h");

/** Phrase courte sur les marchés du jour, ou null s'il n'y en a pas. */
export const marketStatus = (now = new Date()): { open: boolean; text: string } | null => {
  const day = parisDay(now);
  const t = hhmm(now);
  const today = MARKETS.filter((m) => m.days.includes(day));
  const openNow = today.filter((m) => t >= m.from && t < m.to);
  if (openNow.length) {
    const m = openNow[0];
    return { open: true, text: `${m.name} ouvert jusqu'à ${fmtH(m.to)}` };
  }
  const later = today.filter((m) => t < m.from).sort((a, b) => a.from.localeCompare(b.from));
  if (later.length) return { open: false, text: `${later[0].name} à ${fmtH(later[0].from)}` };
  // Prochain jour de marché
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const m = MARKETS.find((x) => x.days.includes(d));
    if (m) {
      const label = i === 1 ? "demain" : ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"][d];
      return { open: false, text: `Prochain marché ${label} dès ${fmtH(m.from)}` };
    }
  }
  return null;
};

// ─── Jours fériés (métropole) ───────────────────────────────────────────────
const easter = (y: number) => {
  // Algorithme de Meeus/Jones/Butcher
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, month - 1, day, 12);
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);

export const holidays = (y: number): { date: Date; name: string }[] => {
  const e = easter(y);
  return [
    { date: new Date(y, 0, 1, 12), name: "Jour de l'An" },
    { date: addDays(e, 1), name: "Lundi de Pâques" },
    { date: new Date(y, 4, 1, 12), name: "Fête du Travail" },
    { date: new Date(y, 4, 8, 12), name: "Victoire 1945" },
    { date: addDays(e, 39), name: "Ascension" },
    { date: addDays(e, 50), name: "Lundi de Pentecôte" },
    { date: new Date(y, 6, 14, 12), name: "Fête nationale" },
    { date: new Date(y, 7, 15, 12), name: "Assomption" },
    { date: new Date(y, 10, 1, 12), name: "Toussaint" },
    { date: new Date(y, 10, 11, 12), name: "Armistice 1918" },
    { date: new Date(y, 11, 25, 12), name: "Noël" },
  ];
};

const todayNoon = (now: Date) => new Date(`${now.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" })}T12:00:00`);
export const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86_400_000);

export const nextHoliday = (now = new Date()) => {
  const t = todayNoon(now);
  const all = [...holidays(t.getFullYear()), ...holidays(t.getFullYear() + 1)];
  const h = all.find((x) => x.date >= t)!;
  return { ...h, inDays: daysBetween(t, h.date) };
};

export const inDaysLabel = (n: number) => (n === 0 ? "aujourd'hui" : n === 1 ? "demain" : `dans ${n} jours`);

// ─── Phase de la lune (approximation, précision ± 1 jour) ──────────────────
export const moonPhase = (now = new Date()) => {
  const synodic = 29.530588853;
  const ref = Date.UTC(2000, 0, 6, 18, 14); // nouvelle lune de référence
  const age = (((now.getTime() - ref) / 86_400_000) % synodic + synodic) % synodic;
  const names: [number, string, string][] = [
    [1.84566, "Nouvelle lune", "🌑"],
    [5.53699, "Premier croissant", "🌒"],
    [9.22831, "Premier quartier", "🌓"],
    [12.91963, "Lune gibbeuse croissante", "🌔"],
    [16.61096, "Pleine lune", "🌕"],
    [20.30228, "Lune gibbeuse décroissante", "🌖"],
    [23.99361, "Dernier quartier", "🌗"],
    [27.68493, "Dernier croissant", "🌘"],
    [synodic, "Nouvelle lune", "🌑"],
  ];
  const [, name, icon] = names.find(([lim]) => age < lim)!;
  return { name, icon, age };
};

// ─── Dole à pied (touristes) ────────────────────────────────────────────────
export interface Lieu {
  name: string;
  en: string;
  fr: string;
  enText: string;
}

export const LIEUX: Lieu[] = [
  {
    name: "Maison natale de Pasteur",
    en: "Louis Pasteur's birthplace",
    fr: "Louis Pasteur y est né le 27 décembre 1822. Maison des Illustres, 43 rue Pasteur.",
    enText: "Where Louis Pasteur was born in 1822 — now a museum.",
  },
  {
    name: "Canal des Tanneurs",
    en: "Tanners' Canal",
    fr: "Le quartier où le père de Pasteur était tanneur — la « petite Venise » jurassienne.",
    enText: "The tanners' quarter, Dole's 'little Venice'.",
  },
  {
    name: "Collégiale Notre-Dame",
    en: "Notre-Dame Collegiate Church",
    fr: "Le grand clocher qui domine la vieille ville, bâti au XVIᵉ siècle.",
    enText: "The 16th-century church whose bell tower dominates the old town.",
  },
  {
    name: "Les Halles",
    en: "Covered market",
    fr: "Briques, fonte et verre face à la Collégiale. Mardi, jeudi et samedi matin, vendredi après-midi.",
    enText: "Brick, iron and glass market hall facing the church.",
  },
  {
    name: "Musée des Beaux-Arts",
    en: "Fine Arts Museum",
    fr: "Des collections du XVIᵉ au XIXᵉ siècle mêlées à l'art contemporain.",
    enText: "Old masters alongside contemporary art.",
  },
  {
    name: "Les bords du Doubs",
    en: "Along the Doubs river",
    fr: "Balade au bord de l'eau, et en saison, bateau électrique sur le Doubs.",
    enText: "Riverside walks and, in season, electric boat trips.",
  },
];

// ─── Changement d'heure (dernier dimanche de mars / d'octobre) ──────────────
const lastSunday = (y: number, month: number) => {
  const d = new Date(y, month + 1, 0, 12);
  d.setDate(d.getDate() - d.getDay());
  return d;
};

export const nextTimeChange = (now = new Date()) => {
  const t = todayNoon(now);
  const y = t.getFullYear();
  const list = [
    { date: lastSunday(y, 2), name: "Passage à l'heure d'été", hint: "on avance d'une heure" },
    { date: lastSunday(y, 9), name: "Passage à l'heure d'hiver", hint: "une heure de sommeil en plus" },
    { date: lastSunday(y + 1, 2), name: "Passage à l'heure d'été", hint: "on avance d'une heure" },
  ];
  const c = list.find((x) => x.date >= t)!;
  return { ...c, inDays: daysBetween(t, c.date) };
};
