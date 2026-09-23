import { useRemoteJson } from "./useRemoteJson";

export interface TvProgramItem {
  start: string; // "21h10"
  title: string;
  subtitle?: string;
  format?: string;
  duration?: string;
  rebroadcast?: boolean;
}

export interface TvChannel {
  name: string;
  url: string;
  hero: TvProgramItem | null;
  next: TvProgramItem | null;
  error: string | null;
}

export interface TvTonight {
  fetchedAt: string;
  channels: TvChannel[];
}

// Le JSON est régénéré chaque matin par GitHub Actions (daily-tv.yml).
export const useTvTonight = () => useRemoteJson<TvTonight>("data/tv-tonight.json", 30 * 60 * 1000);
