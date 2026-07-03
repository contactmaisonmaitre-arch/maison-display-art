# Caisse Maison Maitre — instructions pour Claude Code

Ce dossier sert à générer la **caisse quotidienne** de Maison Maitre au format Excel,
identique à la fiche papier (Billets / Pièces / Chèques / lignes A → H).

## Comment faire une caisse (workflow quotidien)

Quand Maxime donne les quantités du jour :

1. Mets à jour le fichier `caisse_input.json` avec les valeurs du jour (voir schéma plus bas).
2. Lance :
   ```bash
   python3 generer_caisse.py caisse_input.json
   ```
   (Si erreur « No module named openpyxl » : `pip3 install openpyxl`)
3. Le fichier `Caisse_JJ-MM-AAAA.xlsx` est créé. Annonce à Maxime : **C (Total du Jour)**,
   **F (Différence)** et **H (F − G)**, puis rappelle les 2 points de vérif (voir Règle 4 et 5).

Maxime peut aussi simplement dicter les quantités en langage normal : dans ce cas, remplis
toi-même le JSON à partir de ce qu'il dit, puis lance le script.

## RÈGLES MÉTIER (ne jamais s'en écarter)

**Règle 1 — Coupures.**
Billets : 100, 50, 20, 10, 5. Pièces : 2, 1, 0,5, 0,2, 0,1, 0,05, 0,02, 0,01.
Total d'une ligne = Nombre × valeur. Le script le calcule tout seul.

**Règle 2 — Le chèque n'est JAMAIS dans la caisse physique.**
Un chèque client se note sur sa ligne « Chèques » à part, il n'entre PAS dans C (Total du Jour).
C = espèces comptées uniquement (billets + pièces).

**Règle 3 — G = ESPÈCES NET du ticket de caisse.**
Sur le ticket POS, prendre `ESPÈCES NET` = espèces encaissées − rendu monnaie (± cashback).
NE PAS prendre le « Total TTC » (il contient la carte bancaire, qui ne touche pas le tiroir).

**Règle 4 — E (Jour précédent) = report RÉEL, dépôt de la veille déduit.**
La fiche dit « E = D du jour précédent ». C'est vrai SEULEMENT si rien n'a été déposé la veille.
Si un dépôt banque a eu lieu la veille (E' de la veille ≠ 0), il faut le retirer :
`E_report = D(veille) − dépôt(veille)`.
Le script gère ça : renseigne `E_jour_precedent_D` (= D de la veille) et `depot_jour_precedent`
(= ce qui a été déposé la veille, sinon 0).
➡️ Toujours demander/confirmer à Maxime si un dépôt a bien quitté la caisse.

**Règle 5 — A et E'.**
- `A` (espèces à transmettre) = liquide mis de côté pour la banque, encore présent → reste dans D.
- `E'` (déposé à la banque) = ce qui est déposé AUJOURD'HUI (part de la caisse).
➡️ Demander/confirmer à Maxime s'il a mis de côté (A) ou déposé (E') quelque chose ce jour.

**Règle 6 — Contrôle H.**
F = D − E − E'. H = F − G. **H doit être proche de 0** (quelques centimes, comme +0,06 / −0,51 / +0,80).
Si |H| dépasse ~2 €, il y a une erreur, PAS un simple écart de caisse. Vérifier dans l'ordre :
le chèque a-t-il été mis dans C par erreur ? le dépôt de la veille est-il bien déduit de E ?
un A/E' oublié ? Corriger avant de valider.

**Règle 7 — Orthographe.** Toujours « Maitre » sans accent.

## Chaînage d'un jour à l'autre

Pour la caisse de demain :
- `E_jour_precedent_D` = **D (Total CAISSE) d'aujourd'hui**
- `depot_jour_precedent` = **E' (déposé) d'aujourd'hui**

## Schéma de caisse_input.json

```json
{
  "date": "01-07-2026",
  "fichier_sortie": "Caisse_01-07-2026.xlsx",
  "billets": { "100": 0, "50": 1, "20": 7, "10": 20, "5": 7 },
  "pieces":  { "2": 12, "1": 16, "0.5": 19, "0.2": 50, "0.1": 13, "0.05": 3, "0.02": 14, "0.01": 62 },
  "cheques": [ { "label": "chèque client", "montant": 27.25 } ],
  "A_a_transmettre": 0,
  "B_rouleaux": 0,
  "E_jour_precedent_D": 958.55,
  "depot_jour_precedent": 600,
  "E_prime_depose": 0,
  "G_ticket_especes_net": 127.50
}
```
- `cheques` : liste (vide `[]` si aucun). Les décimales de pièces s'écrivent en point (`0.5`), pas virgule.
- Le fichier de sortie s'ouvre dans Excel / Numbers / LibreOffice : les cases bleues sont saisies,
  le reste (totaux, D, F, H) se recalcule automatiquement.
