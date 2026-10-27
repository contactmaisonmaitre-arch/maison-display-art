import { useEffect, useState } from "react";

const GOLD = "#C9A84C";
const URL = "https://maisonmaitre.com/products/le-chat-heureux-the-des-maitre-100g.json";

export const ChatHeureuxScene = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(URL);
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        const src: string | undefined = json?.product?.image?.src ?? json?.product?.images?.[0]?.src;
        if (!src) throw new Error("no image");
        if (alive) setPhoto(src);
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 flex" style={{ background: "#0A0A0A" }}>
      <div className="flex flex-col justify-center" style={{ width: "60%", padding: "0 6vw" }}>
        <div style={{ color: GOLD, fontSize: 14, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 28 }}>
          ★ Coup de cœur · Thé des Maitre
        </div>
        <h2 className="font-serif" style={{ fontSize: "4rem", lineHeight: 1.05, color: "#F3EBDD", margin: 0 }}>
          Le Chat Heureux
        </h2>
        <div className="font-serif italic" style={{ color: GOLD, fontSize: 32, marginTop: 12 }}>
          Notre incontournable
        </div>
        <p style={{ color: "#CFC4B0", fontSize: 24, lineHeight: 1.5, marginTop: 32, maxWidth: 640 }}>
          Un thé vert de caractère — doux, floral, profond.
        </p>
        <div className="flex items-center" style={{ gap: 24, marginTop: 40 }}>
          <span className="font-serif" style={{ color: GOLD, fontSize: 44, fontVariantNumeric: "tabular-nums" }}>
            9,50 € <span style={{ fontSize: 20, opacity: 0.7 }}>/ 100g</span>
          </span>
          <span style={{ border: `1px solid ${GOLD}`, color: GOLD, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 18px" }}>
            Disponible en boutique
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center" style={{ width: "40%", padding: "6vh 5vw 6vh 0" }}>
        <div className="relative w-full h-full overflow-hidden" style={{ border: `1px solid ${GOLD}` }}>
          {photo && !failed ? (
            <img src={photo} alt="Le Chat Heureux" className="w-full h-full object-cover" onError={() => setFailed(true)} />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-serif italic"
              style={{ background: "linear-gradient(135deg, #E8C872, #C9A84C 45%, #7A5A22)", color: "#1A1510", fontSize: 40 }}
            >
              Le Chat Heureux
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
