import { memo, useEffect, useState } from "react";
import type { WeatherData } from "@/types/signage";
import { SCENES } from "@/data/scenes";
import { SceneRenderer } from "@/components/signage/scenes/SceneRenderer";
import { PaperGrain } from "./PaperGrain";

interface CenterPanelProps {
  weather: WeatherData | null;
}

// Durée du fade-out / fade-in d'une scène — doit matcher la transition CSS plus bas.
const TRANSITION_MS = 1000;

export const CenterPanel = memo(({ weather }: CenterPanelProps) => {
  const [index, setIndex] = useState(0);
  // Index de la scène qui est en train de fade out — null entre les transitions.
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [progressKey, setProgressKey] = useState(0);

  // Cycle principal — au bout de la durée de la scène active, on passe à la suivante.
  useEffect(() => {
    const t = setTimeout(() => {
      setPreviousIndex(index);
      setIndex((i) => (i + 1) % SCENES.length);
      setProgressKey((k) => k + 1);
    }, SCENES[index].duration);
    return () => clearTimeout(t);
  }, [index]);

  // Une fois la transition terminée, on démonte la scène précédente.
  useEffect(() => {
    if (previousIndex === null) return;
    const t = setTimeout(() => setPreviousIndex(null), TRANSITION_MS + 100);
    return () => clearTimeout(t);
  }, [previousIndex]);

  // On ne monte que les scènes nécessaires : active + suivante (préchauffe) + précédente (fade-out).
  const nextIndex = (index + 1) % SCENES.length;
  const mounted = new Set<number>([index, nextIndex]);
  if (previousIndex !== null) mounted.add(previousIndex);
  const mountedList = Array.from(mounted).sort((a, b) => a - b);

  return (
    <main
      className="relative h-full w-full overflow-hidden"
      style={{ animation: "mm-fade-in 1.2s ease-out both" }}
    >
      {mountedList.map((i) => {
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
              transition: `opacity ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              pointerEvents: active ? "auto" : "none",
              willChange: active ? "opacity, transform" : "auto",
            }}
          >
            <SceneRenderer scene={SCENES[i]} weather={weather} active={active} />
          </div>
        );
      })}

      <PaperGrain />

      {/* Pager dots — restent affichés pour toutes les scènes (pas de coût React) */}
      <div className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
        {SCENES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-700 ease-out"
            style={{
              width: 6,
              height: i === index ? 28 : 6,
              background:
                i === index
                  ? "linear-gradient(180deg, hsl(var(--gold-lt)), hsl(var(--gold)))"
                  : "rgba(106,97,87,0.3)",
              boxShadow: i === index ? "0 0 12px hsl(var(--gold) / 0.7)" : "none",
            }}
          />
        ))}
      </div>

      {/* Barre de progression dorée */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ height: 3, background: "rgba(201,168,76,0.10)" }}
      >
        <div
          key={progressKey}
          className="h-full origin-left"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(var(--gold-lt)) 20%, hsl(var(--gold)) 50%, hsl(var(--gold-lt)) 80%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: `mm-progress ${SCENES[index].duration}ms linear forwards, mm-shimmer 3s linear infinite`,
            boxShadow:
              "0 0 18px hsl(var(--gold) / 0.85), 0 0 6px hsl(var(--gold-lt) / 0.6)",
          }}
        />
      </div>
    </main>
  );
});
CenterPanel.displayName = "CenterPanel";
