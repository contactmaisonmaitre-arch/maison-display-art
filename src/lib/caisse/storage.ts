// Persistance locale de la caisse : brouillon du jour + enchaînement jour+1.
// Réutilise le pattern tolérant aux navigateurs TV de src/lib/signage/storage.ts.

import { safeGetStorage, safeSetStorage } from "@/lib/signage/storage";
import type { CaisseInput, CaisseResult } from "./types";

const DRAFT_KEY = "mm.caisse.draft";
const CHAIN_KEY = "mm.caisse.chain";

/** Ce qu'on retient d'une journée validée pour pré-remplir la suivante (Règle 4/5). */
export interface ChainState {
  /** Date de la dernière caisse validée. */
  date: string;
  /** D (Total CAISSE) validé — devient E_jour_precedent_D demain. */
  D: number;
  /** E' déposé ce jour — devient depot_jour_precedent demain. */
  Eprime: number;
}

/** Sauvegarde le brouillon en cours (saisie non validée). */
export function saveDraft(input: CaisseInput): void {
  safeSetStorage(DRAFT_KEY, JSON.stringify(input));
}

/** Recharge le brouillon en cours, ou null. */
export function loadDraft(): CaisseInput | null {
  const raw = safeGetStorage(DRAFT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CaisseInput;
  } catch {
    return null;
  }
}

/** Enregistre l'état de chaînage après une caisse validée. */
export function saveChain(input: CaisseInput, result: CaisseResult): void {
  const chain: ChainState = { date: input.date, D: result.D, Eprime: result.Eprime };
  safeSetStorage(CHAIN_KEY, JSON.stringify(chain));
}

/** Relit l'état de chaînage de la dernière caisse validée, ou null. */
export function loadChain(): ChainState | null {
  const raw = safeGetStorage(CHAIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ChainState;
  } catch {
    return null;
  }
}
