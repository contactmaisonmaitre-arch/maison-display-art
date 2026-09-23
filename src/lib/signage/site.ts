// Adresse publique du site (Lovable). Sert aux QR codes affichés sur la TV.
export const SITE_URL: string =
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://maison-display-art.lovable.app";

export const MOBILE_CARTE_URL = `${SITE_URL}/carte`;
