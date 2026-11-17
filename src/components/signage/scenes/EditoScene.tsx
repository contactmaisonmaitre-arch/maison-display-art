import type { CSSProperties } from "react";
import { useRemoteJson } from "@/hooks/useRemoteJson";
import { useNoelActive } from "@/hooks/useNoel";
import { DoubleFilet, tartanBg } from "../noel/Tartan";
import { QrCode } from "../QrCode";
import fallbackSlides from "../../../../public/data/slides.json";

export interface EditoItem {
  img: string;
  name?: string;
  sub?: string;
}

export interface EditoIcon {
  icon: IconName;
  title: string;
  text?: string;
}

export interface EditoSlide {
  id: string;
  layout: "split" | "full" | "trio" | "chiffre" | "defile" | "hero" | "icones";
  /** Défilé / hero : produits (packshots) avec nom et sous-titre. */
  items?: EditoItem[];
  /** Hero : prix mis en avant. */
  price?: string;
  /** Icônes : les étapes « comment ça marche ». */
  icons?: EditoIcon[];
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
  /** Adresse de site affichée en grand, sans QR code. */
  site?: string;
  /** Hero : "arche" (packshot sur fond crème, dans une arche) ou "libre" (packshots détourés qui flottent sur le tartan). */
  frame?: "arche" | "libre";
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

/** Adresse de site en grand (sans QR code). */
const Site = ({ site, light }: { site?: string; light?: boolean }) =>
  site ? (
    <div style={{ marginTop: 38, ...rise(0.9) }}>
      <div className="mm-eyebrow" style={{ fontSize: 14, color: light ? GOLD_LT : "#8A7468" }}>
        Retrouvez-nous en ligne
      </div>
      <div className="font-serif-display" style={{ fontSize: 56, fontWeight: 600, color: light ? "#F4F0E7" : WINE, marginTop: 6, borderBottom: `2px solid ${GOLD}`, display: "inline-block", paddingBottom: 6 }}>
        {site}
      </div>
    </div>
  ) : null;

/** Photo + carte crème avec double filet ; la photo à gauche ou à droite. */
const Split = ({ s, noel }: { s: EditoSlide; noel: boolean }) => {
  const photoLeft = s.side === "left";
  const cardW = 760;
  return (
    <div className="absolute inset-0" style={{ background: "#2E0B14" }}>
      <Photo src={sized(s.photos?.[0] ?? "", 1600)} position={s.position} style={photoLeft ? { left: 0, top: 0, bottom: 0, right: cardW } : { left: cardW, top: 0, bottom: 0, right: 0 }} />
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
    <Photo src={sized(s.photos?.[0] ?? "", 1600)} position={s.position} style={{ inset: 0 }} />
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
              style={{ backgroundImage: `url(${sized(p, 800)})`, backgroundSize: "cover", backgroundPosition: "50% 50%", borderRadius: i === 1 ? "260px 260px 0 0" : 0 }}
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

/* ───────────────────── Icônes maison (traits fins, tracés animés) ───────────────────── */
export type IconName = "comptoir" | "service" | "etage" | "groupe" | "club" | "enligne" | "cadeau" | "sachet";

const ICON_PATHS: Record<IconName, string[]> = {
  // Comptoir : caisse + ticket
  comptoir: ["M10 52h60", "M16 52V30h48v22", "M24 30V18h32v12", "M30 24h20", "M34 40h12", "M58 18l6-8"],
  // Service : plateau + tasse fumante
  service: ["M12 50h56", "M18 50c0-14 10-22 22-22s22 8 22 22", "M40 28v-4", "M36 24h8", "M30 14c2-3 0-5 2-8", "M40 14c2-3 0-5 2-8", "M50 14c2-3 0-5 2-8"],
  // Étage : escalier + fauteuil
  etage: ["M10 60h16V48h14V36h14V24h16", "M52 56h18", "M56 56v-8h10v8", "M56 48v-6h10v6"],
  // Groupe : trois silhouettes
  groupe: ["M40 30a8 8 0 1 0 0-16a8 8 0 1 0 0 16", "M26 58c0-10 6-16 14-16s14 6 14 16", "M20 34a6 6 0 1 0 0-12a6 6 0 1 0 0 12", "M8 58c0-8 5-13 12-13", "M60 34a6 6 0 1 0 0-12a6 6 0 1 0 0 12", "M72 58c0-8-5-13-12-13"],
  // Club : carte avec étoile
  club: ["M10 22h60v36H10z", "M10 32h60", "M40 38l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1z"],
  // En ligne : téléphone + colis
  enligne: ["M18 10h22v48H18z", "M26 52h6", "M46 34h24v22H46z", "M46 34l12-8 12 8", "M58 26v30"],
  // Cadeau : boîte + nœud
  cadeau: ["M14 32h52v28H14z", "M10 24h60v8H10z", "M40 24v36", "M40 24c-6-10-18-10-16-2s16 2 16 2", "M40 24c6-10 18-10 16-2s-16 2-16 2"],
  // Sachet de thé
  sachet: ["M24 14h32l4 10v36H20V24z", "M20 24h40", "M30 36h20v14H30z", "M40 8v6"],
};

const HouseIcon = ({ name, size = 120, delay = 0 }: { name: IconName; size?: number; delay?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 70" fill="none" aria-hidden>
    {(ICON_PATHS[name] ?? []).map((d, i) => (
      <path
        key={i}
        d={d}
        stroke={GOLD_LT}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: `mm-draw 1.6s ease-out ${delay + i * 0.12}s forwards` }}
      />
    ))}
  </svg>
);

/** Image en ligne (Shopify) en taille raisonnable pour la TV. */
const sized = (src: string, w = 700) => (src.includes("cdn.shopify.com") ? `${src}${src.includes("?") ? "&" : "?"}width=${w}` : src);

/** Petites étoiles dorées qui scintillent (décor de Noël, très léger). */
const Twinkles = ({ count = 14 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <span
        key={i}
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: `${(i * 37) % 100}%`,
          top: `${(i * 53 + 11) % 100}%`,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#F6DFA0",
          boxShadow: "0 0 12px 3px rgba(246,223,160,0.6)",
          animation: `mm-twinkle ${2.4 + (i % 5) * 0.5}s ease-in-out ${(i % 7) * 0.4}s infinite`,
        }}
      />
    ))}
  </>
);

/** Défilé : les packshots passent en continu sur fond tartan, sous un titre. */
const Defile = ({ s }: { s: EditoSlide }) => {
  const items = s.items ?? [];
  const loop = [...items, ...items];
  return (
    <div className="absolute inset-0 overflow-hidden" style={tartanBg(488)}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,6,10,0.15), rgba(20,6,10,0.5))" }} />
      <Twinkles />
      <div className="absolute flex items-end justify-between" style={{ left: 90, right: 90, top: 160, gap: 60 }}>
        <div>
          {s.eyebrow && <Eyebrow light>{s.eyebrow}</Eyebrow>}
          <div style={{ marginTop: 18, textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>
            <h2 className="font-serif-display" style={{ fontSize: 104, lineHeight: 0.96, color: "#F4F0E7", ...rise(0.3) }}>
              <span style={{ fontWeight: 600 }}>{s.title} </span>
              {s.titleItalic && (
                <span className="italic" style={{ color: GOLD_LT }}>
                  {s.titleItalic}
                </span>
              )}
            </h2>
          </div>
        </div>
        {(s.body || s.price) && (
          <div style={{ maxWidth: 620, background: CREAM, padding: "26px 34px", position: "relative", boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7)", ...rise(0.5) }}>
            <div aria-hidden className="absolute" style={{ inset: 8, border: `1px solid ${GOLD}` }} />
            {s.price && (
              <div className="font-serif-display" style={{ fontSize: 44, fontWeight: 600, color: WINE, lineHeight: 1 }}>
                {s.price}
              </div>
            )}
            {s.body && (
              <p className="font-serif-display italic" style={{ marginTop: s.price ? 10 : 0, fontSize: 28, lineHeight: 1.3, color: "#5A4A44" }}>
                {s.body}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="absolute" style={{ left: 0, right: 0, bottom: 70, height: 560 }}>
        <div className="flex h-full" style={{ width: "max-content", gap: 40, animation: `mm-defile ${Math.max(20, items.length * 5)}s linear infinite` }}>
          {loop.map((it, i) => (
            <div key={i} className="relative flex flex-col items-center" style={{ width: 360, background: CREAM, padding: "18px 18px 22px", boxShadow: "0 30px 60px -25px rgba(0,0,0,0.8)" }}>
              <div aria-hidden className="absolute" style={{ inset: 7, border: `1px solid rgba(201,164,92,0.7)` }} />
              <div className="relative overflow-hidden" style={{ width: "100%", height: 400 }}>
                <img src={sized(it.img)} alt={it.name ?? ""} className="h-full w-full" style={{ objectFit: "cover" }} />
                <div aria-hidden className="absolute inset-y-0" style={{ width: "40%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent)", animation: `mm-sheen-pass 6s ease-in-out ${(i % 5) * 1.1}s infinite` }} />
              </div>
              {it.name && (
                <div className="font-serif-display text-center" style={{ marginTop: 14, fontSize: 32, fontWeight: 600, color: INK, lineHeight: 1.1 }}>
                  {it.name}
                </div>
              )}
              {it.sub && (
                <div className="mm-eyebrow text-center" style={{ marginTop: 6, fontSize: 13, color: WINE }}>
                  {it.sub}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Hero produit : un packshot qui flotte dans une arche crème, sur tartan, avec le texte à côté. */
const Hero = ({ s }: { s: EditoSlide }) => {
  const [main, ...rest] = s.items ?? [];
  const photoLeft = s.side !== "right";
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(ellipse at 30% 55%, #5A1424 0%, #2E0B14 100%)" }}>
      <div className="absolute" style={{ top: 0, bottom: 0, width: 900, [photoLeft ? "left" : "right"]: 0, ...tartanBg(488) }}>
        <div className="absolute inset-0" style={{ background: "rgba(20,6,10,0.3)" }} />
        <Twinkles count={10} />
        {s.frame === "libre" ? (
          // Packshots détourés (PNG transparents) : posés directement sur le tartan, avec une ombre au sol.
          <div className="absolute" style={{ left: 40, right: 40, top: 150, bottom: 40 }}>
            {[main, ...rest.slice(0, 2)].filter(Boolean).map((it, i) => {
              const big = i === 0;
              const w = big ? 560 : 330;
              const left = big ? 160 : i === 1 ? -10 : 520;
              const top = big ? 120 : 430;
              return (
                <div key={it!.img} className="absolute" style={{ left, top, width: w, height: w, zIndex: big ? 2 : 1, animation: `mm-pop 1s ease-out ${0.2 + i * 0.3}s both` }}>
                  <div aria-hidden className="absolute" style={{ left: "12%", right: "12%", bottom: -10, height: 46, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)" }} />
                  <img src={sized(it!.img, big ? 900 : 500)} alt={it!.name ?? ""} className="relative h-full w-full" style={{ objectFit: "contain", animation: `mm-float ${6 + i}s ease-in-out ${i * 0.8}s infinite` }} />
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {main && (
              <div
                className="absolute flex items-center justify-center"
                style={{ left: 120, right: 120, top: 190, bottom: 70, background: CREAM, borderRadius: "330px 330px 0 0", border: `2px solid ${GOLD}`, boxShadow: "0 0 0 12px rgba(246,240,227,0.25), 0 40px 80px -25px rgba(0,0,0,0.8)", overflow: "hidden", ...rise(0.1) }}
              >
                <img src={sized(main.img, 900)} alt={main.name ?? ""} style={{ width: "92%", height: "92%", objectFit: "contain", animation: "mm-float 6s ease-in-out infinite" }} />
              </div>
            )}
            {rest.slice(0, 2).map((it, i) => (
              <div key={it.img} className="absolute" style={{ [i === 0 ? "left" : "right"]: 40, bottom: 90 + i * 40, width: 210, height: 210, background: CREAM, padding: 8, border: `1px solid ${GOLD}`, boxShadow: "0 25px 50px -20px rgba(0,0,0,0.8)", animation: `mm-pop 1s ease-out ${0.8 + i * 0.3}s both` }}>
                <img src={sized(it.img, 400)} alt={it.name ?? ""} className="h-full w-full" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </>
        )}
      </div>
      <div aria-hidden className="absolute" style={{ top: 0, bottom: 0, width: 2, background: GOLD, [photoLeft ? "left" : "right"]: 900 }} />
      <div className="absolute flex flex-col justify-center" style={{ top: 150, bottom: 90, [photoLeft ? "left" : "right"]: 990, [photoLeft ? "right" : "left"]: 100 }}>
        {s.eyebrow && <Eyebrow light>{s.eyebrow}</Eyebrow>}
        <div style={{ marginTop: 26 }}>
          <Title s={s} size={100} light />
        </div>
        <div style={{ marginTop: 30, width: 140, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        {s.body && (
          <p className="font-serif-display italic" style={{ marginTop: 26, fontSize: 38, lineHeight: 1.32, color: "rgba(244,240,231,0.9)", ...rise(0.6) }}>
            {s.body}
          </p>
        )}
        {s.price && (
          <div className="flex items-baseline" style={{ marginTop: 34, gap: 18, ...rise(0.8) }}>
            <span className="font-serif-display" style={{ fontSize: 76, fontWeight: 600, color: GOLD_LT, lineHeight: 1 }}>
              {s.price}
            </span>
            {main?.sub && (
              <span className="mm-eyebrow" style={{ fontSize: 15, color: "rgba(232,201,169,0.8)" }}>
                {main.sub}
              </span>
            )}
          </div>
        )}
        <Chips chips={s.chips} light />
        <Qr qr={s.qr} light />
        <Site site={s.site} light />
      </div>
    </div>
  );
};

/** Icônes : « comment ça marche », 3 ou 4 cartes qui apparaissent une à une, icônes tracées en direct. */
const Icones = ({ s }: { s: EditoSlide }) => {
  const icons = s.icons ?? [];
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 40%, #5A1424 0%, #2E0B14 100%)" }}>
      <div className="absolute" style={{ left: 0, right: 0, bottom: 0, height: 26, ...tartanBg(244), borderTop: `1px solid ${GOLD}` }} />
      <Twinkles count={10} />
      <div className="absolute flex flex-col items-center text-center" style={{ left: 120, right: 120, top: 170 }}>
        {s.eyebrow && <Eyebrow light>{s.eyebrow}</Eyebrow>}
        <h2 className="font-serif-display" style={{ marginTop: 18, fontSize: 96, lineHeight: 0.98, color: "#F4F0E7", ...rise(0.3) }}>
          <span style={{ fontWeight: 600 }}>{s.title} </span>
          {s.titleItalic && (
            <span className="italic" style={{ color: GOLD_LT }}>
              {s.titleItalic}
            </span>
          )}
        </h2>
      </div>
      <div className="absolute grid" style={{ left: 110, right: 110, top: 430, bottom: 110, gridTemplateColumns: `repeat(${icons.length}, minmax(0, 1fr))`, gap: 34 }}>
        {icons.map((ic, i) => (
          <div
            key={ic.title}
            className="relative flex flex-col items-center text-center"
            style={{ background: "rgba(246,240,227,0.06)", border: `1px solid rgba(217,184,101,0.45)`, padding: "40px 28px 30px", animation: `mm-pop 0.9s ease-out ${0.5 + i * 0.35}s both` }}
          >
            <div className="mm-eyebrow" style={{ fontSize: 14, color: "rgba(232,201,169,0.7)" }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ marginTop: 10 }}>
              <HouseIcon name={ic.icon} size={130} delay={0.8 + i * 0.35} />
            </div>
            <div className="font-serif-display" style={{ marginTop: 16, fontSize: 40, fontWeight: 600, lineHeight: 1.05, color: "#F4F0E7" }}>
              {ic.title}
            </div>
            {ic.text && (
              <p className="font-serif-display italic" style={{ marginTop: 12, fontSize: 27, lineHeight: 1.3, color: "rgba(244,240,231,0.82)" }}>
                {ic.text}
              </p>
            )}
          </div>
        ))}
      </div>
      {s.footer && (
        <div className="mm-eyebrow absolute text-center" style={{ left: 0, right: 0, bottom: 58, fontSize: 15, color: GOLD_LT, ...rise(1.8) }}>
          {s.footer}
        </div>
      )}
    </div>
  );
};

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
    case "defile":
      return <Defile s={s} />;
    case "hero":
      return <Hero s={s} />;
    case "icones":
      return <Icones s={s} />;
    default:
      return <Split s={s} noel={noel} />;
  }
};
