import { useEffect, useState } from "react";
import { FIVE_STAR_REVIEWS, REVIEW_URL } from "@/data/reviews";

// Logo Google "G" officiel multicolore
const GoogleG = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
    <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
  </svg>
);

const GoldStar = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <defs>
      <linearGradient id={`gs-${size}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F0CB6E" />
        <stop offset="55%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#8C6F2A" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.6l2.78 5.96 6.55.78-4.84 4.5 1.31 6.46L12 17.1l-5.8 3.2 1.31-6.46-4.84-4.5 6.55-.78L12 2.6z"
      fill={`url(#gs-${size})`}
      stroke="#7A5C1F"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  </svg>
);

const GoldStars = ({ size = 24, gap = 4, count = 5 }: { size?: number; gap?: number; count?: number }) => (
  <span style={{ display: "inline-flex", gap, alignItems: "center" }}>
    {Array.from({ length: count }).map((_, i) => <GoldStar key={i} size={size} />)}
  </span>
);

export const ReviewScene = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % FIVE_STAR_REVIEWS.length), 4500);
    return () => clearInterval(t);
  }, []);
  const r = FIVE_STAR_REVIEWS[idx];
  // QR code Google avec couleurs et logo intégré (api goqr personnalisable)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=720x720&margin=8&qzone=2&color=1A160F&bgcolor=FFFFFF&ecc=H&data=${encodeURIComponent(REVIEW_URL)}`;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #1A160F 0%, #2E2419 60%, #1A160F 100%)" }}>
      {/* halos colorés Google */}
      <div className="pointer-events-none absolute" style={{ top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(66,133,244,0.18) 0%, transparent 65%)" }} />
      <div className="pointer-events-none absolute" style={{ bottom: "-25%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,67,53,0.14) 0%, transparent 65%)" }} />
      <div className="pointer-events-none absolute" style={{ top: "30%", right: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,188,5,0.12) 0%, transparent 65%)" }} />

      <div className="relative h-full px-24 pb-24 pt-36 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-5">
          <GoogleG size={56} />
          <div style={{ width: 88, height: 2, backgroundColor: "hsl(var(--gold))" }} />
          <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.42em", color: "hsl(var(--gold))" }}>
            Votre avis sur Google
          </div>
        </div>

        <h2 className="mt-7 font-serif-display leading-[0.95]" style={{ fontSize: "8vw", color: "hsl(var(--linen))" }}>
          <span className="font-light">Partagez votre</span>{" "}
          <span className="italic font-light" style={{ color: "hsl(var(--gold-lt))" }}>expérience.</span>
        </h2>

        <div className="mt-12 grid flex-1 gap-16" style={{ gridTemplateColumns: "auto 1fr" }}>
          {/* QR card façon carte téléphone */}
          <div
            className="flex flex-col items-center justify-center"
            style={{
              padding: 32,
              borderRadius: 32,
              background: "linear-gradient(180deg, #FFFFFF 0%, #FAF6EE 100%)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.5)",
              animation: "mm-slide-up 1s ease-out 0.3s both",
            }}
          >
            <div className="relative" style={{ padding: 18, background: "#fff", borderRadius: 18, border: "1px solid hsl(var(--gold))" }}>
              <img src={qrUrl} alt="QR avis Google" style={{ width: 460, height: 460, display: "block" }} />
              {/* Logo G au centre */}
              <div
                className="absolute"
                style={{
                  top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  width: 96, height: 96, borderRadius: 20, background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                }}
              >
                <GoogleG size={64} />
              </div>
            </div>
            <div className="mt-5 font-sans-ui uppercase text-center" style={{ fontSize: 12, letterSpacing: "0.42em", color: "hsl(var(--gold))" }}>
              ◆ Scannez pour nous noter ◆
            </div>
            <div className="mt-2 font-serif-display italic text-center" style={{ fontSize: 22, color: "hsl(var(--espresso))" }}>
              Votre avis compte
            </div>
          </div>

          {/* Reviews */}
          <div
            className="mm-noise flex flex-col"
            style={{
              padding: 44,
              borderRadius: 4,
              background: "#1A1510",
              borderLeft: "4px solid hsl(var(--gold))",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="font-sans-ui uppercase" style={{ fontSize: 15, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
                Derniers avis 5 étoiles
              </div>
              <div className="font-serif-display flex items-baseline gap-3" style={{ color: "hsl(var(--linen))" }}>
                <span style={{ fontSize: 64, fontWeight: 300 }}>5,0</span>
                <GoldStars size={22} gap={4} />
              </div>
            </div>

            <div key={idx} className="mt-8 flex-1 flex flex-col" style={{ animation: "mm-review-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
              <GoldStars size={42} gap={8} />
              <p className="mt-8 font-serif-display italic flex-1" style={{ fontSize: 56, lineHeight: 1.25, color: "hsl(var(--linen))", fontWeight: 300 }}>
                « {r.text} »
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div
                  className="flex items-center justify-center font-serif-display"
                  style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-lt)))",
                    color: "#1A160F", fontSize: 28, fontWeight: 600,
                    boxShadow: "0 0 0 2px rgba(201,168,76,0.3)",
                  }}
                >
                  {r.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-serif-display" style={{ fontSize: 26, color: "hsl(var(--linen))" }}>{r.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center" style={{ width: 16, height: 16, borderRadius: "50%", background: "#4285F4" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.32em", color: "rgba(242,237,228,0.65)" }}>Avis vérifié · Google</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {FIVE_STAR_REVIEWS.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i === idx ? "hsl(var(--gold))" : "rgba(242,237,228,0.15)", transition: "background-color 0.4s" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
