# 04 — Interface : anatomie du HUD, menus, langage ornemental

> Verdict central de la recherche : **l'UI de Bloodborne est austère et minimale**. La matière gothique est dans le *monde* et dans les *icônes peintes*, pas dans le chrome de l'interface. Panneaux noirs translucides, filets de 1 px, coins droits, aucune volute sur les cadres. Une transposition web fidèle doit résister à la tentation d'ornementer l'interface elle-même.

## 1. Anatomie du HUD

Disposition persistante, minimale — pas de boussole, pas de minimap, pas de quêtes à l'écran. **[vérifié: Game UI Database ; Game Developer « The Usability of Bloodborne »]**

### Haut-gauche — jauges
- **Barre de PV** : fine barre horizontale rouge. À la prise de dégâts, « une barre verticale blanche apparaît sur la jauge » marquant le niveau actuel **[vérifié: Gamer Guides]** ; la portion perdue devient **orange** pendant la fenêtre de Rally/Regain (santé récupérable en frappant) **[vérifié: bloodborne.wikidot « Rally »]**.
- **Barre d'endurance** verte, juste dessous, même gabarit.
- Forme : barres très fines (~6–8 px à 1080p), remplissage sur fond sombre, **cadre métallique discret gris-argent à micro-biseau**, minuscule renflement à l'extrémité gauche — pas de gros ornements. **[analyse communautaire]**
- Remplissages [estimation, non documentés officiellement] : PV `#9E1B1B → #6E0F0F` en léger dégradé, endurance `~#6E8F3B`, portion rally `~#C97A2B`.
- Icônes d'états (poison, frénésie, huile, beasthood…) : petites vignettes carrées alignées sous les jauges. **[vérifié: Bloodborne Wiki « HUD Icons »]**

### Haut-droite — compteurs
- **Échos de sang** dans le coin supérieur droit, **Insight juste en dessous** (petit sigle « œil » pâle). **[vérifié: PlayStation Blog officiel]** ⚠️ Différence avec Dark Souls (âmes en bas à droite) — à respecter pour la fidélité.
- Style : nombre serif blanc os aligné à droite dans une petite plaque sombre translucide à liseré fin. **[analyse communautaire]**

### Bas-gauche — équipement
- Compteurs de **balles de mercure** (haut) et **fioles de sang** (bas) : icône + nombre ; dessous, le « **point jaune** » : contour gris = arme en mode principal, rempli jaune = mode transformé. **[vérifié: VideoGamer]**
- Slots d'armes/objet rapide : vignettes sur pastilles sombres translucides à fin liseré clair ; l'affichage reste discret et ne s'anime qu'au changement (d-pad). **[analyse communautaire]**

### Bas-centre — barre de boss
- Longue barre fine (~1360 px de large sur base 720p — presque toute la largeur), remplissage rouge sur base sombre, **embouts ornementaux aux deux extrémités** (pièces « cap » distinctes), nom du boss au-dessus à gauche, dégâts à droite. **[vérifié: code + assets du FromSoft Image Macro Creator]**

## 2. Menus et écrans

Écrans catalogués : title, main menu, load, character creator, inventaire, level up, boutique, dialogue, notes, settings, loading, « Prey slaughtered », « You died ». **[vérifié: Interface In Game ; Game UI Database]**

- **Écran titre** : logo centré (lettrage érodé blanc os) sur fond sombre brumeux, « Press any button » en petit serif dessous.
- **Menu principal** : liste verticale centrée en Title Case ; l'option sélectionnée s'éclaircit (lueur), les autres restent gris moyen ; aucun panneau lourd.
- **Menus in-game** : le jeu ne se met jamais en pause ; navigation exclusivement au d-pad — cohérence relevée comme force d'usabilité. **[vérifié: Game Developer]**
- **Inventaire** : grille de **slots carrés** (vignettes peintes, style skeuomorphe **[vérifié: tags Game UI Database]**) sur **panneau noir translucide ~60–65 %** (valeurs `#000000A1`/`#000000A2` dans la recréation Noxde **[vérifié: code]**) ; liseré fin clair + halo pâle sur le slot sélectionné (la recréation utilise `#679AFF` et une bordure 2 px pour l'état sélectionné **[vérifié: code]** — approximation de la lueur froide du jeu) ; onglets de catégories à icônes en haut ; panneau de détail à droite ; légende des boutons en bande inférieure.
- **Description d'objet** : nom en tête (corps plus grand), ligne de catégorie, **filet horizontal fin**, grande icône à gauche dans un cadre discret, stats chiffrées, puis **texte de lore** en petit serif, interligne généreux, gris plus doux que le nom.
- **Fiche personnage / level up** : stats en deux colonnes (libellé gauche, valeur droite), séparateurs en filets fins translucides ; prévisualisations : hausse en **bleu**, baisse en **rouge** (convention FromSoft).
- **Boutiques** : liste verticale avec prix à droite, panneau de description en vis-à-vis, sélecteur de quantité en overlay centré à liseré fin.
- **Écrans de chargement** : fond sombre, nom de l'élément + **icône d'objet et description de lore** — ajoutés par le patch 1.03. **[vérifié: notes de patch]**
- **Notes/messages** : panneau horizontal sombre translucide centré, texte serif clair ; écriture par assemblage de gabarits de phrases.
- **Choix de dialogue** : boîte centrée en bas, deux options empilées dans des bandes fines, l'option active éclaircie.
- **Feedbacks** : messages plein écran pour les événements clés, popups d'acquisition persistants jusqu'à confirmation, animation de chargement qui pulse. **[vérifié: Game Developer]**

## 3. Le langage ornemental réel de l'UI

- **Panneaux** : rectangles noirs translucides (~60–75 %), sans texture visible, **coins droits** — pas d'arrondi marqué, pas de coins ornés.
- **Bordures** : filets ~1 px, blanc/os à faible opacité (~25–40 %) ; parfois double niveau (bord externe sombre + liseré interne clair) = très léger effet gravé. La recréation Noxde utilise un liseré brun-laiton `#6F634B` pour les rails de scrollbar. **[vérifié: code]**
- **Séparateurs** : filets horizontaux fins translucides.
- **Curseur de sélection** : pas de pointeur ornemental — la sélection est un **état lumineux** : bande/slot éclairci, liseré pâle, léger halo froid.
- **Scrollbars** : rail fin vertical bordé, pouce clair étroit.
- **Les seuls ornements réels, localisés** : embouts sculptés de la barre de boss ; croix de filets + tache d'encre des noms de zone ; micro-terminaisons des jauges. **C'est tout** — pas de cadres à volutes dans les menus.
- **Palette UI vérifiée** (extraite des recréations fidèles) : texte principal `#DBD9D5`, secondaire `#9D9D9D` **[vérifié: code Noxde]** ; nom de zone `#CACBCA`, boss `#C0C0BD` **[vérifié: code rezuaq]** ; accents : rouge PV, vert brume `#90D0A6`, orange rally, jaune indicateur de forme, halo froid de sélection.
- Tags Game UI Database : « 3D Realistic / Skeuomorphic / Fantasy » — le skeuomorphisme porte sur les **icônes peintes**, posées sur un chrome plat et sobre. **[vérifié]**

## 4. Recréations web et fichiers exploitables

| Projet | Intérêt |
|---|---|
| **FromSoft Image Macro Creator** — https://rezuaq.be/new-area/image-creator/ (code : github.com/Sibert-Aerts/sibert-aerts.github.io) | La meilleure référence : messages plein écran BB/DS/Sekiro/ER pixel-fidèles, noms de zone (tache d'encre + filets), barre de boss avec textures. Source de toutes les valeurs chiffrées du doc 03 |
| **Bloodborne Save Editor** — https://github.com/Noxde/Bloodborne-save-editor | Recrée inventaire/menus avec assets et la police extraite `A-OTF-ReimPr6-Medium` ; mine de valeurs CSS (panneaux, scrollbars, sélection) |
| **Bloodborne UI Case Study (Figma)** — https://www.figma.com/community/file/1324779949340768558/bloodborne-ui-case-study | Composants UI recréés, styles de couleur et de texte, variantes, prototype animé — directement exploitable |
| Gist « Dark Souls-style YOU DIED popup » — https://gist.github.com/JacopoWolf/328f7224750d962146bd5b57788cdda3 | Patron d'animation CSS transposable (fade-in 15 %, plateau, fade-out avec léger scale) |
| Mods de référence visuelle | DS3 « Bloodborne HUD and menus » (nexusmods #514), DS3 « BB Style Boss Healthbars » (#1352), Elden Ring « Bloodborne HUD » (#7670) |

Constat utile : **aucune recréation CSS complète du HUD Bloodborne** (barres + compteurs) n'existe sur CodePen/GitHub — c'est un espace libre.

## 5. Accessibilité d'une transposition web

Ratios WCAG calculés sur fond `#1A1A1A` (panneau translucide sur scène sombre) à partir des couleurs vérifiées :

| Usage | Couleur | Ratio | Verdict |
|---|---|---|---|
| Texte principal (os) | `#DBD9D5` | ≈ 12.3:1 | AAA tous corps |
| Texte secondaire | `#9D9D9D` | ≈ 6.4:1 | AA tous corps |
| Nom de zone | `#CACBCA` | ≈ 10.6:1 | AAA |
| « PREY SLAUGHTERED » | `#90D0A6` | ≈ 9.7:1 | AAA |
| « YOU DIED » | `#FF0000` | ≈ 4.3:1 | AA **texte large uniquement** — jamais en petit corps |

- ⚠️ En jeu, les gros messages sont à **26–50 % d'opacité** + halo : garder cette opacité sur le web casse le contraste réel — réserver l'effet au décoratif (`aria-hidden` + doublon accessible), ou remonter l'opacité.
- ⚠️ Fond translucide : `rgba(0,0,0,.63)` sur image claire peut faire chuter les ratios — prévoir `backdrop-filter: brightness(.6)` ou opacité ≥ .75 sous le texte courant.
- **Tailles** : le jeu est notoirement trop petit (mods correctifs) ; ne pas reproduire les ~12 px apparents. Web : corps ≥ 16–18 px (Spectral Light paraît plus petit que sa taille nominale : viser 18 px / interligne 1.6), éviter `font-weight: 300` sous 18 px.
- `prefers-reduced-motion` pour les fondus théâtraux ; ne pas coder l'info par la couleur seule (rally orange → ajouter motif/label) ; le d-pad-only du jeu se traduit en web par une **navigation clavier complète** — le halo de sélection BB fait un excellent `:focus-visible`.

## Sources principales

- Game UI Database — Bloodborne (id 33) — https://www.gameuidatabase.com/gameData.php?id=33
- Interface In Game — Bloodborne (23 captures) — https://interfaceingame.com/games/bloodborne/
- Game Developer, « The Usability of Bloodborne » — https://www.gamedeveloper.com/design/the-usability-of-bloodborne
- PlayStation Blog, « Bloodborne: 24 Tips for Survival » (position échos/insight) — https://blog.playstation.com/2015/03/23/bloodborne-24-tips-for-survival/
- Gamer Guides (jauge PV) — https://www.gamerguides.com/bloodborne/guide/basics/gameplay/general-information/blood-echoes-and-leveling-up
- bloodborne.wikidot, « Rally » — http://bloodborne.wikidot.com/rally
- VideoGamer, « What's the yellow dot? » — https://www.videogamer.com/guides/bloodborne-guide-whats-the-yellow-dot/
- Bloodborne Wiki, « HUD Icons » — https://www.bloodborne-wiki.com/2017/04/hud-icons.html
- Noxde / Bloodborne-save-editor — https://github.com/Noxde/Bloodborne-save-editor
- FromSoft Image Macro Creator — https://rezuaq.be/new-area/image-creator/
- Fextralife, « Patch Notes v1.03 » — https://bloodborne.wiki.fextralife.com/Patch+Notes+v1.03
- Game Accessibility Guidelines (taille minimale) — https://gameaccessibilityguidelines.com/use-an-easily-readable-default-font-size/
- Figma community, « Bloodborne UI Case Study » — https://www.figma.com/community/file/1324779949340768558/bloodborne-ui-case-study
