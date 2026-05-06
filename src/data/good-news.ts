export interface GoodNewsItem {
  title: string;
  body: string;
  tag: string;
}

// Liste organisée par thème, puise dans la rotation pour donner un effet "live"
// — la scène en montre 3 à la fois et tourne en continu.
export const GOOD_NEWS_OF_THE_DAY: GoodNewsItem[] = [
  // Planète & climat
  {
    title: "L'ozone se reconstitue plus vite que prévu",
    body: "Selon l'ONU, la couche d'ozone est en bonne voie de retrouver ses niveaux de 1980 d'ici 2040 — preuve qu'une action mondiale concertée fonctionne.",
    tag: "Planète",
  },
  {
    title: "Énergies renouvelables : record mondial",
    body: "Pour la première fois, plus de 30 % de l'électricité mondiale provient désormais de sources renouvelables — solaire et éolien en tête.",
    tag: "Énergie",
  },
  {
    title: "La forêt française continue de s'étendre",
    body: "Avec 17 millions d'hectares, la forêt couvre désormais près d'un tiers du territoire — sa surface a doublé en deux siècles.",
    tag: "Nature",
  },
  {
    title: "Recul historique des émissions européennes",
    body: "L'UE a réduit ses émissions de CO₂ de 8 % en un an — le plus gros recul jamais enregistré hors période de crise.",
    tag: "Climat",
  },
  {
    title: "Les villes plantent par millions",
    body: "Paris, Lyon, Bordeaux et Dijon ont planté plus de 250 000 arbres l'an dernier pour rafraîchir leurs centres en été.",
    tag: "Urbanisme",
  },
  {
    title: "Plastique : la France en avance",
    body: "Le tri se généralise : 70 % des emballages plastiques sont désormais recyclés, contre 25 % il y a dix ans.",
    tag: "Recyclage",
  },

  // Faune & biodiversité
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
    title: "Retour spectaculaire des bouquetins",
    body: "Sauvés in extremis au XXe siècle, les bouquetins sont aujourd'hui plus de 12 000 dans les Alpes françaises.",
    tag: "Faune",
  },
  {
    title: "Les baleines à bosse hors de danger",
    body: "Leur population mondiale a été multipliée par dix depuis l'arrêt de la chasse — elles ne sont plus inscrites comme espèce menacée.",
    tag: "Océans",
  },
  {
    title: "La cigogne blanche niche à nouveau dans le Jura",
    body: "Quasi-disparue dans les années 1970, elle a recolonisé tout l'est de la France — plus de 200 couples recensés en région.",
    tag: "Faune locale",
  },

  // Santé
  {
    title: "Une avancée majeure contre Alzheimer",
    body: "De nouveaux traitements ralentissent significativement la progression de la maladie chez les patients diagnostiqués tôt.",
    tag: "Santé",
  },
  {
    title: "Cancer du sein : nouveau cap mondial",
    body: "Le taux de survie à cinq ans dépasse désormais 90 % dans les pays à dépistage généralisé. Un seuil inédit.",
    tag: "Santé",
  },
  {
    title: "VIH : un troisième patient guéri",
    body: "La greffe ciblée a permis une rémission complète durable — la voie d'un traitement curatif progresse.",
    tag: "Recherche",
  },
  {
    title: "L'espérance de vie en bonne santé progresse",
    body: "En France, on gagne désormais plus d'années en bonne santé qu'en années totales — un changement de tendance majeur.",
    tag: "Bien-être",
  },

  // Culture & éducation
  {
    title: "Lecture en hausse chez les jeunes",
    body: "Selon le CNL, 81 % des 7-19 ans déclarent lire pour le plaisir — un chiffre en progression continue depuis cinq ans.",
    tag: "Culture",
  },
  {
    title: "Les bibliothèques jamais autant fréquentées",
    body: "Plus de 17 millions de Français inscrits — les bibliothèques deviennent les premiers lieux culturels du pays.",
    tag: "Culture",
  },
  {
    title: "Renaissance des cinémas indépendants",
    body: "200 salles ont rouvert ou été modernisées en France ces deux dernières années — un retour en force du grand écran.",
    tag: "Culture",
  },

  // Solidarité
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
    title: "L'accès à l'eau potable progresse",
    body: "L'OMS estime que deux milliards de personnes ont gagné l'accès à l'eau potable en vingt ans — un des plus grands progrès humains du siècle.",
    tag: "Monde",
  },

  // Local — Jura, Dole, Bourgogne-Franche-Comté
  {
    title: "Le Jura, terre de champions",
    body: "La région compte un nombre record de domaines viticoles primés cette saison — Savagnin et vin jaune brillent à l'international.",
    tag: "Local",
  },
  {
    title: "Dole, ville la plus végétale du Jura",
    body: "Avec ses parcs et le Doubs au cœur de la cité, Dole vient d'être saluée pour son couvert végétal exceptionnel.",
    tag: "Dole",
  },
  {
    title: "Le Comté AOP célèbre ses 70 ans",
    body: "Le fromage le plus vendu de France fête sept décennies d'AOP — une réussite collective du massif jurassien.",
    tag: "Terroir",
  },
  {
    title: "Le canal du Rhône au Rhin retrouve son trafic",
    body: "Les croisières fluviales reviennent à Dole — Strasbourg-Lyon en bateau redevient un vrai voyage.",
    tag: "Tourisme",
  },
  {
    title: "Les vignerons jurassiens recrutent",
    body: "Le vignoble du Jura ouvre 200 postes pour la prochaine saison — une dynamique rare en France viticole.",
    tag: "Emploi",
  },

  // Science & technologie
  {
    title: "JWST découvre une exoplanète habitable",
    body: "À 40 années-lumière de la Terre, K2-18b présente des signatures chimiques compatibles avec la vie microbienne.",
    tag: "Espace",
  },
  {
    title: "L'IA aide à décrypter les langues anciennes",
    body: "Un modèle vient de traduire des textes étrusques inédits — un pan entier de l'Histoire devient accessible.",
    tag: "Sciences",
  },
  {
    title: "La fusion nucléaire passe un cap",
    body: "Une expérience américaine a produit plus d'énergie qu'elle n'en a consommé pour la deuxième fois — promesse d'énergie propre.",
    tag: "Énergie",
  },

  // Gastronomie & art de vivre
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
