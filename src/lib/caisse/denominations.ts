// Coupures acceptées (Règle 1). L'ordre est celui de la fiche papier.
// `value` = valeur en euros, `label` = affichage FR (virgule décimale).

export interface Denomination {
  /** Clé utilisée dans CaisseInput.billets / .pieces (point décimal). */
  key: string;
  /** Valeur unitaire en euros. */
  value: number;
  /** Libellé affiché (virgule décimale à la française). */
  label: string;
}

export const BILLETS: Denomination[] = [
  { key: "100", value: 100, label: "100 €" },
  { key: "50", value: 50, label: "50 €" },
  { key: "20", value: 20, label: "20 €" },
  { key: "10", value: 10, label: "10 €" },
  { key: "5", value: 5, label: "5 €" },
];

export const PIECES: Denomination[] = [
  { key: "2", value: 2, label: "2 €" },
  { key: "1", value: 1, label: "1 €" },
  { key: "0.5", value: 0.5, label: "0,50 €" },
  { key: "0.2", value: 0.2, label: "0,20 €" },
  { key: "0.1", value: 0.1, label: "0,10 €" },
  { key: "0.05", value: 0.05, label: "0,05 €" },
  { key: "0.02", value: 0.02, label: "0,02 €" },
  { key: "0.01", value: 0.01, label: "0,01 €" },
];

/** Seuil de tolérance sur H (Règle 6) : au-delà, c'est une erreur, pas un écart. */
export const TOLERANCE_H = 2;
