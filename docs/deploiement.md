# Déploiement — architecture et exploitation

> Valeurs réelles (domaines, ports, chemins) : GitHub Secrets + `config/README.md`
> local (non versionné — repo public). Ce document ne contient que la mécanique.

## Vue d'ensemble

```
push dev ──► ci.yml ──► deploy-ssr.yml (test) ──► deploy-apache.yml (vhosts test+images)
                   └──► merge dev→test, rsync images/ → docroot images (partagé test/prod ⚠️)
push main ─► ci.yml ──► deploy-ssr.yml (prod) ──► deploy-apache.yml (vhosts prod)
```

- **`ci.yml`** (réutilisable) : audit deps prod, lint (ESLint+Stylelint), format:check,
  tests unitaires + coverage (seuils karma), build, stamp `build-info.json`,
  e2e Playwright (serveur d'images stubbé), artefact `angular-dist`.
- **`deploy-ssr.yml`** (réutilisable) : déploiement **atomique** par releases + symlink.
- **`deploy-apache.yml`** (réutilisable) : vhosts rendus par `envsubst` depuis des
  templates **génériques** (`config/site-ssl.conf.template`,
  `site-http-redirect.conf.template`) + configtest bloquant + rollback.

## Déploiement atomique (deploy-ssr.yml)

Arborescence sur le VPS, par environnement (`$VPS_DIR`) :

```
$VPS_DIR/
├── releases/<run_id>/dist/front-portfolio/{server,browser}/
├── current -> releases/<run_id>       # symlink — bascule atomique (mv -Tf)
└── shared/
    ├── .env                           # PORT, HOST, NODE_ENV, NG_ALLOWED_HOSTS
    ├── uploads/
    └── logs-app/
```

Séquence (un seul step SSH) : upload release → recopie des assets hashés N-1
(onglets ouverts) → bascule symlink → `systemctl restart` → **health-check**
`127.0.0.1:$PORT/health` (rollback automatique si KO) → purge (3 releases).

Puis, depuis le runner : `https://$DOMAIN/build-info.json` doit contenir le
`run_id` du build (détecte un câblage croisé test/prod ou une copie manuelle)
et `/` doit servir `ng-server-context="ssg"` (détecte le fallback CSR).

## Migration VPS (one-time, par environnement)

Le premier run échouera au health-check tant que l'unit systemd pointe sur
l'ancien layout (`$VPS_DIR/dist/...`) — le site reste en ligne sur l'ancien
build. Pour migrer :

```bash
# 1. Préparer le layout
sudo mkdir -p $VPS_DIR/{releases,shared/uploads,shared/logs-app}
sudo mv $VPS_DIR/uploads/*  $VPS_DIR/shared/uploads/  2>/dev/null || true
sudo mv $VPS_DIR/logs-app/* $VPS_DIR/shared/logs-app/ 2>/dev/null || true

# 2. shared/.env (cf. .env.example racine — section [runtime])
#    PORT=<port SSR>  HOST=127.0.0.1  NODE_ENV=production
#    NG_ALLOWED_HOSTS=<domaine public>       # utile si domaine ≠ build
sudoedit $VPS_DIR/shared/.env

# 3. Unit systemd depuis le template versionné
cd <repo>/config/systemd
export SITE_LABEL=<prod|test> VPS_DIR=<...> SERVICE_USER=<user>
envsubst '$SITE_LABEL $VPS_DIR $SERVICE_USER' < angular-portfolio.service.template \
  | sudo tee /etc/systemd/system/<service>.service
sudo systemctl daemon-reload

# 4. Relancer le workflow de déploiement (Actions → re-run), puis vérifier :
curl -s https://<domaine>/build-info.json
curl -s https://<domaine>/health

# 5. Une fois `current` actif : supprimer l'ancien arbre
sudo rm -rf $VPS_DIR/dist
```

> **Avant toute migration prod** : dérouler la séquence de diagnostic du
> câblage croisé (docs/investigations/2026-08-21-freeze-prod-remise-en-prod.md §5)
> — au 2026-08-21, la prod servait l'arbre déployé par la pipeline test.

## Secrets GitHub consommés

| Secret | Rôle |
|---|---|
| `VPS_IP`, `VPS_USER`, `SSH_PRIVATE_KEY` | Accès SSH de déploiement |
| `APACHE_PROD_DOMAIN` / `APACHE_TEST_DOMAIN` | Domaines publics (vhosts + vérification post-deploy) |
| `APACHE_PROD_SSR_PORT` / `APACHE_TEST_SSR_PORT` | Ports SSR locaux (ProxyPass + health-check) |
| `APACHE_TEST_REDIRECT_TARGET` | Redirection du vhost test :80 |
| `APACHE_IMAGES_DOMAIN`, `APACHE_IMAGES_DOCROOT` | Serveur d'images (vhost + rsync + CSP) |

Sudoers requis pour `VPS_USER` (sans mot de passe) : `cp`, `apache2ctl`,
`systemctl restart <services SSR>`, `systemctl reload apache2`.

## Apache

- Templates génériques rendus par site (table dans `deploy-apache.yml`) :
  les vhosts SSL prod/test ne peuvent plus diverger. `${APACHE_LOG_DIR}` n'est
  jamais substitué (allowlist envsubst).
- Logs **séparés par site** (`<site>_error.log` / `<site>_access.log`).
- Vhost test : `X-Robots-Tag "noindex, nofollow"` (environnement non indexé).
- `ErrorDocument 502/503` → `/maintenance.html` statique (déployé par le
  workflow) : plus de page d'erreur brute pendant un restart.
- CSP : `img-src` pointe sur `${APACHE_IMAGES_DOMAIN}` (aligné sur
  `IMAGE_SERVER_URL` du `.env`).

## Configuration applicative

Voir `.env.example` (racine) : SITE_URL / IMAGE_SERVER_URL injectés au build
par `front-portfolio/scripts/gen-env.mjs` ; PORT / HOST / NODE_ENV /
NG_ALLOWED_HOSTS lus au runtime par le serveur SSR (via `shared/.env` sur le
VPS, `env_file` en dev docker).
