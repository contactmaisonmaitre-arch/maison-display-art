import type { ReactNode } from "react";
import type { WeatherData } from "@/types/signage";
import { BOARD } from "@/data/carte";
import { aqiLabel, pollenLevel, useAirQuality } from "@/hooks/useAirQuality";
import { useInfos } from "@/hooks/useInfos";
import { eventDate, useDoleEvents } from "@/hooks/useDoleEvents";
import { daysBetween, inDaysLabel, marketStatus, moonPhase, nextHoliday, nextTimeChange } from "@/data/dole-pratique";
import { wmo } from "@/lib/signage/weather-codes";

const hm = (iso?: string) => (iso ? iso.slice(11, 16).replace(":", "h") : "—");

const Tile = ({ label, big, sub, accent = false, i }: { label: string; big: ReactNode; sub?: ReactNode; accent?: boolean; i: number }) => (
  <div
    className="flex flex-col justify-between rounded-[26px]"
    style={{
      padding: "26px 30px",
      background: accent ? BOARD.wine : "#FFFFFF",
      color: accent ? "#FFFFFF" : BOARD.wine,
      boxShadow: accent ? "none" : "0 0 0 1px #E3D6BC inset",
      animation: `mm-slide-up 0.8s ease-out ${0.15 + i * 0.08}s both`,
      minHeight: 0,
    }}
  >
    <div className="font-serif-display uppercase" style={{ fontSize: 14, letterSpacing: "0.26em", fontWeight: 700, color: accent ? BOARD.sand : BOARD.orange }}>
      {label}
    </div>
    <div className="font-serif-display" style={{ fontSize: 42, fontWeight: 600, lineHeight: 1.08, marginTop: 10 }}>
      {big}
    </div>
    {sub && (
      <div className="font-serif-display italic" style={{ fontSize: 22, marginTop: 8, lineHeight: 1.3, color: accent ? BOARD.sand : BOARD.muted }}>
        {sub}
      </div>
    )}
  </div>
);

// « Aujourd'hui à Dole » : l'essentiel pratique pour les Dolois, en un coup d'œil.
export const AujourdhuiScene = ({ weather }: { weather: WeatherData | null }) => {
  const now = new Date();
  const air = useAirQuality();
  const infos = useInfos();
  const events = useDoleEvents();
  const today = now.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const noon = new Date(`${today}T12:00:00`);

  const w = weather?.current ? wmo(weather.current.weather_code) : null;
  const market = marketStatus(now);
  const q = aqiLabel(air?.aqi ?? null);
  const topPollen = air?.pollen.find((p) => p.value >= 10);
  const moon = moonPhase(now);
  const hol = nextHoliday(now);
  const vac = (infos?.vacances ?? []).find((v) => v.end > today);
  const vacIn = vac ? daysBetween(noon, new Date(`${vac.start}T12:00:00`)) : null;
  const upcoming = events
    .map((e) => ({ e, d: eventDate(e, now) }))
    .filter((x) => x.d && x.d >= today)
    .sort((a, b) => (a.d! < b.d! ? -1 : 1));
  const next = upcoming[0];

  const tiles: { label: string; big: ReactNode; sub?: ReactNode; accent?: boolean }[] = [];
  if (weather?.current && w) {
    const d = weather.daily;
    tiles.push({
      label: "Météo",
      big: `${Math.round(weather.current.temperature_2m)}° · ${w.label}`,
      sub: `Entre ${Math.round(d.temperature_2m_min[0])}° et ${Math.round(d.temperature_2m_max[0])}°${
        d.precipitation_probability_max?.[0] != null ? ` · pluie ${d.precipitation_probability_max[0]} %` : ""
      }`,
      accent: true,
    });
    if (d.sunrise?.[0]) tiles.push({ label: "Soleil", big: `${hm(d.sunrise[0])} → ${hm(d.sunset?.[0])}`, sub: `${moon.name} ce soir` });
  }
  if (market) tiles.push({ label: market.open ? "Marché · ouvert" : "Marché", big: market.open ? "C'est jour de marché" : "Les Halles", sub: market.text });
  if (q) tiles.push({ label: "Qualité de l'air", big: q.label, sub: topPollen ? `Pollen de ${topPollen.name} : ${pollenLevel(topPollen.value)}` : "Pollens faibles" });
  if (next) {
    const n = daysBetween(noon, new Date(`${next.d}T12:00:00`));
    tiles.push({ label: `À Dole ${inDaysLabel(n)}`, big: next.e.title.length > 60 ? `${next.e.title.slice(0, 57)}…` : next.e.title, sub: next.e.body.replace(/\.$/, "") });
  }
  if (vac && vacIn != null && vacIn > 0) tiles.push({ label: "Vacances scolaires · zone A", big: vac.name.replace(/^Vacances (de la |de |d')?/i, "").replace(/^./, (c) => c.toUpperCase()), sub: `Les vacances commencent ${inDaysLabel(vacIn)}` });
  else if (vac) tiles.push({ label: "Vacances scolaires", big: vac.name, sub: "En ce moment" });
  const tc = nextTimeChange(now);
  if (tc.inDays <= 35) {
    const d = tc.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    tiles.push({ label: "Changement d'heure", big: d.charAt(0).toUpperCase() + d.slice(1), sub: `${tc.name} ${inDaysLabel(tc.inDays)} · ${tc.hint}` });
  }
  if (tiles.length < 6) {
    const d = hol.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" }).replace(/^1 /, "1er ");
    tiles.push({ label: "Prochain jour férié", big: d, sub: `${hol.name}, ${inDaysLabel(hol.inDays)}` });
  }

  const dateLabel = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="absolute inset-0 overflow-hidden flex" style={{ background: BOARD.cream, paddingTop: 118 }}>
      <div className="flex flex-col justify-center shrink-0" style={{ width: 520, padding: "0 40px 40px 80px" }}>
        <div className="font-serif-display uppercase" style={{ fontSize: 15, letterSpacing: "0.3em", color: BOARD.orange, fontWeight: 700 }}>
          Infos pratiques
        </div>
        <div className="font-serif-display mt-5" style={{ fontSize: 82, lineHeight: 0.95, color: BOARD.wine, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Aujourd'hui
          <br />
          <span className="italic" style={{ fontWeight: 400 }}>à Dole</span>
        </div>
        <div className="font-serif-display italic mt-6" style={{ fontSize: 30, color: BOARD.muted, textTransform: "none" }}>
          {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}
        </div>
      </div>
      <div
        className="grid flex-1"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gridTemplateRows: "repeat(2, minmax(0, 1fr))", gap: 22, padding: "44px 90px 60px 20px" }}
      >
        {tiles.slice(0, 6).map((t, i) => (
          <Tile key={t.label} i={i} {...t} />
        ))}
      </div>
    </div>
  );
};
