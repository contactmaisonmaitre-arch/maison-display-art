import { describe, it, expect } from "vitest";
import { computeCaisse } from "./compute";
import type { CaisseInput } from "./types";

// Cas de référence = caisse_input.json du kit (fiche du 01-07-2026).
// Attendus repris du récap console de generer_caisse.py :
//   C = 486.85, D = 486.85, E = 358.55, F = 128.30, G = 127.50, H = +0.80 (OK)
const reference: CaisseInput = {
  date: "01-07-2026",
  billets: { "100": 0, "50": 1, "20": 7, "10": 20, "5": 7 },
  pieces: { "2": 12, "1": 16, "0.5": 19, "0.2": 50, "0.1": 13, "0.05": 3, "0.02": 14, "0.01": 62 },
  cheques: [],
  A_a_transmettre: 0,
  B_rouleaux: 0,
  E_jour_precedent_D: 958.55,
  depot_jour_precedent: 600,
  E_prime_depose: 0,
  G_ticket_especes_net: 127.5,
};

describe("computeCaisse — cas de référence 01-07-2026", () => {
  const r = computeCaisse(reference);

  it("C (Total du Jour) = espèces comptées", () => {
    expect(r.totalBillets).toBe(425);
    expect(r.totalPieces).toBeCloseTo(61.85, 2);
    expect(r.C).toBeCloseTo(486.85, 2);
  });

  it("D = A + B + C", () => {
    expect(r.D).toBeCloseTo(486.85, 2);
  });

  it("E = report réel (dépôt de la veille déduit)", () => {
    expect(r.E).toBeCloseTo(358.55, 2); // 958.55 − 600
  });

  it("F = D − E − E'", () => {
    expect(r.F).toBeCloseTo(128.3, 2);
  });

  it("H = F − G ≈ +0,80 et caisse OK", () => {
    expect(r.H).toBeCloseTo(0.8, 2);
    expect(r.ok).toBe(true);
  });
});

describe("computeCaisse — règles métier", () => {
  it("Règle 2 : le chèque n'entre jamais dans C", () => {
    const avec = computeCaisse({ ...reference, cheques: [{ label: "chèque client", montant: 27.25 }] });
    const sans = computeCaisse(reference);
    expect(avec.C).toBeCloseTo(sans.C, 2);
    expect(avec.totalCheques).toBeCloseTo(27.25, 2);
  });

  it("Règle 5 : A reste dans D, E' en sort", () => {
    const r = computeCaisse({ ...reference, A_a_transmettre: 100, E_prime_depose: 50 });
    expect(r.D).toBeCloseTo(586.85, 2); // 486.85 + 100
    expect(r.F).toBeCloseTo(586.85 - 358.55 - 50, 2);
  });

  it("Règle 6 : |H| > 2 € => caisse non OK", () => {
    const r = computeCaisse({ ...reference, G_ticket_especes_net: 120 });
    expect(r.H).toBeCloseTo(8.3, 2);
    expect(r.ok).toBe(false);
  });

  it("pas d'erreur de flottant sur les petites pièces", () => {
    const r = computeCaisse({
      ...reference,
      billets: { "100": 0, "50": 0, "20": 0, "10": 0, "5": 0 },
      pieces: { "2": 0, "1": 0, "0.5": 0, "0.2": 0, "0.1": 3, "0.05": 0, "0.02": 0, "0.01": 0 },
      E_jour_precedent_D: 0,
      depot_jour_precedent: 0,
      G_ticket_especes_net: 0,
    });
    expect(r.C).toBe(0.3); // 3 × 0,10 exactement, pas 0.30000000000000004
  });
});
