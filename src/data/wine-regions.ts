export interface WineRegion {
  id: string;
  name: string;
  /** Sous-titre court : terroir / cépages emblématiques */
  terroir: string;
  /** Phrase d'accroche éditoriale */
  blurb: string;
  /** Vignerons emblématiques en vin nature à mettre en avant */
  producers: string[];
  /** Couleur d'accent associée à la région */
  color: string;
  /** Position approximative sur le viewBox 0 0 100 100 (~France) */
  cx: number;
  cy: number;
  /** Taille du blob */
  r: number;
}

// Régions ordonnées du nord au sud, principalement orientées vin nature.
// Le Jura est mis en premier — c'est le terroir de Maison Maître.
export const WINE_REGIONS: WineRegion[] = [
  {
    id: "jura",
    name: "Jura",
    terroir: "Savagnin · Trousseau · Poulsard · Vin Jaune",
    blurb:
      "Notre terroir. Des vignerons obstinés, des cuvées qui ne ressemblent à rien d'autre — le Jura est unique au monde.",
    producers: ["Domaine Tissot", "Overnoy-Houillon", "Marcel Cabelier"],
    color: "#C9A84C",
    cx: 73,
    cy: 47,
    r: 5,
  },
  {
    id: "beaujolais",
    name: "Beaujolais",
    terroir: "Gamay des dix crus — Morgon, Fleurie, Moulin-à-Vent",
    blurb:
      "Le berceau du vin nature moderne. Marcel Lapierre y a tout commencé en 1981. La gourmandise à l'état pur.",
    producers: ["Marcel Lapierre", "Jean Foillard", "Yvon Métras"],
    color: "#9B2335",
    cx: 67,
    cy: 58,
    r: 4.5,
  },
  {
    id: "loire",
    name: "Loire",
    terroir: "Chenin · Cabernet franc · Sauvignon · Melon de Bourgogne",
    blurb:
      "Le fleuve royal des vignerons libres : Anjou, Touraine, Muscadet, Sancerre. Tendu, salin, vibrant.",
    producers: ["Marc Pesnot", "Olivier Cousin", "Mark Angeli"],
    color: "#5B8A4B",
    cx: 35,
    cy: 42,
    r: 5.5,
  },
  {
    id: "alsace",
    name: "Alsace",
    terroir: "Riesling · Pinot Gris · Gewurztraminer · Sylvaner",
    blurb:
      "Des vignerons qui osent : amphores, longues macérations, vins d'orange. L'élégance schisteuse.",
    producers: ["Christian Binner", "Domaine Bohn", "Patrick Meyer"],
    color: "#A37BC8",
    cx: 84,
    cy: 30,
    r: 4,
  },
  {
    id: "bourgogne",
    name: "Bourgogne",
    terroir: "Pinot noir · Chardonnay · Aligoté",
    blurb:
      "La perfection précise du climat. Quelques hectares peuvent dire le monde — du Côte de Nuits aux Hautes-Côtes.",
    producers: ["Domaine Bizot", "Pierre Boisson", "Julie Balagny"],
    color: "#7E2A2A",
    cx: 68,
    cy: 45,
    r: 4.5,
  },
  {
    id: "champagne",
    name: "Champagne",
    terroir: "Pinot noir · Chardonnay · Pinot meunier",
    blurb:
      "Au-delà du luxe industriel : les vignerons de la Côte des Bar et de la Vallée de la Marne qui font des champagnes de cru.",
    producers: ["Jérôme Prévost", "Selosse", "Egly-Ouriet"],
    color: "#D6C19A",
    cx: 60,
    cy: 25,
    r: 4,
  },
  {
    id: "rhone",
    name: "Rhône",
    terroir: "Syrah · Grenache · Viognier · Marsanne",
    blurb:
      "Du nord granitique de la Côte-Rôtie aux galets ronds de Châteauneuf — la Vallée du Rhône a toutes les facettes.",
    producers: ["Gramenon", "Maxime Magnon", "Hervé Souhaut"],
    color: "#B8552B",
    cx: 67,
    cy: 76,
    r: 5,
  },
  {
    id: "languedoc",
    name: "Languedoc",
    terroir: "Carignan · Grenache · Cinsault · Mourvèdre",
    blurb:
      "Le grand laboratoire du vin nature français. Garrigue, schistes, mer Méditerranée — et des prix encore tendres.",
    producers: ["Fond Cyprès", "Sylvain Bock", "Mas Coutelou"],
    color: "#C56A4A",
    cx: 50,
    cy: 87,
    r: 5,
  },
  {
    id: "sud-ouest",
    name: "Sud-Ouest",
    terroir: "Tannat · Négrette · Manseng · Fer Servadou",
    blurb:
      "De Cahors à Madiran, des cépages oubliés que personne ne fait pousser ailleurs. Le Sud-Ouest est un trésor caché.",
    producers: ["Patrick Bouju", "Élian Da Ros", "Plageoles"],
    color: "#876342",
    cx: 35,
    cy: 78,
    r: 4.5,
  },
];
