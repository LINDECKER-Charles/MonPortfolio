# Direction artistique Bloodborne — dossier de référence

> Dossier de recherche graphique sur la DA de **Bloodborne** (FromSoftware / SIE Japan Studio, 2015), destiné à guider la refonte de la charte graphique et du design system du portfolio. Objectif : comprendre ce qui fait *réellement* la direction artistique du jeu, pour pouvoir la représenter fidèlement — au moment de choisir couleurs, typographies, icônes, images et composants.

## Comment lire ce dossier

Chaque affirmation importante est étiquetée selon sa fiabilité :

| Étiquette | Sens |
|---|---|
| **[vérifié: source]** | Fait sourcé directement (interview développeur, code source d'une recréation fidèle, texte in-game, wiki de référence) |
| **[analyse communautaire]** | Consensus de fans / analyses convergentes, non officiel |
| **[estimation]** | Approximation raisonnée (souvent des HEX échantillonnés sur captures) — à valider à la pipette si besoin de précision absolue |

FromSoftware n'a jamais publié de spécification officielle de sa DA ni de son UI : tout ce dossier est une **reconstruction** à partir de sources primaires (interviews de Miyazaki, textes du jeu, fichiers extraits) et d'analyses communautaires sérieuses.

## Sommaire

| Document | Contenu |
|---|---|
| [01 — Fondations](01-fondations.md) | Univers, influences architecturales et littéraires, piliers thématiques, progression gothique → cosmique, processus créatif |
| [02 — Couleur, lumière, matières](02-couleur-lumiere-matieres.md) | Palette globale et accents sémantiques (HEX), états du ciel, palettes par zone, lumière, matières, VFX |
| [03 — Typographie](03-typographie.md) | La vraie police du jeu (et pourquoi ce n'est PAS un Garamond), le logo, les messages plein écran (valeurs exactes), équivalents Google Fonts évalués |
| [04 — Interface (UI)](04-interface-ui.md) | Anatomie du HUD, menus et écrans, langage ornemental réel (austère), recréations web existantes, accessibilité |
| [05 — Iconographie & motifs](05-iconographie-motifs.md) | Runes Caryll, marques et emblèmes, style des icônes d'objets, motifs récurrents et leur symbolique, styles historiques |
| [06 — Application au portfolio](06-application-portfolio.md) | Analyse d'écart entre la DA réelle du jeu et `tokens.css` / primitives actuels, recommandations concrètes, plan de migration |
| [07 — Ressources & recherche d'assets](07-ressources-recherche-assets.md) | Icônes (noms exacts game-icons.net), textures CC0, gravures et ornements domaine public, polices, mots-clés de recherche FR/EN, garde-fous légaux |

## Les 10 règles d'or de la DA Bloodborne

Synthèse opérationnelle de tout le dossier — le « test de fidélité » à appliquer à chaque décision de design :

1. **La valeur avant la teinte.** Le contraste est un clair-obscur (ombres denses vs halos de lumière), pas un contraste de couleurs. ~70–80 % de l'image est sombre et neutre.
2. **Saturation basse partout, accents rares.** La variété chromatique est volontairement pauvre ; un accent saturé occupe quelques pourcents de la surface, jamais plus.
3. **Le rouge n'est jamais vif.** Le sang est oxblood/bourgogne tirant vers le brun (`#8A0303` → `#320808`), « symbolique et pictural » selon Miyazaki — pas un rouge pur agressif.
4. **Une seule famille typographique, serif.** Tout le jeu (menus, HUD, lore) tient dans une seule fonte serif à fort contraste ; la hiérarchie vient de la taille, de la casse et de l'opacité — pas du gras, et jamais d'une sans-serif.
5. **Le chrome UI est austère.** Panneaux noirs translucides, filets clairs de 1 px, coins droits, aucune volute sur les cadres. L'ornement vit dans le *monde* et les *icônes*, pas dans l'interface.
6. **Nuit froide, points chauds.** Formule bleu/orange : base froide (lune, pierre, brume) réchauffée localement par lanternes, torches et braises qui guident l'œil.
7. **Matières mates.** Pierre, feutre, cuir, bois absorbent la lumière ; le spéculaire est rare (pavés humides, laiton près des flammes) et donc précieux.
8. **Vignette, brume, grain.** Le rendu passe par le post-process : vignettage (rues étroites + post), brouillard qui étage la profondeur, grain de film, légère aberration chromatique en périphérie.
9. **Les glyphes sont organiques et asymétriques.** Runes Caryll : traits d'encre manuscrits à épaisseur variable, boucles et croissants, jamais de géométrie régulière ni de symétrie.
10. **La beauté déchue.** Opulence victorienne + usure, toujours ensemble (« ruined opulence ») : dorures ternies, velours élimés, statues voilées. Miyazaki vise « la tristesse d'une chose magnifique condamnée à la ruine », pas le dégoût.

## La palette en une phrase

Fond quasi-noir brun `#1A0B06`–`#131718`, surfaces gris pierre `#34302F`/`#57504A`, texte parchemin-os `#DBD9D5`/`#C9BFA8`, accent primaire oxblood `#8A0303` (jamais vif), accent secondaire orange lanterne `#D9822B` réservé aux points d'intérêt, accent froid rare bleu lunaire `#B0D1EA` ou turquoise arcane `#7FD4C1` ; saturation globale basse, fort contraste de valeur, vignettage et brume.

## Provenance

Dossier compilé le 22/08/2026 à partir de recherches web parallèles (interviews, wikis, Game UI Database, code source de recréations fidèles, banques d'assets). Les sources détaillées figurent en fin de chaque document.
