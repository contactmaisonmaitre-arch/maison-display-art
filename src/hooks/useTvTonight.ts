import { useEffect, useState } from "react";

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

const REFRESH_MS = 60 * 60 * 1000; // re-tente toutes les heures

export const useTvTonight = () => {
  const [data, setData] = useState<TvTonight | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/data/tv-tonight.json", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as TvTonight;
        if (cancelled) return;
        setData(json);
      } catch {
        // silencieux : la scène retombe sur EditorialView
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return data;
};
