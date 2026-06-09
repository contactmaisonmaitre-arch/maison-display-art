export interface WineRegion {
  id: string;
  name: string;
  /** Sous-titre court : terroir / cépages emblématiques */
  terroir: string;
  /** Phrase d'accroche éditoriale */
  blurb: string;
  /** Vignerons emblématiques à mettre en avant — issus de l'inventaire boutique */
  producers: string[];
  /** Couleur d'accent associée à la région */
  color: string;
  /** Position approximative sur le viewBox 0 0 100 100 (~France) */
  cx: number;
  cy: number;
  /** Taille du blob */
  r: number;
}

// Régions ordonnées dans la rotation. Producteurs RÉELS — extraits de
// l'export caisse "export_produits_2026-06-09…xlsx" (vins en boutique au
// 9 juin 2026). Le Jura est mis en premier — c'est le terroir de Maison
// Maitre.
export const WINE_REGIONS: WineRegion[] = [
  {
    id: "jura",
    name: "Jura",
    terroir: "Savagnin · Trousseau · Poulsard · Chardonnay sous voile",
    blurb:
      "Notre terroir. Des cuvées qui ne ressemblent à rien d'autre — Côtes du Jura, Crémant, Savagnin et chardonnay voilé.",
    producers: [
      "Domaine des Carlines",
      "Domaine Grand",
    ],
    color: "#C9A84C",
    cx: 73,
    cy: 47,
    r: 5,
  },
  {
    id: "bourgogne",
    name: "Bourgogne",
    terroir: "Aligoté · Chardonnay · Pinot noir — Mâconnais, Marsannay",
    blurb:
      "De Marsannay au Mâconnais : la perfection précise du climat bourguignon, des vieilles vignes aux blancs de Viré-Clessé.",
    producers: [
      "Domaine René Bouvier",
      "Domaine des Gandines",
    ],
    color: "#7E2A2A",
    cx: 68,
    cy: 45,
    r: 4.5,
  },
  {
    id: "beaujolais",
    name: "Beaujolais",
    terroir: "Gamay — granit, schistes et soleil du sud",
    blurb:
      "Le Gamay vibrant du Beaujolais. Légèreté, fraîcheur, gourmandise — l'esprit de la cuvée Marylou et de David Large.",
    producers: [
      "David Large",
      "Cuvée Marylou — Beaujolais Villages",
    ],
    color: "#9B2335",
    cx: 67,
    cy: 58,
    r: 4.5,
  },
  {
    id: "rhone",
    name: "Vallée du Rhône",
    terroir: "Grenache · Syrah · Mourvèdre — Châteauneuf, Gigondas, Vacqueyras",
    blurb:
      "Du grand sud rhodanien aux Côtes du Rhône d'agréable rondeur. Le Domaine Fontavin signe nos coups de cœur AOC.",
    producers: [
      "Domaine Fontavin",
      "Mas de Libian",
      "Mas de Lilian",
    ],
    color: "#B8552B",
    cx: 67,
    cy: 76,
    r: 5,
  },
  {
    id: "languedoc",
    name: "Languedoc-Roussillon",
    terroir: "Carignan · Grenache · Cinsault — Corbières, Pic Saint-Loup",
    blurb:
      "Garrigue, schiste, Méditerranée. Maxime Magnon, Mas Foulaquier, Benjamin Taillandier — la nouvelle scène du Sud.",
    producers: [
      "Domaine Maxime Magnon",
      "Mas Foulaquier",
      "Benjamin Taillandier",
    ],
    color: "#C56A4A",
    cx: 50,
    cy: 87,
    r: 5,
  },
  {
    id: "sud-ouest",
    name: "Sud-Ouest",
    terroir: "Malbec · Petit Manseng · Tannat — Cahors, Jurançon, Bergerac",
    blurb:
      "De Cahors au Jurançon : des cépages oubliés, des vignerons obstinés. Cosse-Maisonneuve et Combel-Laserre en pointe.",
    producers: [
      "Cosse-Maisonneuve",
      "Combel-Laserre",
      "Domaine de Bellegarde",
    ],
    color: "#876342",
    cx: 35,
    cy: 78,
    r: 4.5,
  },
  {
    id: "alsace",
    name: "Alsace",
    terroir: "Riesling · Pinot Gris · Gewurztraminer",
    blurb:
      "L'élégance schisteuse alsacienne. Des vins droits, précis, qui chantent — signés Bader.",
    producers: ["Domaine Bader"],
    color: "#A37BC8",
    cx: 84,
    cy: 30,
    r: 4,
  },
  {
    id: "savoie",
    name: "Savoie",
    terroir: "Mondeuse · Jacquère · Altesse",
    blurb:
      "Les vins de montagne, vifs et minéraux. La Mondeuse de Jacques Bouchevreau est notre porte d'entrée.",
    producers: ["Jacques Bouchevreau"],
    color: "#4F7BA2",
    cx: 80,
    cy: 60,
    r: 3.5,
  },
];
