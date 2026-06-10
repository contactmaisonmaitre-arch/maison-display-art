import { memo, useCallback, useEffect, useState } from "react";
import type { WeatherData } from "@/types/signage";
import { SCENES } from "@/data/scenes";
import { SceneRenderer } from "@/components/signage/scenes/SceneRenderer";

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

  // Saut explicite (clic sur un pager dot ou flèches clavier).
  const jumpTo = useCallback(
    (nextIdx: number) => {
      const target = ((nextIdx % SCENES.length) + SCENES.length) % SCENES.length;
      if (target === index) return;
      setPreviousIndex(index);
      setIndex(target);
      setProgressKey((k) => k + 1);
    },
    [index]
  );

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

  // Raccourcis clavier : ← précédente, → suivante, Home → première.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") jumpTo(index + 1);
      else if (e.key === "ArrowLeft") jumpTo(index - 1);
      else if (e.key === "Home") jumpTo(0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, jumpTo]);

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
              animationPlayState: active ? "running" : "paused",
            }}
            data-scene-active={active ? "true" : "false"}
          >
            <SceneRenderer scene={SCENES[i]} weather={weather} active={active} />
          </div>
        );
      })}

      {/* Pager dots — cliquables pour sauter à une scène */}
      <div className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2">
        {SCENES.map((scene, i) => (
          <button
            key={i}
            type="button"
            onClick={() => jumpTo(i)}
            aria-label={`Aller à la scène ${i + 1} · ${scene.type}`}
            title={`${String(i + 1).padStart(2, "0")} · ${scene.type}`}
            className="group bg-transparent border-0 cursor-pointer flex items-center justify-center"
            style={{
              padding: "4px 8px", // hitbox élargie
              outline: "none",
            }}
          >
            <span
              className="rounded-full transition-all duration-700 ease-out group-hover:scale-125"
              style={{
                display: "block",
                width: 6,
                height: i === index ? 28 : 6,
                background:
                  i === index
                    ? "linear-gradient(180deg, hsl(var(--gold-lt)), hsl(var(--gold)))"
                    : "rgba(106,97,87,0.45)",
                boxShadow: i === index ? "0 0 12px hsl(var(--gold) / 0.7)" : "none",
              }}
            />
          </button>
        ))}
      </div>

      {/* Flèches navigation — visibles au survol, discrètes le reste du temps */}
      <button
        type="button"
        onClick={() => jumpTo(index - 1)}
        aria-label="Scène précédente"
        className="absolute left-3 top-1/2 z-30 -translate-y-1/2 flex items-center justify-center rounded-full transition-opacity opacity-0 hover:opacity-100 focus:opacity-100"
        style={{
          width: 48,
          height: 48,
          background: "rgba(26,22,15,0.7)",
          border: "1px solid rgba(201,168,76,0.45)",
          cursor: "pointer",
          color: "hsl(var(--gold))",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => jumpTo(index + 1)}
        aria-label="Scène suivante"
        className="absolute right-12 top-1/2 z-30 -translate-y-1/2 flex items-center justify-center rounded-full transition-opacity opacity-0 hover:opacity-100 focus:opacity-100"
        style={{
          width: 48,
          height: 48,
          background: "rgba(26,22,15,0.7)",
          border: "1px solid rgba(201,168,76,0.45)",
          cursor: "pointer",
          color: "hsl(var(--gold))",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

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
