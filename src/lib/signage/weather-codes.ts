export type WeatherCode = number;

export const WMO: Record<WeatherCode, { emoji: string; label: string }> = {
  0: { emoji: "☀️", label: "Ciel dégagé" },
  1: { emoji: "🌤️", label: "Peu nuageux" },
  2: { emoji: "⛅", label: "Partiellement nuageux" },
  3: { emoji: "☁️", label: "Couvert" },
  45: { emoji: "🌫️", label: "Brouillard" },
  48: { emoji: "🌫️", label: "Brouillard givrant" },
  51: { emoji: "🌦️", label: "Bruine légère" },
  53: { emoji: "🌦️", label: "Bruine" },
  55: { emoji: "🌦️", label: "Bruine dense" },
  61: { emoji: "🌧️", label: "Pluie légère" },
  63: { emoji: "🌧️", label: "Pluie modérée" },
  65: { emoji: "🌧️", label: "Pluie forte" },
  71: { emoji: "❄️", label: "Neige légère" },
  73: { emoji: "❄️", label: "Neige" },
  75: { emoji: "❄️", label: "Neige forte" },
  80: { emoji: "🌦️", label: "Averses" },
  81: { emoji: "🌦️", label: "Averses fortes" },
  82: { emoji: "⛈️", label: "Averses violentes" },
  95: { emoji: "⛈️", label: "Orage" },
  96: { emoji: "⛈️", label: "Orage et grêle" },
  99: { emoji: "⛈️", label: "Orage violent" },
};

export const wmo = (c: number) => WMO[c] ?? { emoji: "🌡️", label: "—" };

export type WIconKind = "sun" | "partly" | "cloud" | "fog" | "drizzle" | "rain" | "snow" | "storm";

export const wmoKind = (c: number): WIconKind => {
  if (c === 0) return "sun";
  if (c === 1 || c === 2) return "partly";
  if (c === 3) return "cloud";
  if (c === 45 || c === 48) return "fog";
  if (c >= 51 && c <= 55) return "drizzle";
  if ((c >= 61 && c <= 65) || (c >= 80 && c <= 81)) return "rain";
  if (c >= 71 && c <= 77) return "snow";
  if (c === 82 || (c >= 95 && c <= 99)) return "storm";
  return "cloud";
};
