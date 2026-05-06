import { useEffect, useState } from "react";
import type { WeatherData } from "@/types/signage";
import { wmo, wmoKind, type WIconKind } from "@/lib/signage/weather-codes";
import { DAYS_FR_SHORT } from "@/lib/signage/date";

interface WeatherIconProps {
  code: number;
  size?: number;
  color?: string;
  accent?: string;
}

const WeatherIcon = ({ code, size = 220, color = "hsl(var(--espresso))", accent = "hsl(var(--gold))" }: WeatherIconProps) => {
  const kind: WIconKind = wmoKind(code);
  const s = size;
  const sw = Math.max(2, s * 0.018);
  const common = { fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden>
      {kind === "sun" && (
        <g {...common} stroke={accent}>
          <circle cx="50" cy="50" r="18" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const x1 = 50 + Math.cos(a) * 28, y1 = 50 + Math.sin(a) * 28;
            const x2 = 50 + Math.cos(a) * 40, y2 = 50 + Math.sin(a) * 40;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
      )}
      {kind === "partly" && (
        <g {...common}>
          <g stroke={accent}>
            <circle cx="38" cy="40" r="13" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i * Math.PI) / 4;
              return <line key={i} x1={38 + Math.cos(a) * 19} y1={40 + Math.sin(a) * 19} x2={38 + Math.cos(a) * 27} y2={40 + Math.sin(a) * 27} />;
            })}
          </g>
          <path d="M30 70 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H34 q-12 0 -12 -10 z" />
        </g>
      )}
      {kind === "cloud" && (
        <path {...common} d="M22 68 q0 -16 16 -16 q4 -12 18 -12 q16 0 18 16 q12 0 12 12 q0 12 -14 12 H30 q-14 0 -14 -12 z" />
      )}
      {kind === "fog" && (
        <g {...common}>
          <path d="M22 56 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H26 q-12 0 -12 -10 z" />
          <line x1="18" y1="78" x2="82" y2="78" />
          <line x1="26" y1="88" x2="74" y2="88" />
        </g>
      )}
      {kind === "drizzle" && (
        <g {...common}>
          <path d="M22 54 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H26 q-12 0 -12 -10 z" />
          <line x1="36" y1="76" x2="32" y2="86" stroke={accent} />
          <line x1="52" y1="76" x2="48" y2="86" stroke={accent} />
          <line x1="68" y1="76" x2="64" y2="86" stroke={accent} />
        </g>
      )}
      {kind === "rain" && (
        <g {...common}>
          <path d="M22 54 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H26 q-12 0 -12 -10 z" />
          <line x1="34" y1="74" x2="28" y2="92" stroke={accent} />
          <line x1="50" y1="74" x2="44" y2="92" stroke={accent} />
          <line x1="66" y1="74" x2="60" y2="92" stroke={accent} />
        </g>
      )}
      {kind === "snow" && (
        <g {...common}>
          <path d="M22 54 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H26 q-12 0 -12 -10 z" />
          {[34, 50, 66].map((x) => (
            <g key={x} stroke={accent}>
              <line x1={x} y1="78" x2={x} y2="92" />
              <line x1={x - 5} y1="81" x2={x + 5} y2="89" />
              <line x1={x - 5} y1="89" x2={x + 5} y2="81" />
            </g>
          ))}
        </g>
      )}
      {kind === "storm" && (
        <g {...common}>
          <path d="M22 54 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H26 q-12 0 -12 -10 z" />
          <path d="M50 70 L42 86 L52 86 L46 96" stroke={accent} fill="none" />
        </g>
      )}
    </svg>
  );
};

export const WeatherScene = ({ weather }: { weather: WeatherData | null }) => {
  const targetTemp = weather ? Math.round(weather.current.temperature_2m) : 0;
  const [displayTemp, setDisplayTemp] = useState(0);
  useEffect(() => {
    if (!weather) return;
    const start = performance.now();
    const dur = 1400;
    const from = 0;
    const to = targetTemp;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayTemp(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetTemp, weather]);

  if (!weather) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: "hsl(var(--cream))" }}>
        <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.42em", color: "hsl(var(--gold))" }}>Météo · Dole, Jura</div>
        <div className="mt-8 font-serif-display italic" style={{ fontSize: 86, color: "hsl(var(--espresso))" }}>Chargement de la météo…</div>
      </div>
    );
  }
  const w = weather.current;
  return (
    <div className="mm-cream mm-grid-light absolute inset-0 flex flex-col items-center justify-center px-24 pb-24 pt-36">
      <div
        className="pointer-events-none absolute"
        style={{ top: "-15%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.22) 0%, transparent 65%)", animation: "mm-glow 10s ease-in-out infinite" }}
      />
      <div className="relative flex items-center gap-5" style={{ animation: "mm-slide-up 1s ease-out both" }}>
        <div style={{ width: 64, height: 1, background: "linear-gradient(90deg, transparent, hsl(var(--gold)))" }} />
        <div className="mm-eyebrow" style={{ fontSize: 22, color: "hsl(var(--gold))" }}>Météo · Dole, Jura</div>
        <div style={{ width: 64, height: 1, background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
      </div>
      <div className="relative mt-8 flex items-center gap-12" style={{ animation: "mm-slide-up 1s ease-out 0.2s both" }}>
        <div style={{ filter: "drop-shadow(0 12px 30px rgba(46,36,25,0.18))" }}>
          <WeatherIcon code={w.weather_code} size={240} />
        </div>
        <div className="relative font-serif-display leading-none tabular-nums" style={{ fontSize: 360, fontWeight: 200, color: "hsl(var(--espresso))", letterSpacing: "-0.05em" }}>
          {displayTemp}
          <span
            className="font-serif-display italic"
            style={{
              position: "absolute",
              top: 24,
              right: -64,
              fontSize: 110,
              fontWeight: 300,
              color: "hsl(var(--copper))",
            }}
          >
            °
          </span>
        </div>
      </div>
      <div className="relative mt-6 font-serif-display italic" style={{ fontSize: 62, color: "hsl(var(--taupe))" }}>
        {wmo(w.weather_code).label}
      </div>
      <div className="relative mt-12 mm-glass-light flex gap-12 rounded-2xl px-12 py-7" style={{ animation: "mm-slide-up 1s ease-out 0.4s both" }}>
        {[
          { l: "Humidité", v: Math.round(w.relative_humidity_2m), u: "%" },
          { l: "Vent", v: Math.round(w.wind_speed_10m), u: "km/h" },
          { l: "Ressenti", v: Math.round(w.apparent_temperature), u: "°" },
          { l: "Indice UV", v: Math.round(w.uv_index ?? 0), u: "" },
        ].map((s, i, arr) => (
          <div key={s.l} className="flex items-center gap-12">
            <div className="text-center">
              <div className="mm-eyebrow" style={{ fontSize: 13, color: "hsl(var(--mink))" }}>{s.l}</div>
              <div className="mt-2 font-serif-display tabular-nums leading-none" style={{ color: "hsl(var(--espresso))" }}>
                <span style={{ fontSize: 88, fontWeight: 300, letterSpacing: "-0.02em" }}>{s.v}</span>
                {s.u && (
                  <span className="font-sans-ui" style={{ fontSize: 22, fontWeight: 400, color: "hsl(var(--gold))", marginLeft: 6, letterSpacing: "0.05em" }}>
                    {s.u}
                  </span>
                )}
              </div>
            </div>
            {i < arr.length - 1 && <div style={{ width: 1, height: 90, background: "rgba(46,36,25,0.15)" }} />}
          </div>
        ))}
      </div>
      <div className="relative mt-12 flex gap-10" style={{ animation: "mm-slide-up 1s ease-out 0.55s both" }}>
        {weather.daily.time.slice(1, 5).map((iso, i) => {
          const d = new Date(iso);
          const code = weather.daily.weather_code[i + 1];
          return (
            <div
              key={iso}
              className="flex flex-col items-center rounded-xl px-8 py-5"
              style={{ background: "rgba(46,36,25,0.04)", border: "1px solid rgba(46,36,25,0.08)" }}
            >
              <div className="mm-eyebrow" style={{ fontSize: 13, color: "hsl(var(--gold))" }}>{DAYS_FR_SHORT[d.getDay()]}</div>
              <div className="my-3" style={{ fontSize: 52 }}>{wmo(code).emoji}</div>
              <div className="font-serif-display" style={{ fontSize: 32, color: "hsl(var(--espresso))" }}>
                {Math.round(weather.daily.temperature_2m_max[i + 1])}°
                <span style={{ color: "hsl(var(--mink))" }}> {Math.round(weather.daily.temperature_2m_min[i + 1])}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
