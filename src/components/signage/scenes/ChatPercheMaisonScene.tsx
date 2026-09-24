import { BOARD } from "@/data/carte";
import { useRemoteJson } from "@/hooks/useRemoteJson";
import { useProducts } from "@/hooks/useProducts";
import type { ShopProduct } from "@/hooks/useProducts";
import { remoteUrl } from "@/lib/signage/remote";

export interface ChatPercheJson {
  from?: string;
  until?: string;
  edition: string;
  dates: string;
  lieux: { titre: string; quand?: string; texte: string }[];
  produits: { handle?: string; nom: string; badge?: string; texte: string; image?: string; price?: string; bg?: string; cover?: boolean }[];
}

export const useChatPerche = () => useRemoteJson<ChatPercheJson>("data/chatperche.json", 30 * 60 * 1000);

export const chatPercheActive = (c: ChatPercheJson | null, now = new Date()) => {
  if (!c) return false;
  const t = now.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  return (!c.from || t >= c.from) && (!c.until || t <= c.until);
};

const Cat = ({ size = 120, color = BOARD.sand }: { size?: number; color?: string }) => (
  // Petit chat perché stylisé (dessin original, simple silhouette)
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden fill={color}>
    <path d="M30 88 C28 70 30 58 38 50 L34 30 L44 42 C48 40 52 40 56 42 L66 30 L62 50 C70 58 72 70 70 88 Z" />
    <path d="M70 84 C82 84 88 76 86 66" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
    <rect x="18" y="88" width="64" height="5" rx="2.5" />
  </svg>
);

// Page spéciale : Maison Maitre au Week-end Gourmand du Chat Perché.
export const ChatPercheMaisonScene = () => {
  const c = useChatPerche();
  if (!c) return <div className="absolute inset-0" style={{ background: BOARD.wine }} />;
  return (
    <div className="absolute inset-0 overflow-hidden flex" style={{ background: BOARD.wine, paddingTop: 118 }}>
      <div className="flex flex-col justify-center shrink-0" style={{ width: 760, padding: "0 40px 40px 100px" }}>
        <Cat size={110} />
        <div className="font-serif-display uppercase mt-6" style={{ fontSize: 16, letterSpacing: "0.3em", color: BOARD.orange, fontWeight: 700 }}>
          Ce week-end à Dole
        </div>
        <div className="font-serif-display mt-4" style={{ fontSize: 92, lineHeight: 0.95, color: "#FFFFFF", fontWeight: 600, letterSpacing: "-0.02em" }}>
          Maison Maitre
          <br />
          <span className="italic" style={{ fontWeight: 400, color: BOARD.sand }}>au Chat Perché</span>
        </div>
        <div className="font-serif-display italic mt-7" style={{ fontSize: 34, color: BOARD.sand }}>
          {c.edition}
        </div>
        <div className="font-serif-display mt-2" style={{ fontSize: 30, color: "#FFFFFF", fontWeight: 600 }}>
          {c.dates}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center" style={{ gap: 26, padding: "40px 100px 60px 20px" }}>
        <div className="font-serif-display uppercase" style={{ fontSize: 15, letterSpacing: "0.3em", color: BOARD.sand, fontWeight: 700 }}>
          Où nous retrouver
        </div>
        {c.lieux.map((l, i) => (
          <div
            key={l.titre}
            className="rounded-[26px]"
            style={{ background: BOARD.cream, padding: "40px 44px", animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.15}s both` }}
          >
            <div className="flex items-baseline justify-between gap-6">
              <div className="font-serif-display" style={{ fontSize: 54, fontWeight: 600, color: BOARD.wine, lineHeight: 1.05 }}>
                {l.titre}
              </div>
              {l.quand && (
                <span className="font-serif-display uppercase shrink-0" style={{ fontSize: 14, letterSpacing: "0.2em", fontWeight: 700, padding: "7px 16px", borderRadius: 999, background: BOARD.orange, color: BOARD.wine }}>
                  {l.quand}
                </span>
              )}
            </div>
            <div className="font-serif-display mt-3" style={{ fontSize: 32, lineHeight: 1.4, color: BOARD.muted }}>
              {l.texte}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Photos : Shopify (redimensionnée) ou fichier du dépôt (servi depuis GitHub,
// visible sans republier Lovable).
const sized = (url?: string | null) => {
  if (!url) return undefined;
  if (url.includes("cdn.shopify.com")) return `${url}${url.includes("?") ? "&" : "?"}width=700`;
  if (url.startsWith("/") && !import.meta.env.DEV) return remoteUrl(url);
  return url;
};

// Annonce officielle : nos produits du Week-end Gourmand.
export const ChatPercheProduitsScene = () => {
  const c = useChatPerche();
  const { raw } = useProducts();
  if (!c) return <div className="absolute inset-0" style={{ background: BOARD.cream }} />;
  const byHandle = new Map<string, ShopProduct>((raw ?? []).map((p) => [p.handle, p]));

  return (
    <div className="absolute inset-0 overflow-hidden flex flex-col" style={{ background: BOARD.cream, paddingTop: 118 }}>
      <div className="flex items-end justify-between" style={{ padding: "40px 100px 0" }}>
        <div>
          <div className="font-serif-display uppercase" style={{ fontSize: 16, letterSpacing: "0.3em", color: BOARD.orange, fontWeight: 700 }}>
            Annonce officielle · {c.edition}
          </div>
          <div className="font-serif-display mt-3" style={{ fontSize: 84, lineHeight: 0.95, color: BOARD.wine, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Nos créations <span className="italic" style={{ fontWeight: 400 }}>du week-end</span>
          </div>
        </div>
        <Cat size={96} color={BOARD.wine} />
      </div>
      <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${c.produits.length}, minmax(0, 1fr))`, gap: 30, padding: "34px 100px 60px" }}>
        {c.produits.map((p, i) => {
          const shop = p.handle ? byHandle.get(p.handle) : undefined;
          const img = sized(p.image ?? shop?.img);
          const price = p.price !== undefined ? p.price : shop?.price;
          return (
            <div
              key={p.nom}
              className="flex flex-col rounded-[28px] overflow-hidden"
              style={{ background: "#FFFFFF", boxShadow: "0 0 0 1px #E3D6BC inset", animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.15}s both`, minHeight: 0 }}
            >
              <div className="relative flex items-center justify-center" style={{ height: 420, background: p.bg ?? "#EFE6DA" }}>
                {img ? (
                  <img src={img} alt={p.nom} onError={(e) => (e.currentTarget.style.visibility = "hidden")} style={{ height: "100%", width: "100%", objectFit: p.cover ? "cover" : "contain", padding: p.cover ? 0 : "14px 0" }} />
                ) : (
                  <div className="flex flex-col items-center">
                    <Cat size={150} color={BOARD.sand} />
                    <div className="font-serif-display italic mt-2" style={{ fontSize: 30, color: BOARD.sand }}>
                      {p.nom}
                    </div>
                  </div>
                )}
                {p.badge && (
                  <span
                    className="absolute font-serif-display uppercase"
                    style={{ top: 20, left: 20, fontSize: 13, letterSpacing: "0.2em", fontWeight: 700, padding: "7px 14px", borderRadius: 999, background: BOARD.orange, color: BOARD.wine }}
                  >
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-col flex-1" style={{ padding: "26px 30px" }}>
                <div className="flex items-baseline justify-between gap-4">
                  <div className="font-serif-display" style={{ fontSize: 46, fontWeight: 600, color: BOARD.wine, lineHeight: 1.05 }}>
                    {p.nom}
                  </div>
                  {price && (
                    <div className="font-serif-display shrink-0" style={{ fontSize: 26, color: BOARD.orange, fontWeight: 600 }}>
                      {price}
                    </div>
                  )}
                </div>
                <div className="font-serif-display mt-3" style={{ fontSize: 24, lineHeight: 1.4, color: BOARD.muted }}>
                  {p.texte}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
