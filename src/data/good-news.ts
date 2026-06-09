export interface GoodNewsItem {
  title: string;
  body: string;
  tag: string;
}

// Liste organisée par thème, puise dans la rotation pour donner un effet "live"
// — la scène en montre 3 à la fois et tourne en continu.
export const GOOD_NEWS_OF_THE_DAY: GoodNewsItem[] = [
  // === Frais 2026 — local Jura / Dole ===
  {
    title: "Le Tour de France traverse Dole",
    body: "Le 17 juillet 2026, Dole sera le départ de la 13ᵉ étape du Tour de France — Belfort à l'arrivée, 205 km : la plus longue étape de la Grande Boucle cette année.",
    tag: "Dole",
  },
  {
    title: "Le bus Santé des Femmes sillonne le Jura",
    body: "Depuis février 2026, un bus médical apporte des consultations gynécologiques dans les quartiers et zones rurales du département, du lundi au mercredi.",
    tag: "Solidarité Jura",
  },
  {
    title: "Le Jura, terre de champions",
    body: "La région compte un nombre record de domaines viticoles primés cette saison — Savagnin et vin jaune brillent à l'international.",
    tag: "Local",
  },
  {
    title: "Le Comté AOP célèbre ses 70 ans",
    body: "Le fromage le plus vendu de France fête sept décennies d'AOP — une réussite collective du massif jurassien.",
    tag: "Terroir",
  },

  // === Frais 2026 — Sciences, Santé, Recherche ===
  {
    title: "Un test sanguin pour 50 cancers",
    body: "Le système de santé britannique dévoile en 2026 les résultats d'une étude majeure : détecter plus de 50 cancers par simple prise de sang, souvent avant les premiers symptômes.",
    tag: "Santé",
  },
  {
    title: "CRISPR progresse face à Huntington",
    body: "Les essais 2026 confirment des résultats encourageants : la thérapie génique ralentit la maladie de Huntington, et progresse aussi sur surdité congénitale et leucémie.",
    tag: "Biotech",
  },
  {
    title: "Le sommeil, nouveau pilier thérapeutique",
    body: "En 2026, la médecine reconnaît le sommeil comme levier thérapeutique central — au même niveau que l'alimentation ou l'activité physique.",
    tag: "Bien-être",
  },
  {
    title: "Méditerranéen + oméga-3 : inflammation en chute",
    body: "Une étude 2026 confirme qu'un régime méditerranéen enrichi en fibres et oméga-3 réduit significativement l'inflammation systémique en moins de trois mois.",
    tag: "Alimentation",
  },
  {
    title: "Les vers marins de Morlaix",
    body: "Un biologiste breton est finaliste du Prix Inventeur Européen 2026 pour un traitement des grands brûlés à partir de vers marins. Génie français en marche.",
    tag: "Innovation",
  },

  // === Frais 2026 — Espace, Climat, Économie ===
  {
    title: "Artemis II vers la Lune",
    body: "La NASA prépare en 2026 le premier vol habité vers la Lune depuis Apollo 17 il y a plus de 50 ans — Artemis II est en répétition générale pour Artemis III.",
    tag: "Espace",
  },
  {
    title: "Ariane 6 réussit son retour",
    body: "L'Europe spatiale tient bon : Ariane 6 a décollé de Kourou et placé deux satellites Galileo en orbite — fin du long passage à vide après Ariane 5.",
    tag: "Europe",
  },
  {
    title: "La France, championne d'Europe des projets",
    body: "Avec 852 projets d'investissements étrangers en 2025, la France redevient la première destination d'Europe — devant le Royaume-Uni et l'Allemagne.",
    tag: "Économie",
  },

  // === Classiques — planète, faune, culture ===
  {
    title: "L'ozone se reconstitue plus vite que prévu",
    body: "Selon l'ONU, la couche d'ozone est en bonne voie de retrouver ses niveaux de 1980 d'ici 2040 — preuve qu'une action mondiale concertée fonctionne.",
    tag: "Planète",
  },
  {
    title: "Énergies renouvelables : record mondial",
    body: "Plus de 30 % de l'électricité mondiale provient désormais de sources renouvelables — solaire et éolien en tête, et ça continue d'accélérer.",
    tag: "Énergie",
  },
  {
    title: "La forêt française continue de s'étendre",
    body: "Avec 17 millions d'hectares, la forêt couvre désormais près d'un tiers du territoire — sa surface a doublé en deux siècles.",
    tag: "Nature",
  },
  {
    title: "Le tigre du Bengale repart à la hausse",
    body: "L'Inde recense plus de 3 600 tigres sauvages aujourd'hui, contre 1 400 il y a quinze ans. Une victoire pour la conservation.",
    tag: "Biodiversité",
  },
  {
    title: "Le loup revient dans les Alpes françaises",
    body: "Après des décennies d'absence, plus de 1 100 loups parcourent à nouveau les massifs — un signe de reconquête écologique.",
    tag: "Faune",
  },
  {
    title: "Les baleines à bosse hors de danger",
    body: "Leur population mondiale a été multipliée par dix depuis l'arrêt de la chasse — elles ne sont plus inscrites comme espèce menacée.",
    tag: "Océans",
  },
  {
    title: "Une avancée majeure contre Alzheimer",
    body: "De nouveaux traitements ralentissent significativement la progression de la maladie chez les patients diagnostiqués tôt.",
    tag: "Santé",
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
    title: "Le bénévolat repart à la hausse",
    body: "Près d'un Français sur trois s'investit dans une association — un niveau record depuis 1990.",
    tag: "Engagement",
  },
  {
    title: "Les cafés de spécialité explosent en France",
    body: "Plus de 500 torréfacteurs artisanaux recensés en 2026, contre 80 en 2015. Une nouvelle scène café à la française.",
    tag: "Gastronomie",
  },
  {
    title: "Vin nature : la France leader mondial",
    body: "Plus de 1 800 vignerons français revendiquent la mention « vin méthode nature » — la plus grande communauté au monde.",
    tag: "Vin",
  },
  {
    title: "Le thé monte en gamme en France",
    body: "Le marché du thé fin a doublé en cinq ans — les Français consomment de moins en moins de sachets, de plus en plus de feuilles.",
    tag: "Thé",
  },
];
