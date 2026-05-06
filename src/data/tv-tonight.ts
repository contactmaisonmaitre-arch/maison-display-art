import type { TvKind } from "@/types/signage";

export interface TvProgram {
  channel: string;
  slot: string;
  kind: TvKind;
  title: string;
  note: string;
  pick: string;
}

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
];

export const TV_KIND_COLORS: Record<TvKind, { bg: string; fg: string; border: string }> = {
  DOCUMENTAIRE: { bg: "rgba(201,168,76,0.18)",  fg: "hsl(var(--gold-lt))", border: "rgba(201,168,76,0.55)" },
  "SÉRIE":      { bg: "rgba(116,42,62,0.32)",   fg: "#E8B4C0",             border: "rgba(116,42,62,0.7)"  },
  "ÉMISSION":   { bg: "rgba(155,120,80,0.22)",  fg: "#E8C9A0",             border: "rgba(155,120,80,0.6)" },
  CONCERT:      { bg: "rgba(80,112,64,0.28)",   fg: "#C8DDB0",             border: "rgba(80,112,64,0.65)" },
  "DÉBAT":      { bg: "rgba(180,90,55,0.24)",   fg: "#F0BC9A",             border: "rgba(180,90,55,0.6)"  },
};
