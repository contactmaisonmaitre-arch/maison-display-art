import type { PlaylistEntry, Scene } from "@/types/signage";
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
  { type: "café", seconds: 13 },
  { type: "weather", seconds: 12 },
  { type: "carte", seconds: 18 },
  { type: "dole", seconds: 20 },
  { type: "review", seconds: 20 },
  { type: "instagram", seconds: 30 },
  { type: "produits", seconds: 17 },
  { type: "goodnews", seconds: 18 },
  { type: "anecdote", seconds: 15 },
  { type: "vin", seconds: 13 },
  { type: "winemap", seconds: 45 },
  { type: "tv", seconds: 18 },
  { type: "annonce", seconds: 16 },
  { type: "instagram", seconds: 30 },
  { type: "produits", seconds: 17 },
  { type: "anecdote", seconds: 15 },
  { type: "matcha", seconds: 15 },
  { type: "ephemeres", seconds: 18 },
  { type: "weather", seconds: 12 },
  { type: "dole", seconds: 20 },
  { type: "goodnews", seconds: 18 },
  { type: "review", seconds: 20 },
  { type: "instagram", seconds: 30 },
  { type: "produits", seconds: 17 },
  { type: "anecdote", seconds: 15 },
  { type: "épicerie", seconds: 13 },
  { type: "annonce", seconds: 16 },
  { type: "chatperche-intro", seconds: 15, until: "2026-09-27" },
  { type: "chatperche-program", seconds: 15, until: "2026-09-27" },
];

/** "2026-09-27" → comparable avec la date du jour (heure de Paris). */
const todayIso = (now: Date) =>
  now.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" }); // AAAA-MM-JJ

/** Contenus dont dépend l'affichage de certaines scènes. */
export interface SceneContext {
  annonceCount: number;
  ephemeres: boolean;
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
): Scene[] => {
  const seen: Partial<Record<string, number>> = {};
  const scenes = playlist
    .filter((e) => isEntryActive(e, now, ctx))
    .map((e): Scene => {
      const n = (seen[e.type] = (seen[e.type] ?? -1) + 1);
      const scene: Scene = { type: e.type, duration: Math.max(4, e.seconds) * 1000 };
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
      }
      return scene;
    });
  return scenes.length > 0 ? scenes : [{ type: "café", duration: 15000 }];
};
