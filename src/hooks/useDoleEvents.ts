import { useEffect, useState } from "react";
import type { DoleFact } from "@/data/dole-facts";

interface DoleEventsJson {
  source: string;
  fetchedAt: string;
  facts: DoleFact[];
}

const REFRESH_MS = 60 * 60 * 1000; // re-fetch toutes les heures

export const useDoleEvents = () => {
  const [facts, setFacts] = useState<DoleFact[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/data/dole-events.json", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as DoleEventsJson;
        if (cancelled) return;
        setFacts(json.facts ?? []);
      } catch {
        // silencieux : DoleScene retombe sur DOLE_FACTS uniquement
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return facts;
};
