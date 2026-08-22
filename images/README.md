# images/ — images statiques du site

Ce dossier est la **source de vérité** des images servies sous `/img` (préfixe
`IMAGE_SERVER_URL` du `.env` racine, relatif en production). Elles sont
**embarquées dans l'image Docker** du front (`docker/front/Dockerfile`,
`COPY images ./images`) et servies par le serveur SSR Express
(`front-portfolio/src/server.ts`, `IMAGES_DIR`) avec la politique de cache par
défaut (1 jour + stale-while-revalidate).

## Versionnées avec le code

Chaque environnement sert **ses** images : staging celles de la branche `test`,
prod celles de l'image promue. Un renommage ou une suppression ici n'impacte la
prod qu'à la promotion `test → main` — fin du docroot partagé de l'ancien vhost
`images.<domaine>` (rsync).

## Contenu attendu

Seuls les types d'assets référencés via `imageServerUrl(...)`
(`front-portfolio/src/app/img-sources/`) vivent ici :

| Dossier | Consommateur |
|---|---|
| `project/` | `projects/*.source.ts` (via `buildProjectImage`) |
| `icon/` | `shared.sources.ts`, `resum.sources.ts` |
| `photos/` | `createPhotoSet` (`shared.sources.ts`) |

Tout le reste (lang, logo, song, opening, favicon…) est servi par le build
Angular depuis `front-portfolio/public/` — ne pas le dupliquer ici.

## Contrat de nommage

Les dimensions font partie du nom de fichier : `<w>x<h>_<name>.webp`.
Les tailles attendues par le front sont déclarées dans les `*.source(s).ts` —
un fichier manquant = 404 `text/plain` (garde d'extension du serveur).

## Dev local

Le dev-server Angular (`npm start` ou `docker compose up`) passe par le même serveur
Express que la prod : `/img` est servi depuis ce dossier (`IMAGES_DIR`, sinon `../images`
du repo) — aucun serveur d'images annexe, même préfixe `/img` partout.
