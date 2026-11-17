import { useMemo } from "react";
import { useRemoteJson } from "./useRemoteJson";
import { useToday } from "./useToday";
import fallbackNoel from "../../public/data/noel.json";

export interface NoelRecette {
  name: string;
  price: string;
  desc?: string;
}

export interface NoelListe {
  title: string;
  price?: string;
  items: string[];
}

export interface NoelConseil {
  theme?: string;
  title: string;
  text: string;
}

export interface NoelJson {
  from?: string;
  until?: string;
  eyebrow?: string;
  recettes: NoelRecette[];
  thes?: NoelListe;
  infusions?: NoelListe;
  photo?: string;
  conseils?: NoelConseil[];
}

const todayIso = (d: Date) => d.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });

/** Contenu de Noël (public/data/noel.json), modifiable sur GitHub sans republier. */
export const useNoel = (): NoelJson => {
  const json = useRemoteJson<NoelJson>("data/noel.json", 30 * 60 * 1000);
  return json ?? (fallbackNoel as NoelJson);
};

/** Vrai pendant la période de Noël (tartan, scènes de Noël). `?noel` force l'aperçu. */
export const useNoelActive = (): boolean => {
  const noel = useNoel();
  const today = useToday();
  return useMemo(() => {
    if (new URLSearchParams(window.location.search).has("noel")) return true;
    const t = todayIso(today);
    return (!noel.from || t >= noel.from) && (!noel.until || t <= noel.until);
  }, [noel.from, noel.until, today]);
};
