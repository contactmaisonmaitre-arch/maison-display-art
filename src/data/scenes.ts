import type { InterludeEntry, PlaylistEntry, Scene } from "@/types/signage";
import { COFFEE_ANECDOTES } from "@/data/anecdotes";
import { GOOD_NEWS_OF_THE_DAY } from "@/data/good-news";

// Utilitaire : ordre aléatoire stable pour cette session/page
const shuffled = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Index aléatoires d'anecdotes café / bonnes nouvelles (renouvelés à chaque chargement)
const ANECDOTE_ORDER = shuffled(COFFEE_ANECDOTES.map((_, i) => i));
const NEWS_ORDER = shuffled(GOOD_NEWS_OF_THE_DAY.map((_, i) => i));

/**
 * Programmation par défaut — utilisée si public/data/playlist.json est
 * injoignable. La version « vivante » est dans public/data/playlist.json
 * (modifiable sur GitHub sans republier Lovable).
 */
export const DEFAULT_PLAYLIST: PlaylistEntry[] = [
  { type: "café", seconds: 12 },
  { type: "chatperche-maison", seconds: 16, until: "2026-09-27" },
  { type: "aujourdhui", seconds: 18 },
  { type: "carte", seconds: 20 },
  { type: "chatperche-produits", seconds: 18, until: "2026-09-27" },
  { type: "review", seconds: 18 },
  { type: "horoscope", seconds: 30 },
  { type: "instagram", seconds: 25 },
  { type: "dole", seconds: 15 },
  { type: "ephemeres", seconds: 16 },
  { type: "produits", seconds: 16 },
  { type: "nouveautes", seconds: 18 },
  { type: "thedesmaitre", seconds: 30, from: "2026-11-15" },
  { type: "chat-heureux", seconds: 16 },
  { type: "chatperche-program", seconds: 14, until: "2026-09-27" },
  { type: "dole-a-pied", seconds: 20 },
  { type: "ephemeride", seconds: 18 },
  { type: "anecdote", seconds: 14 },
  { type: "annonce", seconds: 14 },
  { type: "club", seconds: 30, from: "2026-11-04" },
];

/** Vidéo du feu de cheminée (servie par le site publié, pas par GitHub). La TV la lit via le Fire TV Stick. */
export const CHEMINEE_SRC = "/videos/cheminee.mp4";
export const CHEMINEE_POSTER = "/videos/cheminee.webp";

/** Interlude par défaut : le feu entre chaque scène, l'automne et l'hiver. */
export const DEFAULT_INTERLUDE: InterludeEntry = {
  type: "cheminee",
  seconds: 30,
  from: "2026-10-15",
  until: "2027-03-15",
};

/** "2026-09-27" → comparable avec la date du jour (heure de Paris). */
const todayIso = (now: Date) =>
  now.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" }); // AAAA-MM-JJ

/** Contenus dont dépend l'affichage de certaines scènes. */
export interface SceneContext {
  annonceCount: number;
  ephemeres: boolean;
  /** Éphémérides du jour disponibles (sinon la scène « Ce jour-là » saute). */
  ephemeride?: boolean;
}

export const isEntryActive = (e: PlaylistEntry, now: Date, ctx: SceneContext) => {
  if (e.enabled === false) return false;
  const today = todayIso(now);
  if (e.from && today < e.from) return false;
  if (e.until && today > e.until) return false;
  if (e.days?.length) {
    // Jour de la semaine à Paris (midi pour éviter tout effet de fuseau).
    const day = new Date(`${today}T12:00:00`).getDay();
    if (!e.days.includes(day)) return false;
  }
  if (e.type === "annonce" && ctx.annonceCount === 0) return false;
  if (e.type === "ephemeres" && !ctx.ephemeres) return false;
  if (e.type === "ephemeride" && ctx.ephemeride === false) return false;
  return true;
};

/**
 * Construit la liste des scènes du jour : filtre par dates/jours, et donne à
 * chaque occurrence d'un même type un contenu différent (produit, anecdote…).
 */
export const buildScenes = (
  playlist: PlaylistEntry[],
  now: Date,
  ctx: SceneContext = { annonceCount: 0, ephemeres: true },
  interlude: InterludeEntry | null = null,
): Scene[] => {
  const seen: Partial<Record<string, number>> = {};
  const scenes = playlist
    .filter((e) => isEntryActive(e, now, ctx))
    .map((e): Scene => {
      const n = (seen[e.type] = (seen[e.type] ?? -1) + 1);
      const scene: Scene = { type: e.type, duration: Math.max(4, e.seconds) * 1000 };
      if (e.src) scene.src = e.src;
      if (e.poster) scene.poster = e.poster;
      switch (e.type) {
        case "instagram":
          scene.reelIndex = n;
          break;
        case "produits":
          scene.productOffset = n * 3;
          break;
        case "anecdote":
          scene.anecdoteIndex = ANECDOTE_ORDER[n % ANECDOTE_ORDER.length] ?? 0;
          break;
        case "goodnews":
          scene.newsOffset = NEWS_ORDER[n % NEWS_ORDER.length] ?? 0;
          break;
        case "annonce":
          scene.annonceIndex = n;
          break;
        case "vedette":
          scene.vedetteIndex = n;
          break;
        case "horoscope":
          scene.page = n;
          break;
      }
      return scene;
    });
  const base = scenes.length > 0 ? scenes : [{ type: "café", duration: 15000 } as Scene];
  return insertInterludes(base, interlude, now, ctx);
};

/**
 * Glisse l'interlude (feu de cheminée) après chaque scène. Jamais deux
 * interludes à la suite, ni à côté d'une scène du même type déjà présente
 * dans la liste (la boucle repart au début : on regarde aussi la première).
 */
export const insertInterludes = (
  scenes: Scene[],
  interlude: InterludeEntry | null | undefined,
  now: Date,
  ctx: SceneContext,
): Scene[] => {
  if (!interlude || !isEntryActive(interlude, now, ctx) || scenes.length < 2) return scenes;
  const make = (): Scene => ({
    type: interlude.type,
    duration: Math.max(3, interlude.seconds) * 1000,
    interlude: true,
    ...(interlude.src ? { src: interlude.src } : {}),
    ...(interlude.poster ? { poster: interlude.poster } : {}),
  });
  const out: Scene[] = [];
  scenes.forEach((s, i) => {
    out.push(s);
    const next = scenes[(i + 1) % scenes.length];
    if (s.type !== interlude.type && next.type !== interlude.type) out.push(make());
  });
  return out;
};
