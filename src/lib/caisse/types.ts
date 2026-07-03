// Types de la caisse quotidienne Maison Maitre.
// Le vocabulaire (A → H, C = Total du Jour, etc.) suit exactement la fiche papier
// et les règles métier documentées dans caisse-maison-maitre/CLAUDE.md.

/** Un chèque client — noté à part, JAMAIS dans la caisse physique (Règle 2). */
export interface Cheque {
  label: string;
  montant: number;
}

/** Les quantités et montants saisis pour une journée. */
export interface CaisseInput {
  /** Date au format JJ-MM-AAAA (ex. "01-07-2026"). */
  date: string;
  /** Quantité de chaque coupure de billet, clé = valeur en euros ("100", "50"…). */
  billets: Record<string, number>;
  /** Quantité de chaque pièce, clé = valeur en euros ("2", "0.5", "0.01"…). */
  pieces: Record<string, number>;
  /** Chèques du jour (hors caisse physique). */
  cheques: Cheque[];
  /** A — espèces à transmettre à la banque, encore présentes dans le tiroir. */
  A_a_transmettre: number;
  /** B — rouleaux et billets non ouverts. */
  B_rouleaux: number;
  /** D (Total CAISSE) de la veille — sert de base au report E. */
  E_jour_precedent_D: number;
  /** Ce qui a été déposé à la banque la veille (à retirer du report). */
  depot_jour_precedent: number;
  /** E' — déposé à la banque aujourd'hui (sort de la caisse). */
  E_prime_depose: number;
  /** G — espèces NET du ticket POS (encaissé − rendu monnaie), carte exclue (Règle 3). */
  G_ticket_especes_net: number;
}

/** Résultat calculé d'une caisse. Tous les montants sont en euros. */
export interface CaisseResult {
  /** Sous-total billets. */
  totalBillets: number;
  /** Sous-total pièces. */
  totalPieces: number;
  /** Total des chèques (informatif, hors caisse). */
  totalCheques: number;
  /** C — Total du Jour = espèces comptées (billets + pièces). */
  C: number;
  /** D — Total CAISSE = A + B + C. */
  D: number;
  /** E — report réel du jour précédent = D(veille) − dépôt(veille). */
  E: number;
  /** E' — déposé aujourd'hui. */
  Eprime: number;
  /** F — Différence = D − E − E'. */
  F: number;
  /** G — ticket espèces net. */
  G: number;
  /** H — écart de caisse = F − G (doit être proche de 0). */
  H: number;
  /** true si |H| ≤ seuil de tolérance : caisse OK. */
  ok: boolean;
}
