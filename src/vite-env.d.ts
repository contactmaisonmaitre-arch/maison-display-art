/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL du projet Supabase (envoi auto du rapport de caisse). Optionnel. */
  readonly VITE_SUPABASE_URL?: string;
  /** Clé anon Supabase (appel de l'Edge Function). Optionnel. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Alias Lovable de la clé anon. Optionnel. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
