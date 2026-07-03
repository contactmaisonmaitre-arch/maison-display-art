// Supabase Edge Function (Deno) — envoie le rapport de caisse par email via Resend.
//
// Secrets à définir côté Supabase (Lovable → Supabase → Edge Functions → Secrets) :
//   RESEND_API_KEY   clé API Resend (https://resend.com/api-keys)
//   CAISSE_FROM      expéditeur vérifié chez Resend, ex. "Maison Maitre <caisse@ton-domaine.fr>"
//                    (à défaut, "onboarding@resend.dev" pour les tests)
//   CAISSE_TO        (optionnel) destinataire par défaut si le client n'en fournit pas
//
// Déploiement : Lovable gère le déploiement des fonctions du dossier supabase/functions/.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  to?: string;
  subject?: string;
  html?: string;
  text?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    return json({ error: "RESEND_API_KEY manquant côté Supabase." }, 500);
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Corps JSON invalide." }, 400);
  }

  const to = body.to || Deno.env.get("CAISSE_TO") || "contactmaximemaitre@gmail.com";
  const from = Deno.env.get("CAISSE_FROM") || "Maison Maitre <onboarding@resend.dev>";
  const subject = body.subject || "Caisse Maison Maitre";

  if (!body.html && !body.text) {
    return json({ error: "Rien à envoyer (html/text vides)." }, 400);
  }

  const resendRes = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html: body.html,
      text: body.text,
    }),
  });

  const detail = await resendRes.json().catch(() => ({}));
  if (!resendRes.ok) {
    return json({ error: "Resend a refusé l'envoi.", detail }, 502);
  }

  return json({ ok: true, id: (detail as { id?: string }).id ?? null }, 200);
});

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
