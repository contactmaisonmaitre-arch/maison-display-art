import { useMemo } from "react";
import { useRemoteJson } from "./useRemoteJson";
import { useToday } from "./useToday";

/** Annonce affichée par la scène « annonce » (public/data/annonces.json). */
export interface Annonce {
  eyebrow?: string;
  title: string;
  titleItalic?: string;
  subtitle?: string;
  body?: string;
  badge?: string;
  footer?: string;
  image?: string;
  from?: string;
  until?: string;
}

interface AnnoncesJson {
  annonces: Annonce[];
}

const todayIso = (d: Date) => d.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });

/** Annonces valides aujourd'hui (dates incluses). */
export const useAnnonces = (): Annonce[] => {
  const json = useRemoteJson<AnnoncesJson>("data/annonces.json", 30 * 60 * 1000);
  const today = useToday();
  return useMemo(() => {
    const t = todayIso(today);
    return (json?.annonces ?? []).filter(
      (a) => a.title && (!a.from || t >= a.from) && (!a.until || t <= a.until),
    );
  }, [json, today]);
};
