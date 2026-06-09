// Helper partagé : nombre de jours écoulés depuis une époque stable.
// Utilisé pour piocher déterministiquement dans un pool (faits Dole, régions
// vin, produits…) de façon à ce que le contenu varie jour par jour sans
// dépendre d'aucune API externe.

const EPOCH = new Date(2024, 0, 1).getTime();

export const dayOffset = (d: Date = new Date()) => {
  const today = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.floor((today - EPOCH) / 86_400_000);
};

/** Retourne l'élément du tableau "du jour" : décalé de dayOffset modulo length. */
export const todaysPick = <T,>(arr: readonly T[], date?: Date): T =>
  arr[dayOffset(date) % arr.length];

/** Retourne le tableau réordonné en partant de l'index "du jour". */
export const todaysRotation = <T,>(arr: readonly T[], date?: Date): T[] => {
  const off = dayOffset(date) % arr.length;
  return [...arr.slice(off), ...arr.slice(0, off)];
};
