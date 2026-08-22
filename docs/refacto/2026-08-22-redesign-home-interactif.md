# Redesign de la page d'accueil — interactivité & mise en avant de la cinématique

**Date** : 2026-08-22
**Périmètre** : `front-portfolio/src/app/components/page/home/**`, séquence d'ouverture (`misc/opening-resume/opening/`), directives partagées, i18n `home-*`.
**Statut** : plan validé → implémenté dans la même session (voir « Réalisation » en fin de document).

---

## 1. Constat

La home actuelle est **techniquement propre mais plate** :

| Zone | État | Pourquoi ça paraît plat |
|---|---|---|
| Hero (`home-resume-header`) | Identité + 5 pills CTA de même gabarit | Aucune hiérarchie d'invitation ; la cinématique est un CTA gris « Relancer l'animation » noyé parmi cinq |
| Cinématique (`/opening-home`) | Atout unique du site (audio gate, rune, voix, musique) | **Invisible** : aucune entrée naturelle depuis `/`. Pire : `opening.seen` (localStorage) fait bypasser la séquence, donc le CTA « Relancer » **ne rejoue jamais** pour un visiteur récurrent — il redirige immédiatement vers `/` |
| À propos | Portrait (tilt) + accordéon de 5 snippets | Seule vraie interaction de la page, muette |
| Projets / Parcours | Texte + icônes de stack + 2 CTA chacun | Aucun **contenu** : les sections ne sont que des renvois vers d'autres pages, sans aperçu ni manipulation possible |
| Rythme | 3 plaques `surface-altar` empilées, reveal au scroll | Même gabarit, même densité, aucun « moment » |

## 2. Objectifs

1. **Faire de la cinématique la pièce maîtresse** du premier écran : une invitation lisible, désirable, état-consciente (jamais vue / déjà vue), qui fonctionne réellement (fix du replay).
2. **Maximiser l'interactivité** sans gadget : chaque section doit offrir au moins une manipulation réelle (lumière qui suit la lanterne, cartes projets, jalons du parcours, sons d'interface).
3. Rester dans les **contraintes dures** du projet : DA Bloodborne (tokens + primitives), i18n obligatoire, SSR/SSG + LCP (pas de re-masquage du contenu initial), CSP `script-src 'self'` (aucun inline), `prefers-reduced-motion`, tactile, a11y WCAG AA, couverture de tests.

## 3. Principes de conception

- **Registre « monde »** (cf. `docs/direction-artistique/06`) : la home est un lieu théâtral — ornements, brume, braises, or patiné, lumière de lanterne. Le chrome (nav, footer) n'est pas touché.
- **La lanterne comme fil rouge** : une lumière chaude suit le curseur sur chaque plaque de la home (`appLanternLight`). Même vocabulaire partout → cohérence, coût nul sur mobile (désactivé sans pointeur fin).
- **Interactions progressives** : tout marche au clic/clavier/tactile ; hover, tilt, lumière et sons sont des couches additionnelles (`hover: hover`, `pointer: fine`, reduced-motion respecté).
- **LCP intact** : le `h1` reste rendu SSR avec `.emerge-ritual` ; aucun tween GSAP ne masque du contenu déjà peint. Les nouveaux blocs entrent via `.emerge-ritual` + `--emerge-delay`.
- **Bundle** : aucune nouvelle dépendance. Les données projets (`PROJECTS_DATA`) sont déjà dans `main` ; `EXPERIENCES` (works) est de la donnée pure partagée en chunk commun.

## 4. Design détaillé

### 4.1 Hero — « La Lanterne » (nouveau composant `home-lantern`)

Le hero passe en **deux colonnes** : identité + CTA à gauche, **autel de la cinématique** à droite (empilés sur mobile, autel en second pour préserver `h1` en premier paint).

Contenu de l'autel (`surface-altar surface-altar--ornate surface-textured`) :
- la **rune du Chasseur** (`OPENING_SOURCES`, déjà utilisée par la séquence) sur un halo sang qui respire (`glowPulse`) et flotte (idle CSS) ; 6 braises locales qui montent ;
- eyebrow état-conscient : « Séquence d'ouverture · jamais vue » tant que `opening.seen` n'est pas posé, sinon « Séquence d'ouverture » ;
- titre gravé **« Entrer dans le Rêve »**, lead court, trois chips d'info (« Son recommandé », « ≈ 30 s », « Passable à tout moment ») ;
- CTA double-label « Lancer / La cinématique ».

Interaction :
- toute la tuile est un lien `routerLink="/opening-home"` `?replay=1` (fonctionne sans JS, clavier, tactile) ;
- au clic avec animations actives : **ignition** — la rune s'embrase (scale + halo), un voile (`position: fixed`) noir/sang monte en ~0,55 s, puis navigation programmatique. Garde-fou `delayedCall` : la navigation part quoi qu'il arrive ;
- son `smallBell` à l'ignition (catalogue existant) ;
- hover : lumière de lanterne + halo qui s'intensifie, léger tilt (`appTilt`).

### 4.2 Fix du replay de la séquence (`Opening`)

- Constantes exportées dans `opening.state.ts` : `OPENING_SEEN_KEY`, `OPENING_REPLAY_PARAM`, `OPENING_SKIP_PARAM`.
- `shouldBypass()` : `?replay` **gagne** sur `opening.seen` et sur reduced-motion (l'`OpeningAnimationService` dégrade déjà proprement). Lecture via `ActivatedRoute` (optionnel) avec repli `window.location.search` — testable.
- Suppression du CTA « Relancer l'animation » du hero et de ses clés i18n (`header.cta.replay.*`) dans toutes les locales.

### 4.3 Lumière de lanterne (`appLanternLight` + primitive `.lantern-light`)

- Directive : pose `--lantern-x/--lantern-y` (en px depuis le coin haut-gauche de l'hôte) et `--lantern-on` sur l'hôte — position appliquée dès `pointerenter` (avant l'allumage, pour ne jamais éclairer une position périmée), puis sur `pointermove` (rAF-throttlé) ; active uniquement si `(hover: hover) and (pointer: fine)` et pas de reduced-motion ; SSR-safe.
- Primitive globale (`ornaments.css`) : `<span class="lantern-light" aria-hidden="true">` = couche absolue carrée de taille fixe (`--lantern-size`, 720px par défaut, surchargeable sur l'hôte) peinte une fois (`radial-gradient` or patiné centré, stops en % du demi-côté : halo ≈ 300px de rayon), déplacée par `transform: translate3d(calc(var(--lantern-x) - 50%), calc(var(--lantern-y) - 50%), 0)` + `will-change: transform` — compositor-only, aucun repaint de la plaque au survol. `opacity: var(--lantern-on, 0)`, transition `--ease-ritual`. Enfant direct d'une surface (`position: relative; overflow: hidden` — c'est l'hôte qui clippe le halo), sous le contenu (`z-index: 0`). Trade-off : la taille du halo ne dépend plus de la surface ; une surface étroite peut caler `--lantern-size`.
- Posée sur : hero, autel, section projets, section parcours.

### 4.4 Projets — « Reliquaire » (nouveau `home-projects-relics`)

Sous l'intro et les CTA, une **rangée horizontale** des 4 projets `featured` (scroll-snap, scrollable au doigt, flèches clavier par focus) : vignette (`detail.images[0]`), titre gravé, catégorie (`projects.filter.*`), statut (`projects.status.*`), année, 3 chips de stack. Hover : tilt léger, zoom de l'image, liseré ember ; focus visible doré. Chaque relique est un lien vers `/projects`.

### 4.5 Parcours — « Chronique » (nouveau `home-work-chronicle`)

Une **mini-frise horizontale** des 4 jalons les plus récents d'`EXPERIENCES` : nœud (logo organisme ou monogramme) sur une ligne d'or, année, titre, type (`works.employment.*`). Hover/focus : le nœud s'allume, la ligne se remplit jusqu'à lui, le détail (organisme · lieu) apparaît. Dernier nœud marqué « Aujourd'hui » si `end === null`. Toute la frise renvoie vers `/works`.

### 4.6 Snippets « À propos »

Accordéon conservé ; ajout des sons d'interface du catalogue (`getEcho` à l'ouverture, `getbackEcho` à la fermeture) — même grammaire sonore que le CV.

### 4.7 Rythme de page

- Sections projets/parcours : reveal avec `revealScale` (micro-zoom 0.94 → 1) pour donner du poids.
- Espacement vertical légèrement augmenté entre plaques (`gap` 2.25 → 3 rem desktop) pour laisser respirer les nouveaux contenus.

## 5. Architecture & fichiers

```
src/app/directives/lantern-light.directive.ts (+spec)            # nouveau
src/styles/ornaments.css                                         # + .lantern-light
src/app/components/misc/opening-resume/opening/opening.state.ts  # + constantes
src/app/components/misc/opening-resume/opening/opening.ts (+spec)# replay param
src/app/components/page/home/home.html / home.css                # rythme, revealScale
src/app/components/page/home/home-resume/home-resume-header/*    # 2 colonnes, 4 CTA, lanterne
src/app/components/page/home/home-resume/home-lantern/*          # nouveau (ts/html/css/spec)
src/app/components/page/home/home-projects/*                     # relics + lanterne
src/app/components/page/home/home-projects/home-projects-relics/*# nouveau
src/app/components/page/home/home-work/*                         # chronicle + lanterne
src/app/components/page/home/home-work/home-work-chronicle/*     # nouveau
src/app/components/page/home/home-resume/home-resume-content/home-resume-snippets/* # sons
public/lang/home-resume|home-projects|home-work/*.json           # clés lantern.* / relics.* / chronicle.*
FUNCTIONAL_SPEC.md                                               # §4 accueil, §8 ouverture
```

## 6. i18n

- Nouvelles clés sur `fr` (baseline) + locales maintenues `en/es/de/it/pt` (politique projet : les variantes thématiques et `ar/ja/zh/ru` restent sur le fallback FR).
- Clés retirées partout : `home-resume.header.cta.replay.top/bottom`.
- Réutilisation : `projects.filter.<category>`, `projects.status.<status>`, `works.employment.<type>` (tous les namespaces sont chargés au bootstrap).

## 7. Tests & vérification

- Specs unitaires : `HomeLantern` (état seen, ignition avec/sans reduced-motion, navigation garantie), `LanternLightDirective` (variables posées / no-op sans pointeur fin), `HomeProjectsRelics`, `HomeWorkChronicle`, `Opening` (replay), mises à jour `HomeResumeHeader`/`HomeResumeSnippets`.
- `ng build` (SSR + prerender), `ng test` headless, `ng lint` + stylelint, `prettier --check --end-of-line auto`.
- e2e smoke + a11y axe sur le build, rendu visuel (captures desktop/mobile) pour QA.

## 8. Hors périmètre (suites possibles)

- Parallaxe au scroll des couches du hero.
- Easter egg « Blood Moon » (triple clic sur la rune).
- Migration typographique Shippori/Spectral (doc DA 06) — chantier global, pas home.
- Mini-constellation des projets embarquée sur la home (coût perf/SVG à évaluer).

---

## Réalisation

Livré le 2026-08-22, intégralement conforme aux §4–7, avec les ajustements suivants décidés en cours de route :

- **Lanterne sans `routerLink`** : `RouterLink.onClick` ignore `preventDefault()` et naviguait avant l'ignition. Le lien garde un `href` nu (`/opening-home?replay=1`, fonctionnel sans JS / clic modifié laissé au navigateur) et navigue programmatiquement après la timeline ; si `router.navigate` renvoie `false` ou rejette, l'ignition est rembobinée (`abortIgnition`) et le CTA réarmé.
- **Nom accessible** via `aria-labelledby` (titre + CTA visibles, WCAG 2.5.3) au lieu d'un `aria-label` ; anneau de focus porté par l'hôte (`:has(> :focus-visible)`) car le lien remplit une tuile `overflow: hidden`.
- **Surface de l'autel** = `surface-crypt` + `surface-vignetted--deep` (haze sang en override), pile dorée locale `.lantern__gilt`, labels `cta-tome__*` réutilisés ; rune servie via `LANTERN_RUNE_SOURCES` (descripteurs `w` + `sizes`) ; halo interpolable (`@property --lantern-halo`).
- **`.lantern-light` compositor-only** : couche de taille fixe (`--lantern-size`) translatée, variables en px — pas de repaint de la plaque au survol.
- **Reliquaire** : sources projet converties en descripteurs `width` (`toRelicImage`) pour que `sizes` agisse (vignettes 640 w au lieu du fichier complet).
- **Chronique** : les 4 jalons récents sont tous en cours ; la braise marque chacun, le libellé « Aujourd'hui » n'est affiché que sur le plus récent (visually-hidden sur les autres) ; DOM = ordre visuel sur mobile (intro → CTA → chronique).
- Trade-off assumé : `works.data.ts` devient un chunk partagé home/works (≈ 2,4 Ko gzip) plutôt qu'une copie des jalons.

Vérification (build de prod) : prettier / eslint (0 erreur) / stylelint (0 erreur) ; **667 specs** Karma ; **33 e2e** Playwright (smoke + axe) ; Lighthouse `/` perf 0.99, a11y 1.0, best-practices 1.0, SEO 1.0, LCP 0,9 s, CLS 0, TBT 0 ms. Revue adversariale (3 lentilles, 28 findings vérifiés) : 20 confirmés → 19 corrigés, 1 assumé (chunk `works.data`).
