import { memo, useEffect, useMemo, useState } from "react";
import type { WeatherData } from "@/types/signage";
import { useAirQuality } from "@/hooks/useAirQuality";
import { useInfos } from "@/hooks/useInfos";
import { eventDate, useDoleEvents } from "@/hooks/useDoleEvents";
import { useNow } from "@/hooks/useNow";
import { infosDuMoment } from "@/lib/signage/infos-du-moment";

const STEP_MS = 7000;

// Bandeau d'infos pratiques du bandeau du haut : une info à la fois, en fondu.
export const InfoRotator = memo(({ weather }: { weather: WeatherData | null }) => {
  const now = useNow(60_000);
  const air = useAirQuality();
  const infos = useInfos();
  const events = useDoleEvents();
  const today = now.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const todays = useMemo(() => events.filter((e) => eventDate(e, now) === today), [events, now, today]);
  const chips = useMemo(() => infosDuMoment(now, weather, air, infos, todays), [now, weather, air, infos, todays]);

  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => x + 1), STEP_MS);
    return () => clearInterval(id);
  }, []);
  if (chips.length === 0) return null;
  const c = chips[i % chips.length];

  return (
    <div className="flex flex-col items-center justify-center text-center" style={{ width: 720 }}>
      <div key={`${c.key}-${i}`} style={{ animation: "mm-fade-in 0.7s ease-out both" }}>
        <div className="mm-eyebrow" style={{ fontSize: 12, color: c.important ? "hsl(var(--copper))" : "hsl(var(--taupe))" }}>
          {c.label}
        </div>
        <div
          className="font-serif-display leading-tight"
          style={{ fontSize: 30, color: "hsl(var(--espresso))", fontWeight: 500, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 720 }}
        >
          {c.text}
        </div>
      </div>
      <div className="flex gap-1.5 mt-2">
        {chips.map((x, k) => (
          <span
            key={x.key}
            style={{
              width: k === i % chips.length ? 18 : 5,
              height: 3,
              borderRadius: 2,
              background: k === i % chips.length ? "hsl(var(--copper))" : "rgba(138,90,98,0.3)",
              transition: "all 0.5s",
            }}
          />
        ))}
      </div>
    </div>
  );
});
InfoRotator.displayName = "InfoRotator";
