export interface GoodNewsItem {
  title: string;
  body: string;
  tag: string;
}

// 3 actualités positives du jour (curaté maison, à actualiser)
export const GOOD_NEWS_OF_THE_DAY: GoodNewsItem[] = [
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
