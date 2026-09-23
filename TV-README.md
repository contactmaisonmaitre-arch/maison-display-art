# Écran TV Maison Maitre

Affichage en boutique (1920×1080), React + Vite, hébergé par Lovable
(`maison-display-art.lovable.app`). Le module caisse (`/caisse`) vit dans le même repo.

## Comment la TV se met à jour

| Contenu | Source | Fréquence |
|---|---|---|
| Programme TV du soir | `scripts/fetch-tv-tonight.mjs` | chaque jour (`daily-tv.yml`) |
| Événements à Dole | `scripts/fetch-dole-events.mjs` | chaque lundi |
| Produits + prix | catalogue public maisonmaitre.com | chaque jour (`daily-shop.yml`) |
| Note + avis Google | API Google Places (clé requise) | chaque jour |
| Photos Instagram | API Instagram (jeton requis) | chaque jour |
| Météo | open-meteo.com | toutes les 10 min, en direct |

**Important :** la TV lit ses données (`public/data/*.json`) **directement sur
GitHub** (`raw.githubusercontent.com`), pas dans le site publié par Lovable.
Avant, Lovable ne republiant pas tout seul, la TV restait figée (programme TV
du 10 juin affiché jusqu'en septembre). Maintenant, tout commit sur `main`
est visible sur la TV en moins de 30 min, **sans republier Lovable**.

Il faut republier sur Lovable uniquement quand le **code** change (nouvelle
scène, nouveau design). La TV se recharge seule chaque nuit à 4h30.

## Modifier le contenu sans coder

Sur github.com → dossier `public/data/` → ouvrir le fichier → crayon ✏️ →
« Commit changes ». Chaque fichier a une ligne `_aide` qui explique ses champs.

- `carte.json` — la carte des boissons + les éphémères (avec dates).
- `playlist.json` — ordre, durée et dates de passage des scènes.
- `annonces.json` — annonces datées (événements, fermetures, nouveautés).
- `coups-de-coeur.json` — thé et café mis en avant, produits exclus, notes.

Aperçu d'une scène : ajouter `?scene=carte&pause` à l'adresse de la TV.

## Brancher les avis Google (5 min, gratuit dans les quotas)

1. console.cloud.google.com → créer un projet → activer **Places API (New)**.
2. Identifiants → Créer une clé API (la restreindre à Places API).
3. GitHub → repo → Settings → Secrets and variables → Actions →
   New repository secret : `GOOGLE_PLACES_API_KEY`.
4. Actions → « Refresh boutique » → Run workflow.

Sans clé : la TV affiche la vraie note relevée à la main (4,8 · 341 avis au
23/09/2026) et trois vrais avis. Aucun avis inventé.

## Brancher Instagram

Compte Instagram professionnel requis. Créer une app sur developers.facebook.com
(produit « Instagram API with Instagram Login »), générer un jeton longue durée,
puis secret GitHub `IG_ACCESS_TOKEN`. Le jeton dure 60 jours : pour qu'il se
prolonge tout seul, ajouter aussi un secret `GH_PAT` (jeton GitHub avec droit
« Secrets: write » sur ce repo). Une publication avec `#notv` dans la légende
n'apparaît pas sur la TV. Sans jeton : les 25 photos choisies à la main.

## Dev

```bash
npm install
npm run dev      # données locales de public/data
npm test
```
