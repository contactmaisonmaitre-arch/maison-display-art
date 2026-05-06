import type { TvKind } from "@/types/signage";

export interface TvProgram {
  channel: string;
  slot: string;
  kind: TvKind;
  title: string;
  note: string;
  pick: string;
}

// Sélection éditoriale Maison Maître — café, vin nature, terroir, gastronomie.
// La scène TV en pioche 5 au hasard à chaque démarrage du display.
export const TV_TONIGHT: TvProgram[] = [
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
  {
    channel: "Arte",
    slot: "22h25",
    kind: "DOCUMENTAIRE",
    title: "À l'ombre des caféiers",
    note: "Plongée chez les coopératives 100 % féminines du Burundi et du Rwanda — café d'Afrique de l'Est, parité, terroir d'altitude.",
    pick: "Recommandé par Maison Maître",
  },
  {
    channel: "France 3",
    slot: "20h55",
    kind: "DOCUMENTAIRE",
    title: "Jura, le vignoble qui ne ressemble à aucun autre",
    note: "Savagnin, vin jaune, ouillé / non ouillé : tout ce qu'il faut savoir du plus singulier des vignobles français.",
    pick: "Recommandé par Maison Maître",
  },
  {
    channel: "France 5",
    slot: "21h00",
    kind: "SÉRIE",
    title: "L'art du fromage",
    note: "Le Comté AOP, le Mont d'Or, le Morbier — voyage dans les tommes du Massif jurassien et leur affinage.",
    pick: "Recommandé par Maison Maître",
  },
  {
    channel: "Arte",
    slot: "21h45",
    kind: "DOCUMENTAIRE",
    title: "Tokyo, capitale du slow coffee",
    note: "Filtre lent, Kissaten, baristas obsédés par 0,1 g — la scène café japonaise, la plus exigeante du monde.",
    pick: "Recommandé par Maison Maître",
  },
  {
    channel: "France Inter",
    slot: "20h00",
    kind: "ÉMISSION",
    title: "On va déguster",
    note: "François-Régis Gaudry et son équipe — chaque dimanche, deux heures sur la cuisine, le vin, le café et leurs artisans.",
    pick: "Recommandé par Maison Maître",
  },
  {
    channel: "Arte",
    slot: "23h05",
    kind: "DOCUMENTAIRE",
    title: "Ferments oubliés",
    note: "Kombucha, kéfir, miso, vinaigres vivants — la révolution silencieuse du goût qui bouleverse cuisine et boisson.",
    pick: "Recommandé par Maison Maître",
  },
  {
    channel: "TV5 Monde",
    slot: "20h30",
    kind: "DOCUMENTAIRE",
    title: "Les routes du thé",
    note: "Du Yunnan aux jardins de Darjeeling — comment le thé voyage et change selon les terroirs et les mains qui le préparent.",
    pick: "Recommandé par Maison Maître",
  },
];

export const TV_KIND_COLORS: Record<TvKind, { bg: string; fg: string; border: string }> = {
  DOCUMENTAIRE: { bg: "rgba(201,168,76,0.18)",  fg: "hsl(var(--gold-lt))", border: "rgba(201,168,76,0.55)" },
  "SÉRIE":      { bg: "rgba(116,42,62,0.32)",   fg: "#E8B4C0",             border: "rgba(116,42,62,0.7)"  },
  "ÉMISSION":   { bg: "rgba(155,120,80,0.22)",  fg: "#E8C9A0",             border: "rgba(155,120,80,0.6)" },
  CONCERT:      { bg: "rgba(80,112,64,0.28)",   fg: "#C8DDB0",             border: "rgba(80,112,64,0.65)" },
  "DÉBAT":      { bg: "rgba(180,90,55,0.24)",   fg: "#F0BC9A",             border: "rgba(180,90,55,0.6)"  },
};
