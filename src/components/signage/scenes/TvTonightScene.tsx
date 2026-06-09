import { useState } from "react";
import { TV_TONIGHT, TV_KIND_COLORS } from "@/data/tv-tonight";
import { useTf1Tonight, type Tf1Program } from "@/hooks/useTf1Tonight";

const VISIBLE = 5;

// Map approximative du format programme-tv.net vers nos couleurs de kind
// (les kinds éditoriaux sont assez génériques, on retombe sur DOCUMENTAIRE en cas
// de format inconnu).
const formatToKind = (format?: string) => {
  if (!format) return "DOCUMENTAIRE" as const;
  const f = format.toLowerCase();
  if (f.includes("série")) return "SÉRIE" as const;
  if (f.includes("film")) return "DOCUMENTAIRE" as const; // pas de FILM dans nos couleurs, on prend DOC
  if (f.includes("doc")) return "DOCUMENTAIRE" as const;
  if (f.includes("magazine") || f.includes("infos") || f.includes("émission") || f.includes("emission"))
    return "ÉMISSION" as const;
  if (f.includes("musique") || f.includes("concert")) return "CONCERT" as const;
  if (f.includes("débat") || f.includes("politique")) return "DÉBAT" as const;
  return "ÉMISSION" as const;
};

const Tf1View = ({ programs, fetchedAt }: { programs: Tf1Program[]; fetchedAt: string }) => {
  const visible = programs.slice(0, VISIBLE);
  const updated = new Date(fetchedAt);
  const updatedLabel = updated.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="absolute inset-0 px-28 pb-24 pt-36" style={{ background: "linear-gradient(135deg, #1A1410 0%, #2E2419 60%, #0E0805 100%)" }}>
      <div
        className="pointer-events-none absolute"
        style={{ top: "-15%", left: "-10%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 65%)" }}
      />
      <div className="relative">
        <div className="flex items-center gap-5">
          <div style={{ fontSize: 54 }}>📺</div>
          <div style={{ width: 96, height: 2, backgroundColor: "hsl(var(--gold))" }} />
          <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.4em", color: "hsl(var(--gold))" }}>
            Ce soir sur TF1 · {updatedLabel}
          </div>
        </div>
        <h2 className="mt-8 font-serif-display leading-[1]" style={{ fontSize: 110, color: "hsl(var(--linen))" }}>
          <span className="font-semibold">La grille</span>{" "}
          <span className="italic font-light" style={{ color: "hsl(var(--gold-lt))" }}>du soir.</span>
        </h2>
        <p className="mt-6 max-w-[1240px] font-serif-display italic" style={{ fontSize: 32, lineHeight: 1.3, color: "rgba(242,237,228,0.7)" }}>
          Le programme TF1 du soir, mis à jour chaque matin.
        </p>

        <div className="mt-12 grid grid-cols-5 gap-6" style={{ height: 540 }}>
          {visible.map((p, i) => {
            const kind = formatToKind(p.format);
            const c = TV_KIND_COLORS[kind];
            return (
              <div
                key={p.id}
                className="flex flex-col rounded-sm p-7"
                style={{
                  backgroundColor: "rgba(242,237,228,0.06)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.12}s both`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-sans-ui uppercase" style={{ fontSize: 13, letterSpacing: "0.32em", color: "hsl(var(--gold))" }}>
                    {p.start}
                  </div>
                  {p.format && (
                    <div
                      className="font-sans-ui uppercase rounded-sm px-2 py-1"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.22em",
                        backgroundColor: c.bg,
                        color: c.fg,
                        border: `1px solid ${c.border}`,
                      }}
                    >
                      {p.format}
                    </div>
                  )}
                </div>
                <div className="mt-4 font-serif-display leading-tight" style={{ fontSize: 34, fontWeight: 600, color: "hsl(var(--linen))" }}>
                  TF1
                </div>
                <div className="mt-2" style={{ width: 36, height: 1, backgroundColor: "hsl(var(--gold) / 0.6)" }} />
                <div className="mt-4 font-serif-display italic" style={{ fontSize: 22, lineHeight: 1.25, color: "rgba(242,237,228,0.95)", fontWeight: 400 }}>
                  {p.title}
                </div>
                {p.subtitle && (
                  <div className="mt-2 font-serif-display" style={{ fontSize: 17, lineHeight: 1.35, color: "rgba(242,237,228,0.7)" }}>
                    {p.subtitle}
                  </div>
                )}
                <div
                  className="font-sans-ui uppercase"
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.32em",
                    color: "rgba(201,168,76,0.85)",
                    lineHeight: 1.3,
                    borderTop: "1px solid rgba(201,168,76,0.2)",
                    marginTop: "auto",
                    paddingTop: 16,
                  }}
                >
                  {p.duration ?? ""}
                  {p.rebroadcast && (
                    <span style={{ marginLeft: 10, color: "rgba(242,237,228,0.5)" }}>· Rediff.</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 font-sans-ui uppercase text-center" style={{ fontSize: 14, letterSpacing: "0.42em", color: "rgba(201,168,76,0.55)" }}>
          Grille TF1 · Source programme-tv.net · Mise à jour quotidienne
        </div>
      </div>
    </div>
  );
};

// Vue éditoriale (fallback quand tf1.json n'est pas dispo)
const EditorialView = () => {
  const [pick] = useState(() => {
    const arr = [...TV_TONIGHT];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, VISIBLE);
  });

  return (
    <div className="absolute inset-0 px-28 pb-24 pt-36" style={{ background: "linear-gradient(135deg, #1A1410 0%, #2E2419 60%, #0E0805 100%)" }}>
      <div
        className="pointer-events-none absolute"
        style={{ top: "-15%", left: "-10%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 65%)" }}
      />
      <div className="relative">
        <div className="flex items-center gap-5">
          <div style={{ fontSize: 54 }}>📺</div>
          <div style={{ width: 96, height: 2, backgroundColor: "hsl(var(--gold))" }} />
          <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.4em", color: "hsl(var(--gold))" }}>
            Café de spécialité & vin nature · Ce soir
          </div>
        </div>
        <h2 className="mt-8 font-serif-display leading-[1]" style={{ fontSize: 110, color: "hsl(var(--linen))" }}>
          <span className="font-semibold">Cinq programmes</span>{" "}
          <span className="italic font-light" style={{ color: "hsl(var(--gold-lt))" }}>pour les esprits curieux.</span>
        </h2>
        <p className="mt-6 max-w-[1240px] font-serif-display italic" style={{ fontSize: 32, lineHeight: 1.3, color: "rgba(242,237,228,0.7)" }}>
          Notre sélection éditoriale permanente — autour du café d'exception, du vin vivant et des terroirs.
        </p>

        <div className="mt-12 grid grid-cols-5 gap-6" style={{ height: 540 }}>
          {pick.map((p, i) => {
            const c = TV_KIND_COLORS[p.kind];
            return (
              <div
                key={`${p.channel}-${p.title}`}
                className="flex flex-col rounded-sm p-7"
                style={{
                  backgroundColor: "rgba(242,237,228,0.06)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.12}s both`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-sans-ui uppercase" style={{ fontSize: 13, letterSpacing: "0.32em", color: "hsl(var(--gold))" }}>
                    {p.slot}
                  </div>
                  <div
                    className="font-sans-ui uppercase rounded-sm px-2 py-1"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      backgroundColor: c.bg,
                      color: c.fg,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {p.kind}
                  </div>
                </div>
                <div className="mt-4 font-serif-display leading-tight" style={{ fontSize: 34, fontWeight: 600, color: "hsl(var(--linen))" }}>
                  {p.channel}
                </div>
                <div className="mt-2" style={{ width: 36, height: 1, backgroundColor: "hsl(var(--gold) / 0.6)" }} />
                <div className="mt-4 font-serif-display italic" style={{ fontSize: 22, lineHeight: 1.25, color: "rgba(242,237,228,0.95)", fontWeight: 400 }}>
                  {p.title}
                </div>
                <div className="mt-4 font-serif-display" style={{ fontSize: 17, lineHeight: 1.35, color: "rgba(242,237,228,0.72)" }}>
                  {p.note}
                </div>
                <div
                  className="font-serif-display italic"
                  style={{ fontSize: 16, color: "rgba(201,168,76,0.85)", lineHeight: 1.3, borderTop: "1px solid rgba(201,168,76,0.2)", marginTop: "auto", paddingTop: 16 }}
                >
                  ✦ <span style={{ marginLeft: 4 }}>{p.pick}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 font-sans-ui uppercase text-center" style={{ fontSize: 16, letterSpacing: "0.42em", color: "rgba(201,168,76,0.7)" }}>
          Maison Maitre · Le bon goût, du grain au verre
        </div>
      </div>
    </div>
  );
};

export const TvTonightScene = () => {
  const tf1 = useTf1Tonight();
  if (tf1 && tf1.primeTime.length > 0) {
    return <Tf1View programs={tf1.primeTime} fetchedAt={tf1.fetchedAt} />;
  }
  return <EditorialView />;
};
