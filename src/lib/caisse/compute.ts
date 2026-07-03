// Calcul de la caisse — réplique exacte de generer_caisse.py (bloc A → H),
// mais en arithmétique entière (centimes) pour éviter les erreurs de flottant.
// Voir les règles métier dans caisse-maison-maitre/CLAUDE.md.

import { BILLETS, PIECES, TOLERANCE_H } from "./denominations";
import type { CaisseInput, CaisseResult } from "./types";

/** Convertit un montant en euros vers des centimes entiers (arrondi au centime). */
const toCents = (euros: number): number => Math.round((Number(euros) || 0) * 100);

/** Convertit des centimes entiers vers des euros. */
const toEuros = (cents: number): number => cents / 100;

/** Somme en centimes d'un jeu de coupures × quantités saisies. */
const sumDenoms = (
  denoms: typeof BILLETS,
  quantities: Record<string, number>,
): number =>
  denoms.reduce((cents, d) => {
    const qty = Math.max(0, Math.floor(Number(quantities?.[d.key]) || 0));
    return cents + qty * toCents(d.value);
  }, 0);

/**
 * Calcule C, D, E, F, G, H à partir des saisies du jour.
 * Le chèque n'entre jamais dans C (Règle 2) ; il n'est remonté qu'à titre informatif.
 */
export function computeCaisse(input: CaisseInput): CaisseResult {
  const billetsCents = sumDenoms(BILLETS, input.billets);
  const piecesCents = sumDenoms(PIECES, input.pieces);

  // C = espèces comptées (billets + pièces uniquement).
  const cCents = billetsCents + piecesCents;

  // D = A + B + C.
  const dCents = toCents(input.A_a_transmettre) + toCents(input.B_rouleaux) + cCents;

  // E = report réel : D de la veille moins ce qui a été déposé la veille (Règle 4).
  const eCents = toCents(input.E_jour_precedent_D) - toCents(input.depot_jour_precedent);

  // E' = déposé aujourd'hui (Règle 5).
  const ePrimeCents = toCents(input.E_prime_depose);

  // F = D − E − E'.
  const fCents = dCents - eCents - ePrimeCents;

  // G = ticket espèces net (Règle 3).
  const gCents = toCents(input.G_ticket_especes_net);

  // H = F − G = écart de caisse (doit être ≈ 0, Règle 6).
  const hCents = fCents - gCents;

  const chequesCents = (input.cheques ?? []).reduce(
    (cents, ch) => cents + toCents(ch.montant),
    0,
  );

  return {
    totalBillets: toEuros(billetsCents),
    totalPieces: toEuros(piecesCents),
    totalCheques: toEuros(chequesCents),
    C: toEuros(cCents),
    D: toEuros(dCents),
    E: toEuros(eCents),
    Eprime: toEuros(ePrimeCents),
    F: toEuros(fCents),
    G: toEuros(gCents),
    H: toEuros(hCents),
    ok: Math.abs(hCents) <= toCents(TOLERANCE_H),
  };
}
