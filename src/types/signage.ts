export interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    uv_index: number;
    precipitation: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export type SceneType =
  | "café"
  | "vin"
  | "winemap"
  | "weather"
  | "matcha"
  | "épicerie"
  | "instagram"
  | "chatperche-intro"
  | "chatperche-program"
  | "produits"
  | "anecdote"
  | "goodnews"
  | "review"
  | "dole"
  | "carte"
  | "ephemeres"
  | "vedette"
  | "annonce";

export interface Scene {
  type: SceneType;
  duration: number;
  reelIndex?: number;
  anecdoteIndex?: number;
  newsOffset?: number;
  productOffset?: number;
  /** Index de l'annonce (public/data/annonces.json) pour les scènes "annonce". */
  annonceIndex?: number;
  /** Rang de passage pour la scène "vedette" (boisson mise en avant). */
  vedetteIndex?: number;
}

/**
 * Entrée de programmation (public/data/playlist.json). Durée en secondes.
 * `from` / `until` (AAAA-MM-JJ, inclus) : la scène n'apparaît qu'entre ces
 * dates — pratique pour les événements (Chat Perché, Noël…).
 * `days` : jours de la semaine où la scène passe (0 = dimanche … 6 = samedi).
 */
export interface PlaylistEntry {
  type: SceneType;
  seconds: number;
  from?: string;
  until?: string;
  days?: number[];
  enabled?: boolean;
}

