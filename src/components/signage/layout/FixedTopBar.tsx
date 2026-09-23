import { memo } from "react";
import { getSaintDuJour } from "@/data/saints";
import { formatDateLong, pad } from "@/lib/signage/date";
import { useNow } from "@/hooks/useNow";

export const FixedTopBar = memo(() => {
  const now = useNow();
  return (
    <div
      className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-16"
      style={{
        height: 118,
        // Pas de backdrop-filter : très lourd sur les navigateurs TV. On compense avec
        // un fond opaque (0.96 → 1) qui rend visuellement quasi-équivalent.
        background: "#F4F0E7",
        borderBottom: "1px solid #E3D6BC",
        boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 18px 40px -20px rgba(70,18,31,0.25)",
      }}
    >
      {/* gold underline accent */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: "linear-gradient(90deg, transparent, hsl(var(--gold)) 30%, hsl(var(--gold)) 70%, transparent)" }} />
      <div className="flex items-center gap-8">
        <img src="/brand/logo-wine.png" alt="Maison Maitre" style={{ height: 88, width: "auto", display: "block" }} />
        <div className="mm-eyebrow" style={{ fontSize: 13, color: "hsl(var(--taupe))", lineHeight: 1.6 }}>
          Maison de spécialités
          <br />
          Dole · Jura
        </div>
        <div style={{ width: 1, height: 64, background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.55), transparent)" }} />
        <div>
          <div className="mm-eyebrow" style={{ fontSize: 12, color: "hsl(var(--taupe))" }}>
            Fête du jour
          </div>
          <div className="font-serif-display italic leading-none" style={{ fontSize: 38, color: "hsl(var(--espresso))" }}>
            {getSaintDuJour(now)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div style={{ width: 1, height: 64, background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.55), transparent)" }} />
        <div className="text-right">
          <div className="font-serif-display leading-none tabular-nums flex items-start justify-end" style={{ color: "hsl(var(--espresso))" }}>
            <span style={{ fontSize: 68, fontWeight: 500, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums lining-nums" }}>
              {pad(now.getHours())}:{pad(now.getMinutes())}
            </span>
            <span className="font-serif-display tabular-nums" style={{ fontSize: 26, color: "hsl(var(--copper))", marginLeft: 8, marginTop: 6, fontVariantNumeric: "tabular-nums lining-nums" }}>
              {pad(now.getSeconds())}
            </span>
          </div>
          <div className="mt-2 mm-eyebrow" style={{ fontSize: 12, color: "hsl(var(--taupe))" }}>
            {formatDateLong(now)}
          </div>
        </div>
      </div>
    </div>
  );
});
FixedTopBar.displayName = "FixedTopBar";
