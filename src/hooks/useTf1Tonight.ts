import { useEffect, useState } from "react";

export interface Tf1Program {
  id: string;
  start: string; // "20h50"
  title: string;
  subtitle?: string;
  format?: string;
  duration?: string;
  rebroadcast?: boolean;
}

export interface Tf1Tonight {
  channel: "TF1";
  source: string;
  fetchedAt: string;
  primeTime: Tf1Program[];
}

// Programmes "fillers" qu'on ne veut pas afficher (météo, pubs déguisées…)
const FILLER_TITLES = new Set([
  "Météo",
  "My Million",
  "Petits plats en équilibre",
]);

const isMeaningful = (p: Tf1Program) =>
  !FILLER_TITLES.has(p.title) && !/^Météo/i.test(p.title);

const REFRESH_MS = 60 * 60 * 1000; // re-tente toutes les heures (au cas où la GH Action ait pushé)

export const useTf1Tonight = () => {
  const [data, setData] = useState<Tf1Tonight | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/data/tf1.json", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as Tf1Tonight;
        if (cancelled) return;
        // Filtre les fillers
        json.primeTime = json.primeTime.filter(isMeaningful);
        setData(json);
      } catch {
        // pas grave, on tombe sur le fallback éditorial
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
