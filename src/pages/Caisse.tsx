import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Banknote, Coins, Plus, Trash2, Send, RotateCcw, Mail, CheckCircle2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { BILLETS, PIECES } from "@/lib/caisse/denominations";
import { computeCaisse } from "@/lib/caisse/compute";
import { buildReport, euro, euroSigned } from "@/lib/caisse/report";
import { sendReport, backendConfigured, DEFAULT_RECIPIENT } from "@/lib/caisse/sendReport";
import { loadChain, loadDraft, saveChain, saveDraft } from "@/lib/caisse/storage";
import { todayFr } from "@/lib/caisse/date";
import type { CaisseInput, Cheque } from "@/lib/caisse/types";

const zeroQuantities = (keys: { key: string }[]) =>
  Object.fromEntries(keys.map((d) => [d.key, 0])) as Record<string, number>;

function freshInput(): CaisseInput {
  const chain = loadChain();
  return {
    date: todayFr(),
    billets: zeroQuantities(BILLETS),
    pieces: zeroQuantities(PIECES),
    cheques: [],
    A_a_transmettre: 0,
    B_rouleaux: 0,
    // Enchaînement automatique (Règle 4/5) : le D validé hier devient le report d'aujourd'hui,
    // le E' déposé hier devient le dépôt de la veille à déduire.
    E_jour_precedent_D: chain?.D ?? 0,
    depot_jour_precedent: chain?.Eprime ?? 0,
    E_prime_depose: 0,
    G_ticket_especes_net: 0,
  };
}

/** Champ numérique compact, aligné à droite, virgule ou point acceptés. */
function NumField({
  value,
  onChange,
  step = "1",
  className = "",
  ariaLabel,
}: {
  value: number;
  onChange: (n: number) => void;
  step?: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      min={0}
      aria-label={ariaLabel}
      value={Number.isFinite(value) ? value : 0}
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => {
        const v = e.target.value.replace(",", ".");
        onChange(v === "" ? 0 : Number(v));
      }}
      className={`h-10 w-full rounded-md border border-warm/60 bg-white/80 px-3 text-right font-mono-ui text-espresso outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/40 ${className}`}
    />
  );
}

const Caisse = () => {
  const [input, setInput] = useState<CaisseInput>(() => loadDraft() ?? freshInput());
  const [sending, setSending] = useState(false);

  const result = useMemo(() => computeCaisse(input), [input]);

  // Sauvegarde du brouillon à chaque frappe.
  useEffect(() => {
    saveDraft(input);
  }, [input]);

  const patch = (p: Partial<CaisseInput>) => setInput((prev) => ({ ...prev, ...p }));
  const setQty = (kind: "billets" | "pieces", key: string, n: number) =>
    setInput((prev) => ({ ...prev, [kind]: { ...prev[kind], [key]: Math.max(0, Math.floor(n)) } }));

  const addCheque = () => patch({ cheques: [...input.cheques, { label: "Chèque client", montant: 0 }] });
  const updateCheque = (i: number, p: Partial<Cheque>) =>
    patch({ cheques: input.cheques.map((c, idx) => (idx === i ? { ...c, ...p } : c)) });
  const removeCheque = (i: number) => patch({ cheques: input.cheques.filter((_, idx) => idx !== i) });

  const resetDay = () => {
    setInput(freshInput());
    toast.info("Nouvelle caisse", { description: "Report pré-rempli depuis la dernière caisse validée." });
  };

  const onValidate = async () => {
    if (!result.ok) {
      const proceed = window.confirm(
        `⚠️ Écart H = ${euroSigned(result.H)} (> 2 €).\n` +
          "C'est probablement une erreur (chèque dans C ? dépôt de la veille ? A/E' oublié ?), pas un simple écart.\n\n" +
          "Envoyer quand même le rapport ?",
      );
      if (!proceed) return;
    }
    setSending(true);
    const report = buildReport(input, result);
    const outcome = await sendReport(report, DEFAULT_RECIPIENT);
    setSending(false);

    if (outcome.ok) {
      saveChain(input, result);
      if (outcome.via === "backend") {
        toast.success("Caisse envoyée ✅", { description: `Rapport expédié à ${DEFAULT_RECIPIENT}.` });
      } else {
        toast.success("Rapport prêt", { description: "Votre client mail s'ouvre — appuyez sur Envoyer." });
      }
    } else {
      toast.error("Échec de l'envoi", { description: outcome.error });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#161616] py-8 px-4 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* En-tête */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mm-eyebrow text-gold text-xs">Maison Maitre</div>
            <h1 className="font-serif-display text-3xl text-cream md:text-4xl">Caisse du jour</h1>
          </div>
          <div className="flex items-center gap-2">
            <label className="mm-eyebrow text-mink text-[10px]">Date</label>
            <input
              value={input.date}
              onChange={(e) => patch({ date: e.target.value })}
              className="h-10 w-36 rounded-md border border-warm/40 bg-white/90 px-3 text-center font-mono-ui text-espresso outline-none focus:border-gold"
            />
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          {/* Colonne saisie */}
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Billets */}
              <Card className="border-warm/40 bg-cream/95">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-serif-classic text-xl text-espresso">
                    <Banknote className="h-5 w-5 text-gold" /> Billets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {BILLETS.map((d) => {
                    const qty = input.billets[d.key] ?? 0;
                    return (
                      <div key={d.key} className="grid grid-cols-[64px_1fr_92px] items-center gap-2">
                        <span className="font-mono-ui text-sm font-semibold text-espresso">{d.label}</span>
                        <NumField value={qty} onChange={(n) => setQty("billets", d.key, n)} ariaLabel={`Billets ${d.label}`} />
                        <span className="text-right font-mono-ui text-sm text-taupe">{euro(qty * d.value)}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between border-t border-warm/40 pt-2 text-sm">
                    <span className="font-semibold text-espresso">Sous-total</span>
                    <span className="font-mono-ui font-semibold text-espresso">{euro(result.totalBillets)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Pièces */}
              <Card className="border-warm/40 bg-cream/95">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-serif-classic text-xl text-espresso">
                    <Coins className="h-5 w-5 text-gold" /> Pièces
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {PIECES.map((d) => {
                    const qty = input.pieces[d.key] ?? 0;
                    return (
                      <div key={d.key} className="grid grid-cols-[64px_1fr_92px] items-center gap-2">
                        <span className="font-mono-ui text-sm font-semibold text-espresso">{d.label}</span>
                        <NumField value={qty} onChange={(n) => setQty("pieces", d.key, n)} ariaLabel={`Pièces ${d.label}`} />
                        <span className="text-right font-mono-ui text-sm text-taupe">{euro(qty * d.value)}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between border-t border-warm/40 pt-2 text-sm">
                    <span className="font-semibold text-espresso">Sous-total</span>
                    <span className="font-mono-ui font-semibold text-espresso">{euro(result.totalPieces)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chèques */}
            <Card className="border-warm/40 bg-cream/95">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif-classic text-xl text-espresso">Chèques</CardTitle>
                <CardDescription className="text-taupe">
                  Notés à part — n'entrent jamais dans la caisse physique (C).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {input.cheques.length === 0 && <p className="text-sm italic text-mink">Aucun chèque.</p>}
                {input.cheques.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={c.label}
                      onChange={(e) => updateCheque(i, { label: e.target.value })}
                      className="h-10 flex-1 rounded-md border border-warm/60 bg-white/80 px-3 text-espresso outline-none focus:border-gold"
                    />
                    <div className="w-32">
                      <NumField value={c.montant} step="0.01" onChange={(n) => updateCheque(i, { montant: n })} ariaLabel="Montant chèque" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeCheque(i)} aria-label="Supprimer le chèque">
                      <Trash2 className="h-4 w-4 text-wine" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addCheque} className="mt-1 border-warm/60 text-espresso">
                  <Plus className="mr-1 h-4 w-4" /> Ajouter un chèque
                </Button>
              </CardContent>
            </Card>

            {/* Champs A → G */}
            <Card className="border-warm/40 bg-cream/95">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif-classic text-xl text-espresso">Banque &amp; ticket</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field
                  label="A — Espèces à transmettre"
                  hint="Liquide mis de côté pour la banque, encore dans le tiroir (reste dans D)."
                  value={input.A_a_transmettre}
                  step="0.01"
                  onChange={(n) => patch({ A_a_transmettre: n })}
                />
                <Field
                  label="B — Rouleaux / billets non ouverts"
                  value={input.B_rouleaux}
                  step="0.01"
                  onChange={(n) => patch({ B_rouleaux: n })}
                />
                <Field
                  label="E — Total CAISSE de la veille (D)"
                  hint="Pré-rempli depuis la dernière caisse validée."
                  value={input.E_jour_precedent_D}
                  step="0.01"
                  onChange={(n) => patch({ E_jour_precedent_D: n })}
                />
                <Field
                  label="Dépôt effectué la veille"
                  hint="À déduire du report (0 si rien n'a quitté la caisse)."
                  value={input.depot_jour_precedent}
                  step="0.01"
                  onChange={(n) => patch({ depot_jour_precedent: n })}
                />
                <Field
                  label="E' — Déposé à la banque aujourd'hui"
                  value={input.E_prime_depose}
                  step="0.01"
                  onChange={(n) => patch({ E_prime_depose: n })}
                />
                <Field
                  label="G — Ticket espèces NET"
                  hint="Espèces encaissées − rendu monnaie. PAS le Total TTC (carte exclue)."
                  value={input.G_ticket_especes_net}
                  step="0.01"
                  onChange={(n) => patch({ G_ticket_especes_net: n })}
                />
              </CardContent>
            </Card>
          </div>

          {/* Colonne récap (sticky) */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <Card className="mm-glass-dark border-gold/25 text-cream">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif-display text-2xl text-cream">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <Line label="C — Total du Jour (espèces)" value={euro(result.C)} strong />
                <Line label="D — Total CAISSE (A+B+C)" value={euro(result.D)} strong />
                <div className="my-1 h-px bg-gold/20" />
                <Line label="E — Report réel" value={euro(result.E)} />
                <Line label="E' — Déposé aujourd'hui" value={euro(result.Eprime)} />
                <Line label="F — Différence (D−E−E')" value={euro(result.F)} />
                <Line label="G — Ticket espèces net" value={euro(result.G)} />
                {result.totalCheques > 0 && (
                  <Line label="Chèques (hors caisse)" value={euro(result.totalCheques)} muted />
                )}

                {/* Écart H */}
                <div
                  className={`mt-3 rounded-lg border p-4 ${
                    result.ok ? "border-sage/40 bg-sage/15" : "border-wine/50 bg-wine/20"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-cream/70">
                    {result.ok ? (
                      <CheckCircle2 className="h-4 w-4 text-sage" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-wine" />
                    )}
                    H — Écart de caisse (F − G)
                  </div>
                  <div className="mt-1 font-mono-ui text-3xl font-bold tabular-nums">
                    {euroSigned(result.H)}
                  </div>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${result.ok ? "border-sage/50 text-sage" : "border-wine/60 text-wine"}`}
                  >
                    {result.ok ? "Caisse OK" : "À vérifier (> 2 €)"}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <Button
                    onClick={onValidate}
                    disabled={sending}
                    className="w-full bg-gold text-espresso hover:bg-gold-lt"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {sending ? "Envoi…" : "Valider & envoyer la caisse"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetDay}
                    className="w-full border-gold/30 bg-transparent text-cream hover:bg-gold/10"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Nouvelle caisse
                  </Button>
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-cream/60">
                  <Mail className="h-3 w-3" />
                  {backendConfigured()
                    ? `Envoi auto à ${DEFAULT_RECIPIENT}`
                    : "Backend non configuré → ouvre votre client mail"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

function Field({
  label,
  hint,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-espresso">{label}</span>
      <NumField value={value} step={step} onChange={onChange} ariaLabel={label} />
      {hint && <span className="mt-1 block text-xs italic text-taupe">{hint}</span>}
    </label>
  );
}

function Line({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${muted ? "text-cream/50" : "text-cream/80"}`}>{label}</span>
      <span
        className={`font-mono-ui tabular-nums ${strong ? "text-lg font-bold text-gold-lt" : "text-cream"} ${
          muted ? "text-cream/50" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default Caisse;
