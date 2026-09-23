import { useRemoteJson } from "@/hooks/useRemoteJson";
import { BOARD, type CarteJson, type Ephemere } from "@/data/carte";
import { remoteUrl } from "@/lib/signage/remote";

const img = (src?: string) => {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return import.meta.env.DEV ? `/${src.replace(/^\//, "")}` : remoteUrl(src);
};

const Pill = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <span
    className="font-serif-display uppercase inline-flex items-center gap-2"
    style={{
      fontSize: 15,
      letterSpacing: "0.22em",
      fontWeight: 600,
      padding: "8px 18px",
      borderRadius: 999,
      background: light ? "#FFFFFF" : BOARD.wine,
      color: light ? "#3E5A48" : "#FFFFFF",
    }}
  >
    {children}
  </span>
);

const Card = ({ e, i }: { e: Ephemere; i: number }) => (
  <div
    className="relative flex flex-col rounded-[28px]"
    style={{
      background: e.bg ?? "#EAE3D6",
      padding: "0 44px 40px",
      animation: `mm-slide-up 1s ease-out ${0.25 + i * 0.18}s both`,
    }}
  >
    <div className="relative mx-auto" style={{ width: "86%", aspectRatio: "696 / 661", marginTop: 26 }}>
      {e.image && <img src={img(e.image)} alt={e.name} className="block h-full w-full" style={{ objectFit: "contain" }} />}
      {/* Pastille prix (recouvre celle de la photo d'origine) */}
      {e.price && (
        <div
          className="absolute flex items-center justify-center font-serif-display"
          style={{
            width: "28%",
            aspectRatio: "1",
            left: "81.2%",
            top: "2.1%",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: BOARD.wine,
            color: "#FFFFFF",
            fontSize: 70,
            fontWeight: 600,
            boxShadow: `0 0 0 6px ${e.bg ?? "#EAE3D6"}`,
          }}
        >
          {e.price}
        </div>
      )}
    </div>
    <div className="mt-4 flex gap-3">
      {e.tags?.map((t) => (
        <Pill key={t}>{t}</Pill>
      ))}
      {e.vegan && <Pill light>100 % végétal</Pill>}
    </div>
    <div className="font-serif-display mt-4" style={{ fontSize: 50, lineHeight: 1.02, color: BOARD.wine, fontWeight: 600, letterSpacing: "-0.01em" }}>
      {e.name}
    </div>
    {e.tagline && (
      <div className="font-serif-display italic mt-3" style={{ fontSize: 27, color: BOARD.wine, lineHeight: 1.25 }}>
        {e.tagline}
      </div>
    )}
    {e.desc && (
      <div className="font-serif-display mt-3" style={{ fontSize: 21, color: BOARD.muted, lineHeight: 1.4 }}>
        {e.desc}
      </div>
    )}
  </div>
);

// Scène « Les Éphémères » — recettes de saison, même charte que la carte imprimée.
export const EphemeresScene = () => {
  const carte = useRemoteJson<CarteJson>("data/carte.json", 30 * 60 * 1000);
  const e = carte?.ephemeres;
  if (!e) return <div className="absolute inset-0" style={{ background: BOARD.cream }} />;

  return (
    <div className="absolute inset-0 overflow-hidden flex" style={{ background: BOARD.cream }}>
      <div
        className="grid flex-1 items-start content-center"
        style={{
          gridTemplateColumns: `repeat(${e.items.length}, minmax(0, 1fr))`,
          gap: 44,
          padding: "150px 56px 40px 72px",
        }}
      >
        {e.items.map((it, i) => (
          <Card key={it.name} e={it} i={i} />
        ))}
      </div>
      <div
        className="relative flex flex-col shrink-0"
        style={{ width: 560, background: BOARD.wine, padding: "150px 60px 44px 64px", animation: "mm-fade-in 0.8s ease-out both" }}
      >
        {e.badge && (
          <span
            className="self-start font-serif-display uppercase"
            style={{
              fontSize: 17,
              letterSpacing: "0.2em",
              fontWeight: 600,
              background: BOARD.orange,
              color: BOARD.wine,
              padding: "8px 22px",
              borderRadius: 999,
              transform: "rotate(-3deg)",
            }}
          >
            {e.badge}
          </span>
        )}
        {e.eyebrow && (
          <div className="font-serif-display italic mt-7" style={{ fontSize: 36, color: BOARD.sand }}>
            {e.eyebrow}
          </div>
        )}
        <div className="font-serif-display mt-3" style={{ fontSize: 88, lineHeight: 0.95, color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.02em" }}>
          {(e.title ?? ["Les", "Éphémères"]).map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        {e.intro && (
          <div className="font-serif-display italic mt-8" style={{ fontSize: 29, lineHeight: 1.4, color: BOARD.sand }}>
            {e.intro}
          </div>
        )}
        <div style={{ height: 1, background: "rgba(232,201,169,0.35)", margin: "32px 0 26px" }} />
        {e.footnote && (
          <div className="font-serif-display" style={{ fontSize: 23, lineHeight: 1.4, color: "#FFFFFF", fontWeight: 500 }}>
            {e.footnote}
          </div>
        )}
        <div className="mt-auto flex flex-col gap-2">
          {carte?.footer?.map((f) => (
            <div key={f} className="font-serif-display" style={{ fontSize: 20, color: BOARD.sand }}>
              {f}
            </div>
          ))}
          <div className="font-serif-display mt-2" style={{ fontSize: 22, color: BOARD.sand }}>
            @maison_maitre
          </div>
        </div>
      </div>
    </div>
  );
};
