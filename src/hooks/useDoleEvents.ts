import type { DoleFact } from "@/data/dole-facts";
import { useRemoteJson } from "./useRemoteJson";

interface DoleEventsJson {
  source: string;
  fetchedAt: string;
  facts: DoleFact[];
}

// Régénéré chaque lundi par GitHub Actions (weekly-dole-events.yml).
export const useDoleEvents = (): DoleFact[] =>
  useRemoteJson<DoleEventsJson>("data/dole-events.json", 60 * 60 * 1000)?.facts ?? [];
