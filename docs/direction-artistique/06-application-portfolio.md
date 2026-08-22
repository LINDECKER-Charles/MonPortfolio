# 06 — Application au portfolio : analyse d'écart

> Comparaison entre la DA réelle du jeu (docs 01–05) et le design system actuel du portfolio (`front-portfolio/src/styles/tokens.css` + primitives, état au 22/08/2026). Objectif : savoir précisément **ce qui est déjà fidèle, ce qui s'écarte, et quoi changer en priorité** — sans rien imposer : chaque écart est une décision, pas une faute.

## 0. Deux postures possibles (à trancher avant tout)

- **Posture A — « fidélité musée »** : reproduire les règles du jeu au plus près (une seule serif, chrome austère à coins droits, saturation basse partout, ornement réservé aux « moments monde »). Rend l'hommage immédiatement reconnaissable pour qui connaît le jeu.
- **Posture B — « interprétation »** : garder l'esprit (nuit, or patiné, braises, gravure) mais assumer des choix web modernes (arrondis, orange vif de CTA, sans-serif utilitaire). C'est la posture actuelle du portfolio.

**Recommandation** : posture A pour l'essentiel, avec la **règle des deux registres** (cf. §6) comme soupape — c'est elle qui permet d'être fidèle *et* web. Le reste du document est écrit dans cette optique ; en posture B, les mêmes constats restent utiles comme « curseurs ».

## 1. Ce qui est déjà très fidèle ✅

- **Le fond de scène** : `stone-abyss #0c0f13` / `stone-deep #121010` correspondent aux noirs sourcés du jeu (`#131718` noir bleuté, `#1A0B06` brun quasi-noir). La base sombre est juste.
- **Les vignettes** (`--shadow-vignette-*`) : le jeu vignette réellement (rues étroites + post-process). Très bon réflexe.
- **Les textures grain** (`--texture-parchment/stone` en overlay discret) : cohérentes avec le grain de film du post-process — à condition de rester subtiles (cf. §6).
- **Les lueurs d'ambiance radiales** (`--glow-*-haze`) : équivalent direct des halos de lanternes dans la brume.
- **Les bordures fines à faible opacité** (`--border-gilded` 1px / 0.18) : exactement le langage du jeu (filets ~1px, 25–40 % d'opacité).
- **Le clair-obscur** : ombres composées profondes + centres éclairés = le contraste de valeur du jeu.
- **Le lexique** (rêveur, chasseur, rune, lanterne, braise, altar, crypt…) : démarche déjà exemplaire, confortée par la recherche (cf. doc 05 — et le motif « Messengers » est un nom tout trouvé pour les toasts/notifications).
- **La discipline de tokens** (« jamais de couleur en dur ») : c'est précisément ce qui va rendre la migration facile.

## 2. Palette — token par token

Légende verdicts : ✅ fidèle · 🟡 à ajuster · 🔴 s'écarte du jeu.

| Famille actuelle | Référence jeu (doc 02) | Verdict | Piste |
|---|---|---|---|
| `blood #a60a0a` / `blood-dim #6b0808` | Oxblood `#8A0303 → #320808` ; jamais vermillon | 🟡 Légèrement trop vif/saturé | Descendre `blood` vers `#8a0303` ; `blood-dim` est bon (≈ `#740404`). Ajouter un cran « séché » `#3E1510` pour fonds/bordures |
| `ember #ff934d` / `ember-soft #ffb86c` | Cœur de flamme `#FFB45C`, halo `#D9822B`, braises `#D9622B` — l'orange n'existe qu'en **points chauds**, jamais en aplats | 🔴 Teintes crédibles mais **usage trop généreux** : en CTA pleins, c'est plus de saturation que le jeu n'en montre jamais | Faire de `#D9822B` l'orange de travail (bordures, textes, fills) ; réserver `#ff934d`/`#ffb86c` aux **glows et cœurs lumineux** (petites surfaces, text-shadow, dots) ; CTA = fond sombre + liseré + texte ember, pas d'aplat vif |
| `gold #a49476` / `gold-dim #7e6434` | Laiton patiné `#8A6E3A`/`#9C7C4A`, reflets `#C9A25E` | 🟡 `gold` tire vers le gris-pierre ; `gold-dim` est très juste | Option : réchauffer `gold` vers `#9c7c4a` pour les usages « métal », garder `#a49476` comme « pierre dorée » |
| `parchment #d7c09a` | Papier du jeu `#C9BFA8` (beige **gris**), taupe `#C5A8AA` | 🟡 Plus doré/saturé que le jeu | Garder pour les moments chauds ; introduire `#C9BFA8` pour le texte long « lore » |
| `bone #ece7db` / `bone-bright #f3f6f7` | Texte UI vérifié `#DBD9D5` ; le jeu évite le blanc pur | 🟡 `bone` proche ; `bone-bright` trop blanc-bleu | Aligner le texte principal sur `#DBD9D5`–`#ece7db` ; réserver `bone-bright` aux très petites surfaces (jamais en aplat) |
| `moonlight #8eb8ff` / `-dim #7dabff` / `-soft #d9ebff` | Bleu lunaire `#B0D1EA`/`#8FA3B8`, argent arcane `#C9D8E8` — pâle et **désaturé** | 🔴 Nettement trop saturé (bleu « périwinkle » vif) | Désaturer : `moonlight #b0d1ea`, `dim #8fa3b8`, `soft #d9ebff` (déjà bon). Éventuel `moonlight-arcane #7fd4c1` (turquoise Holy Moonlight) pour un accent rare |
| `ash` (3 crans) | Texte secondaire vérifié `#9D9D9D` | ✅ | RAS |
| `stone` (5 crans) | Noirs bruns (`#1A0B06`, `#34302F` charbon **brun**) et noir bleuté (`#131718`) | 🟡 Base juste ; `elevated #25282d` / `raised #30353b` tirent bleu « tech » | Option : variantes chaudes `stone-warm` (`#2B2622`, `#34302F`) pour surfaces « bois/pierre chaude » (cartes narratives, ateliers) |
| *(absent)* | Vert brume `#90D0A6` (« PREY SLAUGHTERED »), olive maladif `#414F36` | — | Famille optionnelle `mist` : le vert spectral est le « succès » du jeu — parfait pour états de réussite/validation |
| *(absent)* | Prune `#632B58`, violet pâle des échos volés | — | Famille optionnelle `nightshade` pour un état rare (erreur exotique, easter egg Blood Moon) |

**Règle transverse (la plus importante)** : la répartition. ~70–80 % sombre neutre, ~15–20 % tons moyens froids, **≤ 5–10 % d'accents** — et parmi eux, le saturé (ember vif, blood) en touches de quelques pourcents. L'écart principal du portfolio n'est pas dans les teintes mais dans la **surface** qu'occupent les accents chauds.

## 3. Typographie — la refonte majeure

C'est le plus gros écart de fidélité (cf. doc 03 : le jeu n'utilise **ni Garamond, ni Trajan, ni sans-serif** — une seule serif « Mincho-latin »).

| Usage actuel | Verdict recherche | Remplacement fidèle |
|---|---|---|
| `--font-display: Cinzel` | 🔴 Cinzel = Trajan-like, explicitement écarté (« ni le logo ni l'UI ») ; registre gréco-romain ≠ victorien | **Shippori Mincho B1** (500) — ou Zen Old Mincho — en CAPITALES espacées `0.045em`, éventuellement `scaleY(0.92)` pour les grands titres « plein écran » |
| `--font-body: EB Garamond` | 🔴 « EB Garamond = Dark Souls, pas Bloodborne » (trop rond, chaud, contraste bas) | **Spectral** 300–400 — le proxy validé par la recréation de référence |
| `--font-ui: Inter` | 🔴 Aucune sans-serif nulle part dans le jeu ; l'UI entière est serif | **Spectral 400** aussi pour l'UI (une seule famille = la règle du jeu). Si une sans reste souhaitée pour le légal/micro-labels, c'est une exception de posture B à documenter |
| `--tracking-rune: 0.22em` | 🟡 Le jeu n'espace jamais autant (~0.02–0.05 em ; 0.043 em sur YOU DIED) | Garder 0.22 pour de rares eyebrows « gravés » ; introduire `--tracking-engraved: 0.045em` pour les titres caps fidèles |
| Hiérarchie par graisse | 🟡 Le jeu hiérarchise par **taille, casse, opacité** — graisse quasi unique | Décliner les niveaux par taille + opacité (`#DBD9D5` → `#9D9D9D`) plutôt que par bold |

Stacks cibles :

```css
--font-display: 'Shippori Mincho B1', 'Zen Old Mincho', 'Yu Mincho', serif;   /* titres, grands moments */
--font-body:    'Spectral', 'Noto Serif JP', Georgia, serif;                   /* corps, lore */
--font-ui:      'Spectral', 'Noto Serif JP', Georgia, serif;                   /* UI — même famille, corps 400 */
```

Notes de mise en œuvre : `npm run fonts:self-host` existe déjà — Spectral et Shippori Mincho B1 sont sur Google Fonts (self-host OK, licences libres). Spectral paraît plus petit que sa taille nominale : corps ≥ 18 px, éviter la graisse 300 sous 18 px (a11y, cf. doc 04). Les latins de Shippori couvrent le FR ; vérifier les diacritiques rares au moment du build.

## 4. Formes & chrome UI

| Actuel | Jeu | Verdict | Piste |
|---|---|---|---|
| `--radius-panel: 24–32px`, `card 16`, `chip 10`, `pill 999` | **Coins droits** partout (panneaux, slots carrés) ; aucune forme pill | 🔴 L'arrondi généreux est le marqueur « web moderne » le plus visible | Fidélité : `panel/card 0–4px`, `chip 2px`. Les pills (stack icons circularisés) peuvent rester une exception assumée — ou migrer vers des vignettes carrées type « slots d'inventaire » (très Bloodborne) |
| Panneaux `gradient-crypt/sanctum` (bruns chauds, texturés) | Panneaux **noir pur translucide** `rgba(0,0,0,.63–.75)`, sans texture | 🟡 | Chrome fonctionnel (modals, menus, tooltips) : noir translucide + `backdrop-filter` ; garder les gradients chauds pour le registre « monde » (§6) |
| `--border-gilded` (or, 1px, faible opacité) | Filets os/blanc 25–40 % + liserés laiton `#6F634B` | ✅ | Ajouter un filet « os » `rgb(219 217 213 / 0.3)` pour le chrome ; l'or reste pour l'« actif » |
| Focus/halo **doré**, hover halo sang | Sélection = **éclaircissement + halo froid pâle** (blanc-bleuté) | 🟡 Choix d'identité | Fidélité stricte : sélection claire et froide (moonlight désaturé) ; l'or peut rester l'« état actif » (cohérent avec l'or patiné du jeu), mais le focus clavier froid est plus juste |
| Slots/chips arrondis avec ombres | Slots carrés, fond vignetté radial, icône peinte | 🟡 | Pour projets/stack : vignettes carrées `radial-gradient` sombre — le pattern « icône d'objet » du doc 05 est un gabarit tout prêt |

## 5. Motion & effets

- **Durées** : 150–220 ms conviennent aux micro-interactions. Il manque le registre **théâtral** du jeu : fondus lents 1–2 s des grands moments (YOU DIED, entrées de zone). Ajouter `--duration-theatrical: 1200ms` (+ variante réduite via `prefers-reduced-motion`) pour les séquences d'ouverture, transitions de page, reveals de section.
- **Patrons fidèles** : apparition = fondu + très léger scale ; sélection = éclaircissement (pas de déplacement) ; grands messages = fondu d'entrée lent, plateau, fondu de sortie (patron CSS documenté doc 03/04).
- **Effets** : vignette ✅, grain ✅, brume dérivante ✅ (`mistDrift`) — déjà fidèles. Optionnel avancé : très légère **aberration chromatique périphérique** (filtre SVG sur les bords) — signature du post-process du jeu, à doser faiblement.
- **GSAP** : les séquences d'ouverture avec audio sont dans l'esprit « rituel » du jeu — conserver.

## 6. La règle des deux registres (clé de la fidélité web)

Le jeu sépare strictement : **chrome UI austère** / **monde ornemental**. Transposition :

- **Registre « chrome »** (nav, modals, formulaires, tooltips, toasts, listes) : noir translucide, filets 1 px, coins droits, Spectral, sélection lumineuse froide, zéro texture, zéro volute. → C'est là que le portfolio doit *retirer* de l'ornement pour gagner en fidélité.
- **Registre « monde »** (hero, séquences d'ouverture, têtes de section, cartes narratives, fonds de page, 404, illustrations) : là vivent les gradients chauds, textures parchemin/pierre, ornements victoriens (ferronnerie, remplages — sources domaine public au doc 07), gravures, runes originales, brume, lanternes. → C'est là que le portfolio peut *ajouter* de la matière Bloodborne.

Les primitives actuelles (`surface-crypt`, `cta-tome`, `text-engraved`…) ne sont pas à jeter : elles migrent vers le registre « monde » ; le chrome, lui, s'allège.

## 7. Sémantique des accents (mapping recommandé)

| Signal | Couleur (référence jeu) | Usage portfolio |
|---|---|---|
| Action / point d'intérêt | Ember `#D9822B` (halo `#FFB45C` en glow) | CTA, liens hover, dots |
| Actif / précieux | Or patiné `#9C7C4A` | Onglet actif, badge, filet « gilded » |
| Danger / critique / passion | Oxblood `#8A0303` | Erreurs, suppression, hover « agressif », halo rituel |
| Info / savoir / insight | Moonlight désaturé `#B0D1EA` (arcane `#7FD4C1` rare) | Infos, tooltips, liens visités, focus |
| Succès / accompli | Vert brume `#90D0A6` (« PREY SLAUGHTERED ») | Validations, états « terminé » — le vert du jeu est *spectral*, pas pomme |
| Neutre / désactivé | Ash `#9D9D9D` | Disabled, texte secondaire |

## 8. Plan de migration suggéré

1. **Quick wins (une session)** : désaturer `moonlight` ; aligner texte principal sur `#DBD9D5` ; introduire `#D9822B` comme ember de travail et réserver les oranges vifs aux glows ; ajouter `--tracking-engraved` et `--duration-theatrical`.
2. **Typo (le gros morceau)** : intégrer Spectral + Shippori Mincho B1 via `fonts:self-host`, basculer `--font-body`/`--font-ui`, puis `--font-display` ; re-régler tailles/interlignes (Spectral rend petit) ; passer la hiérarchie sur taille+opacité.
3. **Chrome** : réduire les radius du chrome fonctionnel, panneaux noirs translucides, filets os, focus froid.
4. **Monde** : enrichir les moments théâtraux (ornements domaine public, vignettes « icône d'objet » pour les projets, runes originales, patron « entrée de zone » pour les titres de page).
5. **Finitions** : familles optionnelles `mist`/`nightshade`, aberration chromatique légère, audit contraste (WCAG AA — seuils Lighthouse déjà en CI).

Chaque étape est compatible avec la règle « tout passe par tokens.css » : c'est une édition de tokens + primitives, pas une réécriture des composants.

## 9. Décisions à trancher (checklist)

- [ ] Posture A (fidélité) vs B (interprétation) — ou A avec exceptions listées.
- [ ] Une seule famille serif partout, ou sans-serif conservée pour le légal/micro ?
- [ ] Coins droits stricts, ou arrondi résiduel 2–4 px ?
- [ ] Les pills des icônes stack : conserver (exception charte) ou migrer en slots carrés ?
- [ ] Focus clavier : froid (fidèle) ou or (identité actuelle) ?
- [ ] Ajouter les familles `mist` / `nightshade` ?
- [ ] CTA : aplat ember actuel ou « fond sombre + liseré + texte ember » (fidèle) ?
