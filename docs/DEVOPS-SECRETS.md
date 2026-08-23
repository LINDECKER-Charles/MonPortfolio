# 🔐 GitHub Actions — Secrets (monportfolio)

Secrets à configurer pour le pipeline `CI/CD` (`.github/workflows/ci.yml`).

**Où** : `Settings` → `Secrets and variables` → `Actions` → onglet `Repository secrets`.
**Comment (rapide)** : `scripts/setup-secrets.sh` les pose tous via `gh` (voir en bas).
**Valeurs réelles** : `docs/DEVOPS-SECRETS.local.md` (gitignoré — repo public).

## 🔁 Flux (promotion à deux étages, *build once*)

```
push dev  ─▶ _tests ─▶ merge-to-test (dev→test)
          ─▶ _build (GHCR: front:<sha> + :staging) ─▶ _deploy staging  (test.charles-lindecker.com)

merge test→main (manuel)  ─▶ push main
          ─▶ _promote : retag :staging→:prod (sans rebuild) ─▶ _deploy prod (charles-lindecker.com, www)
```

### 🧩 Structure des workflows (reusable, responsabilité unique)

| Fichier | Rôle |
|---|---|
| `ci.yml` | Orchestrateur : déclencheurs `dev`/`main` (+ `pull_request` vers `dev` → tests seuls), gardes `if`, câblage. Aucun secret en dur. |
| `_tests.yml` | Qualité : audit deps prod, lint, format, tests unitaires + coverage, build, e2e + a11y Playwright. **Aucun secret.** |
| `_build.yml` | Build + push de l'image `front` (`:<sha>` + tag mouvant). |
| `_deploy.yml` | Déploiement SSH d'**un** hôte, **paramétré** → appelé pour staging **et** prod (DRY). Vérifie santé, TLS, prérendu SSG. |
| `_promote.yml` | Retag `:staging → :prod` (aucun rebuild). |

- `test` est mis à jour automatiquement depuis `dev` et **ne déclenche jamais** le workflow (pas de boucle).
- `main` n'est atteint que par un **merge manuel `test → main`** : c'est le *gate* humain qui met en production.
- La prod **ne rebuild pas** : elle retague et déploie **exactement l'image validée en staging**.
  Corollaire : toujours passer par `test → main` — un push direct sur `main` déploierait
  l'image staging courante, pas le code poussé.
- Une seule image pour les deux environnements : les valeurs compilées (`SITE_URL`, `/img`)
  sont celles de prod ; staging diffère par son `.env` (`NG_ALLOWED_HOSTS`, `ROBOTS_NOINDEX`).

---

## 🟡 Déploiement staging (job `deploy-staging`)

Son `.env` doit fixer `COMPOSE_PROJECT_NAME=monportfolio-staging`, `IMAGE_TAG=staging`,
`CADDY_DOMAINS=test.charles-lindecker.com`, `NG_ALLOWED_HOSTS=test.charles-lindecker.com`
et `ROBOTS_NOINDEX=1`. Le VPS est mutualisé avec la prod (et d'autres projets) :
l'isolation vient du `COMPOSE_PROJECT_NAME` distinct, le TLS d'un **edge proxy partagé**
(fourni par le dépôt d'infrastructure `infra-vps`, privé).

| Secret | Requis | Description |
|---|:---:|---|
| `STAGING_SSH_KEY` | ✅ | Clé privée SSH (PEM complet) chargée dans `ssh-agent`. Clé publique dans les `authorized_keys` du serveur. |
| `STAGING_HOST` | ✅ | Hôte staging (IP ou FQDN). `ssh-keyscan` + connexions SSH. |
| `STAGING_PATH` | ✅ | Chemin absolu du projet sur le serveur (dossier des `compose.*.yaml`), ex. `/opt/monportfolio-staging`. |
| `STAGING_SSH_USER` | ➖ | Utilisateur SSH. **Optionnel**, défaut `root`. Doit pouvoir lancer `docker` et écrire `${STAGING_PATH}`. |
| `ENV_STAGING` | ✅ | Dotenv staging **complet** (source : `.env.staging`, modèle `.env.staging.example`) poussé dans `${STAGING_PATH}/.env`. Le contact Let's Encrypt de l'edge n'y est **pas** (il vit dans `infra-vps`). |

---

## 🚀 Déploiement production (jobs `promote` + `deploy-prod`)

Son `.env` doit fixer `COMPOSE_PROJECT_NAME=monportfolio-prod`, `IMAGE_TAG=prod`,
`CADDY_DOMAINS=charles-lindecker.com, www.charles-lindecker.com` et
`NG_ALLOWED_HOSTS=charles-lindecker.com,www.charles-lindecker.com`.
Cohabite avec staging sur le même VPS (projets Compose distincts + edge partagé).

| Secret | Requis | Description |
|---|:---:|---|
| `PROD_SSH_KEY` | ✅ | Clé privée SSH (PEM complet). Peut être la même clé que staging (même VPS). |
| `PROD_HOST` | ✅ | Hôte prod (IP ou FQDN). |
| `PROD_PATH` | ✅ | Chemin absolu du projet sur le serveur, ex. `/opt/monportfolio-prod`. |
| `PROD_SSH_USER` | ➖ | Utilisateur SSH. **Optionnel**, défaut `root`. |
| `ENV_PROD` | ✅ | Dotenv prod **complet** (source : `.env.prod`, modèle `.env.prod.example`) poussé dans `${PROD_PATH}/.env`. |

---

## 🔒 TLS / reverse-proxy — edge partagé (caddy-docker-proxy, porté par `infra-vps`)

Le stack app **ne publie aucun port** et n'embarque pas de proxy. Le point d'entrée TLS
est un **edge proxy unique et global** au VPS, partagé par staging, prod et tout futur
projet. Il détecte les domaines via les **labels** du conteneur `front` et émet/renouvelle
seul les certificats Let's Encrypt. **L'edge et les réseaux Docker `edge` / `observability`
sont déployés par le dépôt d'infrastructure `infra-vps` (privé), avant tout projet
applicatif** : ce repo n'en converge rien, et `_deploy.yml` échoue explicitement si le
réseau `edge` est absent. Le secret GitHub du contact Let's Encrypt n'est **plus requis
ici** : il vit dans `infra-vps`.

| Secret | Requis | Description |
|---|:---:|---|
| `REPO_URL` | ➖ | URL de clone HTTPS, utilisée pour initialiser le dépôt sur un hôte neuf. Optionnel : le défaut intégré (`https://github.com/LINDECKER-Charles/MonPortfolio.git`) convient. |

| Variable | Où | Staging | Prod |
|---|---|---|---|
| `CADDY_DOMAINS` | `ENV_STAGING`/`ENV_PROD` | `test.charles-lindecker.com` | `charles-lindecker.com, www.charles-lindecker.com` |

> ⚠️ **Ordre au premier déploiement** : les enregistrements DNS (A/AAAA) de chaque domaine
> doivent pointer vers le VPS **avant** que le déploiement tourne, et les ports **80 + 443**
> doivent être joignables — l'émission ACME échoue sinon. Caddy réessaie une fois le DNS
> propagé, et `_deploy.yml` force une relance de l'edge si un domaine reste sans cert.

### 🖥️ Prérequis serveur (one-shot)

1. Docker Engine + plugin `docker compose` installés ; `git` et `curl` présents.
2. **`infra-vps` déployé d'abord** (edge + réseaux `edge` / `observability`) : sans le
   réseau `edge`, le job de déploiement s'arrête avant de toucher à l'application.
3. Ports **80/443** ouverts et DNS des domaines pointé (cf. ci-dessus).
4. Packages GHCR **publics** (repo public : `ghcr.io/lindecker-charles/monportfolio/front`),
   sinon `docker login ghcr.io` persistant avec un PAT `read:packages` — sans ça
   `docker compose pull` échoue.
5. Le `*_PATH` peut être vide : le job initialise le dépôt (`git init` + `reset`), pousse le
   `.env`, vérifie le réseau `edge`, puis déploie. staging suit `test`, prod suit `main`.

---

## ⚙️ Secrets automatiques (aucune action requise)

| Secret | Description |
|---|---|
| `GITHUB_TOKEN` | Fourni automatiquement par GitHub Actions (merge `dev → test`, push + retag GHCR). **Ne pas créer manuellement.** |

## 🗑️ Secrets legacy (ancien pipeline Apache / systemd) — supprimés le 2026-08-22

`VPS_IP`, `VPS_USER`, `SSH_PRIVATE_KEY`, `APACHE_PROD_DOMAIN`, `APACHE_PROD_SSR_PORT`,
`APACHE_TEST_DOMAIN`, `APACHE_TEST_SSR_PORT`, `APACHE_TEST_REDIRECT_TARGET`,
`APACHE_IMAGES_DOMAIN`, `APACHE_IMAGES_DOCROOT`. Plus aucun workflow ne les lit ; valeurs
historiques conservées localement (`config/README.md`, `~/.ssh/gh-actions-deploy`).

Depuis le 2026-08-23, le secret du contact Let's Encrypt de l'edge n'est plus lu non plus
(edge porté par `infra-vps`) : à supprimer une fois que **toutes** les branches déployées
(`main` inclus) portent le `ci.yml` migré.

---

## ⚡ Mise en place rapide (`gh`)

```sh
# Depuis la racine du repo, après avoir rempli .env.staging / .env.prod
# et scripts/secrets.local.env (hôte, chemins, clé) :
gh auth login                 # une fois
bash scripts/setup-secrets.sh # pose tous les secrets (idempotent)
```

## 📝 Notes

- **Mapping fichier → secret** : le dotenv local de chaque environnement devient le secret correspondant.
  - `.env.staging` → **`ENV_STAGING`** (déploiement staging)
  - `.env.prod` → **`ENV_PROD`** (déploiement prod)
- **`ENV_*`** contiennent le fichier dotenv **intégral** (une variable par ligne), pas une valeur unique — dont
  `COMPOSE_FILE=compose.yaml:compose.deploy.yaml`, qui protège les commandes manuelles sur l'hôte.
- **`CADDY_DOMAINS`** est une **ligne** de ces dotenv, jamais dans les workflows. Le contact Let's Encrypt de l'edge n'est pas un secret de ce repo (`infra-vps`).
- **Staging et prod ne diffèrent que par leur `.env`** : mêmes fichiers compose, même image.
- **`*_SSH_KEY`** : copier l'intégralité du fichier clé, en-têtes `-----BEGIN … PRIVATE KEY-----` inclus.
- Les secrets ne sont **jamais** affichés dans les logs (masqués par GitHub) ; leur mise à jour ne s'applique qu'aux exécutions suivantes.
