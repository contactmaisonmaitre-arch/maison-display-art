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
}

const DAYS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const DAYS_FR_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const formatDateLong = (d: Date) => `${DAYS_FR[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
const pad = (n: number) => n.toString().padStart(2, "0");

const DAILY = [
  { tag: "Café", name: "Éthiopie Yirgacheffe — fruité, floral, agrumes" },
  { tag: "Thé", name: "Darjeeling First Flush · Thé des Maîtres 2025" },
  { tag: "Vin", name: "Kundrat & Fils — Mâcon-Villages nature" },
  { tag: "Four", name: "Brownie noisette & fleur de sel" },
];

// Fête du jour (saint patron)
const SAINTS_DU_JOUR: Record<string, string> = {
  "01-01": "Marie", "01-02": "Basile", "01-03": "Geneviève", "01-04": "Odilon", "01-05": "Édouard", "01-06": "Mélaine", "01-07": "Raymond", "01-08": "Lucien", "01-09": "Alix", "01-10": "Guillaume", "01-11": "Paulin", "01-12": "Tatiana", "01-13": "Yvette", "01-14": "Nina", "01-15": "Rémi", "01-16": "Marcel", "01-17": "Roseline", "01-18": "Prisca", "01-19": "Marius", "01-20": "Sébastien", "01-21": "Agnès", "01-22": "Vincent", "01-23": "Barnard", "01-24": "François de Sales", "01-25": "Conv. Saint Paul", "01-26": "Paule", "01-27": "Angèle", "01-28": "Thomas d'Aquin", "01-29": "Gildas", "01-30": "Martine", "01-31": "Marcelle",
  "02-01": "Ella", "02-02": "Présentation", "02-03": "Blaise", "02-04": "Véronique", "02-05": "Agathe", "02-06": "Gaston", "02-07": "Eugénie", "02-08": "Jacqueline", "02-09": "Apolline", "02-10": "Arnaud", "02-11": "N.-D. de Lourdes", "02-12": "Félix", "02-13": "Béatrice", "02-14": "Valentin", "02-15": "Claude", "02-16": "Julienne", "02-17": "Alexis", "02-18": "Bernadette", "02-19": "Gabin", "02-20": "Aimée", "02-21": "Pierre Damien", "02-22": "Isabelle", "02-23": "Lazare", "02-24": "Modeste", "02-25": "Roméo", "02-26": "Nestor", "02-27": "Honorine", "02-28": "Romain", "02-29": "Auguste",
  "03-01": "Aubin", "03-02": "Charles le Bon", "03-03": "Guénolé", "03-04": "Casimir", "03-05": "Olive", "03-06": "Colette", "03-07": "Félicité", "03-08": "Jean de Dieu", "03-09": "Françoise", "03-10": "Vivien", "03-11": "Rosine", "03-12": "Justine", "03-13": "Rodrigue", "03-14": "Mathilde", "03-15": "Louise", "03-16": "Bénédicte", "03-17": "Patrice", "03-18": "Cyrille", "03-19": "Joseph", "03-20": "Herbert", "03-21": "Clémence", "03-22": "Léa", "03-23": "Victorien", "03-24": "Cath. de Suède", "03-25": "Annonciation", "03-26": "Larissa", "03-27": "Habib", "03-28": "Gontran", "03-29": "Gladys", "03-30": "Amédée", "03-31": "Benjamin",
  "04-01": "Hugues", "04-02": "Sandrine", "04-03": "Richard", "04-04": "Isidore", "04-05": "Irène", "04-06": "Marcellin", "04-07": "J.-B. de la Salle", "04-08": "Julie", "04-09": "Gautier", "04-10": "Fulbert", "04-11": "Stanislas", "04-12": "Jules", "04-13": "Ida", "04-14": "Maxime", "04-15": "Paterne", "04-16": "Benoît-Joseph", "04-17": "Anicet", "04-18": "Parfait", "04-19": "Emma", "04-20": "Odette", "04-21": "Anselme", "04-22": "Alexandre", "04-23": "Georges", "04-24": "Fidèle", "04-25": "Marc", "04-26": "Alida", "04-27": "Zita", "04-28": "Valérie", "04-29": "Cath. de Sienne", "04-30": "Robert",
  "05-01": "Jérémie", "05-02": "Boris", "05-03": "Philippe & Jacques", "05-04": "Sylvain", "05-05": "Judith", "05-06": "Prudence", "05-07": "Gisèle", "05-08": "Désiré", "05-09": "Pacôme", "05-10": "Solange", "05-11": "Estelle", "05-12": "Achille", "05-13": "Rolande", "05-14": "Matthias", "05-15": "Denise", "05-16": "Honoré", "05-17": "Pascal", "05-18": "Éric", "05-19": "Yves", "05-20": "Bernardin", "05-21": "Constantin", "05-22": "Émile", "05-23": "Didier", "05-24": "Donatien", "05-25": "Sophie", "05-26": "Bérenger", "05-27": "Augustin", "05-28": "Germain", "05-29": "Aymar", "05-30": "Ferdinand", "05-31": "Visitation",
  "06-01": "Justin", "06-02": "Blandine", "06-03": "Kévin", "06-04": "Clotilde", "06-05": "Igor", "06-06": "Norbert", "06-07": "Gilbert", "06-08": "Médard", "06-09": "Diane", "06-10": "Landry", "06-11": "Barnabé", "06-12": "Guy", "06-13": "Antoine de Padoue", "06-14": "Élisée", "06-15": "Germaine", "06-16": "Régis", "06-17": "Hervé", "06-18": "Léonce", "06-19": "Romuald", "06-20": "Silvère", "06-21": "Rodolphe", "06-22": "Alban", "06-23": "Audrey", "06-24": "Jean-Baptiste", "06-25": "Prosper", "06-26": "Anthelme", "06-27": "Fernand", "06-28": "Irénée", "06-29": "Pierre & Paul", "06-30": "Martial",
  "07-01": "Thierry", "07-02": "Martinien", "07-03": "Thomas", "07-04": "Florent", "07-05": "Antoine", "07-06": "Mariette", "07-07": "Raoul", "07-08": "Thibault", "07-09": "Amandine", "07-10": "Ulrich", "07-11": "Benoît", "07-12": "Olivier", "07-13": "Henri & Joël", "07-14": "Camille", "07-15": "Donald", "07-16": "N.-D. Mont-Carmel", "07-17": "Charlotte", "07-18": "Frédéric", "07-19": "Arsène", "07-20": "Marina", "07-21": "Victor", "07-22": "Marie-Madeleine", "07-23": "Brigitte", "07-24": "Christine", "07-25": "Jacques", "07-26": "Anne & Joachim", "07-27": "Nathalie", "07-28": "Samson", "07-29": "Marthe", "07-30": "Juliette", "07-31": "Ignace de Loyola",
  "08-01": "Alphonse", "08-02": "Julien-Eymard", "08-03": "Lydie", "08-04": "J.-M. Vianney", "08-05": "Abel", "08-06": "Transfiguration", "08-07": "Gaétan", "08-08": "Dominique", "08-09": "Amour", "08-10": "Laurent", "08-11": "Claire", "08-12": "Clarisse", "08-13": "Hippolyte", "08-14": "Évrard", "08-15": "Assomption", "08-16": "Armel", "08-17": "Hyacinthe", "08-18": "Hélène", "08-19": "Jean Eudes", "08-20": "Bernard", "08-21": "Christophe", "08-22": "Fabrice", "08-23": "Rose de Lima", "08-24": "Barthélémy", "08-25": "Louis", "08-26": "Natacha", "08-27": "Monique", "08-28": "Augustin", "08-29": "Sabine", "08-30": "Fiacre", "08-31": "Aristide",
  "09-01": "Gilles", "09-02": "Ingrid", "09-03": "Grégoire", "09-04": "Rosalie", "09-05": "Raïssa", "09-06": "Bertrand", "09-07": "Reine", "09-08": "Nativité de Marie", "09-09": "Alain", "09-10": "Inès", "09-11": "Adelphe", "09-12": "Apollinaire", "09-13": "Aimé", "09-14": "Sainte Croix", "09-15": "Roland", "09-16": "Édith", "09-17": "Renaud", "09-18": "Nadège", "09-19": "Émilie", "09-20": "Davy", "09-21": "Matthieu", "09-22": "Maurice", "09-23": "Constant", "09-24": "Thècle", "09-25": "Hermann", "09-26": "Côme & Damien", "09-27": "Vincent de Paul", "09-28": "Venceslas", "09-29": "Michel", "09-30": "Jérôme",
  "10-01": "Thérèse de l'E.-J.", "10-02": "Léger", "10-03": "Gérard", "10-04": "François d'Assise", "10-05": "Fleur", "10-06": "Bruno", "10-07": "Serge", "10-08": "Pélagie", "10-09": "Denis", "10-10": "Ghislain", "10-11": "Firmin", "10-12": "Wilfried", "10-13": "Géraud", "10-14": "Juste", "10-15": "Thérèse d'Avila", "10-16": "Edwige", "10-17": "Baudouin", "10-18": "Luc", "10-19": "René", "10-20": "Adeline", "10-21": "Céline", "10-22": "Élodie", "10-23": "Jean de Capistran", "10-24": "Florentin", "10-25": "Crépin", "10-26": "Dimitri", "10-27": "Émeline", "10-28": "Simon & Jude", "10-29": "Narcisse", "10-30": "Bienvenue", "10-31": "Quentin",
  "11-01": "Toussaint", "11-02": "Défunts", "11-03": "Hubert", "11-04": "Charles Borromée", "11-05": "Sylvie", "11-06": "Bertille", "11-07": "Carine", "11-08": "Geoffroy", "11-09": "Théodore", "11-10": "Léon", "11-11": "Martin", "11-12": "Christian", "11-13": "Brice", "11-14": "Sidoine", "11-15": "Albert", "11-16": "Marguerite", "11-17": "Élisabeth", "11-18": "Aude", "11-19": "Tanguy", "11-20": "Edmond", "11-21": "Présentation Marie", "11-22": "Cécile", "11-23": "Clément", "11-24": "Flora", "11-25": "Catherine", "11-26": "Delphine", "11-27": "Séverin", "11-28": "Jacques de la Marche", "11-29": "Saturnin", "11-30": "André",
  "12-01": "Florence", "12-02": "Viviane", "12-03": "François-Xavier", "12-04": "Barbara", "12-05": "Gérald", "12-06": "Nicolas", "12-07": "Ambroise", "12-08": "Imm. Conception", "12-09": "Pierre Fourier", "12-10": "Romaric", "12-11": "Daniel", "12-12": "Jeanne F. de Chantal", "12-13": "Lucie", "12-14": "Odile", "12-15": "Ninon", "12-16": "Alice", "12-17": "Gaël", "12-18": "Gatien", "12-19": "Urbain", "12-20": "Théophile", "12-21": "Pierre Canisius", "12-22": "Françoise-Xavière", "12-23": "Armand", "12-24": "Adèle", "12-25": "Noël", "12-26": "Étienne", "12-27": "Jean", "12-28": "Saints Innocents", "12-29": "David", "12-30": "Roger", "12-31": "Sylvestre",
};
const getSaintDuJour = (d: Date) => SAINTS_DU_JOUR[`${pad(d.getMonth() + 1)}-${pad(d.getDate())}`] ?? "—";

// Anecdotes positives & "le saviez-vous" — café, thé, vin, gourmandise
const POSITIVE_ANECDOTES: NewsItem[] = [
  { source: "Le saviez-vous", title: "Le café est la deuxième boisson la plus consommée au monde, juste après l'eau." },
  { source: "Anecdote", title: "Une légende raconte qu'un berger éthiopien découvrit le café en voyant ses chèvres danser après en avoir mangé les baies." },
  { source: "Bon à savoir", title: "Le thé vert matcha contient jusqu'à 137 fois plus d'antioxydants qu'un thé vert classique infusé." },
  { source: "Tradition", title: "Au Japon, la cérémonie du thé peut durer jusqu'à 4 heures et célèbre l'instant présent." },
  { source: "Le saviez-vous", title: "Le Jura produit le célèbre vin jaune, élevé sous voile pendant 6 ans et 3 mois minimum." },
  { source: "Anecdote", title: "Beethoven comptait précisément 60 grains de café pour préparer chacune de ses tasses." },
  { source: "Histoire", title: "Le premier café d'Europe ouvrit ses portes à Venise en 1645 — un lieu de débats et d'idées." },
  { source: "Curiosité", title: "Les arômes du vin proviennent de plus de 800 composés volatils différents." },
  { source: "Bien-être", title: "Boire un café modérément réduit le risque de maladies cardiovasculaires selon plusieurs études." },
  { source: "Inspiration", title: "Le mot \"espresso\" signifie \"exprimé\" en italien — un café réalisé à la demande." },
  { source: "Le saviez-vous", title: "Il faut environ 100 grains de café pour préparer une tasse d'espresso parfait." },
  { source: "Tradition", title: "En Éthiopie, la cérémonie du café est un rituel de partage qui peut durer plusieurs heures." },
  { source: "Anecdote", title: "Le thé Earl Grey doit son nom au comte Charles Grey, Premier ministre britannique au XIXe siècle." },
  { source: "Terroir", title: "Le Jura abrite cinq cépages emblématiques : Savagnin, Chardonnay, Trousseau, Poulsard et Pinot Noir." },
  { source: "Curiosité", title: "Une tasse de thé blanc renferme moins de caféine qu'une tasse de café — idéal en fin de journée." },
  { source: "Bon à savoir", title: "Le rooibos, originaire d'Afrique du Sud, ne contient ni théine ni caféine — parfait pour le soir." },
  { source: "Histoire", title: "Le chocolat fut consommé sous forme de boisson amère pendant près de 3000 ans avant d'être sucré." },
  { source: "Anecdote", title: "Bach a composé une cantate dédiée au café — la \"Kaffeekantate\" — en 1735." },
  { source: "Le saviez-vous", title: "Plus un café est torréfié foncé, moins il contient de caféine." },
  { source: "Inspiration", title: "Le mot \"barista\" vient de l'italien et désignait à l'origine simplement le serveur d'un bar." },
  { source: "Tradition", title: "Au Royaume-Uni, l'afternoon tea fut inventé en 1840 par Anna, duchesse de Bedford." },
  { source: "Curiosité", title: "Le café Geisha d'Éthiopie peut atteindre des prix records — jusqu'à 10 000 € le kilo." },
  { source: "Bien-être", title: "L'odeur du café fraîchement moulu suffit à stimuler la vigilance et l'humeur." },
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

// Produits coup de cœur de maisonmaitre.com
const PRODUCTS_TO_TRY = [
  { cat: "Café", name: "Éthiopie Yirgacheffe Heirloom Nature", note: "Jasmin · Pêche · Miel" },
  { cat: "Café", name: "Colombie Huila Bourbon Rose Nature", note: "Cerise noire · Framboise · Cacao" },
  { cat: "Thé noir", name: "Banquet des Tsars", note: "Bergamote & agrumes" },
  { cat: "Thé vert", name: "Le Chat Heureux", note: "Notre incontournable" },
  { cat: "Infusion", name: "Délice des Vergers", note: "Framboise · Hibiscus" },
  { cat: "Rooibos", name: "Splendeur d'Abyssinie", note: "Moka · Chocolat blanc" },
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

const YouTubeScene = ({ active }: { active: boolean }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (active) setIdx((i) => (i + 1) % YOUTUBE_COFFEE_IDS.length);
  }, [active]);
  const videoId = YOUTUBE_COFFEE_IDS[idx];
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1&rel=0&showinfo=0`;
  return (
    <div className="absolute inset-0" style={{ backgroundColor: "#000" }}>
      {active && (
        <iframe
          title="Café — vidéo"
          src={src}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: "100%", height: "100%", border: 0, pointerEvents: "none" }}
          allow="autoplay; encrypted-media"
        />
      )}
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.7) 100%)" }} />
      <div className="absolute left-16 top-14 flex items-center gap-4">
        <div style={{ width: 48, height: 1, backgroundColor: "hsl(var(--gold))" }} />
        <div className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
          L'Art du Café · En images
        </div>
      </div>
      <div className="absolute bottom-32 left-16 right-16">
        <h2 className="font-serif-display leading-[1.05]" style={{ fontSize: 56, color: "hsl(var(--linen))" }}>
          <span className="font-semibold">Le geste,</span>{" "}
          <span className="italic font-light" style={{ color: "hsl(var(--gold-lt))" }}>la matière, l'instant.</span>
        </h2>
      </div>
    </div>
  );
};

const SceneRenderer = ({ scene, weather, active }: { scene: Scene; weather: WeatherData | null; active: boolean }) => {
  switch (scene.type) {
    case "café":
      return <TextSlide bg="linear-gradient(135deg, #C4A882, #7A5030, #3A1A08)" tag="Café de Spécialité" titleStart="Origine, terroir," titleItalic="précision." body="Des cafés sélectionnés parmi les meilleurs producteurs du monde — torréfiés artisanalement, extraits avec soin." />;
    case "youtube":
      return <YouTubeScene active={active} />;
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
          <SceneRenderer scene={scene} weather={weather} active={i === index} />
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

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      setScale(s);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-ink flex items-center justify-center"
      style={{ cursor: "none" }}
    >
      <div
        className="relative flex overflow-hidden bg-ink"
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
        }}
      >
        <LeftPanel now={now} weather={weather} />
        <CenterPanel weather={weather} />
        <RightPanel />
      </div>
    </div>
  );
};

export default SignageDisplay;
