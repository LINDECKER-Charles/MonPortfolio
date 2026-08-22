# Dev dockerisé

## Démarrer

```bash
cp .env.example .env        # optionnel — les défauts suffisent
docker compose up
```

- Front (dev-server Angular, hot-reload) : `http://localhost:4200` (`DEV_PORT`)
- Images : servies par le même serveur sous `/img` (dossier racine `images/` monté en
  lecture seule dans le conteneur) — aucun serveur d'images annexe.

## Fichiers compose

| Fichier | Rôle | Appliqué |
|---|---|---|
| `compose.yaml` | Base de **production** : service `front` (image GHCR, `/img` embarqué, healthcheck) | partout |
| `compose.override.yaml` | Commodités de **dev** : dev-server Angular bind-mounté, `images/` monté, port publié | auto-mergé en local uniquement |
| `compose.deploy.yaml` | Overlay des hôtes servis : labels Caddy + réseau `edge` | `COMPOSE_FILE=compose.yaml:compose.deploy.yaml` (pipeline + `.env` de l'hôte) |

## Image de production en local

```bash
docker compose -f compose.yaml build            # image docker/front/Dockerfile
docker run --rm -p 4000:4000 monportfolio/front:latest
curl -s localhost:4000/health
```

`compose.yaml` ne publie aucun port (l'entrée publique est l'edge Caddy) — d'où le
`docker run -p` pour tester l'image seule : `/img`, `build-info.json` et les headers de
sécurité sont servis (HSTS / `upgrade-insecure-requests` uniquement derrière un proxy TLS).

## Notes

- Le dev-server Angular exécute le `reqHandler` de `src/server.ts` : `/img`, `/health` et les
  headers de sécurité se comportent comme en prod, y compris hors docker (`npm start`).
- `node_modules` du dev-server vit dans un volume nommé (binaires Linux ≠ Windows).
  Après un changement de dépendances : `docker compose build front` puis
  `docker compose up --force-recreate front` (ou `docker compose run --rm front npm ci`).
- Le watch utilise `--poll` (les événements filesystem ne traversent pas les
  bind-mounts Windows) — latence de rebuild ~2 s.
- La config build-time (`SITE_URL`, `IMAGE_SERVER_URL`) est régénérée à chaque
  `npm start` par `scripts/gen-env.mjs` (hook `prestart`) depuis l'environnement ou le
  `.env` racine. En production elle n'est **pas** surchargée : l'image embarque les
  défauts (prod), cf. [deploiement.md](deploiement.md).
- Outillage dans le conteneur : `docker compose exec front npm test`,
  `docker compose exec front npm run audit:i18n`, etc.
