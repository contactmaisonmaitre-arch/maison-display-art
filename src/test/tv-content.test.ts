import { describe, expect, it } from "vitest";
import { buildScenes, DEFAULT_PLAYLIST } from "@/data/scenes";
import { selectProducts } from "@/hooks/useProducts";
import { ephemeresActive, type CarteJson } from "@/data/carte";
import { mapProduct, isTvEligible } from "../../scripts/lib/products-map.mjs";
import playlist from "../../public/data/playlist.json";
import carte from "../../public/data/carte.json";
import products from "../../public/data/products.json";
import coups from "../../public/data/coups-de-coeur.json";

const at = (iso: string) => new Date(`${iso}T10:00:00+02:00`);
const ctx = { annonceCount: 1, ephemeres: true };

describe("programmation", () => {
  it("les scènes Chat Perché disparaissent après le 27/09/2026", () => {
    const before = buildScenes(DEFAULT_PLAYLIST, at("2026-09-26"), ctx).map((s) => s.type);
    const after = buildScenes(DEFAULT_PLAYLIST, at("2026-09-28"), ctx).map((s) => s.type);
    expect(before).toContain("chatperche-maison");
    expect(after).not.toContain("chatperche-maison");
  });

  it("pas de scène annonce / éphémères sans contenu", () => {
    const s = buildScenes(DEFAULT_PLAYLIST, at("2026-10-10"), { annonceCount: 0, ephemeres: false });
    expect(s.map((x) => x.type)).not.toContain("annonce");
    expect(s.map((x) => x.type)).not.toContain("ephemeres");
  });

  it("filtre par jour de la semaine", () => {
    const s = buildScenes([{ type: "anecdote", seconds: 10, days: [5, 6] }, { type: "café", seconds: 10 }], at("2026-09-23"), ctx);
    expect(s.map((x) => x.type)).toEqual(["café"]); // mercredi
  });

  it("chaque passage produits montre un produit différent", () => {
    const s = buildScenes(DEFAULT_PLAYLIST, at("2026-10-10"), ctx).filter((x) => x.type === "produits");
    expect(new Set(s.map((x) => x.productOffset)).size).toBe(s.length);
  });

  it("playlist.json est valide", () => {
    const s = buildScenes(playlist.scenes as never, at("2026-10-10"), ctx);
    expect(s.length).toBeGreaterThan(10);
  });
});

describe("carte", () => {
  it("éphémères d'automne actifs en octobre, plus en décembre", () => {
    expect(ephemeresActive(carte as CarteJson)).toBeTypeOf("boolean");
    const c = carte as CarteJson;
    expect(c.ephemeres?.items.length).toBe(2);
    expect(c.columns.flat().map((s) => s.title)).toEqual(["Café", "Au chaud", "Glacé", "Glouglou", "Miam"]);
  });
});

describe("produits", () => {
  it("coups de cœur trouvés dans le catalogue", () => {
    const sel = selectProducts(products as never, coups);
    expect(sel.featuredTea?.name).toBe("Le Chat Heureux");
    expect(sel.featuredCoffee?.name).toBe("Altiplano");
    expect(sel.pool.some((p) => p.name === "Aguacero")).toBe(false); // exclu (remplacé par Ataco)
    expect(sel.pool.length).toBeGreaterThan(15);
  });

  it("mapProduct nettoie les titres Shopify", () => {
    const p = mapProduct({
      handle: "x",
      title: "Tomber dans les Poires - Infusion Pomme Poire Thé des Maitre - 100g",
      product_type: "Infusion",
      body_html: "<p>Une infusion pomme-poire, tendre.Deuxième phrase.</p>",
      images: [{ src: "https://cdn.shopify.com/a.png" }],
      variants: [{ title: "Default Title", price: "9.75", available: true }],
    });
    expect(p.name).toBe("Tomber dans les Poires");
    expect(p.cat).toBe("Infusion des Maitre · Pomme Poire");
    expect(p.price).toBe("9,75 € · 100 g");
    expect(p.notes).toBe("Une infusion pomme-poire, tendre.");
  });

  it("exclut les formats pro 1 kg", () => {
    expect(isTvEligible({ title: "Altiplano – 1 kg PRO", product_type: "café" })).toBe(false);
  });
});

import { eventDate } from "@/hooks/useDoleEvents";
describe("événements Dole", () => {
  it("lit la date dans le texte et repère le passé", () => {
    const now = new Date("2026-09-23T10:00:00+02:00");
    expect(eventDate({ emoji: "", title: "x", body: "Samedi 12 sept. à Dole · Musée." }, now)).toBe("2026-09-12");
    expect(eventDate({ emoji: "", title: "x", body: "Mardi 06 janv. à Dole." }, new Date("2026-12-20"))).toBe("2027-01-06");
  });
});

import { currentMoment, slug, vedettePool, allItems } from "@/data/carte";
describe("carte interactive", () => {
  const c = carte as CarteJson;
  it("slug stable", () => {
    expect(slug("Chaï latte")).toBe("chai-latte");
    expect(slug("Jus d'orange")).toBe("jus-d-orange");
  });
  it("moment selon l'heure de Paris", () => {
    expect(currentMoment(c, new Date("2026-10-10T09:00:00+02:00"))?.focus).toContain("Café");
    expect(currentMoment(c, new Date("2026-10-10T15:00:00+02:00"))?.focus).toContain("Glacé");
    expect(currentMoment(c, new Date("2026-10-10T18:00:00+02:00"))?.focus).toContain("Glouglou");
  });
  it("vedette : seulement avec photo, jamais une boisson épuisée", () => {
    const pool = vedettePool(c, ["tiramisu-latte"], new Date("2026-10-10T18:00:00+02:00"));
    expect(pool.every((i) => i.image)).toBe(true);
    expect(pool.map((i) => i.id)).not.toContain("tiramisu-latte");
  });
  it("tous les identifiants de boissons sont uniques", () => {
    const ids = allItems(c).map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

import { marketStatus, holidays, nextHoliday, moonPhase } from "@/data/dole-pratique";
import { SIGNES, horoscopeDuJour } from "@/data/horoscope";
describe("infos pratiques", () => {
  it("marché : jeudi matin ouvert, lundi → prochain mardi", () => {
    expect(marketStatus(new Date("2026-09-24T10:00:00+02:00"))?.open).toBe(true); // jeudi
    expect(marketStatus(new Date("2026-09-28T10:00:00+02:00"))?.text).toMatch(/demain/); // lundi → mardi
  });
  it("jours fériés 2027 : Pâques au 29 mars → lundi 29 mars", () => {
    const lp = holidays(2027).find((h) => h.name === "Lundi de Pâques")!;
    expect(lp.date.getMonth()).toBe(2);
    expect(lp.date.getDate()).toBe(29);
    expect(nextHoliday(new Date("2026-09-24T10:00:00+02:00")).name).toBe("Toussaint");
  });
  it("lune : pleine lune du 26/09/2026 (à ±1 j)", () => {
    expect(moonPhase(new Date("2026-09-26T20:00:00Z")).name).toMatch(/Pleine|gibbeuse/);
  });
  it("horoscope : 12 phrases différentes le même jour", () => {
    const p = SIGNES.map((_, i) => horoscopeDuJour(i, "2026-09-24", ["A"]).phrase);
    expect(new Set(p).size).toBe(12);
  });
});
