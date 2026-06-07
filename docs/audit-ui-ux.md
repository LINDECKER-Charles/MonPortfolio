# Audit UI/UX & propositions d'amélioration

> **MàJ 2026-06-07 — refacto appliqué.** Voir la section [« Corrections appliquées »](#corrections-appliquées) en fin de document pour l'état réel après implémentation (et les findings de l'audit qui se sont révélés surévalués à la vérification).

**Projet** : `front-portfolio` — Portfolio personnel Charles Lindecker (Angular 20 zoneless, SSR Express, Tailwind 4, GSAP — DA Bloodborne)
**Date** : 2026-06-07
**Périmètre** : accessibilité, performance/SSR, responsive/mobile, motion, conversion/architecture d'information, cohérence du design system.
**Méthode** : lecture du code source (`front-portfolio/src`), vérification par grep des volumétries, recoupement avec les règles internes (`CLAUDE.md`, `tokens.css`).

---

## 1. Résumé exécutif

Le portfolio est **techniquement remarquable** : design system tokenisé strict, SSR + hydratation, i18n exhaustif, fonts self-hostées avec `preload`/`swap`, `prefers-reduced-motion` traité côté CSS, focus-trap et skip-link présents. Le socle est largement au-dessus de la moyenne des portfolios.

Les marges de progression ne sont donc **pas dans la qualité visuelle** mais dans trois zones à fort levier :

| Axe | État | Verdict |
|-----|------|---------|
| Conversion / parcours recruteur | ⚠️ | **Le levier business #1** — contact fragmenté, CV non exposé, intros bloquantes rejouées, page `/works` vide mais indexée |
| Performance / bundle | ⚠️ | Bundle initial **738 KB** (> budget 500 KB) — routes 100 % eager, GSAP au boot |
| Accessibilité (détail) | ⚠️ | Socle bon mais trous : aria-label manquants, focus-trap/scroll-lock incomplets, GSAP sans reduced-motion |
| Responsive / touch | ⚠️ | Plusieurs cibles tactiles < 44 px, feedback hover sans équivalent tap |
| Cohérence design system | 🔴 | **385 couleurs en dur / 37 fichiers**, 36 z-index hors tokens — dérive vs la propre règle du projet |
| Motion / DA | ✅ | Cohérent et maîtrisé |

**Top 5 quick-wins (impact fort / effort faible)** :

1. Passer `/works` en `robots: noindex` tant que la page est en construction *(15 min)*.
2. Exposer le CV et un CTA contact dans le hero + la navbar *(1–2 h)*.
3. Persister le skip des séquences d'ouverture en `localStorage` *(1–2 h)*.
4. Ajouter le check `prefers-reduced-motion` dans `OpeningAnimationService` *(1 h)*.
5. Lazy-loader les routes (`loadComponent`) → bundle initial sous le budget *(2 h)*.

---

## 2. Conversion & architecture d'information (levier business)

> Objectif du site : convaincre recruteurs/clients et **déclencher un contact**. C'est ici que se trouve le ROI le plus élevé.

### 2.1 — Le contact est fragmenté et peu saillant — **Impact : Haut**

La navbar n'expose que 3 entrées (`home`, `projects`, `works` — `nav-barre.ts:20`). Aucun accès direct à `/resume`, au CV, ou à un contact. Les points de contact sont dispersés sur 4 surfaces (footer, `/resume`, `/linktree` orpheline, sociales) sans CTA persistant.

**Reco** :
- Ajouter une entrée nav « CV » / « Contact » (ou un dropdown sous le logo : Home / Projects / Works / Resume / Linktree).
- Un visiteur doit pouvoir contacter en **1 clic depuis n'importe quelle page**.

### 2.2 — Le CV n'est pas exposé là où il compte — **Impact : Moyen-Haut**

Le PDF existe et est lié dans le footer, mais **absent du hero** (`home-resume.html`) — premier écran vu par un recruteur. Footer = sous la ligne de flottaison.

**Reco** : CTA `cta-tome--gilded` « Télécharger le CV » dans le hero, à côté de l'intro (réutiliser la primitive existante, pas de nouveau style).

### 2.3 — Séquences d'ouverture bloquantes et **rejouées à chaque visite** — **Impact : Haut**

`opening-home` / `opening-resume` imposent une intro (audio gate + animation GSAP, ~10–15 s). Le skip existe mais **n'est pas persisté** : un recruteur qui revient resubit l'intro. Aucun flag `localStorage`.

**Reco** :
- Persister `opening.skipped` au premier skip → bypass automatique aux visites suivantes.
- Supporter un `?skip-opening=true` pour les liens partagés (candidatures).
- Sur mobile, réduire la friction de l'audio gate (timeout court, tap n'importe où).

### 2.4 — `/works` est en construction **mais indexée** — **Impact : Haut (SEO + perception)**

`app.routes.ts` déclare `/works` avec `robots: 'index, follow'` alors que la page rend un `construction-state` (3 piliers décoratifs sans contenu). Google indexe une page quasi vide → signal « site non entretenu », et déception du visiteur qui clique « Parcours ».

**Reco** :
- `robots: 'noindex, nofollow'` jusqu'à contenu réel, **ou** remplir `works.state.ts` (expériences/formations) et afficher la timeline, **ou** rediriger temporairement vers `/resume`.

### 2.5 — Page projets : friction d'exploration — **Impact : Moyen**

- **Deep-link non fonctionnel** : `/projects#<id>` n'ouvre pas la modal du projet (utile pour partager un projet en candidature). → lire `location.hash` à l'init et ouvrir la fiche.
- **Filtres non persistés** : reset au changement de page. → sérialiser l'état des filtres en `localStorage`.
- **Constellation peu affordante** : vue par défaut graphiquement riche mais sans indice de cliquabilité. → hint texte + `aria-label` sur les nœuds, ou vue « timeline » par défaut pour le recruteur pressé.
- **État vide manquant** : si un filtre ne renvoie rien, aucun message. → bloc « Aucun résultat » + bouton reset.

### 2.6 — Lisibilité du lexique Bloodborne — **Impact : Moyen**

Le wording thématique (rêveur, rune, lanterne, « banni de ces terres ») est un atout de branding mais peut désorienter un recruteur non-gamer sur les **CTA fonctionnels**. Garder l'immersion narrative, mais s'assurer que **les actions clés restent explicites** (« Voir les projets », « Télécharger le CV », « Me contacter »).

---

## 3. Performance & SSR

### 3.1 — Routes 100 % eager — **Sévérité : Haut**

`app.routes.ts` importe statiquement les 12 composants de page (`0` occurrence de `loadComponent`). Tout le code des pages est dans le chunk initial.

- **Bundle initial mesuré** : `dist/.../main-GH22YYSZ.js` = **738 KB** (non-gzip) → dépasse `maximumWarning: 500kB` (`angular.json:38`).

**Reco** : convertir chaque route en `loadComponent: () => import(...)`. Gain estimé ~100–180 KB sur le chunk initial.

### 3.2 — GSAP chargé au boot — **Sévérité : Haut**

GSAP (~150–200 KB minifié) est importé dans 20+ fichiers et embarqué dans `main`, alors qu'il ne sert que pour les openings et quelques interactions.

**Reco** : import dynamique (`await import('gsap')`) dans les services/composants qui l'utilisent réellement ; les pages légères ne le paient plus. Gain ~80–120 KB.

### 3.3 — Leviers complémentaires — **Sévérité : Bas-Moyen**

- Aucun `@defer` : candidats naturels = listes projets, carrousels, sections sous la ligne de flottaison.
- Pas de `withPreloading(PreloadAllModules)` (à activer **après** le passage en lazy pour précharger en idle).
- `aspect-ratio` à généraliser sur les conteneurs d'icônes (24/40/80) pour garantir CLS ≈ 0.
- **Note** : `provideClientHydration()` sans `withEventReplay()` est **volontaire** (contrainte CSP stricte sans script inline — cf. mémoire projet). À ne pas « corriger » sans lever la contrainte CSP.

**Déjà optimal** (à conserver) : fonts self-hostées + `preload` + `font-display: swap`, `preconnect` serveur d'images, audio chargé à la demande, ember-particles full-CSS avec dégradé mobile + reduced-motion.

---

## 4. Accessibilité (détail)

Socle solide (skip-link `app.html:3`, `lang` dynamique, focus-trap directive, reduced-motion CSS). Trous à combler :

| # | Sévérité | Constat | Fichier | Correctif |
|---|----------|---------|---------|-----------|
| 1 | Haut | `image-lightbox` a `role="dialog"`/`aria-modal` mais **pas de focus-trap** (présent sur lang-modal & projects-modal seulement) | `image-lightbox.html` | Ajouter `appFocusTrap` sur le dialog |
| 2 | Haut | Boutons icon-only sans `aria-label` (filtres tags/stack, retrait de chip, détails constellation, nav carrousel) | `projects-filter.html`, `constellation.html`, `projects-modal.html` | `[attr.aria-label]` sur chaque |
| 3 | Haut | `outline: none` sans fallback visible sur input de recherche & nœuds constellation | `projects-filter.css:130`, `constellation.css:249` | `:focus-visible { box-shadow: 0 0 0 2px … }` (halo doré) |
| 4 | Moyen | Contraste limite : `ash-faint #6b7280` sur fond sombre (~3.8:1) sur petites icônes | `lang-modal.css` close, constellation labels | Remonter à `ash-dim`/`ash` |
| 5 | Moyen | `ResponsivePicture.alt` vaut `''` par défaut → oublis silencieux | `responsive-picture.ts` | Rendre `alt` requis (ou warn en dev) |
| 6 | Moyen | Hiérarchie de titres : `h2` sans `h1` ancêtre dans certaines modals | `projects-modal.html`, `constellation.html` | Vérifier l'ordre h1→h2→h3 par vue |

---

## 5. Responsive, mobile & touch

| # | Sévérité | Constat | Fichier |
|---|----------|---------|---------|
| 1 | Haut | Cibles tactiles < 44 px : collapse sound (20 px), zoom constellation (32 px), dots carrousel (10 px), nav icon-btn (38 px), chips filtres (~36 px) | `stop-all-sound.css`, `constellation.css:394`, `photo-carousel.css:209`, `nav-barre.css:149` |
| 2 | Haut | `OpeningAnimationService` ne teste **pas** `prefers-reduced-motion` → GSAP joue toujours (vérifié : 0 `matchMedia` dans le dossier opening) | `opening-animation.service.ts` |
| 3 | Moyen | Scroll-lock du body présent **uniquement** sur projects (`projects.ts:154`) — absent de lang-modal & lightbox → la page défile derrière la modale sur mobile | `lang-modal.ts`, `image-lightbox.ts` |
| 4 | Moyen | Interactions hover sans équivalent `:active`/tap (label constellation, chips, nav) → pas de feedback au toucher | divers `.css` |
| 5 | Bas | Quelques tailles < 12 px (légendes constellation 0.6rem) — acceptable mais limite | `constellation.css:444` |

**Bon** : viewport meta correct, constellation gérée en `clamp()` + media queries (pas d'overflow horizontal), tilt désactivé sur tactile.

---

## 6. Cohérence du design system (dette technique) — 🔴

Le projet impose (cf. `CLAUDE.md`) : *« Ne jamais écrire une couleur en dur — piocher dans un token »* et partir des primitives. La réalité mesurée diverge :

- **385 `rgb()/rgba()` en dur** dans **37 fichiers** composants.
- **83 couleurs hex** en dur.
- **36 `z-index`** hors des tokens `--z-*` pourtant définis (`tokens.css:194`).
- Duplications de patterns (surfaces translucides, chips dorés, ombres « blood intense ») recodés localement au lieu de `.surface-*` / `.chip--gilded` / `.cta-tome`.

**Nuance importante (à ne pas traiter comme une simple indiscipline)** : Tailwind 4 expose les couleurs `@theme` comme valeurs hex, **non décomposées en canaux** — impossible d'en dériver une variante alpha sans `color-mix()` ou tokens canaux. Une grande part des `rgb(166 10 10 / 0.18)` sont donc des **variantes d'opacité de tokens existants**, contraintes par l'outillage, pas du hasard.

**Reco structurante** :
1. Ajouter des **tokens canaux** : `--color-blood-rgb: 166 10 10;` → permet `rgb(var(--color-blood-rgb) / .18)`. Ou systématiser `color-mix(in srgb, var(--color-blood) 18%, transparent)`.
2. Remplacer les 36 `z-index` par `var(--z-*)` (≈ 30 min, faible risque).
3. Extraire les gradients/ombres dupliqués en tokens (`--shadow-blood-intense`, `--gradient-card-light`).
4. **Garde-fou** : règle stylelint interdisant `rgb(`/`#hex`/`z-index` numérique hors `styles/`. C'est ce qui empêchera la dérive de revenir.

> Priorité : **moyenne**. C'est de la dette de maintenabilité, invisible pour l'utilisateur — à traiter après les axes conversion/perf/a11y, mais le garde-fou stylelint vaut d'être posé tôt.

---

## 7. Plan d'action priorisé

### Phase 1 — Quick-wins conversion & SEO (≈ 1 jour)
- [ ] `/works` → `robots: noindex` (ou remplir/rediriger). *(15 min)*
- [ ] CTA CV + contact dans hero et navbar. *(1–2 h)*
- [ ] Persistance `localStorage` du skip opening + `?skip-opening`. *(1–2 h)*
- [ ] État vide « Aucun résultat » sur projets. *(1 h)*

### Phase 2 — Performance (≈ 1 jour)
- [ ] Routes en `loadComponent`. *(2 h)*
- [ ] Import dynamique de GSAP. *(2–3 h)*
- [ ] `withPreloading(PreloadAllModules)` + `aspect-ratio` icônes. *(1 h)*

### Phase 3 — Accessibilité & mobile (≈ 1–2 jours)
- [ ] `prefers-reduced-motion` dans `OpeningAnimationService`. *(1 h)*
- [ ] focus-trap + scroll-lock sur lightbox & lang-modal. *(1–2 h)*
- [ ] `aria-label` sur boutons icon-only + `:focus-visible` sur inputs/nœuds. *(2 h)*
- [ ] Cibles tactiles ≥ 44 px + feedback `:active`. *(2–3 h)*

### Phase 4 — Dette design system (≈ 2–3 jours, en continu)
- [ ] Règle stylelint anti-couleur/z-index en dur (garde-fou d'abord). *(0,5 j)*
- [ ] Tokens canaux + remplacement des `z-index`. *(1 j)*
- [ ] Refactor incrémental des duplications vers primitives. *(continu)*

### Matrice impact / effort

```
Impact ↑
 Haut │ CV+contact nav   Lazy routes      Works noindex
      │ Skip persistant  GSAP dynamic
      │
Moyen │ Deep-link proj   focus-trap/lock  aria-labels
      │ Filtres persist  reduced-motion GSAP
      │
  Bas │ Wording CTA      @defer           Tokens canaux/stylelint
      └─────────────────────────────────────────────────────→ Effort
         Faible            Moyen             Élevé
```

---

## 8. Ce qui est déjà exemplaire (à préserver)

- Design system tokenisé (`tokens.css`) : palette sémantique, eases, ombres, textures.
- SSR + hydratation, zoneless, signals.
- i18n exhaustif (baseline FR + fallback, namespaces lazy).
- Fonts self-hostées optimisées (preload + swap), RGPD-friendly.
- `prefers-reduced-motion` côté CSS, tilt désactivé sur tactile, ember-particles full-CSS.
- SEO structuré : JSON-LD (Person/WebSite/Breadcrumb), OG/Twitter par route, canoniques.
- DA cohérente et différenciante — c'est l'atout maître, à ne pas diluer.

---

*Audit conduit par lecture statique du code ; les volumétries (385 rgb, 738 KB bundle, 36 z-index, 0 loadComponent) sont issues de grep/build vérifiés. Les ratios de contraste sont estimés et à confirmer par un check automatisé (axe-core / Lighthouse).*

---

## Corrections appliquées

État après implémentation (build vérifié `exit 0`). Plusieurs findings se sont révélés **surévalués** une fois vérifiés dans le détail du code — c'est noté explicitement.

### Performance — ✅ appliqué (gain majeur)
- **Routes en `loadComponent`** + `withPreloading(PreloadAllModules)` (`app.routes.ts`, `app.config.ts`).
- Résultat mesuré : **bundle `main` 738 KB → 50 KB** (≈ 11 KB gzip), **initial total ≈ 463 KB**.
- **GSAP** : passe automatiquement dans un chunk lazy partagé (plus dans l'initial). Le refacto « import dynamique GSAP sur 20 fichiers » devient **inutile** — non réalisé (risque évité).
- `provideClientHydration()` laissé **sans** `withEventReplay()` (contrainte CSP stricte — volontaire).
- `aspect-ratio` icônes : non fait (faible valeur, CLS déjà couvert par les conteneurs).

### SEO / conversion — ✅ appliqué (+ findings corrigés)
- `/works` repassé en **`robots: noindex, nofollow`** tant que la page est en construction.
- **Persistance du skip d'ouverture** : `Opening` mémorise `opening.seen` en `localStorage`, supporte `?skip-opening`, et bypasse en `prefers-reduced-motion` (`opening.ts`).
- **État vide projets** (vue liste) : bloc « Aucun projet trouvé » + reset (`projects.html`, clés i18n FR/EN).
- ⚠️ **Finding corrigé** — « CV/contact absents du hero » : **faux**. Le hero expose déjà 4 CTA (Resume, Replay, Linktree, **Téléchargement CV**) et le footer couvre le contact sur toutes les pages. Aucun CTA redondant ajouté.

### Accessibilité & mobile — ✅ appliqué (+ findings corrigés)
- **Focus-trap** ajouté à `image-lightbox` (+ `role/aria-modal` déjà présents).
- **Scroll-lock** ajouté à `image-lightbox` et `lang-modal`, avec **capture/restauration** de `overflow` (gère l'imbrication lightbox-au-dessus-d'un-modal sans déverrouiller le parent).
- **Reduced-motion** câblé dans `OpeningAnimationService` (les timelines GSAP sautent à l'état final ; plus de flottement infini).
- **Cibles tactiles** : nav icon-buttons 38 → **44 px**, popover-mute 36 → 44 px ; zones tactiles élargies à 44 px via pseudo-élément sans grossir le visuel (collapse-toggle son, dots carrousel).
- **Focus visible** : relais halo (or/ember) sur les `outline: none` réellement orphelins (onglets vue projets, dots carrousel).
- **aria-label** ajouté aux inputs de recherche tags/stack (placeholder ≠ nom accessible).
- ⚠️ **Findings corrigés** — la majorité des « boutons sans aria-label » signalés (chips de filtre tags/stack) ont en réalité un **texte visible** → nom accessible présent, pas de correctif nécessaire.

### Dette design system — 🟡 groundwork seulement (finding largement surévalué)
- Ajout des **tokens canaux** dans `tokens.css` (`--color-blood-rgb`, `--color-gold-rgb`, …) : débloque l'écriture propre des variantes alpha `rgb(var(--color-x-rgb) / α)` au lieu de figer la couleur. Pattern démontré sur `nav-barre`.
- ⚠️ **Finding corrigé — z-index** : les « 36 z-index en dur » sont quasi tous des **contextes d'empilement locaux légitimes** (dialog au-dessus de son backdrop). Les overlays (`lightbox`, `lang-modal`, `projects-modal`, `loading`) utilisent **déjà** `--z-lightbox`/`--z-modal`/`--z-loading` sur leur racine. **Aucun bug réel** ; remplacement par les tokens globaux non fait (ce serait une erreur).
- ⚠️ **Finding nuancé — 385 couleurs** : en grande partie des **variantes alpha de tokens** contraintes par Tailwind 4 (couleurs `@theme` non décomposées en canaux), pas de l'indiscipline pure. Le **mass-refacto n'a pas été appliqué** : invisible à l'écran, fort risque de régression en une passe, à mener **incrémentalement** fichier par fichier avec les tokens canaux.
- **Stylelint** anti-couleur/z-index : **recommandé** mais non posé (inonderait l'éditeur de warnings sur l'existant ; à activer en `warn` lors du cleanup incrémental).

### i18n
- 2 clés ajoutées (`projects.empty.title/text`) en **FR (baseline) + EN**. Les autres locales héritent du fallback FR — comportement **déjà en place** dans le projet (l'audit `npm run audit:i18n` révèle **592 clés pré-existantes** manquantes hors FR, dont `view.*`, `constellation.*`, `lucie-*`). Propager les 22 locales reste un chantier de fond séparé.

### Non réalisé volontairement (trade-offs)
| Item | Raison |
|------|--------|
| Import dynamique GSAP (20 fichiers) | Rendu inutile par le lazy-loading des routes |
| Mass-refacto 385 couleurs → tokens | Invisible, risqué en une passe ; à faire incrémentalement |
| Remplacement des z-index locaux | Faux positif : empilement local correct |
| Propagation i18n 22 locales | Backlog pré-existant (592 clés) ; chantier séparé |
| Stylelint imposé | Noierait l'existant ; à activer pendant le cleanup |
| CTA CV/contact navbar/hero | Déjà présents (hero 4 CTA + footer) |

**Build** : `npm run build` → `exit 0`. **Vérif visuelle** restant à faire par toi (`npm start`).

### Seconde passe (même jour) — lot a11y restant, stylelint, couleurs, i18n

- **A11y/mobile complémentaire** : carousel nav 44 px (desktop + mobile) ; lang-modal close 44 px + contraste `ash-dim` + focus-visible ; chips/options/reset de filtre → focus-visible doré (absent) ; constellation zoom-btn → zone tactile 44 px (pseudo) + halo focus ; legend-row → halo focus. Chips filtre laissés compacts visuellement (trade-off DA assumé, focus indicator ajouté).
- **Stylelint (garde-fou)** : `stylelint` 17 + `stylelint-declaration-strict-value`. Config `.stylelintrc.json` : warn sur hex et `rgb()` littéral pour `color/fill/stroke/background-color/border-color`, accepte `var(--…)` et `rgb(var(--…-rgb) / α)`, exempte `src/styles/`. Script `npm run lint:css`. **z-index volontairement non couvert** (faux positifs locaux). Baseline 208 → **153 warnings** après migration.
- **Migration couleurs** : **286 littéraux `rgb()`** de la palette convertis en `rgb(var(--color-*-rgb) / α)` sur tout `src/app` (substitution canal-exact = rendu strictement identique). Tokens canaux étendus (`gold-dim`, `stone`, `stone-abyss`, `stone-elevated`, `stone-raised`). Les **153 warnings restants** = teintes one-off hors palette (gris 215, browns…) et fallbacks hex intentionnels (constellation auto-contenue) → décisions design, pas du mécanique.
- **i18n** : `en/es/de/it/pt` complétés — footer (+4 clés × 5 : liens légaux) et projects (+8 en : `lucie-*` ; +25 es/de/it/pt : `empty.*`, `view.*`, `constellation.*`, `lucie-*`), traductions complètes. Audit : **592 → 464 clés manquantes** ; le reliquat (variantes thématiques + ar/ja/zh/ru) reste sur fallback FR par décision.
- **Décisions produit confirmées** : bypass d'ouverture conservé tel quel ; migration couleurs incrémentale ; locales thématiques sur fallback.

**Build final** : `exit 0`, initial total ≈ 464 kB (gzip ≈ 127 kB).
