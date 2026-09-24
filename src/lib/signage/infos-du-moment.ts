import type { WeatherData } from "@/types/signage";
import type { AirQuality } from "@/hooks/useAirQuality";
import { aqiLabel, pollenLevel } from "@/hooks/useAirQuality";
import type { InfosJson } from "@/hooks/useInfos";
import type { DoleFact } from "@/data/dole-facts";
import { daysBetween, inDaysLabel, marketStatus, moonPhase, nextHoliday, nextTimeChange } from "@/data/dole-pratique";
import { wmo } from "./weather-codes";

export interface InfoChip {
  key: string;
  label: string; // petite étiquette (« Météo », « Marché »…)
  text: string;
  important?: boolean; // passe en tête et reste plus longtemps
}

const hm = (iso?: string) => (iso ? iso.slice(11, 16).replace(":", "h") : null);
const dayNoon = (iso: string) => new Date(`${iso}T12:00:00`);
const frDate = (iso: string) =>
  dayNoon(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }).replace(/^1 /, "1er ");

/**
 * Infos pratiques du moment pour le bandeau du haut. Ne renvoie que ce qui
 * est connu : une source absente = pas de ligne (jamais d'info inventée).
 */
export const infosDuMoment = (
  now: Date,
  weather: WeatherData | null,
  air: AirQuality | null,
  infos: InfosJson | null,
  todaysEvents: DoleFact[],
): InfoChip[] => {
  const chips: InfoChip[] = [];
  const today = now.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const noon = dayNoon(today);

  if (weather?.current) {
    const w = wmo(weather.current.weather_code);
    const max = weather.daily?.temperature_2m_max?.[0];
    chips.push({
      key: "meteo",
      label: "Météo à Dole",
      text: `${Math.round(weather.current.temperature_2m)}° · ${w.label}${max != null ? ` · max ${Math.round(max)}°` : ""}`,
    });
    const rain = weather.daily?.precipitation_probability_max?.[0];
    if (rain != null && rain >= 50) {
      chips.push({ key: "pluie", label: "Parapluie", text: `Pluie probable aujourd'hui (${rain} %)`, important: rain >= 70 });
    }
    const rise = hm(weather.daily?.sunrise?.[0]);
    const set = hm(weather.daily?.sunset?.[0]);
    if (rise && set) chips.push({ key: "soleil", label: "Soleil", text: `Lever ${rise} · Coucher ${set}` });
  }

  const market = marketStatus(now);
  if (market) chips.push({ key: "marche", label: market.open ? "Marché ouvert" : "Marché", text: market.text, important: market.open });

  if (air) {
    const q = aqiLabel(air.aqi);
    const topPollen = air.pollen.find((p) => p.value >= 10);
    if (q) {
      chips.push({
        key: "air",
        label: "Qualité de l'air",
        text: `${q.label}${topPollen ? ` · pollen de ${topPollen.name} ${pollenLevel(topPollen.value)}` : ""}`,
        important: q.tone === "bad",
      });
    }
  }

  for (const e of todaysEvents.slice(0, 2)) {
    chips.push({ key: `evt-${e.title}`, label: "Aujourd'hui à Dole", text: e.title, important: true });
  }

  const v = (infos?.vacances ?? []).find((x) => x.end > today);
  if (v) {
    if (v.start <= today) {
      const last = new Date(dayNoon(v.end).getTime() - 86_400_000).toLocaleDateString("sv-SE");
      chips.push({ key: "vac", label: "Vacances scolaires", text: `${v.name} jusqu'au ${frDate(last)}` });
    } else {
      const n = daysBetween(noon, dayNoon(v.start));
      if (n <= 45) chips.push({ key: "vac", label: "Vacances scolaires · zone A", text: `${v.name} ${inDaysLabel(n)}` });
    }
  }

  const h = nextHoliday(now);
  if (h.inDays <= 21) chips.push({ key: "ferie", label: "Jour férié", text: `${h.name} ${inDaysLabel(h.inDays)}`, important: h.inDays <= 2 });

  const tc = nextTimeChange(now);
  if (tc.inDays <= 10) chips.push({ key: "heure", label: "Changement d'heure", text: `${tc.name} ${inDaysLabel(tc.inDays)} · ${tc.hint}`, important: tc.inDays <= 2 });

  const moon = moonPhase(now);
  chips.push({ key: "lune", label: "Ce soir", text: `${moon.name}` });

  // Les infos importantes d'abord.
  return [...chips.filter((c) => c.important), ...chips.filter((c) => !c.important)];
};
