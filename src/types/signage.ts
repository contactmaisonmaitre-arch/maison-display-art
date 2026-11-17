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
    sunrise?: string[];
    sunset?: string[];
    precipitation_probability_max?: number[];
  };
}

export type SceneType =
  | "café"
  | "chat-heureux"
  | "weather"
  | "matcha"
  | "nouveautes"
  | "thedesmaitre"
  | "épicerie"
  | "instagram"
  | "chatperche-intro"
  | "chatperche-program"
  | "chatperche-maison"
  | "chatperche-produits"
  | "produits"
  | "anecdote"
  | "goodnews"
  | "review"
  | "dole"
  | "carte"
  | "ephemeres"
  | "vedette"
  | "aujourdhui"
  | "dole-a-pied"
  | "horoscope"
  | "ephemeride"
  | "annonce"
  | "cheminee"
  | "video"
  | "club"
  | "noel-menu"
  | "conseil"
  | "grain"
  | "edito";

export interface Scene {
  type: SceneType;
  duration: number;
  reelIndex?: number;
  anecdoteIndex?: number;
  newsOffset?: number;
  productOffset?: number;
  /** Index de l'annonce (public/data/annonces.json) pour les scènes "annonce". */
  annonceIndex?: number;
  /** Index du conseil du barista (public/data/noel.json → conseils). */
  conseilIndex?: number;
  /** Scène « edito » : identifiant de la slide (public/data/slides.json). */
  slide?: string;
  /** Rang de passage pour la scène "vedette" (boisson mise en avant). */
  vedetteIndex?: number;
  /** Vidéo à jouer (scènes "video" et "cheminee"). */
  src?: string;
  /** Image affichée pendant le chargement ou si la vidéo ne passe pas. */
  poster?: string;
  /** Scène insérée automatiquement entre deux scènes (feu de cheminée). */
  interlude?: boolean;
  /** Page à afficher pour les scènes paginées (horoscope : 6 signes par page). */
  page?: number;
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
  /** Scènes "video" / "cheminee" : fichier vidéo (/videos/… ou URL). */
  src?: string;
  poster?: string;
  /** Scène « edito » : identifiant de la slide dans public/data/slides.json. */
  slide?: string;
}

/**
 * Interlude (public/data/playlist.json → "interlude") : une scène, en
 * général le feu de cheminée, glissée automatiquement entre chaque scène
 * pendant la période from → until.
 */
export interface InterludeEntry extends PlaylistEntry {
  enabled?: boolean;
  /** Le feu toutes les N scènes (défaut : 1, après chaque scène). */
  every?: number;
}

