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
        background: "linear-gradient(180deg, rgba(251,247,238,0.96) 0%, rgba(244,238,226,0.92) 100%)",
        borderBottom: "1px solid rgba(201,168,76,0.32)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 18px 40px -20px rgba(46,36,25,0.25)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* gold underline accent */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: "linear-gradient(90deg, transparent, hsl(var(--gold)) 30%, hsl(var(--gold)) 70%, transparent)" }} />
      <div className="flex items-center gap-8">
        <div>
          <div className="mm-eyebrow" style={{ fontSize: 12, color: "hsl(var(--gold))" }}>
            Boutique · Dole, Jura
          </div>
          <div className="leading-none flex items-baseline gap-3" style={{ color: "hsl(var(--espresso))" }}>
            <span className="font-sans-ui font-light tracking-wide" style={{ fontSize: 38, letterSpacing: "0.04em" }}>Maison</span>
            <span className="font-serif-display italic" style={{ fontSize: 48, color: "hsl(var(--gold))", fontWeight: 500 }}>Maitre</span>
          </div>
        </div>
        <div style={{ width: 1, height: 64, background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.55), transparent)" }} />
        <div>
          <div className="mm-eyebrow" style={{ fontSize: 11, color: "hsl(var(--mink))" }}>
            ◆ Fête du jour
          </div>
          <div className="font-serif-display italic leading-none" style={{ fontSize: 38, color: "hsl(var(--espresso))" }}>
            {getSaintDuJour(now)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div style={{ width: 1, height: 64, background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.55), transparent)" }} />
        {/* Live pill */}
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2"
          style={{ background: "rgba(46,36,25,0.06)", border: "1px solid rgba(46,36,25,0.12)" }}
        >
          <span
            className="rounded-full"
            style={{ width: 8, height: 8, background: "#16a34a", boxShadow: "0 0 10px #16a34a", animation: "mm-glow 1.6s ease-in-out infinite" }}
          />
          <span className="font-mono-ui uppercase" style={{ fontSize: 10, letterSpacing: "0.32em", color: "hsl(var(--espresso))" }}>
            En direct
          </span>
        </div>
        <div className="text-right">
          <div className="font-mono-ui leading-none tabular-nums flex items-start justify-end" style={{ color: "hsl(var(--espresso))" }}>
            <span style={{ fontSize: 84, fontWeight: 300, letterSpacing: "-0.05em" }}>
              {pad(now.getHours())}:{pad(now.getMinutes())}
            </span>
            <span className="font-mono-ui tabular-nums" style={{ fontSize: 26, color: "hsl(var(--gold))", marginLeft: 8, marginTop: 4, letterSpacing: "0.05em" }}>
              {pad(now.getSeconds())}
            </span>
          </div>
          <div className="mt-2 mm-eyebrow" style={{ fontSize: 11, color: "hsl(var(--gold))" }}>
            {formatDateLong(now)}
          </div>
        </div>
      </div>
    </div>
  );
});
FixedTopBar.displayName = "FixedTopBar";
