import { useEffect, useState } from "react";
import { FiletTitle } from "../noel/Tartan";

/**
 * « Dole, à deux pas » : plan dessiné de la vieille ville (données © OpenStreetMap),
 * avec un zoom animé sur chaque lieu et le trajet à pied depuis la boutique.
 * Le plan est une seule image (public/plan/plan-dole.webp, 2,2 px par mètre) :
 * seuls des transform/opacity bougent, pour rester fluide sur le Fire TV.
 */

const IMG = "/plan/plan-dole.webp";
const IMG_W = 2068;
const IMG_H = 2024;
const PX = 2.2; // pixels par mètre dans l'image
const X0 = -420; // origine de l'image (mètres, y vers le sud)
const Y0 = -300;

// Coordonnées en mètres depuis le centre-ville (calculées depuis OpenStreetMap)
const P = {
  boutique: [259, -42],
  collegiale: [184, 114],
  pasteur: [261, 174],
  halles: [106, 196],
  vue: [190, 90],
} as const;

type Key = keyof typeof P;

interface Step {
  key: Key;
  scale: number;
  ms: number;
  num?: string;
  title?: string;
  text?: string;
  en?: string;
}

const STEPS: Step[] = [
  { key: "vue", scale: 0.62, ms: 4500 },
  {
    key: "boutique",
    scale: 1.05,
    ms: 7000,
    num: "Vous êtes ici",
    title: "Maison Maitre",
    text: "16 rue de Besançon, au cœur de la vieille ville.",
    en: "You are here.",
  },
  {
    key: "collegiale",
    scale: 0.95,
    ms: 7000,
    num: "≈ 3 min à pied",
    title: "La Collégiale",
    text: "Notre-Dame, XVIᵉ siècle : son clocher veille sur toute la ville.",
    en: "The 16th-century collegiate church.",
  },
  {
    key: "pasteur",
    scale: 0.95,
    ms: 7000,
    num: "≈ 5 min à pied",
    title: "Maison natale de Pasteur",
    text: "Louis Pasteur y est né en 1822, au bord du canal des Tanneurs.",
    en: "Louis Pasteur's birthplace, by the tanners' canal.",
  },
  {
    key: "halles",
    scale: 0.95,
    ms: 7000,
    num: "≈ 5 min à pied",
    title: "Les Halles",
    text: "Le marché couvert : mardi, jeudi, vendredi après-midi et samedi matin.",
    en: "The covered market.",
  },
  {
    key: "vue",
    scale: 0.7,
    ms: 6500,
    num: "Tout se fait à pied",
    title: "Dole, à deux pas",
    text: "Une tasse ici, puis la vieille ville en une heure de balade.",
    en: "The whole old town is a short walk away.",
  },
];

const SPOTS: Key[] = ["collegiale", "pasteur", "halles"];

// Itinéraires à pied réels depuis la boutique (OSRM, profil piéton, sur les données OpenStreetMap)
const ROUTES: Record<string, number[][]> = {"collegiale": [[265, -34], [263, -32], [238, -12], [236, -10], [205, 15], [175, 38], [171, 41], [170, 44], [170, 47], [171, 50], [173, 53], [181, 62], [185, 65], [188, 68], [188, 70], [156, 95], [161, 100], [169, 94]], "pasteur": [[265, -34], [298, -57], [300, -55], [303, -51], [316, -37], [346, -12], [349, -10], [353, -7], [364, 3], [368, 9], [374, 24], [375, 28], [375, 33], [374, 41], [373, 44], [372, 46], [360, 59], [356, 62], [336, 81], [317, 94], [294, 118], [290, 123], [273, 138], [245, 164], [256, 177], [257, 178]], "halles": [[265, -34], [263, -32], [238, -12], [236, -10], [205, 15], [175, 38], [171, 41], [170, 44], [170, 47], [171, 50], [173, 53], [181, 62], [185, 65], [188, 68], [188, 70], [156, 95], [161, 100], [148, 104], [128, 124], [127, 127], [125, 130], [124, 133], [125, 136], [127, 139], [129, 141], [134, 145], [142, 151], [150, 153], [150, 160], [146, 166], [134, 188], [126, 202]]};

// Points du pointillé, tous les ~16 px de l'image, le long de l'itinéraire
const dotsOf = (pts: number[][]) => {
  const out: [number, number][] = [];
  const pix = pts.map(([x, y]) => [(x - X0) * PX, (y - Y0) * PX]);
  let carry = 0;
  for (let n = 1; n < pix.length; n++) {
    const [ax, ay] = pix[n - 1];
    const [bx, by] = pix[n];
    const len = Math.hypot(bx - ax, by - ay);
    let d = carry;
    while (d <= len) {
      out.push([ax + ((bx - ax) * d) / len, ay + ((by - ay) * d) / len]);
      d += 16;
    }
    carry = d - len;
  }
  return out;
};
const DOTS: Record<string, [number, number][]> = Object.fromEntries(Object.entries(ROUTES).map(([k, v]) => [k, dotsOf(v)]));


const img = (k: Key) => [(P[k][0] - X0) * PX, (P[k][1] - Y0) * PX];

// Centre de l'écran où l'on amène le lieu (à droite du cartouche)
const CX = 1250;
const CY = 610;

const view = (s: Step) => {
  let [x, y] = img(s.key);
  // Pour un lieu, on cadre le trajet entier : la boutique et le lieu restent visibles
  if (SPOTS.includes(s.key)) {
    const [bx, by] = img("boutique");
    x = (x + bx) / 2;
    y = (y + by) / 2;
  }
  return { tx: CX - x * s.scale, ty: CY - y * s.scale, s: s.scale };
};

const EASE = "transform 2.4s cubic-bezier(0.65, 0, 0.35, 1)";

export const PlanScene = () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setI((n) => (n + 1) % STEPS.length), STEPS[i].ms);
    return () => window.clearTimeout(t);
  }, [i]);

  const step = STEPS[i];
  const v = view(step);
  const showAll = i === STEPS.length - 1;

  // Position écran d'un point de l'image avec la vue courante
  const at = (k: Key) => {
    const [x, y] = img(k);
    return `translate3d(${v.tx + x * v.s}px, ${v.ty + y * v.s}px, 0)`;
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#EFE4CC" }}>
      {/* Le plan */}
      <div
        className="absolute left-0 top-0"
        style={{
          width: IMG_W,
          height: IMG_H,
          transformOrigin: "0 0",
          transform: `translate3d(${v.tx}px, ${v.ty}px, 0) scale(${v.s})`,
          transition: EASE,
        }}
      >
        <img src={IMG} alt="" width={IMG_W} height={IMG_H} style={{ display: "block" }} />
        {/* Itinéraires à pied : les points apparaissent un à un depuis la boutique */}
        {SPOTS.map((k) => {
          const on = showAll || step.key === k;
          if (!on) return null;
          const dots = DOTS[k];
          const per = Math.min(45, 1500 / dots.length);
          return (
            <div key={`${k}-${i}`} className="absolute left-0 top-0">
              {dots.map(([x, y], n) => (
                <span
                  key={n}
                  className="absolute"
                  style={{
                    left: x - 4.5,
                    top: y - 4.5,
                    width: 9,
                    height: 9,
                    borderRadius: 999,
                    background: "#7A1424",
                    boxShadow: "0 0 0 2px rgba(251,246,234,0.85)",
                    animation: `mm-plan-dot 0.35s ease-out ${(showAll ? 1.4 : 2.0) + (n * per) / 1000}s both`,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Fondu des bords du plan */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 62% 70% at 65% 56%, rgba(239,228,204,0) 55%, rgba(239,228,204,0.9) 88%, #EFE4CC 100%)" }}
      />

      {/* Repères */}
      {SPOTS.map((k) => {
        const active = step.key === k;
        return (
          <div
            key={k}
            className="absolute left-0 top-0"
            style={{ transform: at(k), transition: EASE }}
          >
            <div
              style={{
                width: active ? 30 : 18,
                height: active ? 30 : 18,
                marginLeft: active ? -15 : -9,
                marginTop: active ? -15 : -9,
                borderRadius: 999,
                background: active ? "#C9A45C" : "#7A1424",
                border: "3px solid #FBF6EA",
                boxShadow: "0 4px 14px rgba(70,18,31,0.45)",
                transition: "all 0.6s ease",
              }}
            />
            {active && (
              <div
                className="absolute"
                style={{ left: -45, top: -45, width: 90, height: 90, borderRadius: 999, border: "3px solid #C9A45C", animation: "mm-plan-ping 1.8s ease-out 2s infinite" }}
              />
            )}
          </div>
        );
      })}

      {/* Écusson de la boutique */}
      <div className="absolute left-0 top-0" style={{ transform: at("boutique"), transition: EASE }}>
        <div
          className="absolute"
          style={{ left: -60, top: -60, width: 120, height: 120, borderRadius: 999, border: "3px solid #7A1424", animation: "mm-plan-ping 2.2s ease-out infinite" }}
        />
        <div
          className="absolute flex items-center justify-center font-serif-display"
          style={{
            left: -38,
            top: -38,
            width: 76,
            height: 76,
            borderRadius: 999,
            background: "#7A1424",
            boxShadow: "0 0 0 3px #C9A45C, 0 10px 24px rgba(70,18,31,0.5)",
            color: "#E8C98F",
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          MM
        </div>
      </div>

      {/* Cartouche */}
      <div
        className="absolute flex flex-col"
        style={{
          left: 70,
          top: 190,
          width: 560,
          padding: "44px 46px 40px",
          background: "#FBF6EA",
          boxShadow: "0 0 0 1px #C9A45C, 0 0 0 9px #FBF6EA, 0 0 0 10px #7A1424, 0 30px 60px -20px rgba(70,18,31,0.45)",
        }}
      >
        <FiletTitle size={16}>Le plan</FiletTitle>
        <div key={i} style={{ animation: "mm-slide-up 0.9s ease-out 0.5s both" }}>
          {step.title ? (
            <>
              <div className="mm-eyebrow mt-8" style={{ fontSize: 17, letterSpacing: "0.26em", color: "#A8823E" }}>
                {step.num}
              </div>
              <div className="font-serif-display mt-3" style={{ fontSize: 62, lineHeight: 1.0, color: "#46121F", fontWeight: 600 }}>
                {step.title}
              </div>
              <div className="font-serif-display mt-5" style={{ fontSize: 27, lineHeight: 1.35, color: "#5B3A2E" }}>
                {step.text}
              </div>
              <div className="font-serif-display italic mt-3" style={{ fontSize: 20, color: "#9A7B5E" }}>
                {step.en}
              </div>
            </>
          ) : (
            <>
              <div className="font-serif-display mt-8" style={{ fontSize: 76, lineHeight: 0.95, color: "#46121F", fontWeight: 600 }}>
                Dole
                <br />
                <span className="italic" style={{ fontWeight: 400, color: "#7A1424" }}>
                  à deux pas
                </span>
              </div>
              <div className="font-serif-display mt-6" style={{ fontSize: 27, lineHeight: 1.35, color: "#5B3A2E" }}>
                Ville d'art et d'histoire. Suivez le guide depuis la boutique.
              </div>
            </>
          )}
        </div>
        <div className="flex mt-8" style={{ gap: 10 }}>
          {STEPS.map((_, n) => (
            <span key={n} style={{ height: 3, flexGrow: 1, background: n <= i ? "#7A1424" : "rgba(122,20,36,0.18)", transition: "background 0.6s" }} />
          ))}
        </div>
      </div>

      {/* Nord + attribution */}
      <div className="absolute font-serif-display" style={{ right: 70, top: 150, textAlign: "center", color: "#7A1424" }}>
        <div style={{ fontSize: 30, lineHeight: 1 }}>▲</div>
        <div style={{ fontSize: 18, letterSpacing: "0.3em", marginLeft: "0.3em" }}>N</div>
      </div>
      <div className="absolute" style={{ right: 40, bottom: 26, fontSize: 14, color: "rgba(70,18,31,0.55)" }}>
        Plan : © les contributeurs OpenStreetMap
      </div>
    </div>
  );
};
