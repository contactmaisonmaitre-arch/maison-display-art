import { useNoel, type NoelListe } from "@/hooks/useNoel";
import { DoubleFilet, FiletTitle, tartanBg } from "../noel/Tartan";

const WINE = "#6B1424";
const INK = "#2A1A1C";
const GOLD = "#C9A45C";
const GOLD_LT = "#D9B865";
const CREAM = "#F6F0E3";

const rise = (delay: number) => ({ animation: `mm-slide-up 0.9s ease-out ${delay}s both` });

const Liste = ({ liste, delay }: { liste: NoelListe; delay: number }) => (
  <div style={{ ...rise(delay), width: "100%" }}>
    <FiletTitle color={GOLD_LT} size={20}>
      {liste.title}
    </FiletTitle>
    {liste.price && (
      <div className="font-serif-display italic text-center" style={{ fontSize: 28, color: "#E6D8C2", marginTop: 6 }}>
        {liste.price}
      </div>
    )}
    <div className="font-serif-display text-center" style={{ marginTop: 12, fontSize: 34, lineHeight: 1.28, color: "#F3E9D8" }}>
      {liste.items.map((it) => (
        <div key={it}>{it}</div>
      ))}
    </div>
  </div>
);

/** Le menu de Noël : les recettes de Noël + la théière de Noël, en tartan. */
export const NoelMenuScene = () => {
  const noel = useNoel();
  return (
    <div className="absolute inset-0 overflow-hidden" style={tartanBg(488)}>
      {/* léger voile pour calmer le tartan derrière les cartes */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 40% 55%, rgba(20,6,10,0.15), rgba(20,6,10,0.55))" }} />

      {/* Carte crème : les recettes */}
      <div
        className="absolute flex flex-col"
        style={{
          left: 90,
          top: 168,
          width: 1080,
          bottom: 96,
          background: CREAM,
          padding: "64px 84px 56px",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
          ...rise(0.1),
        }}
      >
        <DoubleFilet inset={20} />
        <div className="mm-eyebrow" style={{ fontSize: 18, color: WINE, letterSpacing: "0.3em" }}>
          {noel.eyebrow ?? "Noël · Pour accompagner vos fêtes"}
        </div>
        <h2 className="font-serif-display" style={{ marginTop: 14, fontSize: 112, lineHeight: 0.95, color: INK }}>
          <span style={{ fontWeight: 600 }}>Le menu de </span>
          <span className="italic" style={{ color: WINE }}>
            Noël
          </span>
        </h2>
        <div style={{ marginTop: 34 }}>
          <FiletTitle>Nos recettes</FiletTitle>
        </div>
        <div className="flex flex-col" style={{ marginTop: 26, gap: 30 }}>
          {noel.recettes.map((r, i) => (
            <div key={r.name} style={rise(0.45 + i * 0.25)}>
              <div className="flex items-baseline font-serif-display" style={{ gap: 18, fontSize: 56, lineHeight: 1.05, color: INK }}>
                <span style={{ fontWeight: 600 }}>{r.name}</span>
                <span style={{ flexGrow: 1, borderBottom: `2px dotted ${GOLD}`, transform: "translateY(-12px)" }} />
                <span style={{ color: WINE, fontWeight: 600 }}>{r.price}</span>
              </div>
              {r.desc && (
                <div className="font-serif-display italic" style={{ marginTop: 6, fontSize: 31, lineHeight: 1.3, color: "#5A4A44" }}>
                  {r.desc}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mm-eyebrow" style={{ marginTop: "auto", fontSize: 14, color: "#8A7468" }}>
          Prix nets, service compris · Allergènes sur demande
        </div>
      </div>

      {/* Carte velours : la théière de Noël */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          left: 1230,
          top: 168,
          right: 90,
          bottom: 96,
          background: "linear-gradient(200deg, #5A1222 0%, #47121F 55%, #3A0E19 100%)",
          padding: "46px 56px 44px",
          gap: 22,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
          ...rise(0.3),
        }}
      >
        <div aria-hidden className="pointer-events-none absolute" style={{ inset: 20, border: `1px solid ${GOLD}`, opacity: 0.7 }} />
        <img
          src="/brand/logo-white.png"
          alt="Maison Maitre"
          style={{ height: 70, width: "auto", opacity: 0.92 }}
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
        {noel.thes && <Liste liste={noel.thes} delay={0.7} />}
        {noel.infusions && <Liste liste={noel.infusions} delay={0.95} />}
      </div>
    </div>
  );
};
