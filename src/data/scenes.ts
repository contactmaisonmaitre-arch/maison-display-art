import type { Scene } from "@/types/signage";
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

// Index aléatoires d'anecdotes café (renouvelés à chaque rafraîchissement)
const ANECDOTE_ORDER = shuffled(COFFEE_ANECDOTES.map((_, i) => i));
const NEWS_OFFSETS = shuffled(GOOD_NEWS_OF_THE_DAY.map((_, i) => i)).slice(0, 3);

export const SCENES: Scene[] = [
  { type: "café", duration: 13000 },
  { type: "weather", duration: 12000 },
  { type: "dole", duration: 20000 },
  { type: "review", duration: 38000 },
  { type: "instagram", duration: 30000, reelIndex: 0 },
  { type: "produits", duration: 17000, productOffset: 0 },
  { type: "goodnews", duration: 18000, newsOffset: NEWS_OFFSETS[0] ?? 0 },
  { type: "anecdote", duration: 15000, anecdoteIndex: ANECDOTE_ORDER[0] ?? 0 },
  { type: "vin", duration: 13000 },
  { type: "winemap", duration: 45000 },
  { type: "tv", duration: 18000 },
  { type: "instagram", duration: 30000, reelIndex: 1 },
  { type: "review", duration: 38000 },
  { type: "produits", duration: 17000, productOffset: 3 },
  { type: "anecdote", duration: 15000, anecdoteIndex: ANECDOTE_ORDER[1] ?? 1 },
  { type: "thé", duration: 13000 },
  { type: "matcha", duration: 15000 },
  { type: "weather", duration: 12000 },
  { type: "dole", duration: 20000 },
  { type: "goodnews", duration: 18000, newsOffset: NEWS_OFFSETS[1] ?? 3 },
  { type: "anecdote", duration: 15000, anecdoteIndex: ANECDOTE_ORDER[2] ?? 2 },
  { type: "review", duration: 38000 },
  { type: "instagram", duration: 30000, reelIndex: 2 },
  { type: "produits", duration: 17000, productOffset: 6 },
  { type: "anecdote", duration: 15000, anecdoteIndex: ANECDOTE_ORDER[3] ?? 3 },
  { type: "épicerie", duration: 13000 },
  { type: "chatperche-intro", duration: 15000 },
  { type: "chatperche-program", duration: 15000 },
];
