// « L'horoscope du café » — pour sourire, écrit maison. Chaque signe reçoit
// chaque jour une phrase et une boisson porte-bonheur tirées au sort de façon
// stable (même résultat toute la journée, change le lendemain).

export interface Signe {
  name: string;
  symbol: string;
  dates: string;
}

export const SIGNES: Signe[] = [
  { name: "Bélier", symbol: "♈", dates: "21 mars – 19 avril" },
  { name: "Taureau", symbol: "♉", dates: "20 avril – 20 mai" },
  { name: "Gémeaux", symbol: "♊", dates: "21 mai – 20 juin" },
  { name: "Cancer", symbol: "♋", dates: "21 juin – 22 juillet" },
  { name: "Lion", symbol: "♌", dates: "23 juillet – 22 août" },
  { name: "Vierge", symbol: "♍", dates: "23 août – 22 sept." },
  { name: "Balance", symbol: "♎", dates: "23 sept. – 22 oct." },
  { name: "Scorpion", symbol: "♏", dates: "23 oct. – 21 nov." },
  { name: "Sagittaire", symbol: "♐", dates: "22 nov. – 21 déc." },
  { name: "Capricorne", symbol: "♑", dates: "22 déc. – 19 janv." },
  { name: "Verseau", symbol: "♒", dates: "20 janv. – 18 fév." },
  { name: "Poissons", symbol: "♓", dates: "19 fév. – 20 mars" },
];

export const PHRASES: string[] = [
  "Une belle rencontre au comptoir pourrait bien illuminer ta journée.",
  "Prends le temps : aujourd'hui, les meilleures idées infusent lentement.",
  "Ton énergie est au top — un double espresso ne ferait que confirmer.",
  "Une petite douceur t'attend, et tu l'as bien méritée.",
  "Écoute ton instinct : il a rarement tort quand il s'agit de goût.",
  "Journée idéale pour tester quelque chose de nouveau sur la carte.",
  "Quelqu'un pense à toi. Offre-lui un café, la boucle est bouclée.",
  "Ralentis un peu : la mousse d'un cappuccino ne se presse pas.",
  "Ta bonne humeur est contagieuse, partage-la sans compter.",
  "Un projet qui mijotait prend enfin forme. Savoure le moment.",
  "Aujourd'hui, dis oui aux petits plaisirs simples.",
  "Une conversation inattendue t'apporte exactement ce qu'il te fallait.",
  "Les étoiles conseillent une pause en terrasse, si la météo le permet.",
  "Tu as l'esprit vif : c'est le bon jour pour régler ce qui traîne.",
  "Laisse-toi surprendre, le hasard fait bien les choses.",
  "Un compliment sincère ouvrira bien des portes aujourd'hui.",
  "Journée douce en perspective, comme un latte bien velouté.",
  "Ton sens du détail fera la différence. Comme un bon barista.",
  "Offre-toi une balade le long du Doubs, les idées viendront toutes seules.",
  "Ce qui te semblait compliqué hier paraîtra limpide aujourd'hui.",
  "Un vieil ami refait surface. Et si vous vous retrouviez autour d'un café ?",
  "L'audace paie aujourd'hui : ose la boisson que tu n'as jamais goûtée.",
  "Ton calme impressionne. Garde ce cap, tout s'aligne.",
  "Petit budget, grands plaisirs : la journée te réserve de jolies surprises.",
  "Tu rayonnes. Même la Collégiale paraît plus lumineuse à tes côtés.",
  "Accorde-toi dix minutes rien qu'à toi. C'est le meilleur investissement du jour.",
  "Une nouvelle inattendue te fera sourire avant midi.",
  "Aujourd'hui, la gourmandise n'est pas un défaut, c'est une philosophie.",
  "Partage une bonne adresse autour de toi : le bouche-à-oreille te le rendra.",
  "Tout vient à point à qui sait attendre… son café filtre.",
];

// Hash simple et stable (FNV-1a) pour un tirage « du jour ».
export const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/**
 * Phrase + boisson du jour pour le signe n° `index`. Les 12 signes ont
 * toujours des phrases différentes le même jour (pas de 7, premier avec 30).
 */
export const horoscopeDuJour = (index: number, dayKey: string, drinks: string[]) => {
  const base = hash(dayKey);
  const phrase = PHRASES[(base + index * 7) % PHRASES.length];
  const drink = drinks.length ? drinks[(hash(`${dayKey}|boisson`) + index * 5) % drinks.length] : null;
  return { phrase, drink };
};
