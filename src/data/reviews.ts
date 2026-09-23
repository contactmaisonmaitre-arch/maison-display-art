export const REVIEW_URL = "https://maps.app.goo.gl/SBPvWavn536mCHmt9";

export interface Review {
  name: string;
  text: string;
  date?: string | null;
}

export interface ReviewsData {
  url?: string;
  rating: number;
  count: number;
  reviews: Review[];
  fetchedAt?: string;
}

// Secours si public/data/reviews.json est injoignable. Uniquement de VRAIS
// avis Google (relevés le 23/09/2026) — jamais d'avis inventés à l'écran.
export const FALLBACK_REVIEWS: ReviewsData = {
  url: REVIEW_URL,
  rating: 4.8,
  count: 341,
  reviews: [
    {
      name: "Aurelien P.",
      text: "Une expérience incroyable, avec un accueil chaleureux. Avec une magnifique décoration, des gammes de thé et infusion très riches. Je conseille fortement la boisson Ube latte.",
    },
    {
      name: "Fabienne P.",
      text: "Une adresse qui vaut le détour. Un lieu où l'on se sent bien. Accueil très chaleureux.",
    },
    {
      name: "Laureline T.",
      text: "Toujours très bien accueilli et de bon conseil. Plein de bonnes choses à déguster et à découvrir.",
    },
  ],
};
