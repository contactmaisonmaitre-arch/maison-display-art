// Construction du rapport de caisse — texte + HTML — à partir des saisies et du calcul.
// Utilisé pour l'aperçu à l'écran et pour le corps de l'email (Edge Function Resend).

import { BILLETS, PIECES } from "./denominations";
import type { CaisseInput, CaisseResult } from "./types";

/** Formate un montant en euros à la française : "1 234,56 €". */
export function euro(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Montant signé (pour H) : "+0,80 €" / "−0,51 €". */
export function euroSigned(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${euro(Math.abs(n))}`;
}

export interface ReportBundle {
  subject: string;
  text: string;
  html: string;
}

const rows = (denoms: typeof BILLETS, quantities: Record<string, number>) =>
  denoms
    .map((d) => ({ d, qty: Math.max(0, Math.floor(Number(quantities?.[d.key]) || 0)) }))
    .filter(({ qty }) => qty > 0);

/** Construit le sujet, le corps texte et le corps HTML de l'email de caisse. */
export function buildReport(input: CaisseInput, r: CaisseResult): ReportBundle {
  const subject = `Caisse Maison Maitre — ${input.date} — H ${euroSigned(r.H)} ${r.ok ? "OK" : "à vérifier"}`;

  const billetLines = rows(BILLETS, input.billets);
  const pieceLines = rows(PIECES, input.pieces);
  const cheques = input.cheques ?? [];

  // --- Version texte (fallback mail / lisibilité) ---
  const txt: string[] = [];
  txt.push(`CAISSE MAISON MAITRE — ${input.date}`);
  txt.push("");
  txt.push("Billets :");
  billetLines.forEach(({ d, qty }) => txt.push(`  ${d.label.padEnd(8)} × ${qty}  = ${euro(qty * d.value)}`));
  txt.push(`  Sous-total billets = ${euro(r.totalBillets)}`);
  txt.push("");
  txt.push("Pièces :");
  pieceLines.forEach(({ d, qty }) => txt.push(`  ${d.label.padEnd(8)} × ${qty}  = ${euro(qty * d.value)}`));
  txt.push(`  Sous-total pièces = ${euro(r.totalPieces)}`);
  txt.push("");
  if (cheques.length) {
    txt.push("Chèques (hors caisse) :");
    cheques.forEach((c) => txt.push(`  ${c.label} = ${euro(c.montant)}`));
    txt.push(`  Total chèques = ${euro(r.totalCheques)}`);
    txt.push("");
  }
  txt.push(`C  Total du Jour (espèces)      = ${euro(r.C)}`);
  txt.push(`   A espèces à transmettre       = ${euro(input.A_a_transmettre)}`);
  txt.push(`   B rouleaux / non ouverts      = ${euro(input.B_rouleaux)}`);
  txt.push(`D  Total CAISSE (A+B+C)          = ${euro(r.D)}`);
  txt.push(`E  Report réel (veille − dépôt)  = ${euro(r.E)}`);
  txt.push(`E' Déposé aujourd'hui            = ${euro(r.Eprime)}`);
  txt.push(`F  Différence (D−E−E')           = ${euro(r.F)}`);
  txt.push(`G  Ticket espèces net            = ${euro(r.G)}`);
  txt.push(`H  Écart de caisse (F−G)         = ${euroSigned(r.H)}  ${r.ok ? "OK ✅" : "⚠️ à vérifier"}`);

  // --- Version HTML ---
  const tr = (label: string, value: string, opts: { strong?: boolean; bg?: string } = {}) =>
    `<tr>
       <td style="padding:6px 10px;border:1px solid #e0d8c8;${opts.strong ? "font-weight:700;" : ""}${opts.bg ? `background:${opts.bg};` : ""}">${label}</td>
       <td style="padding:6px 10px;border:1px solid #e0d8c8;text-align:right;font-variant-numeric:tabular-nums;${opts.strong ? "font-weight:700;" : ""}${opts.bg ? `background:${opts.bg};` : ""}">${value}</td>
     </tr>`;

  const denomTable = (title: string, lines: ReturnType<typeof rows>, subtotal: number) => {
    if (!lines.length) return "";
    const body = lines
      .map(({ d, qty }) => tr(`${d.label} × ${qty}`, euro(qty * d.value)))
      .join("");
    return `<h3 style="margin:18px 0 6px;font-size:14px;color:#5b4a35;">${title}</h3>
      <table style="border-collapse:collapse;width:100%;font-size:13px;">${body}${tr(
        `Sous-total ${title.toLowerCase()}`,
        euro(subtotal),
        { strong: true, bg: "#f3ede0" },
      )}</table>`;
  };

  const chequesHtml = cheques.length
    ? `<h3 style="margin:18px 0 6px;font-size:14px;color:#5b4a35;">Chèques <span style="font-weight:400;color:#8a7a60;">(hors caisse physique)</span></h3>
       <table style="border-collapse:collapse;width:100%;font-size:13px;">${cheques
         .map((c) => tr(c.label, euro(c.montant)))
         .join("")}${tr("Total chèques", euro(r.totalCheques), { strong: true, bg: "#f3ede0" })}</table>`
    : "";

  const statusColor = r.ok ? "#3f6d3f" : "#9a2f2f";
  const statusBg = r.ok ? "#e6efe0" : "#f6e2e0";

  const html = `<!doctype html>
<div style="font-family:Georgia,'Times New Roman',serif;max-width:560px;margin:0 auto;color:#2b2216;">
  <div style="border-bottom:2px solid #c9a84c;padding-bottom:10px;margin-bottom:6px;">
    <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#8a7a60;">Maison Maitre</div>
    <div style="font-size:22px;font-weight:700;">Caisse du ${input.date}</div>
  </div>

  ${denomTable("Billets", billetLines, r.totalBillets)}
  ${denomTable("Pièces", pieceLines, r.totalPieces)}
  ${chequesHtml}

  <h3 style="margin:20px 0 6px;font-size:14px;color:#5b4a35;">Récapitulatif</h3>
  <table style="border-collapse:collapse;width:100%;font-size:13px;">
    ${tr("C — Total du Jour (espèces)", euro(r.C), { strong: true })}
    ${tr("A — Espèces à transmettre", euro(input.A_a_transmettre))}
    ${tr("B — Rouleaux / non ouverts", euro(input.B_rouleaux))}
    ${tr("D — Total CAISSE (A+B+C)", euro(r.D), { strong: true, bg: "#f3ede0" })}
    ${tr("E — Report réel (veille − dépôt)", euro(r.E))}
    ${tr("E' — Déposé aujourd'hui", euro(r.Eprime))}
    ${tr("F — Différence (D−E−E')", euro(r.F), { strong: true })}
    ${tr("G — Ticket espèces net", euro(r.G))}
  </table>

  <div style="margin-top:16px;padding:14px 16px;border-radius:8px;background:${statusBg};border:1px solid ${statusColor}33;">
    <span style="font-size:13px;color:#5b4a35;">H — Écart de caisse (F − G)</span>
    <div style="font-size:26px;font-weight:700;color:${statusColor};font-variant-numeric:tabular-nums;">
      ${euroSigned(r.H)} &nbsp;<span style="font-size:14px;">${r.ok ? "OK ✅" : "⚠️ à vérifier"}</span>
    </div>
  </div>

  <p style="margin-top:18px;font-size:11px;color:#8a7a60;font-style:italic;">
    Chèque hors total caisse · G = espèces net du ticket · E = report réel (dépôt de la veille déduit).
    Pour demain : E (report) = D d'aujourd'hui (${euro(r.D)}), dépôt de la veille = E' d'aujourd'hui (${euro(r.Eprime)}).
  </p>
</div>`;

  return { subject, text: txt.join("\n"), html };
}
