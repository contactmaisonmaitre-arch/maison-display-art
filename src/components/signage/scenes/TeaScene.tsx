import { getSaintDuJour } from "@/data/saints";

export const TeaScene = ({ now }: { now: Date }) => {
  const saint = getSaintDuJour(now);
  return (
    <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #B0C4A0, #507040, #182A10)" }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(24,42,16,0.04) 0%, rgba(242,237,228,0.9) 58%, rgba(242,237,228,0.98) 100%)" }} />
      <div className="relative flex h-full flex-col justify-center px-28 pb-24 pt-40" style={{ animation: "mm-slide-up 1.2s ease-out 0.3s both" }}>
        <div className="flex items-center gap-6">
          <div style={{ width: 88, height: 2, backgroundColor: "hsl(var(--gold))" }} />
          <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
            Salon de Thé · Thés des Maitre
          </div>
        </div>
        <h2 className="mt-10 max-w-[1320px] font-serif-display leading-[0.96]" style={{ fontSize: 126, color: "hsl(var(--ink))" }}>
          <span className="font-semibold">Notre marque,</span>{" "}
          <span className="italic font-light" style={{ color: "hsl(var(--copper))" }}>nos cuvées.</span>
        </h2>
        <p className="mt-10 max-w-[1120px] font-serif-display italic" style={{ fontSize: 42, color: "hsl(var(--taupe))", lineHeight: 1.28 }}>
          Une collection exclusive de thés d'exception. En boutique et sur maisonmaitre.com.
        </p>
        <div
          className="mt-12 inline-flex items-center gap-6 rounded-sm px-9 py-7 self-start"
          style={{ backgroundColor: "rgba(46,36,25,0.92)", color: "hsl(var(--linen))" }}
        >
          <div style={{ fontSize: 48 }}>✦</div>
          <div>
            <div className="font-sans-ui uppercase" style={{ fontSize: 16, letterSpacing: "0.32em", color: "hsl(var(--gold-lt))" }}>
              ◆ Fête du jour
            </div>
            <div className="mt-2 font-serif-display italic" style={{ fontSize: 48, fontWeight: 300 }}>
              Bonne fête {saint}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
