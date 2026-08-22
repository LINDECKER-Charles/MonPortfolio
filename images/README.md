# images/ — source du serveur d'images statique

Ce dossier est la **source de vérité** du vhost `images.<domaine>` (variable
`IMAGE_SERVER_URL` du `.env` racine). Il est synchronisé vers le docroot du VPS
par la pipeline **dev** (`ci-cd-test.yml`, job `push-images-test`) via
`rsync --delete`.

## ⚠️ Docroot partagé test/prod

Le serveur d'images est **unique** pour les deux environnements : un renommage
ou une suppression ici casse les URLs référencées par la **prod** dès le push
sur `dev` (la prod référence les noms de fichiers de `main`). Ne supprimer ou
renommer un asset qu'une fois la prod alignée.

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
un fichier manquant = 404 silencieux côté client.

## Dev local

`docker compose up` sert ce dossier via nginx sur
`http://localhost:${IMAGE_SERVER_PORT}` (cf. `.env.example`) — le front dev
pointe dessus en réglant `IMAGE_SERVER_URL`.
