import { useEffect, useMemo, useState } from "react";

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

const DAILY = [
  { tag: "Café des Maitre", name: "Moka Sidamo — fruité, floral, notes d'agrumes" },
  { tag: "Thé des Maitre", name: "Darjeeling First Flush — récolte 2025" },
  { tag: "Vin nature", name: "Domaine Marcel Lapierre — Morgon" },
  { tag: "Sapidité", name: "Brownie noisette & fleur de sel" },
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
  "Café des Maitre · Moka Sidamo — en grain, en boutique",
  "Vin nature · Marcel Lapierre — Morgon",
  "Thé des Maitre · Darjeeling First Flush — récolte 2025",
  "Matcha · Kumiko Matcha — cérémonie & barista",
  "Sapidité · Brownie noisette & fleur de sel — fait maison",
  "Vin nature · Jean Foillard — Morgon Côte du Py",
  "Vin nature · Domaine Overnoy-Houillon — Pupillin, Jura",
  "Vin nature · Yvon Métras — Fleurie L'Ultime",
  "Boutique en ligne · maisonmaitre.com",
];

// Produits réels — extraits de maisonmaitre.com (prix au 100g pour les thés/infusions)
const PRODUCTS_TO_TRY = [
  { cat: "Café des Maitre · Éthiopie",  name: "Yirgacheffe Heirloom",     note: "Jasmin · Pêche · Miel · 14,50 € / 100g",        img: "/products/cafe-ethiopie.png" },
  { cat: "Café des Maitre · Colombie",  name: "Huila Bourbon Rose",       note: "Cerise · Framboise · Cacao · 16 € / 100g",      img: "/products/cafe-colombie-bourbon.png" },
  { cat: "Café des Maitre · Colombie",  name: "Huila Castillo Semi-Lavé", note: "Chocolat · Noisette · Caramel · 14,50 € / 100g",img: "/products/cafe-colombie-castillo.gif" },
  { cat: "Thé des Maitre · Noir",       name: "Banquet des Tsars",        note: "Bergamote & agrumes · 10,90 € / 100g",          img: "/products/the-tsars.png" },
  { cat: "Thé des Maitre · Vert",       name: "Le Chat Heureux",          note: "Notre incontournable · 9,50 € / 100g",          img: "/products/the-chat.png" },
  { cat: "Infusion des Maitre",         name: "Délice des Vergers",       note: "Framboise · Hibiscus · 9,35 € / 100g",          img: "/products/infusion-vergers.png" },
  { cat: "Thé des Maitre · Floral",     name: "Eden Floral",              note: "Rose & Pivoine · 11,50 € / 100g",               img: "/products/eden-floral.png" },
  { cat: "Thé des Maitre · Caramel",    name: "Douceur Salée",            note: "Caramel beurre salé · 12,25 € / 100g",          img: "/products/douceur-salee.png" },
  { cat: "Boutique",                    name: "Mug Émaillé",              note: "« Buvez un bon café » · 20 €",                  img: "/products/mug-emaille.png" },
];


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
];

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
type SceneType = "café" | "vin" | "weather" | "thé" | "épicerie" | "instagram" | "chatperche" | "produits" | "anecdote" | "goodnews" | "review";
interface Scene {
  type: SceneType;
  duration: number;
  reelIndex?: number;
  anecdoteIndex?: number;
  newsOffset?: number;
  productOffset?: number;
}
const SCENES: Scene[] = [
  { type: "café", duration: 13000 },
  { type: "weather", duration: 12000 },
  { type: "instagram", duration: 30000, reelIndex: 0 },
  { type: "produits", duration: 17000, productOffset: 0 },
  { type: "goodnews", duration: 18000, newsOffset: 0 },
  { type: "anecdote", duration: 15000, anecdoteIndex: 0 },
  { type: "vin", duration: 13000 },
  { type: "instagram", duration: 30000, reelIndex: 1 },
  { type: "produits", duration: 17000, productOffset: 3 },
  { type: "thé", duration: 13000 },
  { type: "weather", duration: 12000 },
  { type: "goodnews", duration: 18000, newsOffset: 3 },
  { type: "instagram", duration: 30000, reelIndex: 2 },
  { type: "produits", duration: 17000, productOffset: 6 },
  { type: "anecdote", duration: 15000, anecdoteIndex: 1 },
  { type: "épicerie", duration: 13000 },
  { type: "review", duration: 20000 },
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

// ============ Sub-components ============

const LeftPanel = ({ now }: { now: Date }) => {
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

      {/* Fête du jour */}
      <div className="relative px-7 py-6" style={{ borderBottom: "1px solid rgba(242,237,228,0.08)" }}>
        <div className="font-sans-ui uppercase" style={{ fontSize: 10, letterSpacing: "0.32em", color: "rgba(242,237,228,0.4)" }}>
          ✦ Fête du jour
        </div>
        <div className="mt-3 font-serif-display italic text-linen" style={{ fontSize: 30, fontWeight: 300, lineHeight: 1.1 }}>
          {getSaintDuJour(now)}
        </div>
        <div className="mt-2 font-sans-ui" style={{ fontSize: 12, color: "rgba(242,237,228,0.45)" }}>
          Bonne fête à toutes et tous !
        </div>
      </div>

      {/* Daily selection */}
      <div className="relative flex flex-1 flex-col justify-center px-7 py-6">
        <div className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.32em", color: "rgba(242,237,228,0.32)" }}>
          Sélection du jour
        </div>
        <div className="mt-6 space-y-5">
          {DAILY.map((d) => (
            <div key={d.tag}>
              <div className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.28em", color: "hsl(var(--gold))" }}>
                {d.tag}
              </div>
              <div className="mt-1 font-serif-display italic leading-snug" style={{ fontSize: 19, color: "rgba(242,237,228,0.92)" }}>
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
      style={{ background: "linear-gradient(90deg, rgba(26,22,15,0.12) 0%, rgba(242,237,228,0.92) 58%, rgba(242,237,228,0.98) 100%)" }}
    />
    <div
      className="relative flex h-full flex-col justify-center px-28 pb-24 pt-40"
      style={{ animation: "mm-slide-up 1.2s ease-out 0.25s both" }}
    >
      <div className="flex items-center gap-6">
        <div style={{ width: 88, height: 2, backgroundColor: "hsl(var(--gold))" }} />
        <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
          {tag}
        </div>
      </div>
      <h2 className="mt-10 max-w-[1380px] font-serif-display leading-[0.96]" style={{ fontSize: 126, color: "hsl(var(--ink))" }}>
        <span className="font-semibold">{titleStart} </span>
        <span className="italic font-light" style={{ color: "hsl(var(--wine))" }}>{titleItalic}</span>
      </h2>
      <p className="mt-10 max-w-[1180px] font-serif-display italic" style={{ fontSize: 42, color: "hsl(var(--taupe))", lineHeight: 1.28 }}>
        {body}
      </p>
    </div>
  </div>
);

const WeatherScene = ({ weather }: { weather: WeatherData | null }) => {
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
    <div className="absolute inset-0 flex flex-col items-center justify-center px-24 pb-24 pt-36" style={{ backgroundColor: "hsl(var(--cream))" }}>
      <div className="font-sans-ui uppercase" style={{ fontSize: 22, letterSpacing: "0.42em", color: "hsl(var(--gold))" }}>
        Météo · Dole, Jura
      </div>
      <div className="mt-10 flex items-center gap-12">
        <div style={{ fontSize: 176 }}>{wmo(w.weather_code).emoji}</div>
        <div className="font-serif-display leading-none" style={{ fontSize: 260, fontWeight: 300, color: "hsl(var(--espresso))" }}>
          {Math.round(w.temperature_2m)}°
        </div>
      </div>
      <div className="mt-2 font-serif-display italic" style={{ fontSize: 62, color: "hsl(var(--taupe))" }}>
        {wmo(w.weather_code).label}
      </div>
      <div className="mt-14 flex gap-24">
        {[
          { l: "Humidité", v: `${Math.round(w.relative_humidity_2m)}%` },
          { l: "Vent km/h", v: `${Math.round(w.wind_speed_10m)}` },
          { l: "Ressenti", v: `${Math.round(w.apparent_temperature)}°` },
          { l: "Indice UV", v: `${Math.round(w.uv_index ?? 0)}` },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-sans-ui uppercase" style={{ fontSize: 15, letterSpacing: "0.3em", color: "hsl(var(--mink))" }}>
              {s.l}
            </div>
            <div className="mt-2 font-serif-display" style={{ fontSize: 58, fontWeight: 300, color: "hsl(var(--espresso))" }}>
              {s.v}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 flex gap-16">
        {weather.daily.time.slice(1, 5).map((iso, i) => {
          const d = new Date(iso);
          const code = weather.daily.weather_code[i + 1];
          return (
            <div key={iso} className="flex flex-col items-center">
              <div className="font-sans-ui uppercase" style={{ fontSize: 15, letterSpacing: "0.24em", color: "hsl(var(--mink))" }}>
                {DAYS_FR_SHORT[d.getDay()]}
              </div>
              <div className="my-3" style={{ fontSize: 48 }}>{wmo(code).emoji}</div>
              <div className="font-serif-display" style={{ fontSize: 30, color: "hsl(var(--espresso))" }}>
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

// Reels Instagram @maison_maitre — vidéos MP4 silencieuses, optimisées TV.
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

// Précharge les MP4 des Reels une seule fois (cache navigateur)
const reelBlobCache: Record<string, string> = {};
const reelLoadingPromises: Record<string, Promise<string>> = {};
const preloadReel = (reelId: string): Promise<string> => {
  if (reelBlobCache[reelId]) return Promise.resolve(reelBlobCache[reelId]);
  if (reelLoadingPromises[reelId]) return reelLoadingPromises[reelId];
  const p = fetch(`${REELS_PATH}/${reelId}.mp4`)
    .then((r) => r.blob())
    .then((b) => {
      const url = URL.createObjectURL(b);
      reelBlobCache[reelId] = url;
      return url;
    })
    .catch(() => `${REELS_PATH}/${reelId}.mp4`);
  reelLoadingPromises[reelId] = p;
  return p;
};
// Précharge tous les reels au démarrage du module
if (typeof window !== "undefined") {
  INSTAGRAM_REELS.forEach((id) => preloadReel(id));
}

const InstagramScene = ({ active, reelIndex = 0 }: { active: boolean; reelIndex?: number }) => {
  const idx = reelIndex % INSTAGRAM_REELS.length;
  const reelId = INSTAGRAM_REELS[idx];
  const nextId = INSTAGRAM_REELS[(idx + 1) % INSTAGRAM_REELS.length];
  const [vidEl, setVidEl] = useState<HTMLVideoElement | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>(reelBlobCache[reelId] || "");
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    preloadReel(reelId).then((url) => {
      if (!cancelled) setVideoSrc(url);
    });
    // précharge aussi le suivant
    preloadReel(nextId);
    return () => { cancelled = true; };
  }, [reelId, nextId]);

  useEffect(() => {
    if (active && vidEl && videoSrc) {
      try {
        vidEl.currentTime = 0;
        vidEl.play().catch(() => {});
      } catch {}
    }
  }, [active, vidEl, videoSrc, reelId]);

  return (
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(135deg, #1A0F08 0%, #0A0604 60%, #050302 100%)" }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-15%", right: "-10%", width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,150,90,0.18) 0%, transparent 65%)",
        }}
      />

      <div className="relative grid h-full grid-cols-2 gap-12 px-20 pb-24 pt-32">
        {/* Reel à gauche, en vrai cadre 9:16 façon téléphone */}
        <div className="flex items-center justify-center">
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "9 / 16",
              height: "94%",
              borderRadius: 28,
              boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,150,90,0.3), 0 0 0 8px #1a1410, 0 0 0 9px rgba(184,150,90,0.4)",
              background: "#000",
            }}
          >
            <video
              ref={setVidEl}
              key={reelId}
              src={videoSrc || undefined}
              poster={`${REELS_PATH}/${reelId}.jpg`}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setLoaded(true)}
              onCanPlay={() => setLoaded(true)}
              className="h-full w-full"
              style={{ objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
            />
            {/* Poster image affichée tant que la vidéo n'est pas prête */}
            {!loaded && (
              <img
                src={`${REELS_PATH}/${reelId}.jpg`}
                alt=""
                className="absolute inset-0 h-full w-full"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        </div>

        {/* Branding à droite */}
        <div className="flex flex-col justify-center" style={{ animation: "mm-slide-up 1.2s ease-out 0.3s both" }}>
          <div className="flex items-center gap-5">
            <InstagramLogo size={64} />
            <div className="font-sans-ui uppercase" style={{ fontSize: 18, letterSpacing: "0.4em", color: "hsl(var(--gold))" }}>
              Suivez-nous
            </div>
          </div>

          <h2
            className="font-serif-display"
            style={{ fontSize: 104, lineHeight: 1, color: "hsl(var(--linen))", marginTop: 32, letterSpacing: "0.02em" }}
          >
            <span className="font-semibold">Maison</span>
            <br />
            <em className="font-light" style={{ color: "hsl(var(--gold-lt))" }}>Maitre</em>
          </h2>

          <div
            className="font-serif-display flex items-center gap-4"
            style={{ fontSize: 52, color: "hsl(var(--linen))", marginTop: 36, letterSpacing: "0.01em" }}
          >
            <InstagramLogo size={52} />
            @maison_maitre
          </div>

          <p
            className="font-sans-ui"
            style={{ fontSize: 26, lineHeight: 1.45, color: "rgba(242,237,228,0.82)", marginTop: 32, maxWidth: 640 }}
          >
            Cafés des Maitre, Thés des Maitre, vignerons nature et belles
            adresses — toute notre actualité au quotidien.
          </p>

          <div className="mt-12 font-sans-ui uppercase" style={{ fontSize: 16, letterSpacing: "0.32em", color: "rgba(184,150,90,0.7)" }}>
            Reel {idx + 1} / {INSTAGRAM_REELS.length}
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
    <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #3A2418 0%, #1F1209 60%, #0E0805 100%)" }}>
      {/* halo doré */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-20%", right: "-15%", width: 900, height: 900, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,150,90,0.22) 0%, transparent 65%)",
        }}
      />
      <div
        className="relative flex h-full flex-col justify-center px-28 pb-24 pt-36"
        style={{ animation: "mm-slide-up 1.2s ease-out 0.3s both" }}
      >
        <div className="flex items-center gap-5">
          <div style={{ fontSize: 70 }}>☕</div>
          <div style={{ width: 96, height: 2, backgroundColor: "hsl(var(--gold))" }} />
          <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.4em", color: "hsl(var(--gold))" }}>
            {a.tag} · L'art du café
          </div>
        </div>
        <h2
          className="mt-10 font-serif-display leading-[1.02]"
          style={{ fontSize: 132, fontWeight: 600, color: "hsl(var(--linen))" }}
        >
          {a.title}
        </h2>
        <p
          className="mt-10 max-w-[1360px] font-serif-display italic"
          style={{ fontSize: 48, lineHeight: 1.3, color: "rgba(242,237,228,0.82)" }}
        >
          {a.body}
        </p>
        <div className="mt-12 font-sans-ui uppercase" style={{ fontSize: 17, letterSpacing: "0.42em", color: "rgba(184,150,90,0.7)" }}>
          Maison Maitre · Le café autrement
        </div>
      </div>
    </div>
  );
};

// ============ 3 actualités positives du jour ============
const GoodNewsScene = ({ newsOffset = 0 }: { newsOffset?: number }) => {
  const items = [0, 1, 2].map(
    (i) => GOOD_NEWS_OF_THE_DAY[(newsOffset + i) % GOOD_NEWS_OF_THE_DAY.length]
  );
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
        <span className="italic font-light" style={{ color: "hsl(var(--wine))" }}>aussi bien.</span>
      </h2>

      <div className="mt-12 grid grid-cols-3 gap-9" style={{ height: 545 }}>
        {items.map((n, i) => (
          <div
            key={i}
            className="flex flex-col rounded-sm p-9"
            style={{
              backgroundColor: "rgba(46,36,25,0.05)",
              border: "1px solid rgba(46,36,25,0.15)",
              animation: `mm-slide-up 0.9s ease-out ${0.2 + i * 0.15}s both`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center font-serif-display"
                style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "hsl(var(--gold))", color: "hsl(var(--ink))", fontSize: 22, fontWeight: 600 }}
              >
                {i + 1}
              </div>
              <div className="font-sans-ui uppercase" style={{ fontSize: 14, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
                {n.tag}
              </div>
            </div>
            <h3
              className="mt-7 font-serif-display leading-[1.1]"
              style={{ fontSize: 44, fontWeight: 600, color: "hsl(var(--espresso))" }}
            >
              {n.title}
            </h3>
            <p
              className="mt-5 font-serif-display italic"
              style={{ fontSize: 27, lineHeight: 1.35, color: "hsl(var(--taupe))" }}
            >
              {n.body}
            </p>
          </div>
        ))}
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
          <span className="italic font-light" style={{ color: "hsl(var(--wine))" }}>nos cuvées.</span>
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
              Fête du jour
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
  const total = PRODUCTS_TO_TRY.length;
  const items = Array.from({ length: 3 }, (_, i) => PRODUCTS_TO_TRY[(productOffset + i) % total]);
  return (
  <div className="absolute inset-0 px-24 pb-24 pt-36" style={{ backgroundColor: "hsl(var(--cream))" }}>
    <div className="flex items-center gap-6">
      <div style={{ width: 88, height: 2, backgroundColor: "hsl(var(--gold))" }} />
      <div className="font-sans-ui uppercase" style={{ fontSize: 20, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
        À découvrir · maisonmaitre.com
      </div>
    </div>
    <h2 className="mt-6 font-serif-display leading-[1]" style={{ fontSize: 94, color: "hsl(var(--ink))" }}>
      <span className="font-semibold">Nos coups de cœur</span>{" "}
      <span className="italic font-light" style={{ color: "hsl(var(--wine))" }}>à tester.</span>
    </h2>
    <div className="mt-10 grid grid-cols-3 gap-8" style={{ height: 720 }}>
      {items.map((p) => (
        <div
          key={p.name}
          className="flex flex-col overflow-hidden rounded-sm"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(46,36,25,0.12)", boxShadow: "0 14px 40px rgba(46,36,25,0.10)" }}
        >
          <div className="relative w-full overflow-hidden" style={{ height: 460, backgroundColor: "#FAF6EE" }}>
            <img
              src={p.img}
              alt={p.name}
              loading="lazy"
              className="h-full w-full"
              style={{ objectFit: "contain", padding: 18 }}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-7">
            <div>
              <div className="font-sans-ui uppercase" style={{ fontSize: 16, letterSpacing: "0.3em", color: "hsl(var(--gold))" }}>
                {p.cat}
              </div>
              <div className="mt-3 font-serif-display leading-tight" style={{ fontSize: 42, color: "hsl(var(--espresso))" }}>
                {p.name}
              </div>
            </div>
            <div className="mt-4 font-serif-display italic" style={{ fontSize: 28, color: "hsl(var(--taupe))" }}>
              {p.note}
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-7 font-sans-ui uppercase text-center" style={{ fontSize: 17, letterSpacing: "0.36em", color: "hsl(var(--mink))" }}>
      Commande en ligne · maisonmaitre.com
    </div>
  </div>
  );
};

const REVIEW_URL = "https://maps.app.goo.gl/SBPvWavn536mCHmt9";
const FIVE_STAR_REVIEWS: { name: string; text: string }[] = [
  { name: "Camille D.", text: "Une adresse rare. Café d'exception, accueil chaleureux, sélection de vins natures pointue. On revient à coup sûr." },
  { name: "Thomas L.", text: "Le meilleur café de la ville, sans hésiter. L'équipe est passionnée et de bon conseil. Une vraie maison." },
  { name: "Sophie M.", text: "Un lieu magnifique, des produits d'épicerie fine triés sur le volet. Mon arrêt préféré du quartier." },
  { name: "Antoine R.", text: "Service impeccable, ambiance feutrée, et des thés à tomber. Maison Maitre mérite ses 5 étoiles." },
  { name: "Élise B.", text: "Tout est juste : le café, les vins, la lumière, les gens. Une parenthèse délicieuse à chaque visite." },
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

        <h2 className="mt-7 font-serif-display leading-[0.98]" style={{ fontSize: 110, color: "hsl(var(--linen))" }}>
          <span className="font-semibold">Partagez votre</span>{" "}
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
              boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(184,150,90,0.5)",
              animation: "mm-slide-up 1s ease-out 0.3s both",
            }}
          >
            <div className="relative" style={{ padding: 18, background: "#fff", borderRadius: 18 }}>
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
            <div className="mt-6 font-serif-display text-center" style={{ fontSize: 30, color: "hsl(var(--espresso))" }}>
              Scannez pour <em className="font-light" style={{ color: "hsl(var(--wine))" }}>nous noter</em>
            </div>
            <div className="mt-2 font-sans-ui uppercase text-center" style={{ fontSize: 13, letterSpacing: "0.36em", color: "hsl(var(--mink))" }}>
              ★★★★★ · Google Maps
            </div>
          </div>

          {/* Reviews */}
          <div
            className="flex flex-col"
            style={{
              padding: 44,
              borderRadius: 28,
              background: "rgba(242,237,228,0.06)",
              border: "1px solid rgba(184,150,90,0.25)",
              backdropFilter: "blur(2px)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="font-sans-ui uppercase" style={{ fontSize: 15, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
                Derniers avis 5 étoiles
              </div>
              <div className="font-serif-display flex items-baseline gap-3" style={{ color: "hsl(var(--linen))" }}>
                <span style={{ fontSize: 64, fontWeight: 300 }}>5,0</span>
                <span style={{ fontSize: 22, color: "#E8B548", letterSpacing: 4 }}>★★★★★</span>
              </div>
            </div>

            <div key={idx} className="mt-8 flex-1 flex flex-col" style={{ animation: "mm-slide-up 0.6s ease-out both" }}>
              <div style={{ fontSize: 42, color: "#E8B548", letterSpacing: 8 }}>★★★★★</div>
              <p className="mt-8 font-serif-display italic flex-1" style={{ fontSize: 40, lineHeight: 1.32, color: "hsl(var(--linen))" }}>
                « {r.text} »
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div
                  className="flex items-center justify-center font-serif-display"
                  style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-lt)))",
                    color: "#1A160F", fontSize: 26, fontWeight: 600,
                  }}
                >
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="font-serif-display" style={{ fontSize: 26, color: "hsl(var(--linen))" }}>{r.name}</div>
                  <div className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.32em", color: "rgba(242,237,228,0.5)" }}>Avis vérifié Google</div>
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
      return <TextSlide bg="linear-gradient(135deg, #A0A8C0, #405070, #101828)" tag="Chat Perché Gourmand · Été 2026" titleStart="Le rendez-vous" titleItalic="de l'été." body="Retrouvez-nous sur La Visitation. Dégustation, découverte, plaisirs partagés." />;
    case "review":
      return <ReviewScene />;
  }
};

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
      {SCENES.map((scene, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
        >
          <SceneRenderer scene={scene} weather={weather} active={i === index} now={now} />
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

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20" style={{ height: 4, backgroundColor: "rgba(0,0,0,0.08)" }}>
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

const FixedTopBar = ({ now }: { now: Date }) => (
  <div
    className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-16"
    style={{ height: 118, backgroundColor: "rgba(242,237,228,0.94)", borderBottom: "1px solid rgba(46,36,25,0.14)" }}
  >
    <div className="flex items-center gap-8">
      <div>
        <div className="font-sans-ui uppercase" style={{ fontSize: 13, letterSpacing: "0.36em", color: "hsl(var(--gold))" }}>
          Boutique · Dole, Jura
        </div>
        <div className="font-serif-display leading-none" style={{ fontSize: 46, color: "hsl(var(--espresso))" }}>
          <span className="font-semibold">Maison </span>
          <span className="italic font-light" style={{ color: "hsl(var(--wine))" }}>Maitre</span>
        </div>
      </div>
      <div style={{ width: 1, height: 64, backgroundColor: "rgba(46,36,25,0.16)" }} />
      <div>
        <div className="font-sans-ui uppercase" style={{ fontSize: 12, letterSpacing: "0.3em", color: "hsl(var(--mink))" }}>
          Fête du jour
        </div>
        <div className="font-serif-display italic leading-none" style={{ fontSize: 38, color: "hsl(var(--espresso))" }}>
          {getSaintDuJour(now)}
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-serif-display leading-none" style={{ fontSize: 76, fontWeight: 300, color: "hsl(var(--espresso))" }}>
        {pad(now.getHours())}:{pad(now.getMinutes())}
        <span style={{ fontSize: 42, color: "hsl(var(--mink))" }}>:{pad(now.getSeconds())}</span>
      </div>
      <div className="mt-2 font-sans-ui uppercase" style={{ fontSize: 13, letterSpacing: "0.26em", color: "hsl(var(--gold))" }}>
        {formatDateLong(now)}
      </div>
    </div>
  </div>
);

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
  const items = POSITIVE_ANECDOTES;
  const doubled = useMemo(() => [...items, ...items], [items]);

  return (
    <aside
      className="relative flex h-full flex-col overflow-hidden"
      style={{ width: 340, backgroundColor: "#E5DDD0", animation: "mm-slide-right 1s ease-out both" }}
    >
      <PaperGrain />
      <div className="relative flex items-end justify-between px-6 pb-5 pt-7" style={{ borderBottom: "1px solid rgba(106,97,87,0.18)" }}>
        <div>
          <div className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.36em", color: "hsl(var(--mink))" }}>
            Le saviez-vous
          </div>
          <h2 className="mt-1 font-serif-display" style={{ fontSize: 30, fontWeight: 300, color: "hsl(var(--espresso))" }}>
            Anecdotes
          </h2>
        </div>
        <div style={{ fontSize: 28 }}>✦</div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div style={{ animation: "mm-news-scroll 120s linear infinite" }}>
          {doubled.map((n, i) => (
            <div key={i} className="px-6 py-6" style={{ borderBottom: "1px solid rgba(106,97,87,0.12)" }}>
              <div className="font-sans-ui uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "hsl(var(--gold))" }}>
                {n.source}
              </div>
              <div className="mt-3 font-serif-display italic leading-snug" style={{ fontSize: 19, color: "hsl(var(--espresso))", lineHeight: 1.45 }}>
                {n.title}
              </div>
            </div>
          ))}
        </div>
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
      className="fixed inset-0 overflow-hidden bg-ink flex items-center justify-center"
      style={{ cursor: showCtrl ? "default" : "none" }}
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
        <FixedTopBar now={now} />
        <CenterPanel weather={weather} now={now} />
      </div>

      {/* Mode d'affichage — visible au survol */}
      <div
        className="fixed top-4 right-4 z-[9999] flex gap-1 rounded-full p-1 transition-opacity duration-500"
        style={{
          opacity: showCtrl ? 1 : 0,
          backgroundColor: "rgba(26,22,15,0.92)",
          border: "1px solid rgba(184,150,90,0.4)",
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
