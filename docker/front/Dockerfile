# syntax=docker/dockerfile:1.7
# Image de PRODUCTION du front — build context = racine du repo (docker/front/Dockerfile).
#
#   build   : npm ci + ng build (scripts/gen-env.mjs injecte SITE_URL / IMAGE_SERVER_URL
#             au prebuild ; sans build-arg, ses défauts = valeurs de production)
#   runtime : Node 24 minimal, utilisateur non-root, bundle SSR AUTONOME (aucun
#             node_modules : esbuild a inliné express/compression/@angular/ssr)
#             + images/ (racine du repo) servies par Express sous /img.
#
# UNE image pour staging ET prod (build-once, promue par retag) : les valeurs compilées
# sont celles de production ; staging sert le même bundle sous son propre domaine via
# les variables RUNTIME NG_ALLOWED_HOSTS + ROBOTS_NOINDEX (cf. .env.staging.example).

ARG NODE_VERSION=24

# ── build ───────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /src/front-portfolio

# Couche dépendances (cache) : manifestes + ce que lit gen-env.mjs au postinstall.
COPY front-portfolio/package.json front-portfolio/package-lock.json ./
COPY front-portfolio/scripts/gen-env.mjs ./scripts/gen-env.mjs
COPY front-portfolio/src/app/seo/site-routes.json ./src/app/seo/site-routes.json
RUN mkdir -p src/environments public \
 && npm ci --no-audit --no-fund

COPY front-portfolio/ ./

# Config build-time (non définis → défauts prod de gen-env.mjs) et traçabilité.
# Un ARG sans valeur n'est PAS exporté dans l'environnement du RUN : gen-env.mjs
# ne voit alors rien et retombe sur ses défauts (une chaîne vide les écraserait).
ARG SITE_URL
ARG IMAGE_SERVER_URL
ARG GIT_SHA=unknown
ARG GIT_REF=unknown
ARG BUILD_ID=local
RUN npm run build \
 && printf '{\n  "runId": "%s",\n  "sha": "%s",\n  "ref": "%s",\n  "builtAt": "%s"\n}\n' \
      "$BUILD_ID" "$GIT_SHA" "$GIT_REF" "$(date -u +%FT%TZ)" \
      > dist/front-portfolio/browser/build-info.json

# ── runtime ─────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4000 \
    IMAGES_DIR=/app/images
WORKDIR /app

COPY --from=build --chown=node:node /src/front-portfolio/dist/front-portfolio ./dist/front-portfolio
COPY --chown=node:node images ./images

USER node
EXPOSE 4000

# Même sonde que le déploiement (deploy-ssr historique) : /health, jamais mis en cache.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/health >/dev/null || exit 1

CMD ["node", "dist/front-portfolio/server/server.mjs"]
