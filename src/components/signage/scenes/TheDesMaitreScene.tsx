import { useEffect, useState } from "react";
import { useRemoteJson } from "@/hooks/useRemoteJson";
import fallbackData from "../../../../public/data/the-des-maitre.json";

interface Tea {
  nom: string;
  famille?: string;
  prix?: string;
  format?: string;
  img: string;
}

export interface TheDesMaitreJson {
  eyebrow?: string;
  title?: string;
  titleItalic?: string;
  coffret?: { nom: string; prix?: string; contenu?: string[]; img?: string } | null;
  teas: Tea[];
  club?: string;
  site?: string;
}

const PER_PAGE = 4;
const PAGE_MS = 6000;
const GOLD = "hsl(var(--gold))";
const CREAM = "rgba(244,240,231,0.85)";

/** 4 thés à partir de `page`, en reprenant au début de la liste si besoin. */
export const teasForPage = (teas: Tea[], page: number): Tea[] =>
  teas.length <= PER_PAGE ? teas : Array.from({ length: PER_PAGE }, (_, i) => teas[(page * PER_PAGE + i) % teas.length]);

/** Scène « Thé des Maitre » : le coffret de Noël et les thés qui défilent par 4 (public/data/the-des-maitre.json). */
export const TheDesMaitreScene = ({ active = true }: { active?: boolean }) => {
  const remote = useRemoteJson<TheDesMaitreJson>("data/the-des-maitre.json", 30 * 60 * 1000);
  const data: TheDesMaitreJson = remote?.teas?.length ? remote : (fallbackData as TheDesMaitreJson);

  // Une nouvelle page de thés toutes les 6 s tant que la scène est à l'écran ;
  // on repart de la première à chaque passage (et on relance les animations).
  const [page, setPage] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!active) return;
    setPage(0);
    setRun((r) => r + 1);
    const id = window.setInterval(() => setPage((p) => p + 1), PAGE_MS);
    return () => window.clearInterval(id);
  }, [active]);

  const teas = teasForPage(data.teas, page);
  const c = data.coffret;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(ellipse at 30% 40%, #4A1422 0%, #2A0A12 75%)" }}>
      <div key={run} className="relative flex h-full" style={{ paddingTop: 118 }}>
        {/* Colonne gauche : la marque, le coffret, le Club, le site */}
        <div className="flex shrink-0 flex-col justify-center" style={{ width: 660, padding: "0 40px 30px 90px" }}>
          <div style={{ animation: "mm-slide-up 1s ease-out 0.1s both" }}>
            {data.eyebrow && (
              <div className="mm-eyebrow" style={{ fontSize: 15, color: GOLD, letterSpacing: "0.38em" }}>
                {data.eyebrow}
              </div>
            )}
            <h1 className="font-serif-display mt-4" style={{ fontSize: 96, lineHeight: 0.95, color: "#FFFFFF" }}>
              <span className="font-light">{data.title} </span>
              <span className="font-semibold italic" style={{ color: GOLD }}>
                {data.titleItalic}
              </span>
            </h1>
          </div>

          {c && (
            <div className="mt-10 flex items-center" style={{ gap: 26, animation: "mm-slide-up 1s ease-out 0.5s both" }}>
              {c.img && (
                <div className="shrink-0 overflow-hidden" style={{ width: 210, height: 197, borderRadius: 16, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(232,201,169,0.4)" }}>
                  <img src={c.img} alt={c.nom} className="h-full w-full" style={{ objectFit: "cover" }} />
                </div>
              )}
              <div className="min-w-0">
                <div className="font-serif-display italic" style={{ fontSize: 42, lineHeight: 1.05, color: "#FFFFFF" }}>
                  {c.nom}
                </div>
                {c.prix && (
                  <div className="font-serif-display mt-2" style={{ fontSize: 40, color: GOLD, fontWeight: 600 }}>
                    {c.prix}
                  </div>
                )}
                {c.contenu && (
                  <div className="font-serif-display italic mt-2" style={{ fontSize: 21, lineHeight: 1.35, color: CREAM }}>
                    {c.contenu.join(" · ")}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col" style={{ gap: 14, animation: "mm-slide-up 1s ease-out 0.9s both" }}>
            {data.club && (
              <div className="font-serif-display" style={{ fontSize: 24, lineHeight: 1.3, color: "#FFFFFF", paddingLeft: 18, borderLeft: `3px solid ${GOLD}` }}>
                {data.club}
              </div>
            )}
            {data.site && (
              <div className="font-sans-ui uppercase" style={{ fontSize: 14, letterSpacing: "0.26em", color: "hsl(var(--gold-lt))", paddingLeft: 21 }}>
                {data.site}
              </div>
            )}
          </div>
        </div>

        {/* Les thés, par 4, qui se renouvellent */}
        <div className="flex flex-1 items-center justify-center" style={{ paddingRight: 90, paddingBottom: 30 }}>
        <div key={page} className="flex items-start justify-center" style={{ gap: 34 }}>
          {teas.map((t, i) => (
            <div key={`${t.nom}-${i}`} className="flex flex-col items-center text-center" style={{ width: 268, animation: `mm-slide-up 0.9s ease-out ${0.15 + i * 0.15}s both` }}>
              <div
                className="relative overflow-hidden"
                style={{ width: 268, height: 450, borderRadius: 18, background: "#F4F0E7", boxShadow: "0 40px 70px -25px rgba(0,0,0,0.8), 0 0 0 1px rgba(232,201,169,0.35)" }}
              >
                <img
                  src={t.img}
                  alt={t.nom}
                  className="absolute inset-0 h-full w-full"
                  style={{ objectFit: "cover", animation: `mm-tdm-zoom ${PAGE_MS}ms ease-out both` }}
                />
              </div>
              <div className="font-serif-display italic mt-5" style={{ fontSize: 31, lineHeight: 1.08, color: "#FFFFFF" }}>
                {t.nom}
              </div>
              {t.famille && (
                <div className="font-sans-ui uppercase mt-2" style={{ fontSize: 12, letterSpacing: "0.22em", color: "hsl(var(--gold-lt))" }}>
                  {t.famille}
                </div>
              )}
              {t.prix && (
                <div className="font-serif-display mt-2" style={{ fontSize: 28, color: GOLD }}>
                  {t.prix}
                  {t.format && <span style={{ fontSize: 20, color: CREAM }}> · {t.format}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};
