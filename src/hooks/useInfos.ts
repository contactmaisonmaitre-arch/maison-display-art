import { useRemoteJson } from "./useRemoteJson";

export interface Vacances {
  name: string;
  start: string; // AAAA-MM-JJ (premier jour)
  end: string; // AAAA-MM-JJ (jour de reprise)
  zone?: string;
}
export interface Ephemeride {
  year: number;
  text: string;
  kind: "event" | "birth";
}
export interface InfosJson {
  vacances?: Vacances[];
  ephemerides?: { date: string; events: Ephemeride[]; births: Ephemeride[] };
  fetchedAt?: string;
}

// Écrit chaque matin par scripts/fetch-infos.mjs (GitHub Actions).
export const useInfos = () => useRemoteJson<InfosJson>("data/infos.json", 60 * 60 * 1000);
