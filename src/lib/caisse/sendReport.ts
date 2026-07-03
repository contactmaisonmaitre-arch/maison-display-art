// Envoi du rapport de caisse.
// Chemin principal : Supabase Edge Function `send-caisse-report` -> Resend (envoi auto).
// Fallback : ouvre le client mail (mailto:) pré-rempli si le backend n'est pas configuré.

import type { ReportBundle } from "./report";

/** Destinataire par défaut du rapport quotidien. */
export const DEFAULT_RECIPIENT = "contactmaximemaitre@gmail.com";

export interface SendOutcome {
  /** Canal effectivement utilisé. */
  via: "backend" | "mailto";
  /** true si l'envoi (ou l'ouverture du client mail) a réussi. */
  ok: boolean;
  /** Message d'erreur en cas d'échec du backend. */
  error?: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// Lovable nomme parfois la clé anon « PUBLISHABLE_KEY » : on accepte les deux.
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** Le backend d'envoi auto est-il configuré ? */
export function backendConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/** Ouvre le client mail avec le rapport pré-rempli (fallback / secours). */
export function openMailto(report: ReportBundle, to = DEFAULT_RECIPIENT): void {
  const url =
    `mailto:${encodeURIComponent(to)}` +
    `?subject=${encodeURIComponent(report.subject)}` +
    `&body=${encodeURIComponent(report.text)}`;
  window.location.href = url;
}

/**
 * Envoie le rapport. Si le backend Supabase est configuré, appelle l'Edge Function
 * (envoi auto via Resend). Sinon, bascule sur le client mail local.
 */
export async function sendReport(
  report: ReportBundle,
  to = DEFAULT_RECIPIENT,
): Promise<SendOutcome> {
  if (!backendConfigured()) {
    openMailto(report, to);
    return { via: "mailto", ok: true };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-caisse-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY as string,
      },
      body: JSON.stringify({
        to,
        subject: report.subject,
        html: report.html,
        text: report.text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { via: "backend", ok: false, error: `HTTP ${res.status} ${detail}`.trim() };
    }
    return { via: "backend", ok: true };
  } catch (e) {
    return { via: "backend", ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
