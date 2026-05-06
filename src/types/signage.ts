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
  | "weather"
  | "thé"
  | "épicerie"
  | "instagram"
  | "chatperche-intro"
  | "chatperche-program"
  | "produits"
  | "anecdote"
  | "goodnews"
  | "review"
  | "tv"
  | "dole";

export interface Scene {
  type: SceneType;
  duration: number;
  reelIndex?: number;
  anecdoteIndex?: number;
  newsOffset?: number;
  productOffset?: number;
}

export type TvKind = "DOCUMENTAIRE" | "SÉRIE" | "ÉMISSION" | "CONCERT" | "DÉBAT";
