import { useEffect, useMemo, useRef, useState } from "react";

// ============ Types & constants ============

type WeatherCode = number;
const WMO: Record<WeatherCode, { emoji: string; label: string }> = {
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
const wmo = (c: number) => WMO[c] ?? { emoji: "🌡️", label: "—" };

interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    uv_index: number;
    precipitation: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface NewsItem {
  source: string;
  title: string;
  pubDate: number;
}

const NEWS_FEEDS = [
  { source: "Le Monde", url: "https://www.lemonde.fr/rss/une.xml" },
  { source: "France Info", url: "https://www.francetvinfo.fr/titres.rss" },
  { source: "Le Figaro", url: "https://www.lefigaro.fr/rss/figaro_actualites.xml" },
];

const DAYS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const DAYS_FR_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const formatDateLong = (d: Date) => `${DAYS_FR[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
const pad = (n: number) => n.toString().padStart(2, "0");
const timeAgo = (ts: number) => {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
};

// ============ Daily selection ============
const DAILY = [
  { tag: "Café", name: "Éthiopie Yirgacheffe — fruité, floral, agrumes" },
  { tag: "Thé", name: "Darjeeling First Flush · Thé des Maîtres 2025" },
  { tag: "Vin", name: "Kundrat & Fils — Mâcon-Villages nature" },
  { tag: "Four", name: "Brownie noisette & fleur de sel" },
];

const TICKER = [
  "Café · Éthiopie Yirgacheffe — fruité, floral, notes d'agrumes",
  "Vin · René Bouvier — Bourgogne rouge nature",
  "Thé des Maîtres · Darjeeling First Flush — récolte 2025",
  "Matcha · Kumiko Matcha — cérémonie & barista",
  "Four · Brownie noisette & fleur de sel — fait maison",
  "Vin · Domaine des Carlines — Côtes du Jura, Savagnin ouillé",
  "Vin · Kundrat & Fils — Mâcon-Villages nature",
  "Boutique en ligne · maisonmaitre.com",
];

// ============ Scenes ============
type SceneType = "café" | "vin" | "weather" | "thé" | "épicerie" | "instagram" | "chatperche" | "youtube";
interface Scene {
  type: SceneType;
  duration: number;
}
// Vidéos YouTube café (changer les IDs si besoin)
const YOUTUBE_COFFEE_IDS = ["1oB1oDrDkHM", "j6VlPHxnjCo", "BZNUo7orS3k"];
const SCENES: Scene[] = [
  { type: "café", duration: 10000 },
  { type: "youtube", duration: 22000 },
  { type: "vin", duration: 10000 },
  { type: "weather", duration: 8000 },
  { type: "thé", duration: 10000 },
  { type: "épicerie", duration: 10000 },
  { type: "instagram", duration: 12000 },
  { type: "chatperche", duration: 10000 },
];

// ============ Paper grain SVG ============
const PaperGrain = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0.022, mixBlendMode: "multiply" }} aria-hidden>
    <filter id="mm-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#mm-grain)" />
  </svg>
);

// ============ Sub-components ============

const LeftPanel = ({ now, weather }: { now: Date; weather: WeatherData | null }) => {
  const w = weather?.current;
  return (
    <aside
      className="relative flex h-full flex-col text-linen"
      style={{ width: 370, backgroundColor: "#2E2419", animation: "mm-slide-left 1s ease-out both" }}
    >
      <PaperGrain />

      {/* Logo */}
      <div className="relative px-7 pb-6 pt-7" style={{ borderBottom: "1px solid rgba(242,237,228,0.08)" }}>
        <div className="font-sans-ui uppercase" style={{ fontSize: 10, letterSpacing: "0.38em", color: "rgba(242,237,228,0.3)" }}>
          Boutique
        </div>
        <div className="mt-3 font-serif-display leading-none" style={{ fontSize: 42 }}>
          <span className="font-semibold text-linen">Maison </span>
          <span className="italic font-light" style={{ color: "hsl(var(--gold-lt))" }}>Maitre</span>
        </div>
        <div className="my-3" style={{ width: 36, height: 1, backgroundColor: "hsl(var(--gold))" }} />
        <div className="font-sans-ui uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(242,237,228,0.2)" }}>
          Café · Thé · Vin · Épicerie — Dole, Jura
        </div>
      </div>

      {/* Clock */}
      <div className="relative px-7 py-6" style={{ borderBottom: "1px solid rgba(242,237,228,0.08)" }}>
        <div className="font-serif-display leading-none text-linen" style={{ fontSize: 76, fontWeight: 300 }}>
          {pad(now.getHours())}:{pad(now.getMinutes())}
          <span className="text-[44px]" style={{ opacity: 0.35 }}>:{pad(now.getSeconds())}</span>
        </div>
        <div className="mt-3 font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.22em", color: "hsl(var(--gold))", opacity: 0.7 }}>
          {formatDateLong(now)}
        </div>
      </div>

      {/* Weather */}
      <div className="relative px-7 py-6" style={{ borderBottom: "1px solid rgba(242,237,228,0.08)" }}>
        <div className="font-sans-ui uppercase" style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(242,237,228,0.4)" }}>
          📍 Dole · Jura · France
        </div>
        {w ? (
          <>
            <div className="mt-4 flex items-end gap-3">
              <div style={{ fontSize: 56, lineHeight: 1 }}>{wmo(w.weather_code).emoji}</div>
              <div className="font-serif-display leading-none text-linen" style={{ fontSize: 62, fontWeight: 300 }}>
                {Math.round(w.temperature_2m)}°
              </div>
            </div>
            <div className="mt-1 font-sans-ui" style={{ fontSize: 11, color: "rgba(242,237,228,0.5)" }}>
              ressenti {Math.round(w.apparent_temperature)}°
            </div>
            <div className="mt-2 font-serif-display italic" style={{ fontSize: 15, color: "rgba(242,237,228,0.7)" }}>
              {wmo(w.weather_code).label}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat label="Humidité" value={`${Math.round(w.relative_humidity_2m)}%`} />
              <Stat label="Vent km/h" value={`${Math.round(w.wind_speed_10m)}`} />
              <Stat label="UV" value={`${Math.round(w.uv_index ?? 0)}`} />
              <Stat label="Pluie mm" value={`${(w.precipitation ?? 0).toFixed(1)}`} />
            </div>
            {weather?.daily && (
              <div className="mt-5 flex justify-between gap-1">
                {weather.daily.time.slice(1, 5).map((iso, i) => {
                  const d = new Date(iso);
                  const code = weather.daily.weather_code[i + 1];
                  return (
                    <div key={iso} className="flex flex-col items-center" style={{ minWidth: 56 }}>
                      <div className="font-sans-ui uppercase" style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(242,237,228,0.45)" }}>
                        {DAYS_FR_SHORT[d.getDay()]}
                      </div>
                      <div className="my-1" style={{ fontSize: 20 }}>{wmo(code).emoji}</div>
                      <div className="font-serif-display text-linen" style={{ fontSize: 13 }}>
                        {Math.round(weather.daily.temperature_2m_max[i + 1])}°
                        <span style={{ opacity: 0.4 }}> {Math.round(weather.daily.temperature_2m_min[i + 1])}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="mt-6 font-serif-display italic" style={{ color: "rgba(242,237,228,0.4)" }}>chargement…</div>
        )}
      </div>

      {/* Daily selection */}
      <div className="relative flex flex-1 flex-col justify-center px-7 py-6">
        <div className="font-sans-ui uppercase" style={{ fontSize: 9, letterSpacing: "0.32em", color: "rgba(242,237,228,0.22)" }}>
          Sélection du jour
        </div>
        <div className="mt-5 space-y-4">
          {DAILY.map((d) => (
            <div key={d.tag}>
              <div className="font-sans-ui uppercase" style={{ fontSize: 9, letterSpacing: "0.28em", color: "hsl(var(--gold))" }}>
                {d.tag}
              </div>
              <div className="mt-1 font-serif-display italic leading-snug" style={{ fontSize: 16, color: "rgba(242,237,228,0.85)" }}>
                {d.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative px-7 pb-5 pt-3 font-sans-ui" style={{ fontSize: 10, color: "rgba(242,237,228,0.18)", letterSpacing: "0.18em" }}>
        @maisonmaitre · maisonmaitre.com
      </div>
    </aside>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="font-sans-ui uppercase" style={{ fontSize: 8.5, letterSpacing: "0.24em", color: "rgba(242,237,228,0.4)" }}>
      {label}
    </div>
    <div className="font-serif-display text-linen" style={{ fontSize: 22, fontWeight: 300 }}>{value}</div>
  </div>
);

// ============ Scene content ============

const TextSlide = ({
  bg, tag, titleStart, titleItalic, body,
}: { bg: string; tag: string; titleStart: string; titleItalic: string; body: string }) => (
  <div className="absolute inset-0" style={{ background: bg }}>
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(229,221,208,0.05) 35%, rgba(229,221,208,0.97) 100%)" }}
    />
    <div
      className="relative flex h-full flex-col justify-end px-20 pb-32"
      style={{ animation: "mm-slide-up 1.2s ease-out 0.4s both" }}
    >
      <div className="flex items-center gap-4">
        <div style={{ width: 48, height: 1, backgroundColor: "hsl(var(--gold))" }} />
        <div className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
          {tag}
        </div>
      </div>
      <h2 className="mt-6 font-serif-display leading-[1.05]" style={{ fontSize: 68, color: "hsl(var(--ink))" }}>
        <span className="font-semibold">{titleStart} </span>
        <span className="italic font-light" style={{ color: "hsl(var(--wine))" }}>{titleItalic}</span>
      </h2>
      <p className="mt-6 max-w-[820px] font-serif-display italic" style={{ fontSize: 19, color: "hsl(var(--mink))", lineHeight: 1.5 }}>
        {body}
      </p>
    </div>
  </div>
);

const WeatherScene = ({ weather }: { weather: WeatherData | null }) => {
  if (!weather) return <div className="absolute inset-0" style={{ backgroundColor: "hsl(var(--cream))" }} />;
  const w = weather.current;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: "hsl(var(--cream))" }}>
      <div className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.42em", color: "hsl(var(--mink))" }}>
        Météo · Dole, Jura
      </div>
      <div className="mt-6 flex items-center gap-8">
        <div style={{ fontSize: 110 }}>{wmo(w.weather_code).emoji}</div>
        <div className="font-serif-display leading-none" style={{ fontSize: 152, fontWeight: 300, color: "hsl(var(--espresso))" }}>
          {Math.round(w.temperature_2m)}°
        </div>
      </div>
      <div className="mt-2 font-serif-display italic" style={{ fontSize: 30, color: "hsl(var(--taupe))" }}>
        {wmo(w.weather_code).label}
      </div>
      <div className="mt-10 flex gap-16">
        {[
          { l: "Humidité", v: `${Math.round(w.relative_humidity_2m)}%` },
          { l: "Vent km/h", v: `${Math.round(w.wind_speed_10m)}` },
          { l: "Ressenti", v: `${Math.round(w.apparent_temperature)}°` },
          { l: "Indice UV", v: `${Math.round(w.uv_index ?? 0)}` },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-sans-ui uppercase" style={{ fontSize: 10, letterSpacing: "0.3em", color: "hsl(var(--mink))" }}>
              {s.l}
            </div>
            <div className="mt-1 font-serif-display" style={{ fontSize: 36, fontWeight: 300, color: "hsl(var(--espresso))" }}>
              {s.v}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 flex gap-10">
        {weather.daily.time.slice(1, 5).map((iso, i) => {
          const d = new Date(iso);
          const code = weather.daily.weather_code[i + 1];
          return (
            <div key={iso} className="flex flex-col items-center">
              <div className="font-sans-ui uppercase" style={{ fontSize: 10, letterSpacing: "0.24em", color: "hsl(var(--mink))" }}>
                {DAYS_FR_SHORT[d.getDay()]}
              </div>
              <div className="my-2" style={{ fontSize: 32 }}>{wmo(code).emoji}</div>
              <div className="font-serif-display" style={{ fontSize: 18, color: "hsl(var(--espresso))" }}>
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

const InstagramScene = () => {
  const cells = [
    { e: "☕", g: "linear-gradient(135deg,#C4A882,#7A5030)" },
    { e: "🍵", g: "linear-gradient(135deg,#B0C4A0,#507040)" },
    { e: "🍷", g: "linear-gradient(135deg,#C0A8B0,#704050)" },
    { e: "🧁", g: "linear-gradient(135deg,#D0C080,#907030)" },
    { e: "🫖", g: "linear-gradient(135deg,#A0A8C0,#405070)" },
    { e: "🌿", g: "linear-gradient(135deg,#B8C8A0,#688060)" },
  ];
  return (
    <div className="absolute inset-0 px-16 py-14" style={{ backgroundColor: "hsl(var(--cream))" }}>
      <div className="flex items-center gap-5">
        <div
          className="flex items-center justify-center rounded-full font-serif-display text-linen"
          style={{ width: 76, height: 76, fontSize: 36, background: "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--wine)))" }}
        >
          M
        </div>
        <div>
          <div className="font-serif-display" style={{ fontSize: 32, color: "hsl(var(--espresso))" }}>@maisonmaitre</div>
          <div className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "hsl(var(--mink))" }}>
            Dole · Jura · France
          </div>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-3 grid-rows-2 gap-5" style={{ height: 540 }}>
        {cells.map((c, i) => (
          <div key={i} className="flex items-center justify-center rounded-md" style={{ background: c.g, fontSize: 84 }}>
            {c.e}
          </div>
        ))}
      </div>
    </div>
  );
};

const SceneRenderer = ({ scene, weather }: { scene: Scene; weather: WeatherData | null }) => {
  switch (scene.type) {
    case "café":
      return <TextSlide bg="linear-gradient(135deg, #C4A882, #7A5030, #3A1A08)" tag="Café de Spécialité" titleStart="Origine, terroir," titleItalic="précision." body="Des cafés sélectionnés parmi les meilleurs producteurs du monde — torréfiés artisanalement, extraits avec soin." />;
    case "vin":
      return <TextSlide bg="linear-gradient(135deg, #C0A8B0, #704050, #2A1020)" tag="Vins Naturels" titleStart="Le vin comme" titleItalic="il devrait être." body="Vignerons engagés, biodynamie — René Bouvier, Domaine des Carlines, Kundrat & Fils." />;
    case "weather":
      return <WeatherScene weather={weather} />;
    case "thé":
      return <TextSlide bg="linear-gradient(135deg, #B0C4A0, #507040, #182A10)" tag="Thés des Maîtres" titleStart="Notre marque," titleItalic="nos cuvées." body="Une collection exclusive de thés d'exception. En boutique et sur maisonmaitre.com." />;
    case "épicerie":
      return <TextSlide bg="linear-gradient(135deg, #D0C080, #907030, #382810)" tag="Épicerie Fine" titleStart="Bien manger," titleItalic="bien choisir." body="Conserves artisanales, chocolats, condiments — sélectionnés avec la même exigence." />;
    case "instagram":
      return <InstagramScene />;
    case "chatperche":
      return <TextSlide bg="linear-gradient(135deg, #A0A8C0, #405070, #101828)" tag="Chat Perché Gourmand · Été 2026" titleStart="Le rendez-vous" titleItalic="de l'été." body="Retrouvez-nous sur La Visitation. Dégustation, découverte, plaisirs partagés." />;
  }
};

// ============ Center panel ============

const CenterPanel = ({ weather }: { weather: WeatherData | null }) => {
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
    <main className="relative flex-1 overflow-hidden" style={{ animation: "mm-fade-in 1.2s ease-out both" }}>
      {SCENES.map((scene, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
        >
          <SceneRenderer scene={scene} weather={weather} />
        </div>
      ))}

      <PaperGrain />

      {/* Pager dots */}
      <div className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
        {SCENES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: 6,
              height: i === index ? 24 : 6,
              backgroundColor: i === index ? "hsl(var(--gold))" : "rgba(106,97,87,0.35)",
            }}
          />
        ))}
      </div>

      {/* Bottom ticker belt */}
      <BottomTicker />

      {/* Progress bar above ticker */}
      <div className="absolute left-0 right-0 z-20" style={{ bottom: 100, height: 2, backgroundColor: "rgba(0,0,0,0.08)" }}>
        <div
          key={progressKey}
          className="h-full origin-left"
          style={{
            backgroundColor: "hsl(var(--gold))",
            animation: `mm-progress ${SCENES[index].duration}ms linear forwards`,
          }}
        />
      </div>
    </main>
  );
};

// ============ Bottom ticker ============

const BottomTicker = () => {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center overflow-hidden" style={{ height: 100, backgroundColor: "#1A160F" }}>
      <div
        className="flex h-full shrink-0 items-center px-7 font-sans-ui uppercase"
        style={{ fontSize: 9, letterSpacing: "0.36em", color: "hsl(var(--gold))", borderRight: "1px solid rgba(184,150,90,0.25)" }}
      >
        La sélection
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: "mm-ticker 60s linear infinite", width: "max-content" }}>
          {items.map((t, i) => (
            <div key={i} className="flex items-center">
              <div
                className="px-8 font-serif-display italic"
                style={{ fontSize: 18, color: "rgba(242,237,228,0.6)" }}
              >
                {t}
              </div>
              <div className="rounded-full" style={{ width: 4, height: 4, backgroundColor: "hsl(var(--gold))" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ Right panel — News ============

const RightPanel = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const all: NewsItem[] = [];
      await Promise.all(
        NEWS_FEEDS.map(async (feed) => {
          try {
            const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`);
            const data = await res.json();
            const xml = new DOMParser().parseFromString(data.contents, "text/xml");
            const items = Array.from(xml.querySelectorAll("item")).slice(0, 10);
            for (const it of items) {
              const title = it.querySelector("title")?.textContent?.trim() ?? "";
              const pub = it.querySelector("pubDate")?.textContent?.trim() ?? "";
              if (title) all.push({ source: feed.source, title, pubDate: pub ? Date.parse(pub) : Date.now() });
            }
          } catch (e) {
            console.warn("news feed fail", feed.source, e);
          }
        })
      );
      all.sort((a, b) => b.pubDate - a.pubDate);
      setNews(all);
    };
    fetchAll();
    const id = setInterval(fetchAll, 25 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const doubled = useMemo(() => [...news, ...news], [news]);

  return (
    <aside
      className="relative flex h-full flex-col overflow-hidden"
      style={{ width: 340, backgroundColor: "#E5DDD0", animation: "mm-slide-right 1s ease-out both" }}
    >
      <PaperGrain />
      <div className="relative flex items-end justify-between px-6 pb-5 pt-7" style={{ borderBottom: "1px solid rgba(106,97,87,0.18)" }}>
        <div>
          <div className="font-sans-ui uppercase" style={{ fontSize: 9, letterSpacing: "0.36em", color: "hsl(var(--mink))" }}>
            En direct
          </div>
          <h2 className="mt-1 font-serif-display" style={{ fontSize: 26, fontWeight: 300, color: "hsl(var(--espresso))" }}>
            Actualités
          </h2>
        </div>
        <div
          className="rounded-full px-3 py-1 font-sans-ui"
          style={{ fontSize: 10, letterSpacing: "0.18em", backgroundColor: "rgba(46,36,25,0.08)", color: "hsl(var(--taupe))" }}
        >
          {news.length} articles
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {news.length > 0 ? (
          <div style={{ animation: "mm-news-scroll 90s linear infinite" }}>
            {doubled.map((n, i) => (
              <div key={i} className="px-6 py-4" style={{ borderBottom: "1px solid rgba(106,97,87,0.12)" }}>
                <div className="font-sans-ui uppercase" style={{ fontSize: 9, letterSpacing: "0.3em", color: "hsl(var(--gold))" }}>
                  {n.source}
                </div>
                <div className="mt-2 font-serif-display italic leading-snug" style={{ fontSize: 14, color: "hsl(var(--taupe))" }}>
                  {n.title}
                </div>
                <div className="mt-2 font-sans-ui" style={{ fontSize: 9, letterSpacing: "0.22em", color: "hsl(var(--mink))" }}>
                  {timeAgo(n.pubDate)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 font-serif-display italic" style={{ color: "hsl(var(--mink))" }}>
            Chargement des actualités…
          </div>
        )}
        {/* fade overlays */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32" style={{ background: "linear-gradient(to bottom, transparent, #E5DDD0)" }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10" style={{ background: "linear-gradient(to top, transparent, #E5DDD0)" }} />
      </div>
    </aside>
  );
};

// ============ Main ============

const SignageDisplay = () => {
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=47.0924&longitude=5.4910&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FParis&forecast_days=5"
        );
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        console.warn("weather fail", e);
      }
    };
    fetchWeather();
    const id = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative flex overflow-hidden bg-ink"
      style={{ width: 1920, height: 1080, cursor: "none" }}
    >
      <LeftPanel now={now} weather={weather} />
      <CenterPanel weather={weather} />
      <RightPanel />
    </div>
  );
};

export default SignageDisplay;
