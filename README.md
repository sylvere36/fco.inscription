# Fond Cœur d'Or (FCO) — Formulaire d'inscription

Application web publique permettant aux encadreurs du **MADEB Archidiocèse de
Cotonou** de s'inscrire au **Fond Cœur d'Or** en tant qu'**encadreur avec
travaux** ou **ambassadeur**.

Formulaire multi-étapes → validation → stockage Supabase → page de succès.
Une page admin protégée permet de consulter, filtrer, valider/rejeter et
exporter les inscriptions.

## Stack

| Couche | Techno |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS (mobile-first) |
| Formulaire | React Hook Form + Zod |
| Base de données | Supabase (PostgreSQL) |
| Stockage photo | Supabase Storage (bucket `fco-photos`) |
| Déploiement | Vercel (Hobby) |

## Démarrage local

```bash
npm install
cp .env.example .env.local   # puis renseigner les vraies valeurs
npm run dev                  # http://localhost:3000
```

Vérifications :

```bash
npm run typecheck   # types TypeScript
npm run lint        # ESLint
npm run build       # build de production
```

## Variables d'environnement

Voir [`.env.example`](.env.example). À définir en local (`.env.local`) **et**
sur Vercel (Settings → Environment Variables) :

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme publique |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service_role — **secrète**, serveur uniquement |
| `ADMIN_PASSWORD` | Mot de passe de la page `/admin` |

## Configuration Supabase

1. Créer un projet Supabase (plan gratuit).
2. **SQL Editor** → exécuter le contenu de [`supabase/schema.sql`](supabase/schema.sql).
   Cela crée la table `inscriptions`, les index, les politiques RLS **et** le
   bucket public `fco-photos`.
3. Vérifier dans **Storage** que le bucket `fco-photos` existe et est public
   (le SQL le crée ; sinon le créer manuellement : Public = true, 5 Mo,
   MIME `image/jpeg,image/png,image/webp`).
4. Récupérer les clés dans **Settings → API**.

> La liste des 12 vicariats est codée en dur dans
> [`lib/vicariats.ts`](lib/vicariats.ts) — remplacer les noms provisoires par
> les noms exacts fournis par le Bureau Diocésain avant mise en production.

## Déploiement Vercel

1. Pousser le code sur un repo GitHub.
2. Sur Vercel : **New Project** → importer le repo.
3. Ajouter les 4 variables d'environnement.
4. Déployer. Chaque push sur `main` redéploie automatiquement.
5. Tester le formulaire en production et vérifier l'insertion dans Supabase.

## Structure

```
app/
  page.tsx                    # Formulaire principal (/)
  success/page.tsx            # Page de succès (/success)
  admin/page.tsx              # Dashboard admin (/admin)
  api/
    inscription/route.ts      # POST public — upload photo + insertion
    admin/inscriptions/route.ts  # POST — liste (mot de passe requis)
    admin/statut/route.ts        # POST — valider/rejeter + code parrainage
components/                   # FormulaireFCO, sections, champs, Stepper…
lib/
  validations.ts             # Schémas Zod (client + serveur)
  supabase.ts                # Client service_role (serveur)
  vicariats.ts, options.ts   # Données fixes
  csv.ts, admin-auth.ts
types/inscription.ts
supabase/schema.sql          # Table + RLS + bucket
```

## Fonctionnement de la page admin

- Accès protégé par `ADMIN_PASSWORD` (saisie stockée en `sessionStorage`).
- Le mot de passe n'est jamais comparé côté client : chaque appel API le
  revalide côté serveur avant d'utiliser la clé `service_role`.
- Filtres par profil et par statut, fiche détaillée en modal, boutons
  Valider / Rejeter, export CSV (séparateur `;`, compatible Excel FR).
- À la **validation d'un ambassadeur**, un `code_parrainage` unique (`FCO-XXXXXX`)
  est généré automatiquement.

---

FCO · MADEB Archidiocèse de Cotonou · « Le sourire toujours »
