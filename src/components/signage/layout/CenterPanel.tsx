import { memo, useEffect, useState } from "react";
import type { WeatherData } from "@/types/signage";
import { SCENES } from "@/data/scenes";
import { SceneRenderer } from "@/components/signage/scenes/SceneRenderer";
import { PaperGrain } from "./PaperGrain";

interface CenterPanelProps {
  weather: WeatherData | null;
}

export const CenterPanel = memo(({ weather }: CenterPanelProps) => {
  const [index, setIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % SCENES.length);
      setProgressKey((k) => k + 1);
    }, SCENES[index].duration);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <main className="relative h-full w-full overflow-hidden" style={{ animation: "mm-fade-in 1.2s ease-out both" }}>
      {SCENES.map((scene, i) => {
        const active = i === index;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: active ? 1 : 0,
              transform: active
                ? "translateY(0) scale(1)"
                : "translateY(14px) scale(0.985)",
              transition:
                "opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1), transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
              pointerEvents: active ? "auto" : "none",
              willChange: active ? "opacity, transform" : "auto",
            }}
          >
            <SceneRenderer scene={scene} weather={weather} active={active} />
          </div>
        );
      })}

      <PaperGrain />

      {/* Pager dots */}
      <div className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
        {SCENES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-700 ease-out"
            style={{
              width: 6,
              height: i === index ? 28 : 6,
              background: i === index
                ? "linear-gradient(180deg, hsl(var(--gold-lt)), hsl(var(--gold)))"
                : "rgba(106,97,87,0.3)",
              boxShadow: i === index ? "0 0 12px hsl(var(--gold) / 0.7)" : "none",
            }}
          />
        ))}
      </div>

      {/* Bordure basse — barre de progression dorée plus lisible */}
      <div className="absolute bottom-0 left-0 right-0 z-20" style={{ height: 3, background: "rgba(201,168,76,0.10)" }}>
        <div
          key={progressKey}
          className="h-full origin-left"
          style={{
            background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold-lt)) 20%, hsl(var(--gold)) 50%, hsl(var(--gold-lt)) 80%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: `mm-progress ${SCENES[index].duration}ms linear forwards, mm-shimmer 3s linear infinite`,
            boxShadow: "0 0 18px hsl(var(--gold) / 0.85), 0 0 6px hsl(var(--gold-lt) / 0.6)",
          }}
        />
      </div>
    </main>
  );
});
CenterPanel.displayName = "CenterPanel";
