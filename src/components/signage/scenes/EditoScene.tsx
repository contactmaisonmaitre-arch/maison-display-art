import type { CSSProperties } from "react";
import { useRemoteJson } from "@/hooks/useRemoteJson";
import { useNoelActive } from "@/hooks/useNoel";
import { DoubleFilet, tartanBg } from "../noel/Tartan";
import { QrCode } from "../QrCode";
import fallbackSlides from "../../../../public/data/slides.json";

export interface EditoSlide {
  id: string;
  layout: "split" | "full" | "trio" | "chiffre";
  side?: "left" | "right";
  photos?: string[];
  position?: string;
  eyebrow?: string;
  title: string;
  titleItalic?: string;
  body?: string;
  chips?: string[];
  figure?: string;
  /** Petit texte au-dessus du chiffre (défaut : « Dole · Jura »). */
  figureLabel?: string;
  footer?: string;
  /** QR code : lien à scanner (ex. https://maisonmaitre.com) et son libellé. */
  qr?: { url: string; label?: string };
}

interface SlidesJson {
  slides: EditoSlide[];
}

const WINE = "#6B1424";
const INK = "#2A1A1C";
const GOLD = "#C9A45C";
const GOLD_LT = "#D9B865";
const CREAM = "#F6F0E3";

const rise = (delay: number): CSSProperties => ({ animation: `mm-slide-up 1s ease-out ${delay}s both` });

/** Photo en fond, avec un zoom lent (pas de filtre : léger pour la TV). */
const Photo = ({ src, position = "50% 50%", style }: { src: string; position?: string; style?: CSSProperties }) => (
  <div className="absolute overflow-hidden" style={style}>
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: position,
        animation: "mm-cave-kenburns 18s ease-out forwards",
      }}
    />
  </div>
);

const Title = ({ s, size, light, delay = 0.35 }: { s: EditoSlide; size: number; light?: boolean; delay?: number }) => (
  <h2 className="font-serif-display" style={{ fontSize: size, lineHeight: 0.96, color: light ? "#F4F0E7" : INK, ...rise(delay) }}>
    <span style={{ fontWeight: 600 }}>{s.title}</span>
    {s.titleItalic && (
      <>
        <br />
        <span className="italic" style={{ color: light ? GOLD_LT : WINE }}>
          {s.titleItalic}
        </span>
      </>
    )}
  </h2>
);

const Eyebrow = ({ children, light, delay = 0.2 }: { children: string; light?: boolean; delay?: number }) => (
  <div className="flex items-center" style={{ gap: 20, ...rise(delay) }}>
    <div style={{ width: 70, height: 2, background: `linear-gradient(90deg, transparent, ${light ? GOLD_LT : GOLD})` }} />
    <div className="mm-eyebrow" style={{ fontSize: 18, color: light ? GOLD_LT : WINE }}>
      {children}
    </div>
  </div>
);

const Chips = ({ chips, light }: { chips?: string[]; light?: boolean }) =>
  chips?.length ? (
    <div className="flex flex-wrap" style={{ gap: 14, marginTop: 38, ...rise(0.8) }}>
      {chips.map((c) => (
        <span
          key={c}
          className="mm-eyebrow"
          style={{
            fontSize: 14,
            padding: "10px 18px",
            border: `1px solid ${light ? "rgba(217,184,101,0.6)" : GOLD}`,
            color: light ? GOLD_LT : WINE,
            borderRadius: 999,
          }}
        >
          {c}
        </span>
      ))}
    </div>
  ) : null;

/** QR code + libellé, pour aller sur le site depuis son téléphone. */
const Qr = ({ qr, light }: { qr?: EditoSlide["qr"]; light?: boolean }) =>
  qr ? (
    <div className="flex items-center" style={{ gap: 24, marginTop: 40, ...rise(0.9) }}>
      <div style={{ padding: 10, background: "#FFFFFF", border: `1px solid ${GOLD}` }}>
        <QrCode value={qr.url} size={150} fg="#2A1A1C" bg="#FFFFFF" />
      </div>
      <div>
        <div className="mm-eyebrow" style={{ fontSize: 14, color: light ? GOLD_LT : "#8A7468" }}>
          Scannez avec votre téléphone
        </div>
        <div className="font-serif-display" style={{ fontSize: 40, fontWeight: 600, color: light ? "#F4F0E7" : WINE, marginTop: 4 }}>
          {qr.label ?? qr.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>
  ) : null;

/** Photo + carte crème avec double filet ; la photo à gauche ou à droite. */
const Split = ({ s, noel }: { s: EditoSlide; noel: boolean }) => {
  const photoLeft = s.side === "left";
  const cardW = 760;
  return (
    <div className="absolute inset-0" style={{ background: "#2E0B14" }}>
      <Photo src={s.photos?.[0] ?? ""} position={s.position} style={photoLeft ? { left: 0, top: 0, bottom: 0, right: cardW } : { left: cardW, top: 0, bottom: 0, right: 0 }} />
      {noel && (
        <div
          className="absolute"
          style={{ top: 0, bottom: 0, width: 26, [photoLeft ? "right" : "left"]: cardW - 26, ...tartanBg(244), borderLeft: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` }}
        />
      )}
      <div
        className="absolute flex flex-col justify-center"
        style={{ top: 0, bottom: 0, width: cardW - (noel ? 26 : 0), [photoLeft ? "right" : "left"]: 0, background: CREAM, padding: "150px 80px 100px" }}
      >
        <DoubleFilet inset={24} />
        {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
        <div style={{ marginTop: 28 }}>
          <Title s={s} size={100} />
        </div>
        <div style={{ marginTop: 32, width: 140, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        {s.body && (
          <p className="font-serif-display italic" style={{ marginTop: 28, fontSize: 38, lineHeight: 1.3, color: "#5A4A44", ...rise(0.6) }}>
            {s.body}
          </p>
        )}
        <Chips chips={s.chips} />
        <Qr qr={s.qr} />
      </div>
    </div>
  );
};

/** Photo plein écran, titre en bas à gauche sur un dégradé, cadre doré fin. */
const Full = ({ s, noel }: { s: EditoSlide; noel: boolean }) => (
  <div className="absolute inset-0" style={{ background: "#2E0B14" }}>
    <Photo src={s.photos?.[0] ?? ""} position={s.position} style={{ inset: 0 }} />
    <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(30,8,14,0.88) 0%, rgba(30,8,14,0.6) 38%, rgba(30,8,14,0.05) 70%), linear-gradient(0deg, rgba(30,8,14,0.6) 0%, transparent 40%)" }} />
    <div aria-hidden className="pointer-events-none absolute" style={{ left: 48, right: 48, top: 166, bottom: 48, border: `1px solid rgba(217,184,101,0.55)` }} />
    {noel && <div className="absolute" style={{ left: 48, top: 166, bottom: 48, width: 22, ...tartanBg(244), borderRight: `1px solid ${GOLD}` }} />}
    <div className="absolute flex flex-col justify-end" style={{ left: 130, bottom: 120, width: 1000 }}>
      {s.eyebrow && <Eyebrow light>{s.eyebrow}</Eyebrow>}
      <div style={{ marginTop: 26, textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>
        <Title s={s} size={128} light />
      </div>
      {s.body && (
        <p className="font-serif-display italic" style={{ marginTop: 30, fontSize: 40, lineHeight: 1.3, color: "rgba(244,240,231,0.92)", textShadow: "0 2px 20px rgba(0,0,0,0.6)", ...rise(0.6) }}>
          {s.body}
        </p>
      )}
    </div>
  </div>
);

/** Trois photos encadrées sur fond tartan, texte sur une bande crème. */
const Trio = ({ s, noel }: { s: EditoSlide; noel: boolean }) => {
  const photos = (s.photos ?? []).slice(0, 3);
  return (
    <div className="absolute inset-0" style={noel ? tartanBg(488) : { background: "radial-gradient(ellipse at center, #46121F 0%, #2E0B14 100%)" }}>
      <div className="absolute inset-0" style={{ background: "rgba(20,6,10,0.35)" }} />
      <div className="absolute flex flex-col justify-center" style={{ left: 0, top: 130, bottom: 0, width: 640, background: CREAM, padding: "40px 70px 80px" }}>
        <DoubleFilet inset={22} />
        {s.eyebrow && <Eyebrow>{s.eyebrow}</Eyebrow>}
        <div style={{ marginTop: 26 }}>
          <Title s={s} size={88} />
        </div>
        <div style={{ marginTop: 30, width: 120, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        {s.body && (
          <p className="font-serif-display italic" style={{ marginTop: 26, fontSize: 34, lineHeight: 1.32, color: "#5A4A44", ...rise(0.6) }}>
            {s.body}
          </p>
        )}
      </div>
      <div className="absolute flex items-center" style={{ left: 700, right: 70, top: 190, bottom: 70, gap: 34 }}>
        {photos.map((p, i) => (
          <div
            key={p}
            className="relative"
            style={{
              flex: 1,
              height: i === 1 ? "100%" : "86%",
              background: CREAM,
              padding: 14,
              boxShadow: "0 30px 60px -20px rgba(0,0,0,0.75)",
              ...rise(0.3 + i * 0.2),
            }}
          >
            <div
              className="h-full w-full"
              style={{ backgroundImage: `url(${p})`, backgroundSize: "cover", backgroundPosition: "50% 50%", borderRadius: i === 1 ? "260px 260px 0 0" : 0 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/** Grand chiffre typographique : pour Dole et les « le saviez-vous ». */
const Chiffre = ({ s, noel }: { s: EditoSlide; noel: boolean }) => (
  <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, #5A1424 0%, #2E0B14 100%)" }}>
    <div className="absolute flex items-center justify-center" style={{ left: 0, top: 130, bottom: 0, width: 860, ...(noel ? tartanBg(488) : { background: "#3A0E19" }) }}>
      <div className="absolute inset-0" style={{ background: "rgba(20,6,10,0.3)" }} />
      <div className="relative flex flex-col items-center justify-center" style={{ width: 640, height: 640, borderRadius: "50%", background: CREAM, border: `2px solid ${GOLD}`, boxShadow: "0 0 0 14px rgba(246,240,227,0.25), 0 40px 80px -25px rgba(0,0,0,0.8)", ...rise(0.1) }}>
        <div className="mm-eyebrow" style={{ fontSize: 18, color: "#8A7468" }}>
          {s.figureLabel ?? "Dole · Jura"}
        </div>
        <div className="font-serif-display" style={{ fontSize: s.figure && s.figure.length > 4 ? 150 : 200, lineHeight: 1, color: WINE, fontWeight: 600, marginTop: 10 }}>
          {s.figure}
        </div>
        <div style={{ marginTop: 18, width: 120, height: 1, background: GOLD }} />
      </div>
    </div>
    <div aria-hidden className="absolute" style={{ left: 860, top: 130, bottom: 0, width: 2, background: GOLD }} />
    <div className="absolute flex flex-col justify-center" style={{ left: 960, right: 110, top: 150, bottom: 90 }}>
      {s.eyebrow && <Eyebrow light>{s.eyebrow}</Eyebrow>}
      <div style={{ marginTop: 28 }}>
        <Title s={s} size={104} light />
      </div>
      <div style={{ marginTop: 32, width: 140, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
      {s.body && (
        <p className="font-serif-display italic" style={{ marginTop: 28, fontSize: 40, lineHeight: 1.32, color: "rgba(244,240,231,0.9)", ...rise(0.6) }}>
          {s.body}
        </p>
      )}
      {s.footer && (
        <div className="mm-eyebrow" style={{ marginTop: 40, fontSize: 15, color: "rgba(232,201,169,0.75)", ...rise(0.8) }}>
          {s.footer}
        </div>
      )}
      <Qr qr={s.qr} light />
    </div>
  </div>
);

/** Slide éditoriale haut de gamme, décrite dans public/data/slides.json. */
export const EditoScene = ({ id }: { id?: string }) => {
  const json = useRemoteJson<SlidesJson>("data/slides.json", 30 * 60 * 1000) ?? (fallbackSlides as SlidesJson);
  const noel = useNoelActive();
  const s = json.slides.find((x) => x.id === id) ?? json.slides[0];
  if (!s) return null;
  switch (s.layout) {
    case "full":
      return <Full s={s} noel={noel} />;
    case "trio":
      return <Trio s={s} noel={noel} />;
    case "chiffre":
      return <Chiffre s={s} noel={noel} />;
    default:
      return <Split s={s} noel={noel} />;
  }
};
