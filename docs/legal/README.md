# Documents légaux

Mentions légales et documents de conformité du portfolio
[charles-lindecker.com](https://charles-lindecker.com).

## Sommaire

| Document | Objet |
| --- | --- |
| [mentions-legales.md](./mentions-legales.md) | Identification de l'éditeur, de l'hébergeur, propriété intellectuelle, responsabilité (LCEN art. 6) |
| [politique-confidentialite.md](./politique-confidentialite.md) | Traitement des données personnelles (RGPD) |
| [politique-cookies.md](./politique-cookies.md) | Cookies et stockage local du navigateur |

## Champs à compléter avant publication

Ces documents sont rédigés à partir des informations connues. Avant mise en
ligne, renseignez les éléments marqués `[À COMPLÉTER]` dans
`mentions-legales.md` :

- **Adresse** de l'établissement / domiciliation de la micro-entreprise.
- **SIRET** 97789794100018.
- **Inscription RCS** : à conserver uniquement si l'activité est commerciale
  (avec n° RCS + ville du greffe) ; à supprimer si activité libérale.

## Faits techniques retenus (au 27 mai 2026)

Ces documents reflètent l'état réel du site ; à réviser si l'un de ces points
change :

- **Éditeur** : Charles Lindecker, micro-entreprise — TVA en franchise de base
  (art. 293 B CGI).
- **Hébergeur** : Hostinger International Ltd. (Larnaca, Chypre), VPS auto-géré
  (Apache + Node.js/Express, TLS Let's Encrypt).
- **Aucune collecte active** : pas de formulaire, pas de compte, pas de mesure
  d'audience, pas de cookie ni de traceur tiers. CSP stricte (`'self'`).
- **Stockage local** uniquement fonctionnel : langue de l'interface, volume et
  sourdine audio.
- **Seules données serveur** : journaux Apache (IP, user-agent, requêtes) —
  base légale intérêt légitime, conservation ≤ 12 mois.

## Exposition côté application (à faire)

Pour être opposables, ces mentions doivent être accessibles depuis le site
(obligation LCEN). Pistes d'intégration côté Angular :

- Ajouter un lien « Mentions légales » dans le `footer`
  (`front-portfolio/src/app/components/misc/footer/footer.html`).
- Créer une route dédiée (ex. `/mentions-legales`) servant ce contenu, traduite
  via `TranslationService` conformément à la convention i18n du projet.
