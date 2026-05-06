import { useEffect, useState } from "react";

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

type WIconKind = "sun" | "partly" | "cloud" | "fog" | "drizzle" | "rain" | "snow" | "storm";
const wmoKind = (c: number): WIconKind => {
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

const WeatherIcon = ({ code, size = 220, color = "hsl(var(--espresso))", accent = "hsl(var(--gold))" }: { code: number; size?: number; color?: string; accent?: string }) => {
  const kind = wmoKind(code);
  const s = size;
  const sw = Math.max(2, s * 0.018);
  const common = { fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden>
      {kind === "sun" && (
        <g {...common} stroke={accent}>
          <circle cx="50" cy="50" r="18" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const x1 = 50 + Math.cos(a) * 28, y1 = 50 + Math.sin(a) * 28;
            const x2 = 50 + Math.cos(a) * 40, y2 = 50 + Math.sin(a) * 40;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
      )}
      {kind === "partly" && (
        <g {...common}>
          <g stroke={accent}>
            <circle cx="38" cy="40" r="13" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i * Math.PI) / 4;
              return <line key={i} x1={38 + Math.cos(a) * 19} y1={40 + Math.sin(a) * 19} x2={38 + Math.cos(a) * 27} y2={40 + Math.sin(a) * 27} />;
            })}
          </g>
          <path d="M30 70 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H34 q-12 0 -12 -10 z" />
        </g>
      )}
      {kind === "cloud" && (
        <path {...common} d="M22 68 q0 -16 16 -16 q4 -12 18 -12 q16 0 18 16 q12 0 12 12 q0 12 -14 12 H30 q-14 0 -14 -12 z" />
      )}
      {kind === "fog" && (
        <g {...common}>
          <path d="M22 56 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H26 q-12 0 -12 -10 z" />
          <line x1="18" y1="78" x2="82" y2="78" />
          <line x1="26" y1="88" x2="74" y2="88" />
        </g>
      )}
      {kind === "drizzle" && (
        <g {...common}>
          <path d="M22 54 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H26 q-12 0 -12 -10 z" />
          <line x1="36" y1="76" x2="32" y2="86" stroke={accent} />
          <line x1="52" y1="76" x2="48" y2="86" stroke={accent} />
          <line x1="68" y1="76" x2="64" y2="86" stroke={accent} />
        </g>
      )}
      {kind === "rain" && (
        <g {...common}>
          <path d="M22 54 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H26 q-12 0 -12 -10 z" />
          <line x1="34" y1="74" x2="28" y2="92" stroke={accent} />
          <line x1="50" y1="74" x2="44" y2="92" stroke={accent} />
          <line x1="66" y1="74" x2="60" y2="92" stroke={accent} />
        </g>
      )}
      {kind === "snow" && (
        <g {...common}>
          <path d="M22 54 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H26 q-12 0 -12 -10 z" />
          {[34, 50, 66].map((x) => (
            <g key={x} stroke={accent}>
              <line x1={x} y1="78" x2={x} y2="92" />
              <line x1={x - 5} y1="81" x2={x + 5} y2="89" />
              <line x1={x - 5} y1="89" x2={x + 5} y2="81" />
            </g>
          ))}
        </g>
      )}
      {kind === "storm" && (
        <g {...common}>
          <path d="M22 54 q0 -14 14 -14 q4 -10 16 -10 q14 0 16 14 q10 0 10 10 q0 10 -12 10 H26 q-12 0 -12 -10 z" />
          <path d="M50 70 L42 86 L52 86 L46 96" stroke={accent} fill="none" />
        </g>
      )}
    </svg>
  );
};

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

const DAYS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const DAYS_FR_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const formatDateLong = (d: Date) => `${DAYS_FR[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
const pad = (n: number) => n.toString().padStart(2, "0");
const safeGetStorage = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const safeSetStorage = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Certains navigateurs TV bloquent localStorage : on continue sans faire planter l'écran.
  }
};

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

// Produits réels — extraits de maisonmaitre.com (prix au 100g pour les thés/infusions)
// Le Chat Heureux est en vedette : toujours en première position (featured: true)
const PRODUCTS_TO_TRY: { cat: string; name: string; notes: string; price: string; img: string; featured?: boolean }[] = [
  { cat: "Thé des Maitre · Vert",       name: "Le Chat Heureux",          notes: "Notre incontournable",         price: "9,50 € / 100g",  img: "/products/the-chat.png", featured: true },
  { cat: "Café des Maitre · Éthiopie",  name: "Yirgacheffe Heirloom",     notes: "Jasmin · Pêche · Miel",        price: "14,50 € / 100g", img: "/products/cafe-ethiopie.png" },
  { cat: "Café des Maitre · Colombie",  name: "Huila Bourbon Rose",       notes: "Cerise · Framboise · Cacao",   price: "16 € / 100g",    img: "/products/cafe-colombie-bourbon.png" },
  { cat: "Café des Maitre · Colombie",  name: "Huila Castillo Semi-Lavé", notes: "Chocolat · Noisette · Caramel",price: "14,50 € / 100g", img: "/products/cafe-colombie-castillo.gif" },
  { cat: "Thé des Maitre · Noir",       name: "Banquet des Tsars",        notes: "Bergamote & agrumes",          price: "10,90 € / 100g", img: "/products/the-tsars.png" },
  { cat: "Infusion des Maitre",         name: "Délice des Vergers",       notes: "Framboise · Hibiscus",         price: "9,35 € / 100g",  img: "/products/infusion-vergers.png" },
  { cat: "Thé des Maitre · Floral",     name: "Eden Floral",              notes: "Rose & Pivoine",               price: "11,50 € / 100g", img: "/products/eden-floral.png" },
  { cat: "Thé des Maitre · Caramel",    name: "Douceur Salée",            notes: "Caramel beurre salé",          price: "12,25 € / 100g", img: "/products/douceur-salee.png" },
  { cat: "Boutique",                    name: "Mug Émaillé",              notes: "« Buvez un bon café »",        price: "20 €",           img: "/products/mug-emaille.png" },
];

// ============ Chat Perché — événement Maison Maître ============
const ChatPercheScene = () => (
  <div className="absolute inset-0 flex items-center" style={{ background: "#0A0A0A" }}>
    <div
      className="mx-auto"
      style={{
        maxWidth: 1200,
        padding: "0 96px",
        borderLeft: "4px solid hsl(var(--gold))",
        paddingLeft: 56,
      }}
    >
      <div
        className="mm-eyebrow"
        style={{ fontSize: 16, color: "hsl(var(--gold))", letterSpacing: "0.42em" }}
      >
        Événement · Maison Maître
      </div>
      <h1
        className="font-serif-display mt-8"
        style={{ fontSize: 96, lineHeight: 1.02, color: "#F5EFE2" }}
      >
        Le Week-end Gourmand<br />du Chat Perché
      </h1>
      <div
        className="font-serif-display italic mt-6"
        style={{ fontSize: 42, color: "hsl(var(--gold))", fontWeight: 400 }}
      >
        Un événement unique à Dole
      </div>
      <p
        className="mm-body mt-10"
        style={{ fontSize: 26, lineHeight: 1.55, color: "rgba(245,239,226,0.78)", maxWidth: 880 }}
      >
        Chaque week-end, Maison Maître vous invite à une expérience sensorielle
        autour du café de spécialité, du thé d'exception et des vins nature.
      </p>
      <div
        className="inline-block font-sans-ui uppercase mt-12"
        style={{
          fontSize: 13,
          letterSpacing: "0.32em",
          color: "#0A0A0A",
          background: "hsl(var(--gold))",
          padding: "14px 28px",
          borderRadius: 2,
          fontWeight: 600,
        }}
      >
        ★ À ne pas manquer
      </div>
    </div>
  </div>
);


// ============ Anecdotes café (grand format TV) ============
const COFFEE_ANECDOTES = [
  { tag: "Le saviez-vous", title: "Une légende éthiopienne", body: "Un berger nommé Kaldi remarqua que ses chèvres dansaient après avoir mangé certaines baies rouges. Il venait, sans le savoir, de découvrir le café." },
  { tag: "Histoire", title: "Le premier café d'Europe", body: "Ouvert à Venise en 1645, il devint un haut lieu de débats, d'idées et de rencontres. Aujourd'hui encore, le café rassemble." },
  { tag: "Bach & le café", title: "La Kaffeekantate, 1735", body: "Jean-Sébastien Bach a composé une cantate entière dédiée au café — une déclaration d'amour musicale à la boisson noire." },
  { tag: "Beethoven", title: "Soixante grains, pas un de plus", body: "Le compositeur comptait précisément 60 grains de café pour préparer chacune de ses tasses. La précision, déjà, faisait l'art." },
  { tag: "Géographie", title: "La ceinture du café", body: "Le café ne pousse qu'entre les tropiques du Cancer et du Capricorne — une fine bande où l'altitude, la pluie et le soleil s'accordent." },
  { tag: "Torréfaction", title: "Plus c'est foncé…", body: "Contrairement à l'idée reçue, plus un café est torréfié foncé, moins il contient de caféine. La chaleur en détruit une partie." },
  { tag: "Espresso", title: "100 grains pour une tasse", body: "Il faut environ cent grains de café pour préparer un espresso parfait — concentration, finesse et 25 secondes d'extraction." },
  { tag: "Éthiopie", title: "La cérémonie du café", body: "Au pays d'origine, le café se partage en trois services rituels — un moment de paix, de paroles et de transmission qui peut durer des heures." },
  { tag: "Bien-être", title: "Une boisson amie du cœur", body: "Consommé avec mesure, le café est associé à un risque réduit de maladies cardiovasculaires selon plusieurs études internationales." },
  { tag: "Geisha", title: "Le café le plus rare du monde", body: "La variété Geisha, cultivée en Éthiopie puis au Panama, peut atteindre 10 000 € le kilo — pour ses notes florales d'exception." },
  { tag: "En boutique", title: "Repartez avec le café que vous buvez", body: "Vous savez qu'ici vous pouvez repartir avec le café que vous buvez, en grain ? En ce moment dans nos silos : le Moka Sidamo, fruité et floral." },
  { tag: "Le saviez-vous", title: "Café en grain, fraîcheur préservée", body: "Un café moulu perd 60 % de ses arômes en moins de 15 minutes. C'est pour cela que nous vous proposons nos cafés en grain, à moudre au moment de l'extraction." },
  // === Tendances & actualités des coffee shops dans le monde ===
  { tag: "Melbourne", title: "La capitale mondiale du flat white", body: "À Melbourne, la culture café est si forte que Starbucks y a fermé presque toutes ses boutiques — les torréfacteurs locaux comme Proud Mary et Market Lane dominent la scène mondiale." },
  { tag: "Tokyo", title: "Le slow coffee japonais", body: "Chez Blue Bottle ou Koffee Mameya à Tokyo, chaque tasse est préparée en filtre lent — jusqu'à 6 minutes d'extraction pour révéler la pureté du grain." },
  { tag: "Oslo", title: "La torréfaction nordique", body: "Tim Wendelboe à Oslo a inventé la torréfaction « light Scandinavian » : très claire, fruitée, presque thé — une révolution qui inspire toute la 3ᵉ vague." },
  { tag: "Séoul", title: "Le café-cathédrale coréen", body: "À Séoul, des coffee shops géants comme Onion ou Fritz Coffee mêlent architecture brutaliste, pâtisseries d'art et grains d'origine — le café devient expérience." },
  { tag: "Copenhague", title: "La Coffee Collective", body: "Pionniers du commerce direct, ils achètent leur café au même fermier depuis plus de 15 ans — un modèle imité dans toute l'Europe." },
  { tag: "Tendance 2026", title: "L'essor du café fermenté", body: "Les fermentations anaérobies et carboniques transforment le café : notes de fruits exotiques, de vin, de whisky — une révolution qui vient de Colombie et du Costa Rica." },
  { tag: "New York", title: "La renaissance du filtre", body: "À Brooklyn, des adresses comme Sey Coffee ou Devoción placent le filtre au centre — le grain de spécialité y est servi comme un grand cru." },
  { tag: "Berlin", title: "The Barn, l'exigence allemande", body: "Ralf Rüller a imposé une vision puriste : pas de lait sur les filtres, des origines tracées au village près. Berlin est devenue une capitale mondiale du café." },
  { tag: "Tendance", title: "Le retour du café grec & turc", body: "Préparé à l'eau chaude dans le cezve, sans filtre, le café turc connaît un renouveau — il est même classé au patrimoine immatériel de l'UNESCO depuis 2013." },
  { tag: "Café & climat", title: "L'arabica menacé", body: "D'ici 2050, la moitié des terres à café arabica pourrait disparaître. C'est pourquoi de nouveaux hybrides résistants émergent au Salvador et au Kenya." },
  { tag: "Ouverture", title: "Le café comme langage commun", body: "Du Yémen à Melbourne, du Brésil à Dole — partout dans le monde, le café réunit. Une tasse, c'est mille ans d'histoire et 70 pays producteurs." },
  { tag: "Sapidité", title: "La 4ᵉ vague est arrivée", body: "Après la qualité (3ᵉ vague), la 4ᵉ vague mise sur la science : profilage du grain, contrôle de l'eau, extraction mesurée au millième. Le café devient discipline d'orfèvre." },
  { tag: "Producteur·rice", title: "Café & parité", body: "Au Rwanda et au Burundi, les coopératives 100 % féminines comme Hingakawa produisent certains des meilleurs cafés d'Afrique de l'Est — à découvrir absolument." },
];

// ============ Programmes TV qualité — ce soir ============
type TvKind = "DOCUMENTAIRE" | "SÉRIE" | "ÉMISSION" | "CONCERT" | "DÉBAT";
const TV_TONIGHT: { channel: string; slot: string; kind: TvKind; title: string; note: string; pick: string }[] = [
  {
    channel: "Arte",
    slot: "20h55",
    kind: "DOCUMENTAIRE",
    title: "Le café, voyage au bout d'une tasse",
    note: "Origines du café de spécialité, des plantations éthiopiennes aux torréfacteurs européens. Aussi sur arte.tv.",
    pick: "Recommandé par Maison Maître",
  },
  {
    channel: "France 5",
    slot: "20h55",
    kind: "SÉRIE",
    title: "Vin, sans sulfites ni compromis",
    note: "Vignerons rebelles, terroirs vivants, biodynamie. Série en 3 épisodes sur le vin nature mondial.",
    pick: "Recommandé par Maison Maître",
  },
  {
    channel: "France Culture",
    slot: "21h00",
    kind: "ÉMISSION",
    title: "Le Goût du monde",
    note: "Culture du café au Yémen et en Éthiopie, entre patrimoine et modernité. Rediffusable en podcast.",
    pick: "Recommandé par Maison Maître",
  },
  {
    channel: "Mezzo",
    slot: "21h00",
    kind: "CONCERT",
    title: "Live dans les caves naturelles",
    note: "Concerts dans des caves de vignerons naturels en Bourgogne et Jura. Musique improvisée & dégustation.",
    pick: "Recommandé par Maison Maître",
  },
  {
    channel: "Public Sénat",
    slot: "20h30",
    kind: "DÉBAT",
    title: "Agriculture naturelle : les pionniers",
    note: "Agriculteurs qui abandonnent les pesticides : cafés, vignes, maraîchers bio engagés.",
    pick: "Recommandé par Maison Maître",
  },
];

const TV_KIND_COLORS: Record<TvKind, { bg: string; fg: string; border: string }> = {
  DOCUMENTAIRE: { bg: "rgba(201,168,76,0.18)",  fg: "hsl(var(--gold-lt))", border: "rgba(201,168,76,0.55)" },
  "SÉRIE":      { bg: "rgba(116,42,62,0.32)",   fg: "#E8B4C0",             border: "rgba(116,42,62,0.7)"  },
  "ÉMISSION":   { bg: "rgba(155,120,80,0.22)",  fg: "#E8C9A0",             border: "rgba(155,120,80,0.6)" },
  CONCERT:      { bg: "rgba(80,112,64,0.28)",   fg: "#C8DDB0",             border: "rgba(80,112,64,0.65)" },
  "DÉBAT":      { bg: "rgba(180,90,55,0.24)",   fg: "#F0BC9A",             border: "rgba(180,90,55,0.6)"  },
};

// 3 actualités positives du jour (curaté maison, à actualiser)
const GOOD_NEWS_OF_THE_DAY = [
  {
    title: "L'ozone se reconstitue plus vite que prévu",
    body: "Selon l'ONU, la couche d'ozone est en bonne voie de retrouver ses niveaux de 1980 d'ici 2040 — preuve qu'une action mondiale concertée peut fonctionner.",
    tag: "Planète",
  },
  {
    title: "Le tigre du Bengale repart à la hausse",
    body: "L'Inde recense aujourd'hui plus de 3 600 tigres sauvages, contre à peine 1 400 il y a quinze ans. Une victoire pour la conservation.",
    tag: "Biodiversité",
  },
  {
    title: "Les énergies renouvelables battent un record",
    body: "Pour la première fois, plus de 30 % de l'électricité mondiale provient désormais de sources renouvelables — solaire et éolien en tête.",
    tag: "Énergie",
  },
  {
    title: "Une avancée majeure contre Alzheimer",
    body: "De nouveaux traitements ralentissent significativement la progression de la maladie chez les patients diagnostiqués tôt.",
    tag: "Santé",
  },
  {
    title: "Le loup revient dans les Alpes françaises",
    body: "Après des décennies d'absence, plus de 1 100 loups parcourent à nouveau les massifs — un signe de reconquête écologique.",
    tag: "Faune",
  },
  {
    title: "Lecture en hausse chez les jeunes",
    body: "Selon le CNL, 81 % des 7-19 ans déclarent lire pour le plaisir — un chiffre en progression continue depuis cinq ans.",
    tag: "Culture",
  },
  {
    title: "Record de dons aux Restos du Cœur",
    body: "La générosité des Français ne faiblit pas — la collecte annuelle a permis de servir plus de 170 millions de repas l'an dernier.",
    tag: "Solidarité",
  },
  {
    title: "Le Jura, terre de champions",
    body: "La région compte un nombre record de domaines viticoles primés cette saison — le Savagnin et le vin jaune brillent à l'international.",
    tag: "Local",
  },
  {
    title: "La forêt française continue de s'étendre",
    body: "Avec 17 millions d'hectares, la forêt couvre désormais près d'un tiers du territoire — sa surface a doublé en deux siècles.",
    tag: "Nature",
  },
];

// ============ Scenes ============
type SceneType = "café" | "vin" | "weather" | "thé" | "épicerie" | "instagram" | "chatperche" | "produits" | "anecdote" | "goodnews" | "review" | "tv" | "dole";
interface Scene {
  type: SceneType;
  duration: number;
  reelIndex?: number;
  anecdoteIndex?: number;
  newsOffset?: number;
  productOffset?: number;
}

// Utilitaire : ordre aléatoire stable pour cette session/page
const shuffled = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Index aléatoires d'anecdotes café (renouvelés à chaque rafraîchissement)
const ANECDOTE_ORDER = shuffled(COFFEE_ANECDOTES.map((_, i) => i));
const NEWS_OFFSETS = shuffled(GOOD_NEWS_OF_THE_DAY.map((_, i) => i)).slice(0, 3);

const SCENES: Scene[] = [
  { type: "café", duration: 13000 },
  { type: "weather", duration: 12000 },
  { type: "dole", duration: 20000 },
  { type: "review", duration: 38000 },
  { type: "instagram", duration: 30000, reelIndex: 0 },
  { type: "produits", duration: 17000, productOffset: 0 },
  { type: "goodnews", duration: 18000, newsOffset: NEWS_OFFSETS[0] ?? 0 },
  { type: "anecdote", duration: 15000, anecdoteIndex: ANECDOTE_ORDER[0] ?? 0 },
  { type: "vin", duration: 13000 },
  { type: "tv", duration: 18000 },
  { type: "instagram", duration: 30000, reelIndex: 1 },
  { type: "review", duration: 38000 },
  { type: "produits", duration: 17000, productOffset: 3 },
  { type: "anecdote", duration: 15000, anecdoteIndex: ANECDOTE_ORDER[1] ?? 1 },
  { type: "thé", duration: 13000 },
  { type: "weather", duration: 12000 },
  { type: "dole", duration: 20000 },
  { type: "goodnews", duration: 18000, newsOffset: NEWS_OFFSETS[1] ?? 3 },
  { type: "anecdote", duration: 15000, anecdoteIndex: ANECDOTE_ORDER[2] ?? 2 },
  { type: "review", duration: 38000 },
  { type: "instagram", duration: 30000, reelIndex: 2 },
  { type: "produits", duration: 17000, productOffset: 6 },
  { type: "anecdote", duration: 15000, anecdoteIndex: ANECDOTE_ORDER[3] ?? 3 },
  { type: "épicerie", duration: 13000 },
  { type: "chatperche", duration: 13000 },
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

// ============ Scene content ============

const TextSlide = ({
  bg, tag, titleStart, titleItalic, body,
}: { bg: string; tag: string; titleStart: string; titleItalic: string; body: string }) => (
  <div className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
    <div className="absolute inset-0" style={{ background: bg, animation: "mm-pan 22s ease-in-out infinite", filter: "blur(2px)" }} />
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(105deg, rgba(10,7,4,0.55) 0%, rgba(10,7,4,0.15) 35%, rgba(251,247,238,0.92) 62%, rgba(251,247,238,0.99) 100%)" }}
    />
    <div
      className="pointer-events-none absolute"
      style={{
        top: "-25%", left: "-15%", width: 760, height: 760, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,0.28) 0%, transparent 65%)",
        animation: "mm-glow 9s ease-in-out infinite",
      }}
    />
    <div
      className="relative flex h-full flex-col justify-center px-28 pb-28 pt-40"
      style={{ animation: "mm-slide-up 1.2s ease-out 0.25s both" }}
    >
      <div className="flex items-center gap-6">
        <div style={{ width: 88, height: 2, background: "linear-gradient(90deg, transparent, hsl(var(--gold)))" }} />
        <div className="mm-eyebrow" style={{ fontSize: 20, color: "hsl(var(--gold))" }}>
          {tag}
        </div>
      </div>
      <h2 className="mt-10 max-w-[1380px] font-serif-display leading-[0.94]" style={{ fontSize: 134, color: "hsl(var(--ink))" }}>
        <span className="font-semibold" style={{ animation: "mm-letter-rise 1s ease-out 0.4s both", display: "inline-block" }}>{titleStart} </span>
        <span className="italic font-light" style={{ color: "hsl(var(--copper))", animation: "mm-letter-rise 1s ease-out 0.7s both", display: "inline-block" }}>{titleItalic}</span>
      </h2>
      <div className="mt-8" style={{ width: 140, height: 1, background: "linear-gradient(90deg, hsl(var(--copper)), transparent)" }} />
      <p className="mt-8 max-w-[1180px] font-serif-display italic" style={{ fontSize: 42, color: "hsl(var(--taupe))", lineHeight: 1.28 }}>
        {body}
      </p>
    </div>
  </div>
);

const WeatherScene = ({ weather }: { weather: WeatherData | null }) => {
  const targetTemp = weather ? Math.round(weather.current.temperature_2m) : 0;
  const [displayTemp, setDisplayTemp] = useState(0);
  useEffect(() => {
    if (!weather) return;
    const start = performance.now();
    const dur = 1400;
    const from = 0;
    const to = targetTemp;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayTemp(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetTemp, weather]);

  if (!weather) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: "hsl(var(--cream))" }}>
        <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.42em", color: "hsl(var(--gold))" }}>Météo · Dole, Jura</div>
        <div className="mt-8 font-serif-display italic" style={{ fontSize: 86, color: "hsl(var(--espresso))" }}>Chargement de la météo…</div>
      </div>
    );
  }
  const w = weather.current;
  return (
    <div className="mm-cream mm-grid-light absolute inset-0 flex flex-col items-center justify-center px-24 pb-24 pt-36">
      <div
        className="pointer-events-none absolute"
        style={{ top: "-15%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.22) 0%, transparent 65%)", animation: "mm-glow 10s ease-in-out infinite" }}
      />
      <div className="relative flex items-center gap-5" style={{ animation: "mm-slide-up 1s ease-out both" }}>
        <div style={{ width: 64, height: 1, background: "linear-gradient(90deg, transparent, hsl(var(--gold)))" }} />
        <div className="mm-eyebrow" style={{ fontSize: 22, color: "hsl(var(--gold))" }}>Météo · Dole, Jura</div>
        <div style={{ width: 64, height: 1, background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
      </div>
      <div className="relative mt-8 flex items-center gap-12" style={{ animation: "mm-slide-up 1s ease-out 0.2s both" }}>
        <div style={{ filter: "drop-shadow(0 12px 30px rgba(46,36,25,0.18))" }}>
          <WeatherIcon code={w.weather_code} size={240} />
        </div>
        <div className="relative font-serif-display leading-none tabular-nums" style={{ fontSize: 360, fontWeight: 200, color: "hsl(var(--espresso))", letterSpacing: "-0.05em" }}>
          {displayTemp}
          <span
            className="font-serif-display italic"
            style={{
              position: "absolute",
              top: 24,
              right: -64,
              fontSize: 110,
              fontWeight: 300,
              color: "hsl(var(--copper))",
            }}
          >
            °
          </span>
        </div>
      </div>
      <div className="relative mt-6 font-serif-display italic" style={{ fontSize: 62, color: "hsl(var(--taupe))" }}>
        {wmo(w.weather_code).label}
      </div>
      <div className="relative mt-12 mm-glass-light flex gap-12 rounded-2xl px-12 py-7" style={{ animation: "mm-slide-up 1s ease-out 0.4s both" }}>
        {[
          { l: "Humidité", v: Math.round(w.relative_humidity_2m), u: "%" },
          { l: "Vent", v: Math.round(w.wind_speed_10m), u: "km/h" },
          { l: "Ressenti", v: Math.round(w.apparent_temperature), u: "°" },
          { l: "Indice UV", v: Math.round(w.uv_index ?? 0), u: "" },
        ].map((s, i, arr) => (
          <div key={s.l} className="flex items-center gap-12">
            <div className="text-center">
              <div className="mm-eyebrow" style={{ fontSize: 13, color: "hsl(var(--mink))" }}>{s.l}</div>
              <div className="mt-2 font-serif-display tabular-nums leading-none" style={{ color: "hsl(var(--espresso))" }}>
                <span style={{ fontSize: 88, fontWeight: 300, letterSpacing: "-0.02em" }}>{s.v}</span>
                {s.u && (
                  <span className="font-sans-ui" style={{ fontSize: 22, fontWeight: 400, color: "hsl(var(--gold))", marginLeft: 6, letterSpacing: "0.05em" }}>
                    {s.u}
                  </span>
                )}
              </div>
            </div>
            {i < arr.length - 1 && <div style={{ width: 1, height: 90, background: "rgba(46,36,25,0.15)" }} />}
          </div>
        ))}
      </div>
      <div className="relative mt-12 flex gap-10" style={{ animation: "mm-slide-up 1s ease-out 0.55s both" }}>
        {weather.daily.time.slice(1, 5).map((iso, i) => {
          const d = new Date(iso);
          const code = weather.daily.weather_code[i + 1];
          return (
            <div
              key={iso}
              className="flex flex-col items-center rounded-xl px-8 py-5"
              style={{ background: "rgba(46,36,25,0.04)", border: "1px solid rgba(46,36,25,0.08)" }}
            >
              <div className="mm-eyebrow" style={{ fontSize: 13, color: "hsl(var(--gold))" }}>{DAYS_FR_SHORT[d.getDay()]}</div>
              <div className="my-3" style={{ fontSize: 52 }}>{wmo(code).emoji}</div>
              <div className="font-serif-display" style={{ fontSize: 32, color: "hsl(var(--espresso))" }}>
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

// Reels Instagram @maison_maitre — images animées, plus compatibles avec les navigateurs TV que les MP4.
const INSTAGRAM_REELS = ["DXtn06bIgtd", "DXjAgNRirlr", "DXPVGNDioOU"];
const REELS_PATH = "/reels-tv";

// Vrai logo Instagram (caméra) en SVG, gradient officiel
const InstagramLogo = ({ size = 72 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FED576" />
        <stop offset="26%" stopColor="#F47133" />
        <stop offset="61%" stopColor="#BC3081" />
        <stop offset="100%" stopColor="#4F5BD5" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#ig-grad)" />
    <rect x="12" y="12" width="40" height="40" rx="11" fill="none" stroke="#fff" strokeWidth="3.2" />
    <circle cx="32" cy="32" r="9" fill="none" stroke="#fff" strokeWidth="3.2" />
    <circle cx="46" cy="18" r="2.8" fill="#fff" />
  </svg>
);

// Précharge uniquement les formats image : certaines TV affichent un écran noir au lieu de lire les MP4.
const preloadReelAssets = (reelId: string) => {
  if (typeof window === "undefined") return;
  [`${REELS_PATH}/${reelId}.webp`, `${REELS_PATH}/${reelId}.gif`, `${REELS_PATH}/${reelId}.jpg`].forEach((href) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    document.head.appendChild(link);
  });
};
if (typeof window !== "undefined") INSTAGRAM_REELS.forEach(preloadReelAssets);

const InstagramScene = ({ active, reelIndex = 0 }: { active: boolean; reelIndex?: number }) => {
  const idx = reelIndex % INSTAGRAM_REELS.length;
  const reelId = INSTAGRAM_REELS[idx];
  const nextId = INSTAGRAM_REELS[(idx + 1) % INSTAGRAM_REELS.length];
  const [fallbackSrc, setFallbackSrc] = useState<string>(`${REELS_PATH}/${reelId}.webp`);

  useEffect(() => {
    setFallbackSrc(`${REELS_PATH}/${reelId}.webp`);
    preloadReelAssets(reelId);
    preloadReelAssets(nextId);
  }, [reelId, nextId]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Backdrop flouté avec la même image — pour habiller les bandes latérales */}
      <img
        aria-hidden
        src={fallbackSrc}
        alt=""
        className="absolute inset-0 h-full w-full"
        style={{
          objectFit: "cover",
          filter: "blur(48px) brightness(0.45) saturate(1.2)",
          transform: "scale(1.15)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.75) 100%)" }}
      />

      {/* Reel plein écran, ratio 9:16 conservé, jamais coupé */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "mm-fade-in 0.8s ease-out both" }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "9 / 16",
            height: "96%",
            maxWidth: "96%",
            borderRadius: 24,
            boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.35)",
            background: "#000",
          }}
        >
          <img
            key={fallbackSrc}
            src={fallbackSrc}
            alt=""
            className="h-full w-full"
            onError={() => setFallbackSrc((src) => src.endsWith(".webp") ? `${REELS_PATH}/${reelId}.gif` : `${REELS_PATH}/${reelId}.jpg`)}
            style={{ objectFit: "contain", background: "#000" }}
          />

          {/* Compteur REEL X/3 — top right */}
          <div
            className="absolute top-6 right-6 font-sans-ui uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "0.32em",
              color: "rgba(201,168,76,0.95)",
              padding: "8px 14px",
              border: "1px solid rgba(201,168,76,0.45)",
              borderRadius: 2,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
            }}
          >
            Reel {idx + 1} / {INSTAGRAM_REELS.length}
          </div>

          {/* Overlay bas — logo Instagram + handle + thème + CTA */}
          <div
            className="absolute left-0 right-0 bottom-0 flex items-center gap-5 px-8 pb-8 pt-24"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.9) 100%)",
            }}
          >
            <InstagramLogo size={44} />
            <div className="flex flex-col">
              <div
                className="font-serif-display"
                style={{ fontSize: 32, lineHeight: 1, color: "#fff", letterSpacing: "0.01em", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
              >
                @maison_maitre
              </div>
              <div
                className="font-sans-ui uppercase mt-2"
                style={{ fontSize: 11, letterSpacing: "0.3em", color: "rgba(201,168,76,0.9)" }}
              >
                Cafés · Thés · Vins nature
              </div>
            </div>
            <div
              className="ml-auto font-sans-ui uppercase"
              style={{
                fontSize: 13,
                letterSpacing: "0.28em",
                color: "hsl(var(--gold))",
                padding: "14px 26px",
                border: "1.5px solid hsl(var(--gold))",
                borderRadius: 2,
                background: "rgba(0,0,0,0.35)",
              }}
            >
              Suivez-nous
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Anecdote café (plein écran TV) ============
const AnecdoteScene = ({ anecdoteIndex = 0 }: { anecdoteIndex?: number }) => {
  const a = COFFEE_ANECDOTES[anecdoteIndex % COFFEE_ANECDOTES.length];
  return (
    <div className="mm-noir-warm mm-grid absolute inset-0 overflow-hidden">
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-20%", right: "-15%", width: 900, height: 900, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.28) 0%, transparent 65%)",
          animation: "mm-glow 11s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-30%", left: "-15%", width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(116,42,42,0.22) 0%, transparent 65%)",
          animation: "mm-glow 13s ease-in-out infinite reverse",
        }}
      />
      {/* Giant editorial coffee glyph */}
      <div
        className="pointer-events-none absolute font-serif-display italic select-none"
        style={{ right: -60, bottom: -120, fontSize: 720, color: "rgba(201,168,76,0.06)", lineHeight: 1 }}
      >
        ☕
      </div>
      <div
        className="relative flex h-full flex-col justify-center px-28 pb-24 pt-36"
        style={{ animation: "mm-slide-up 1.2s ease-out 0.3s both" }}
      >
        <div className="flex items-center gap-5">
          <div className="mm-glass-dark flex items-center justify-center rounded-full" style={{ width: 76, height: 76, fontSize: 38 }}>☕</div>
          <div style={{ width: 96, height: 2, background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          <div className="mm-eyebrow" style={{ fontSize: 20, color: "hsl(var(--gold))" }}>
            {a.tag} · L'art du café
          </div>
        </div>
        <h2
          className="mt-10 max-w-[1500px] font-serif-display leading-[1.02]"
          style={{ fontSize: 138, fontWeight: 600, color: "hsl(var(--linen))", textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
        >
          {a.title}
        </h2>
        <div className="mt-8" style={{ width: 160, height: 1, background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
        <p
          className="mt-8 max-w-[1360px] font-serif-display italic"
          style={{ fontSize: 48, lineHeight: 1.3, color: "rgba(242,237,228,0.86)" }}
        >
          {a.body}
        </p>
        <div className="mt-12 mm-eyebrow" style={{ fontSize: 17, color: "rgba(201,168,76,0.7)" }}>
          Maison Maitre · Le café autrement
        </div>
      </div>
      <div
        className="font-sans-ui uppercase"
        style={{
          position: "absolute",
          bottom: 32,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "#C9A84C",
          opacity: 0.65,
        }}
      >
        Maison Maître · La référence du café de spécialité à Dole
      </div>
    </div>
  );
};

// ============ 3 actualités positives du jour ============
const GoodNewsScene = ({ newsOffset = 0 }: { newsOffset?: number }) => {
  const [rotation, setRotation] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  const [, setTick] = useState(0);

  useEffect(() => {
    const refresh = setInterval(() => {
      setRotation((r) => r + 3);
      setLastUpdated(new Date());
    }, 5 * 60 * 1000);
    const tick = setInterval(() => setTick((t) => t + 1), 30 * 1000);
    return () => {
      clearInterval(refresh);
      clearInterval(tick);
    };
  }, []);

  const items = [0, 1, 2].map(
    (i) => GOOD_NEWS_OF_THE_DAY[(newsOffset + rotation + i) % GOOD_NEWS_OF_THE_DAY.length]
  );
  const minutesAgo = Math.max(0, Math.floor((Date.now() - lastUpdated.getTime()) / 60000));
  const updatedLabel =
    minutesAgo < 1 ? "Mis à jour à l'instant" : `Mis à jour il y a ${minutesAgo} min`;
  return (
    <div className="absolute inset-0 px-28 pb-24 pt-36" style={{ background: "linear-gradient(135deg, #F2EDE4 0%, #E5DDD0 100%)" }}>
      <div className="flex items-center gap-5">
        <div style={{ fontSize: 54 }}>✦</div>
        <div style={{ width: 96, height: 2, backgroundColor: "hsl(var(--gold))" }} />
        <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.4em", color: "hsl(var(--gold))" }}>
          Trois bonnes nouvelles du jour
        </div>
      </div>
      <h2 className="mt-6 font-serif-display leading-[1]" style={{ fontSize: 106, color: "hsl(var(--ink))" }}>
        <span className="font-semibold">Le monde va</span>{" "}
        <span className="italic font-light" style={{ color: "hsl(var(--copper))" }}>aussi bien.</span>
      </h2>

      <div className="mt-12 grid grid-cols-3 gap-9" style={{ height: 545 }}>
        {items.map((n, i) => (
          <div
            key={i}
            className="relative flex flex-col overflow-hidden rounded-sm p-9"
            style={{
              backgroundColor: "rgba(46,36,25,0.05)",
              border: "1px solid rgba(46,36,25,0.15)",
              borderTop: "3px solid transparent",
              backgroundImage: "linear-gradient(rgba(46,36,25,0.05), rgba(46,36,25,0.05)), linear-gradient(90deg, hsl(var(--copper)) 0%, hsl(var(--gold)) 50%, hsl(var(--gold-lt)) 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.15}s both`,
            }}
          >
            {/* Numéro géant doré en filigrane */}
            <div
              aria-hidden
              className="pointer-events-none absolute font-serif-display select-none"
              style={{
                top: -42,
                left: -10,
                fontSize: 220,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: "-0.05em",
                background: "linear-gradient(180deg, hsl(var(--gold)) 0%, hsl(var(--copper)) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                opacity: 0.18,
              }}
            >
              0{i + 1}
            </div>

            <div className="relative font-sans-ui uppercase" style={{ fontSize: 13, letterSpacing: "0.42em", color: "hsl(var(--gold))" }}>
              {n.tag}
            </div>
            <div className="relative mt-5" style={{ height: 1, background: "linear-gradient(90deg, hsl(var(--gold)) 0%, hsl(var(--gold) / 0.4) 60%, transparent 100%)" }} />
            <h3
              className="relative mt-5 font-serif-display leading-[1.05]"
              style={{ fontSize: 52, fontWeight: 600, color: "hsl(var(--espresso))", letterSpacing: "-0.01em" }}
            >
              {n.title}
            </h3>
            <div className="relative mt-5" style={{ width: 48, height: 1, backgroundColor: "hsl(var(--gold))" }} />
            <p
              className="relative mt-5 font-serif-display italic"
              style={{ fontSize: 26, lineHeight: 1.4, color: "hsl(var(--taupe))", fontWeight: 300 }}
            >
              {n.body}
            </p>
          </div>
        ))}
      </div>
      <div
        className="absolute bottom-6 right-10 font-sans-ui uppercase"
        style={{ fontSize: 11, letterSpacing: "0.32em", color: "hsl(var(--taupe) / 0.7)" }}
      >
        ◦ {updatedLabel}
      </div>
    </div>
  );
};

const TeaScene = ({ now }: { now: Date }) => {
  const saint = getSaintDuJour(now);
  return (
    <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #B0C4A0, #507040, #182A10)" }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(24,42,16,0.04) 0%, rgba(242,237,228,0.9) 58%, rgba(242,237,228,0.98) 100%)" }} />
      <div className="relative flex h-full flex-col justify-center px-28 pb-24 pt-40" style={{ animation: "mm-slide-up 1.2s ease-out 0.3s both" }}>
        <div className="flex items-center gap-6">
          <div style={{ width: 88, height: 2, backgroundColor: "hsl(var(--gold))" }} />
          <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
            Salon de Thé · Thés des Maitre
          </div>
        </div>
        <h2 className="mt-10 max-w-[1320px] font-serif-display leading-[0.96]" style={{ fontSize: 126, color: "hsl(var(--ink))" }}>
          <span className="font-semibold">Notre marque,</span>{" "}
          <span className="italic font-light" style={{ color: "hsl(var(--copper))" }}>nos cuvées.</span>
        </h2>
        <p className="mt-10 max-w-[1120px] font-serif-display italic" style={{ fontSize: 42, color: "hsl(var(--taupe))", lineHeight: 1.28 }}>
          Une collection exclusive de thés d'exception. En boutique et sur maisonmaitre.com.
        </p>
        <div
          className="mt-12 inline-flex items-center gap-6 rounded-sm px-9 py-7 self-start"
          style={{ backgroundColor: "rgba(46,36,25,0.92)", color: "hsl(var(--linen))" }}
        >
          <div style={{ fontSize: 48 }}>✦</div>
          <div>
            <div className="font-sans-ui uppercase" style={{ fontSize: 16, letterSpacing: "0.32em", color: "hsl(var(--gold-lt))" }}>
              ◆ Fête du jour
            </div>
            <div className="mt-2 font-serif-display italic" style={{ fontSize: 48, fontWeight: 300 }}>
              Bonne fête {saint}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsScene = ({ productOffset = 0 }: { productOffset?: number }) => {
  const featured = PRODUCTS_TO_TRY.find((p) => p.featured);
  const others = PRODUCTS_TO_TRY.filter((p) => !p.featured);
  const total = others.length;
  const rest = Array.from({ length: 2 }, (_, i) => others[(productOffset + i) % total]);
  const items = featured ? [featured, ...rest] : Array.from({ length: 3 }, (_, i) => PRODUCTS_TO_TRY[(productOffset + i) % PRODUCTS_TO_TRY.length]);
  return (
  <div className="mm-cream mm-grid-light absolute inset-0 px-24 pb-20 pt-32 overflow-hidden">
    <div
      className="pointer-events-none absolute"
      style={{ top: "-25%", right: "-15%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.20) 0%, transparent 65%)", animation: "mm-glow 12s ease-in-out infinite" }}
    />
    <div className="relative grid h-full gap-16" style={{ gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.4fr)" }}>
      {/* Left — title */}
      <div className="flex flex-col justify-between" style={{ animation: "mm-slide-up 1s ease-out both" }}>
        <div>
          <div className="flex items-center gap-5">
            <div style={{ width: 64, height: 2, background: "linear-gradient(90deg, transparent, hsl(var(--gold)))" }} />
            <div className="mm-eyebrow" style={{ fontSize: 16, color: "hsl(var(--gold))" }}>
              À découvrir
            </div>
          </div>
          <h2 className="mt-10 font-serif-display" style={{ fontSize: 168, lineHeight: 0.9, color: "hsl(var(--ink))", letterSpacing: "-0.02em" }}>
            <span className="font-light">Nos</span><br />
            <span className="font-semibold">coups de</span><br />
            <span className="italic font-light" style={{ color: "hsl(var(--copper))" }}>cœur.</span>
          </h2>
          <div className="mt-10" style={{ width: 120, height: 1, background: "linear-gradient(90deg, hsl(var(--gold)), transparent)" }} />
          <p className="mt-8 font-serif-display italic" style={{ fontSize: 30, lineHeight: 1.35, color: "hsl(var(--taupe))", maxWidth: 460 }}>
            Une sélection signée la Maison, à savourer sur place ou à emporter.
          </p>
        </div>
        <div className="mm-eyebrow" style={{ fontSize: 14, color: "hsl(var(--mink))" }}>
          Commande en ligne · maisonmaitre.com
        </div>
      </div>

      {/* Right — product grid */}
      <div className="grid gap-6" style={{ gridTemplateRows: "repeat(3, minmax(0, 1fr))" }}>
        {items.map((p, i) => (
          <div
            key={p.name}
            className="mm-noise relative grid overflow-hidden rounded-2xl"
            style={{
              gridTemplateColumns: "300px 1fr",
              background: "linear-gradient(180deg, #FFFFFF 0%, #FBF6EC 100%)",
              border: p.featured ? "1.5px solid hsl(var(--gold))" : "1px solid rgba(201,168,76,0.25)",
              boxShadow: p.featured
                ? "0 30px 60px -20px rgba(46,36,25,0.35), 0 0 0 1px rgba(255,255,255,0.6) inset, 0 0 0 3px rgba(201,168,76,0.18)"
                : "0 30px 60px -20px rgba(46,36,25,0.30), 0 0 0 1px rgba(255,255,255,0.6) inset",
              animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.15}s both`,
            }}
          >
            {p.featured && (
              <div
                className="font-sans-ui uppercase absolute z-10"
                style={{
                  top: 14, right: 14,
                  background: "linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(var(--gold-lt)) 100%)",
                  color: "hsl(var(--ink))",
                  fontSize: 12, letterSpacing: "0.18em", fontWeight: 600,
                  padding: "7px 14px", borderRadius: 999,
                  boxShadow: "0 8px 18px -6px rgba(201,168,76,0.55), 0 0 0 1px rgba(255,255,255,0.4) inset",
                }}
              >
                ★ Coup de cœur
              </div>
            )}
            <div className="relative w-full overflow-hidden" style={{ background: "linear-gradient(180deg, #F8F2E4 0%, #EFE4CC 100%)" }}>
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="h-full w-full"
                style={{
                  objectFit: "contain",
                  padding: 18,
                  filter: "drop-shadow(0 14px 24px rgba(46,36,25,0.25))",
                }}
              />
              {/* Overlay doré subtil — préserve les vraies couleurs du produit */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.10) 0%, transparent 60%)" }}
              />
            </div>
            <div className="relative flex flex-col justify-center p-8 overflow-hidden">
              {/* Numéro géant en filigrane */}
              <div
                aria-hidden
                className="pointer-events-none absolute font-serif-display italic select-none"
                style={{
                  right: -18,
                  bottom: -48,
                  fontSize: 280,
                  lineHeight: 1,
                  fontWeight: 300,
                  letterSpacing: "-0.05em",
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(201,168,76,0.28)",
                  zIndex: 0,
                }}
              >
                0{i + 1}
              </div>
              
              <div className="relative" style={{ zIndex: 1 }}>
                <div className="mm-eyebrow" style={{ fontSize: 13, color: "hsl(var(--gold))" }}>
                  {p.cat}
                </div>
                <div className="mt-3 font-serif-display leading-tight" style={{ fontSize: 40, color: "hsl(var(--espresso))" }}>
                  {p.name}
                </div>
                <div className="mt-4 font-serif-display italic" style={{ fontSize: 22, color: "hsl(var(--taupe))" }}>
                  {p.notes}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div style={{ width: 28, height: 1, backgroundColor: "hsl(var(--gold))" }} />
                  <div className="font-sans-ui tabular-nums" style={{ fontSize: 22, fontWeight: 500, color: "hsl(var(--gold))", letterSpacing: "0.02em" }}>
                    {p.price}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

const REVIEW_URL = "https://maps.app.goo.gl/SBPvWavn536mCHmt9";
const FIVE_STAR_REVIEWS: { name: string; text: string }[] = [
  { name: "Camille D.", text: "Une adresse rare. Café d'exception, accueil chaleureux, sélection de vins nature pointue. On revient à coup sûr." },
  { name: "Nicolas B.", text: "Le meilleur café de Dole, sans hésiter. L'équipe connaît ses produits et prend vraiment le temps de conseiller." },
  { name: "Sophie M.", text: "Un lieu magnifique, des produits d'épicerie fine triés sur le volet. Mon arrêt préféré du quartier." },
  { name: "Julien P.", text: "Service impeccable, ambiance élégante, et des thés à tomber. Maison Maitre mérite largement ses 5 étoiles." },
  { name: "Élise R.", text: "Tout est juste : le café, les vins, la lumière, les gens. Une parenthèse délicieuse à chaque visite." },
  { name: "Marion L.", text: "On sent une vraie passion derrière chaque conseil. Le Moka Sidamo est superbe, fruité et très bien torréfié." },
  { name: "Hugo V.", text: "Très belle sélection de vins nature et de gourmandises. L'accueil est simple, précis et toujours souriant." },
  { name: "Claire T.", text: "Je repars souvent avec le café que je viens de boire sur place. Belle boutique, bons produits, équipe adorable." },
  { name: "Mathieu G.", text: "Adresse incontournable pour offrir du thé ou découvrir un vrai bon café. Le lieu a beaucoup de charme." },
  { name: "Anaïs C.", text: "Excellent moment chez Maison Maitre : café parfait, conseils généreux, et une atmosphère très chaleureuse." },
];

// Logo Google "G" officiel multicolore
const GoogleG = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
    <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
  </svg>
);

const GoldStar = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <defs>
      <linearGradient id={`gs-${size}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F0CB6E" />
        <stop offset="55%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#8C6F2A" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.6l2.78 5.96 6.55.78-4.84 4.5 1.31 6.46L12 17.1l-5.8 3.2 1.31-6.46-4.84-4.5 6.55-.78L12 2.6z"
      fill={`url(#gs-${size})`}
      stroke="#7A5C1F"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  </svg>
);

const GoldStars = ({ size = 24, gap = 4, count = 5 }: { size?: number; gap?: number; count?: number }) => (
  <span style={{ display: "inline-flex", gap, alignItems: "center" }}>
    {Array.from({ length: count }).map((_, i) => <GoldStar key={i} size={size} />)}
  </span>
);

const ReviewScene = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % FIVE_STAR_REVIEWS.length), 4500);
    return () => clearInterval(t);
  }, []);
  const r = FIVE_STAR_REVIEWS[idx];
  // QR code Google avec couleurs et logo intégré (api goqr personnalisable)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=720x720&margin=8&qzone=2&color=1A160F&bgcolor=FFFFFF&ecc=H&data=${encodeURIComponent(REVIEW_URL)}`;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #1A160F 0%, #2E2419 60%, #1A160F 100%)" }}>
      {/* halos colorés Google */}
      <div className="pointer-events-none absolute" style={{ top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(66,133,244,0.18) 0%, transparent 65%)" }} />
      <div className="pointer-events-none absolute" style={{ bottom: "-25%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,67,53,0.14) 0%, transparent 65%)" }} />
      <div className="pointer-events-none absolute" style={{ top: "30%", right: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,188,5,0.12) 0%, transparent 65%)" }} />

      <div className="relative h-full px-24 pb-24 pt-36 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-5">
          <GoogleG size={56} />
          <div style={{ width: 88, height: 2, backgroundColor: "hsl(var(--gold))" }} />
          <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.42em", color: "hsl(var(--gold))" }}>
            Votre avis sur Google
          </div>
        </div>

        <h2 className="mt-7 font-serif-display leading-[0.95]" style={{ fontSize: "8vw", color: "hsl(var(--linen))" }}>
          <span className="font-light">Partagez votre</span>{" "}
          <span className="italic font-light" style={{ color: "hsl(var(--gold-lt))" }}>expérience.</span>
        </h2>

        <div className="mt-12 grid flex-1 gap-16" style={{ gridTemplateColumns: "auto 1fr" }}>
          {/* QR card façon carte téléphone */}
          <div
            className="flex flex-col items-center justify-center"
            style={{
              padding: 32,
              borderRadius: 32,
              background: "linear-gradient(180deg, #FFFFFF 0%, #FAF6EE 100%)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.5)",
              animation: "mm-slide-up 1s ease-out 0.3s both",
            }}
          >
            <div className="relative" style={{ padding: 18, background: "#fff", borderRadius: 18, border: "1px solid hsl(var(--gold))" }}>
              <img src={qrUrl} alt="QR avis Google" style={{ width: 460, height: 460, display: "block" }} />
              {/* Logo G au centre */}
              <div
                className="absolute"
                style={{
                  top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  width: 96, height: 96, borderRadius: 20, background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                }}
              >
                <GoogleG size={64} />
              </div>
            </div>
            <div className="mt-5 font-sans-ui uppercase text-center" style={{ fontSize: 12, letterSpacing: "0.42em", color: "hsl(var(--gold))" }}>
              ◆ Scannez pour nous noter ◆
            </div>
            <div className="mt-2 font-serif-display italic text-center" style={{ fontSize: 22, color: "hsl(var(--espresso))" }}>
              Votre avis compte
            </div>
          </div>

          {/* Reviews */}
          <div
            className="mm-noise flex flex-col"
            style={{
              padding: 44,
              borderRadius: 4,
              background: "#1A1510",
              borderLeft: "4px solid hsl(var(--gold))",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="font-sans-ui uppercase" style={{ fontSize: 15, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
                Derniers avis 5 étoiles
              </div>
              <div className="font-serif-display flex items-baseline gap-3" style={{ color: "hsl(var(--linen))" }}>
                <span style={{ fontSize: 64, fontWeight: 300 }}>5,0</span>
                <GoldStars size={22} gap={4} />
              </div>
            </div>

            <div key={idx} className="mt-8 flex-1 flex flex-col" style={{ animation: "mm-review-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
              <GoldStars size={42} gap={8} />
              <p className="mt-8 font-serif-display italic flex-1" style={{ fontSize: 56, lineHeight: 1.25, color: "hsl(var(--linen))", fontWeight: 300 }}>
                « {r.text} »
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div
                  className="flex items-center justify-center font-serif-display"
                  style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-lt)))",
                    color: "#1A160F", fontSize: 28, fontWeight: 600,
                    boxShadow: "0 0 0 2px rgba(201,168,76,0.3)",
                  }}
                >
                  {r.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-serif-display" style={{ fontSize: 26, color: "hsl(var(--linen))" }}>{r.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center" style={{ width: 16, height: 16, borderRadius: "50%", background: "#4285F4" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.32em", color: "rgba(242,237,228,0.65)" }}>Avis vérifié · Google</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {FIVE_STAR_REVIEWS.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i === idx ? "hsl(var(--gold))" : "rgba(242,237,228,0.15)", transition: "background-color 0.4s" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Dole · Le saviez-vous ? ============
const DOLE_FACTS: { emoji: string; title: string; body: string }[] = [
  { emoji: "🏰", title: "Capitale historique", body: "Dole fut la capitale de la Franche-Comté pendant plus de 3 siècles, avant que Besançon ne lui ravisse ce titre en 1676." },
  { emoji: "⚗️", title: "Louis Pasteur est né ici", body: "Le père de la pasteurisation et des vaccins modernes est né à Dole le 27 décembre 1822. Sa maison natale est aujourd'hui un musée." },
  { emoji: "🛤️", title: "Le Canal du Rhône au Rhin", body: "Dole est traversée par le canal du Rhône au Rhin, inauguré en 1833, qui reliait Strasbourg à la Méditerranée via le Doubs." },
  { emoji: "🦅", title: "Ville d'Art et d'Histoire", body: "Avec ses ruelles médiévales, ses hôtels particuliers du XVIe siècle et sa collégiale Notre-Dame, Dole est classée Ville d'Art et d'Histoire." },
  { emoji: "🍷", title: "Aux portes du vignoble jurassien", body: "À 20 minutes des premières vignes du Jura, Dole est la porte d'entrée naturelle vers les vins nature, savagnin et vin jaune." },
  { emoji: "☕", title: "Une culture du café qui renaît", body: "Maison Maître a fait de Dole une adresse de référence du café de spécialité en Bourgogne-Franche-Comté." },
  { emoji: "🌊", title: "Le Doubs, rivière emblématique", body: "La rivière Doubs longe la vieille ville de Dole, offrant des promenades le long des berges et un paysage unique au cœur de la cité." },
  { emoji: "🧀", title: "Terre de comté", body: "La région autour de Dole est une des zones de production du Comté AOP, le fromage le plus vendu de France avec 70 000 tonnes/an." },
  { emoji: "🎭", title: "Une ville vivante", body: "Dole accueille chaque année festivals, marchés nocturnes et événements culturels dans ses espaces patrimoniaux uniques." },
  { emoji: "📍", title: "Carrefour de la France", body: "Idéalement située entre Paris (2h TGV), Lyon (1h), Berne (1h30) et Genève (1h45), Dole est un carrefour stratégique de l'Est français." },
];

const DoleScene = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % DOLE_FACTS.length), 20000);
    return () => clearInterval(id);
  }, []);
  const f = DOLE_FACTS[idx];
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#0A0A0A" }}>
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-20%", left: "-10%", width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.16) 0%, transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-25%", right: "-15%", width: 900, height: 900, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(116,42,62,0.14) 0%, transparent 65%)",
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center px-20 text-center">
        <div
          className="font-sans-ui uppercase"
          style={{ fontSize: 11, letterSpacing: "0.3em", color: "#C9A84C" }}
        >
          Dole · Le saviez-vous ?
        </div>

        <div
          key={idx}
          className="flex flex-col items-center"
          style={{ animation: "mm-fade-in 0.6s ease-out both", marginTop: 28 }}
        >
          <div style={{ fontSize: 96, lineHeight: 1 }}>{f.emoji}</div>
          <h2
            className="font-serif-display italic"
            style={{ fontSize: "2.8rem", color: "#C9A84C", marginTop: 28, lineHeight: 1.1, letterSpacing: "-0.01em" }}
          >
            {f.title}
          </h2>
          <p
            className="mt-8 font-sans-ui"
            style={{ fontSize: "1.1rem", color: "#F5F0E8", maxWidth: "42rem", opacity: 0.8, lineHeight: 1.55 }}
          >
            {f.body}
          </p>
        </div>

        {/* Indicateur de progression */}
        <div className="mt-12 flex gap-1.5">
          {DOLE_FACTS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === idx ? 24 : 6,
                height: 3,
                borderRadius: 2,
                background: i === idx ? "#C9A84C" : "rgba(201,168,76,0.25)",
                transition: "all 0.4s",
              }}
            />
          ))}
        </div>

        {/* Signature Maison Maître */}
        <div
          className="font-serif-display italic"
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 13,
            color: "#C9A84C",
            opacity: 0.6,
          }}
        >
          Maison Maître · Café de spécialité à Dole
        </div>
      </div>
    </div>
  );
};

const SceneRenderer = ({ scene, weather, active, now }: { scene: Scene; weather: WeatherData | null; active: boolean; now: Date }) => {
  switch (scene.type) {
    case "café":
      return <TextSlide bg="linear-gradient(135deg, #C4A882, #7A5030, #3A1A08)" tag="Café de Spécialité" titleStart="Origine, terroir," titleItalic="précision." body="Des cafés sélectionnés parmi les meilleurs producteurs du monde — torréfiés artisanalement, extraits avec soin." />;
    case "anecdote":
      return <AnecdoteScene anecdoteIndex={scene.anecdoteIndex ?? 0} />;
    case "goodnews":
      return <GoodNewsScene newsOffset={scene.newsOffset ?? 0} />;
    case "produits":
      return <ProductsScene productOffset={scene.productOffset ?? 0} />;
    case "vin":
      return <TextSlide bg="linear-gradient(135deg, #C0A8B0, #704050, #2A1020)" tag="Vins Naturels" titleStart="Le vin comme" titleItalic="il devrait être." body="Vignerons engagés — Marcel Lapierre, Jean Foillard, Overnoy-Houillon, Yvon Métras." />;
    case "weather":
      return <WeatherScene weather={weather} />;
    case "thé":
      return <TeaScene now={now} />;
    case "épicerie":
      return <TextSlide bg="linear-gradient(135deg, #D0C080, #907030, #382810)" tag="Épicerie Fine" titleStart="Bien manger," titleItalic="bien choisir." body="Conserves artisanales, chocolats, condiments — sélectionnés avec la même exigence." />;
    case "instagram":
      return <InstagramScene active={active} reelIndex={scene.reelIndex ?? 0} />;
    case "chatperche":
      return <ChatPercheScene />;
    case "review":
      return <ReviewScene />;
    case "tv":
      return <TvTonightScene />;
    case "dole":
      return <DoleScene />;
  }
};

// ============ Ce soir à la TV — recommandations qualité ============
const TvTonightScene = () => (
  <div className="absolute inset-0 px-28 pb-24 pt-36" style={{ background: "linear-gradient(135deg, #1A1410 0%, #2E2419 60%, #0E0805 100%)" }}>
    <div
      className="pointer-events-none absolute"
      style={{ top: "-15%", left: "-10%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 65%)" }}
    />
    <div className="relative">
      <div className="flex items-center gap-5">
        <div style={{ fontSize: 54 }}>📺</div>
        <div style={{ width: 96, height: 2, backgroundColor: "hsl(var(--gold))" }} />
        <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.4em", color: "hsl(var(--gold))" }}>
          Café de spécialité & vin nature · Ce soir
        </div>
      </div>
      <h2 className="mt-8 font-serif-display leading-[1]" style={{ fontSize: 110, color: "hsl(var(--linen))" }}>
        <span className="font-semibold">Cinq programmes</span>{" "}
        <span className="italic font-light" style={{ color: "hsl(var(--gold-lt))" }}>pour les esprits curieux.</span>
      </h2>
      <p className="mt-6 max-w-[1240px] font-serif-display italic" style={{ fontSize: 32, lineHeight: 1.3, color: "rgba(242,237,228,0.7)" }}>
        Notre sélection éditoriale permanente — autour du café d'exception et du vin vivant.
      </p>

      <div className="mt-12 grid grid-cols-5 gap-6" style={{ height: 540 }}>
        {TV_TONIGHT.map((p, i) => {
          const c = TV_KIND_COLORS[p.kind];
          return (
            <div
              key={p.channel}
              className="flex flex-col rounded-sm p-7"
              style={{
                backgroundColor: "rgba(242,237,228,0.06)",
                border: "1px solid rgba(201,168,76,0.25)",
                animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.12}s both`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-sans-ui uppercase" style={{ fontSize: 13, letterSpacing: "0.32em", color: "hsl(var(--gold))" }}>
                  {p.slot}
                </div>
                <div
                  className="font-sans-ui uppercase rounded-sm px-2 py-1"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    backgroundColor: c.bg,
                    color: c.fg,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  {p.kind}
                </div>
              </div>
              <div className="mt-4 font-serif-display leading-tight" style={{ fontSize: 34, fontWeight: 600, color: "hsl(var(--linen))" }}>
                {p.channel}
              </div>
              <div className="mt-2" style={{ width: 36, height: 1, backgroundColor: "hsl(var(--gold) / 0.6)" }} />
              <div className="mt-4 font-serif-display italic" style={{ fontSize: 22, lineHeight: 1.25, color: "rgba(242,237,228,0.95)", fontWeight: 400 }}>
                {p.title}
              </div>
              <div className="mt-4 font-serif-display" style={{ fontSize: 17, lineHeight: 1.35, color: "rgba(242,237,228,0.72)" }}>
                {p.note}
              </div>
              <div
                className="font-serif-display italic"
                style={{ fontSize: 16, color: "rgba(201,168,76,0.85)", lineHeight: 1.3, borderTop: "1px solid rgba(201,168,76,0.2)", marginTop: "auto", paddingTop: 16 }}
              >
                ✦ <span style={{ marginLeft: 4 }}>{p.pick}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 font-sans-ui uppercase text-center" style={{ fontSize: 16, letterSpacing: "0.42em", color: "rgba(201,168,76,0.7)" }}>
        Maison Maitre · Le bon goût, du grain au verre
      </div>
    </div>
  </div>
);

// ============ Center panel ============

const CenterPanel = ({ weather, now }: { weather: WeatherData | null; now: Date }) => {
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
              transform: active ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 800ms ease, transform 800ms ease",
              pointerEvents: active ? "auto" : "none",
            }}
          >
            <SceneRenderer scene={scene} weather={weather} active={active} now={now} />
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

      {/* Bordure basse — 1px gradient or */}
      <div className="absolute bottom-0 left-0 right-0 z-20" style={{ height: 1, background: "rgba(201,168,76,0.10)" }}>
        <div
          key={progressKey}
          className="h-full origin-left"
          style={{
            background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold-lt)) 20%, hsl(var(--gold)) 50%, hsl(var(--gold-lt)) 80%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: `mm-progress ${SCENES[index].duration}ms linear forwards, mm-shimmer 3s linear infinite`,
            boxShadow: "0 0 14px hsl(var(--gold) / 0.7)",
          }}
        />
      </div>
    </main>
  );
};

const FixedTopBar = ({ now }: { now: Date }) => (
  <div
    className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-16"
    style={{
      height: 118,
      background: "linear-gradient(180deg, rgba(251,247,238,0.96) 0%, rgba(244,238,226,0.92) 100%)",
      borderBottom: "1px solid rgba(201,168,76,0.32)",
      boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 18px 40px -20px rgba(46,36,25,0.25)",
      backdropFilter: "blur(12px)",
    }}
  >
    {/* gold underline accent */}
    <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: "linear-gradient(90deg, transparent, hsl(var(--gold)) 30%, hsl(var(--gold)) 70%, transparent)" }} />
    <div className="flex items-center gap-8">
      <div>
        <div className="mm-eyebrow" style={{ fontSize: 12, color: "hsl(var(--gold))" }}>
          Boutique · Dole, Jura
        </div>
        <div className="leading-none flex items-baseline gap-3" style={{ color: "hsl(var(--espresso))" }}>
          <span className="font-sans-ui font-light tracking-wide" style={{ fontSize: 38, letterSpacing: "0.04em" }}>Maison</span>
          <span className="font-serif-display italic" style={{ fontSize: 48, color: "hsl(var(--gold))", fontWeight: 500 }}>Maitre</span>
        </div>
      </div>
      <div style={{ width: 1, height: 64, background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.55), transparent)" }} />
      <div>
        <div className="mm-eyebrow" style={{ fontSize: 11, color: "hsl(var(--mink))" }}>
          ◆ Fête du jour
        </div>
        <div className="font-serif-display italic leading-none" style={{ fontSize: 38, color: "hsl(var(--espresso))" }}>
          {getSaintDuJour(now)}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div style={{ width: 1, height: 64, background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.55), transparent)" }} />
      {/* Live pill */}
      <div
        className="flex items-center gap-2 rounded-full px-4 py-2"
        style={{ background: "rgba(46,36,25,0.06)", border: "1px solid rgba(46,36,25,0.12)" }}
      >
        <span
          className="rounded-full"
          style={{ width: 8, height: 8, background: "#16a34a", boxShadow: "0 0 10px #16a34a", animation: "mm-glow 1.6s ease-in-out infinite" }}
        />
        <span className="font-mono-ui uppercase" style={{ fontSize: 10, letterSpacing: "0.32em", color: "hsl(var(--espresso))" }}>
          En direct
        </span>
      </div>
      <div className="text-right">
        <div className="font-mono-ui leading-none tabular-nums flex items-start justify-end" style={{ color: "hsl(var(--espresso))" }}>
          <span style={{ fontSize: 84, fontWeight: 300, letterSpacing: "-0.05em" }}>
            {pad(now.getHours())}:{pad(now.getMinutes())}
          </span>
          <span className="font-mono-ui tabular-nums" style={{ fontSize: 26, color: "hsl(var(--gold))", marginLeft: 8, marginTop: 4, letterSpacing: "0.05em" }}>
            {pad(now.getSeconds())}
          </span>
        </div>
        <div className="mt-2 mm-eyebrow" style={{ fontSize: 11, color: "hsl(var(--gold))" }}>
          {formatDateLong(now)}
        </div>
      </div>
    </div>
  </div>
);

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

  type FitMode = "fit" | "cover" | "100";
  const [mode, setMode] = useState<FitMode>(() => (safeGetStorage("mm-fit") as FitMode) || "fit");
  const [scale, setScale] = useState(1);
  const [showCtrl, setShowCtrl] = useState(false);

  useEffect(() => {
    const compute = () => {
      const sx = window.innerWidth / 1920;
      const sy = window.innerHeight / 1080;
      if (mode === "fit") setScale(Math.min(sx, sy));
      else if (mode === "cover") setScale(Math.max(sx, sy));
      else setScale(1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [mode]);

  useEffect(() => {
    safeSetStorage("mm-fit", mode);
  }, [mode]);

  // Show controls on mouse move, hide after 3s
  useEffect(() => {
    let t: number | undefined;
    const onMove = () => {
      setShowCtrl(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => setShowCtrl(false), 3000);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchstart", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onMove);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      className="mm-grain-global fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{ cursor: showCtrl ? "default" : "none", background: "radial-gradient(ellipse at center, #0D0B08 0%, #050505 100%)" }}
    >
      <div
        className="relative flex overflow-hidden"
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
          background: "radial-gradient(ellipse at center, #0D0B08 0%, #050505 100%)",
        }}
      >
        <FixedTopBar now={now} />
        <CenterPanel weather={weather} now={now} />
      </div>

      {/* Mode d'affichage — visible au survol */}
      <div
        className="fixed top-4 right-4 z-[9999] flex gap-1 rounded-full p-1 transition-opacity duration-500"
        style={{
          opacity: showCtrl ? 1 : 0,
          backgroundColor: "rgba(26,22,15,0.92)",
          border: "1px solid rgba(201,168,76,0.4)",
          fontFamily: "Jost, sans-serif",
        }}
      >
        {(
          [
            { k: "fit", label: "Adapter", desc: "Aucun contenu coupé" },
            { k: "cover", label: "Remplir", desc: "Pleine surface, peut couper" },
            { k: "100", label: "100 %", desc: "Taille réelle 1920×1080" },
          ] as { k: FitMode; label: string; desc: string }[]
        ).map((o) => (
          <button
            key={o.k}
            onClick={() => setMode(o.k)}
            title={o.desc}
            className="rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors"
            style={{
              backgroundColor: mode === o.k ? "hsl(var(--gold))" : "transparent",
              color: mode === o.k ? "#1A160F" : "rgba(242,237,228,0.8)",
              cursor: "pointer",
              border: "none",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SignageDisplay;
