# Dev dockerisé

## Démarrer

```bash
cp .env.example .env        # optionnel — les défauts suffisent
docker compose up
```

- Front (dev-server Angular, hot-reload) : `http://localhost:4200` (`DEV_PORT`)
- Serveur d'images local (nginx sur `./images`) : `http://localhost:8081` (`IMAGE_SERVER_PORT`)

Sans `.env`, le front dev pointe automatiquement sur le serveur d'images
**local** (`IMAGE_SERVER_URL=http://localhost:8081`) : plus aucune dépendance
au vhost distant pour développer.

## Notes

- **Dev uniquement** — la production reste le build CI déployé sur le VPS
  (cf. [deploiement.md](deploiement.md)).
- `node_modules` vit dans un volume nommé (binaires Linux ≠ Windows). Après un
  changement de dépendances : `docker compose build front` puis
  `docker compose up --force-recreate front` (ou
  `docker compose run --rm front npm ci`).
- Le watch utilise `--poll` (les événements filesystem ne traversent pas les
  bind-mounts Windows) — latence de rebuild ~2 s.
- La config build-time (SITE_URL, IMAGE_SERVER_URL) est régénérée à chaque
  `npm start` par `scripts/gen-env.mjs` (hook `prestart`) depuis
  l'environnement du conteneur (`compose.yaml`) ou le `.env` racine.
- Outillage dans le conteneur : `docker compose exec front npm test`,
  `docker compose exec front npm run audit:i18n`, etc.
