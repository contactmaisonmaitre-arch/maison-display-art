import type { DoleFact } from "@/data/dole-facts";
import { useRemoteJson } from "./useRemoteJson";
import { useToday } from "./useToday";

interface DoleEventsJson {
  source: string;
  fetchedAt: string;
  facts: DoleFact[];
}

const MONTHS: Record<string, number> = {
  janv: 1, févr: 2, fevr: 2, mars: 3, avr: 4, mai: 5, juin: 6, juil: 7,
  août: 8, aout: 8, sept: 9, oct: 10, nov: 11, déc: 12, dec: 12,
};

/** Date d'un événement : champ `date`, sinon lue dans « Samedi 12 sept. ». */
export const eventDate = (f: DoleFact, now: Date): string | null => {
  if (f.date) return f.date;
  const m = f.body.toLowerCase().match(/^\S+\s+(\d{1,2})\s+([a-zéû]+)/);
  if (!m) return null;
  const key = Object.keys(MONTHS).find((k) => m[2].startsWith(k));
  if (!key) return null;
  const month = MONTHS[key];
  let year = now.getFullYear();
  if (month < now.getMonth() + 1 - 2) year += 1;
  return `${year}-${String(month).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
};

// Régénéré par GitHub Actions ; on masque ici les événements déjà passés.
export const useDoleEvents = (): DoleFact[] => {
  const json = useRemoteJson<DoleEventsJson>("data/dole-events.json", 60 * 60 * 1000);
  const now = useToday();
  const today = now.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  return (json?.facts ?? []).filter((f) => {
    const d = eventDate(f, now);
    return !d || d >= today;
  });
};
