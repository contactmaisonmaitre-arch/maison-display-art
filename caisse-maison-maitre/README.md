# Caisse Maison Maitre

Comptage quotidien de la caisse (Billets / Pièces / Chèques / lignes A → H),
identique à la fiche papier. Deux manières de l'utiliser :

## 1. L'appli web (recommandé)

Page **`/caisse`** de ce projet Lovable. On la garde ouverte en onglet Chrome ;
on saisit les quantités, l'appli calcule **C, D, E, F, G, H** en direct, vérifie
l'écart **H ≈ 0**, et envoie le rapport par email au clic sur **« Valider & envoyer »**.

Enchaînement automatique d'un jour à l'autre : le **D** validé aujourd'hui pré-remplit
le report **E** de demain, et le **E'** déposé aujourd'hui devient le dépôt de la veille
à déduire (Règles 4 et 5).

### Code (dans `src/`)

| Fichier | Rôle |
|---|---|
| `src/pages/Caisse.tsx` | Écran de saisie + récapitulatif |
| `src/lib/caisse/compute.ts` | Calcul C/D/E/F/G/H (arithmétique en centimes) |
| `src/lib/caisse/report.ts` | Rapport texte + HTML (email) |
| `src/lib/caisse/sendReport.ts` | Envoi (backend Supabase ou fallback mail) |
| `src/lib/caisse/storage.ts` | Brouillon + enchaînement jour+1 |
| `src/lib/caisse/compute.test.ts` | Tests (cas de référence 01-07-2026) |
| `supabase/functions/send-caisse-report/` | Edge Function d'envoi via Resend |

### Envoi automatique par email — mise en route (Supabase + Resend)

Tant que ce n'est pas branché, le bouton ouvre simplement votre client mail
pré-rempli (aucune config requise pour démarrer). Pour l'**envoi automatique** :

1. Dans Lovable, brancher **Supabase** au projet.
2. Ajouter les variables d'environnement front (Lovable / `.env`, cf. `.env.example`) :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` *(ou son alias Lovable `VITE_SUPABASE_PUBLISHABLE_KEY`)*
3. Créer une clé API **Resend** (https://resend.com) et, côté Supabase
   (Edge Functions → Secrets), définir :
   - `RESEND_API_KEY`
   - `CAISSE_FROM` — expéditeur vérifié chez Resend
     (ex. `Maison Maitre <caisse@ton-domaine.fr>` ; sinon `onboarding@resend.dev` pour tester)
   - `CAISSE_TO` *(optionnel)* — destinataire par défaut
     (par défaut `contactmaximemaitre@gmail.com`)
4. Déployer l'Edge Function `send-caisse-report` (Lovable/Supabase s'en charge
   depuis `supabase/functions/`).

Une fois `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` présents, l'appli bascule
d'elle-même sur l'envoi automatique.

## 2. Le script Python (hors-ligne / secours)

`generer_caisse.py` génère un **fichier Excel** identique à la fiche papier, avec
formules vivantes. Utile sans navigateur.

```bash
pip3 install openpyxl
python3 generer_caisse.py caisse_input.json
```

Voir `caisse_input.json` pour le schéma, `exemple_Caisse_01-07-2026.xlsx` pour un rendu.

## Règles métier

Les 7 règles (chèque hors caisse, G = espèces net du ticket, E = report réel
dépôt de la veille déduit, contrôle H ≈ 0, « Maitre » sans accent, etc.) sont
détaillées dans **`CLAUDE.md`** — la logique de l'appli web les applique à l'identique.
