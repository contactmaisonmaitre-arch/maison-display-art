import { useEffect, useState } from "react";
import type { CarteJson } from "@/data/carte";
import { useRemoteJson } from "./useRemoteJson";

export const useCarte = () => useRemoteJson<CarteJson>("data/carte.json", 15 * 60 * 1000);

const REPO = "contactmaisonmaitre-arch/maison-display-art";
export const DISPO_PATH = "public/data/dispo.json";

export interface DispoJson {
  epuises: string[];
  updatedAt?: string | null;
}

/**
 * Boissons épuisées. Lu via l'API GitHub (pas de cache de 5 min comme
 * raw.githubusercontent) → la TV suit en ~2 min quand l'équipe coche
 * « épuisé ». 30 appels/h, sous la limite de 60/h sans clé.
 */
export const fetchDispo = async (): Promise<DispoJson | null> => {
  try {
    const url = import.meta.env.DEV
      ? "/data/dispo.json"
      : `https://api.github.com/repos/${REPO}/contents/${DISPO_PATH}?ref=main`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: import.meta.env.DEV ? {} : { Accept: "application/vnd.github.raw+json" },
    });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as DispoJson;
  } catch {
    try {
      const res = await fetch("/data/dispo.json", { cache: "no-store" });
      return res.ok ? ((await res.json()) as DispoJson) : null;
    } catch {
      return null;
    }
  }
};

export const useDispo = (refreshMs = 2 * 60 * 1000): string[] => {
  const [epuises, setEpuises] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const d = await fetchDispo();
      if (!cancelled && d) setEpuises(d.epuises ?? []);
    };
    load();
    const id = setInterval(load, refreshMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [refreshMs]);
  return epuises;
};
