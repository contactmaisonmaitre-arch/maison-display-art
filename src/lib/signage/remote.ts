// Chargement des données dynamiques de la TV.
//
// Pourquoi : le site publié par Lovable n'est PAS republié quand GitHub Actions
// commit de nouvelles données (programme TV, événements, produits…). Résultat
// avant ce fichier : la TV affichait des JSON figés au jour de la dernière
// publication. On lit donc les JSON directement sur la branche `main` du repo
// GitHub (public), et on retombe sur la copie embarquée dans le build si
// GitHub ne répond pas.

export const DATA_BASE: string =
  (import.meta.env.VITE_DATA_BASE as string | undefined) ??
  "https://raw.githubusercontent.com/contactmaisonmaitre-arch/maison-display-art/main/public";

/** URL absolue d'un fichier du dossier /public servi depuis GitHub. */
export const remoteUrl = (path: string) =>
  `${DATA_BASE}/${path.replace(/^\//, "")}`;

const withBust = (url: string) => {
  // Change toutes les 5 min → contourne les caches intermédiaires sans
  // marteler GitHub.
  const bucket = Math.floor(Date.now() / 300_000);
  return `${url}${url.includes("?") ? "&" : "?"}v=${bucket}`;
};

/**
 * Récupère un JSON de /public/data. Ordre : GitHub (frais) → copie locale
 * (build) → null. Ne lève jamais : la scène doit toujours pouvoir s'afficher.
 */
export async function fetchDataJson<T>(path: string): Promise<T | null> {
  const clean = path.replace(/^\//, "");
  const candidates = import.meta.env.DEV
    ? [`/${clean}`]
    : [withBust(remoteUrl(clean)), `/${clean}`];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      return (await res.json()) as T;
    } catch {
      // on essaie la source suivante
    }
  }
  return null;
}
