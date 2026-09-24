import { useEffect, useState } from "react";

export interface AirQuality {
  aqi: number | null; // indice européen (EAQI)
  pollen: { name: string; value: number }[];
  uv: number | null;
}

const URL =
  "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=47.0924&longitude=5.4910&current=european_aqi,uv_index,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FParis";

const POLLEN: Record<string, string> = {
  alder_pollen: "aulne",
  birch_pollen: "bouleau",
  grass_pollen: "graminées",
  mugwort_pollen: "armoise",
  olive_pollen: "olivier",
  ragweed_pollen: "ambroisie",
};

/** Qualité de l'air + pollens à Dole (open-meteo, sans clé), toutes les 30 min. */
export const useAirQuality = (): AirQuality | null => {
  const [data, setData] = useState<AirQuality | null>(null);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(URL);
        if (!res.ok) return;
        const { current } = await res.json();
        if (cancelled || !current) return;
        setData({
          aqi: current.european_aqi ?? null,
          uv: current.uv_index ?? null,
          pollen: Object.entries(POLLEN)
            .map(([k, name]) => ({ name, value: Number(current[k] ?? 0) }))
            .sort((a, b) => b.value - a.value),
        });
      } catch {
        /* réseau : on garde la dernière valeur */
      }
    };
    load();
    const id = setInterval(load, 30 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);
  return data;
};

/** Libellé de l'indice européen de qualité de l'air. */
export const aqiLabel = (aqi: number | null) => {
  if (aqi == null) return null;
  if (aqi <= 20) return { label: "Très bonne", tone: "good" as const };
  if (aqi <= 40) return { label: "Bonne", tone: "good" as const };
  if (aqi <= 60) return { label: "Moyenne", tone: "mid" as const };
  if (aqi <= 80) return { label: "Médiocre", tone: "bad" as const };
  return { label: "Mauvaise", tone: "bad" as const };
};

/** Niveau de pollen (grains/m³) → mot simple. Seuils indicatifs. */
export const pollenLevel = (v: number) => (v < 10 ? "faible" : v < 50 ? "modéré" : v < 200 ? "élevé" : "très élevé");
