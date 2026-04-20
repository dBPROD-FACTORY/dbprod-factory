# dB PROD·FACTORY — Site web

Site Astro + React + Framer Motion pour dB PROD·FACTORY (studio de doublage, voice-over et post-production à Casablanca).

- **Framework** : [Astro](https://astro.build) (statique)
- **UI** : React 18 + [Framer Motion](https://www.framer.com/motion/) pour les animations
- **Contenu** : Astro Content Collections (Markdown + JSON) éditables via [PagesCMS](https://pagescms.org)
- **Hébergement** : GitHub + Cloudflare Pages

## Démarrage

```bash
npm install
npm run dev       # serveur local http://localhost:4321
npm run build     # build statique → ./dist
npm run preview   # preview locale du build
```

### (Re-)seed du contenu

```bash
node scripts/seed.mjs   # régénère src/content/* depuis les données initiales
```

## Structure

```
src/
├── components/        # React (Nav, Footer, Icon, Waveform, AudioPlayer, ProjectCard…)
├── content/           # Collections éditables (services, projects, posts, studios, faq)
├── data/              # JSON globaux éditables (site.json, home.json)
├── layouts/Base.astro # Layout principal (nav + footer + theme toggle)
├── pages/             # Routes Astro
└── styles/global.css  # Design tokens (OKLCH), dark/light, typo, animations
public/
├── _headers           # Headers HTTP Cloudflare
├── _redirects         # Redirections Cloudflare
└── favicon.svg
.pages.yml             # Configuration PagesCMS
.github/workflows/deploy.yml
```

## Design system

- Fonts : **Fraunces** (display serif), **Geist** (grotesk), **JetBrains Mono**
- Accent par défaut : **Lime** (OKLCH), modifiable dans `src/styles/global.css` (`--accent-h`, `--accent`)
- Dark/Light togglable via le bouton en haut à droite (stocké dans `localStorage`)

## Édition via PagesCMS

1. Crée un compte sur [pagescms.org](https://pagescms.org) et connecte ton repo GitHub.
2. Le fichier `.pages.yml` à la racine configure automatiquement l'interface d'édition.
3. Chaque modification dans l'UI pousse un commit sur `main` → déploiement auto via GitHub Actions.

### Collections éditables

| Nom | Chemin | Description |
| --- | --- | --- |
| **Réglages du site** | `src/data/site.json` | Marque, contact, social, clients, stats, témoignages |
| **Page d'accueil** | `src/data/home.json` | Hero, échantillons audio |
| **Services** | `src/content/services/*.md` | 12 disciplines |
| **Portfolio** | `src/content/projects/*.md` | Films, séries, corporate |
| **Journal** | `src/content/posts/*.md` | Articles de blog |
| **Studios** | `src/content/studios/*.md` | 4 studios avec fiches techniques |
| **FAQ** | `src/content/faq/*.md` | Catégories + questions/réponses |

## Déploiement — Cloudflare Pages + GitHub

### Option A — Connexion directe via le dashboard Cloudflare (recommandé)

1. Pousse le projet sur GitHub :
   ```bash
   git init
   git add .
   git commit -m "Initial commit — dB PROD·FACTORY"
   git branch -M main
   git remote add origin git@github.com:<toi>/dbprod-factory.git
   git push -u origin main
   ```
2. Dans le dashboard [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages) → **Create a project** → **Connect to Git** → choisis ton repo.
3. Paramètres de build :
   - **Framework preset** : Astro
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Root directory** : `/`
   - **Node version** : `20` (variable d'env `NODE_VERSION=20`)
4. Deploy. À chaque `git push` sur `main`, Cloudflare redéploie.

### Option B — GitHub Actions (workflow inclus)

`.github/workflows/deploy.yml` est déjà fourni. Ajoute ces secrets dans GitHub (Settings → Secrets and variables → Actions) :
- `CLOUDFLARE_API_TOKEN` — token avec permission "Cloudflare Pages: Edit"
- `CLOUDFLARE_ACCOUNT_ID` — ton account ID Cloudflare

Puis chaque push sur `main` déploie automatiquement le projet `dbprod-factory` sur Cloudflare Pages.

## Connecter PagesCMS au repo GitHub

1. Va sur [pagescms.org](https://pagescms.org) → **Sign in with GitHub**
2. Autorise PagesCMS à accéder à ton repo.
3. Ouvre ton projet — l'éditeur détecte `.pages.yml` et génère l'interface.
4. Les éditeurs (non-devs) accèdent à `https://app.pagescms.org/<user>/<repo>`.

## Personnalisation rapide

- **Couleur d'accent** : change `--accent-h` et `--accent` dans `src/styles/global.css`.
- **Typo** : remplacer Fraunces/Geist par d'autres familles Google Fonts dans `src/layouts/Base.astro`.
- **Nouvelle page** : crée `src/pages/<nom>.astro` et importe `Base`.
- **Nouveau type de contenu** : ajoute une `defineCollection` dans `src/content/config.ts` + une entrée dans `.pages.yml`.

## Licence

Code propriétaire — dB PROD·FACTORY 2026.
