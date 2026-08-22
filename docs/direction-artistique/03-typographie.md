# 03 — Typographie

> Le point le plus contre-intuitif de tout le dossier : **la typographie de Bloodborne n'est PAS un Garamond**, et encore moins un Trajan. C'est le latin d'un Minchō japonais. Ce chapitre documente l'identification, puis évalue les équivalents web.

## 1. La vraie police de l'UI (menus, HUD, descriptions — version occidentale)

- **Identification la plus solide : Morisawa Reimin (黎ミン / « Rei Min »), graisse Medium, jeu Pr6** — un Minchō japonais dont les **glyphes latins intégrés** servent tout le texte occidental.
  - Un datamining du jeu cité sur le forum dafont identifie « 黎ミンY10 R » (Rei Min, Morisawa). **[analyse communautaire, via datamine]**
  - Corroboration indépendante forte : le **Bloodborne Save Editor** (Noxde, React/Tauri), qui recrée l'UI avec des assets extraits, embarque le fichier **`A-OTF-ReimPr6-Medium.otf`** comme police unique de son interface. **[vérifié: code source du repo]**
  - Reimin est une famille Minchō de Morisawa en 8 graisses, dessinée par Hideyuki Oda. **[vérifié: Fonts In Use / Morisawa]** Fonts In Use ne liste pas Bloodborne comme usage documenté — l'identification reste communautaire, mais doublement corroborée.
- **Conséquence clé : ce n'est pas un Garamond.** Le latin de Reimin est un « Mincho-Latin » : **contraste plein/délié élevé, empattements fins, aigus, quasi triangulaires, axe presque vertical, dessin légèrement étroit et « gravé »**. C'est pour ça que l'œil occidental hésite entre « Garamond » et « Times » sans jamais trouver. Les threads d'identification demandant « quelle est la police des menus » sont restés sans réponse pendant des années.
- **Une seule famille pour tout le jeu** : la police est embarquée par langue dans `menu/[langue]/font.gfx` (Scaleform GFx) — menus, HUD, descriptions, dialogues utilisent la même fonte ; les variations sont de **taille, casse, opacité et couleur**, jamais de changement de famille ni (quasiment) de graisse. **[vérifié: tutoriels de modding Nexus]**
- **Casse et traitement** **[analyse communautaire, constant sur toutes les captures]** :
  - Options de menus, noms d'objets, stats : **Title Case** (mixte) — jamais de petites capitales.
  - Gros messages plein écran : **CAPITALES espacées**.
  - Graisse unique perçue ~Medium ; hiérarchie par taille et opacité, pas par bold.
  - Interlettrage légèrement positif partout (~0.02–0.05 em), interlignage aéré dans les descriptions.

## 2. Le logo « BLOODBORNE »

- **Lettrage custom, pas une police du commerce.** **[analyse communautaire: forum dafont — « custom made for the game only »]**
- Substituts cités : **Waltari** (payante, « la plus proche »), **Augusta** (gratuite) ; recréation fan « Fresh And Blood » (distribuée aussi sous le nom « Flesh And Blood »). 1000logos le décrit comme un « designer typeface aux contours gothiques » proche de Mezalia / Vinque Antique. **[vérifié: FontLot, 1000logos]**
- **À écarter** : Bank Gothic (géométrique sans empattements — rien à voir) et **Trajan/Cinzel** (capitales inscriptionnelles romaines ; le logo est un serif gothique/victorien, pas des capitales Trajan).
- Traitement : capitales serif anguleuses, hampes légèrement irrégulières, **texture érodée/encrée** (grain de gravure, bords rongés), blanc os sur fond noir.

## 3. Messages plein écran — valeurs exactes

Valeurs issues du code du **FromSoft Image Macro Creator** (rezuaq.be, open source), recréation pixel-fidèle de référence, base canvas ~1280×720. **[vérifié: code source layerTypes.js / drawFunctions.js]**

| Écran | Police (stack du projet) | Taille | Graisse | Échelle vert. | Interlettre | Couleur (opacité) | Halo |
|---|---|---|---|---|---|---|---|
| **YOU DIED** | Kozuka Mincho Pro → Yu Mincho → Georgia | 139 px | 500 | 0.922 (écrasé) | 6 px (~0.043 em) | `#FF0000` à **30 %** | `#951818`, blur 22, multi-passes additives |
| **PREY SLAUGHTERED** | idem | 139 px | 500 | 0.922 | 6 px | `#90D0A6` à **50 %** | même teinte, blur 17 |
| **NIGHTMARE SLAIN** | idem | 115 px | 500 | 1.12 | 2 px | `#FF3300` à **26 %** | `#9C2D11`, blur 12 |

- Position : bande centrée, **légèrement au-dessus du centre vertical** (yOffset ≈ −93 px à 720p).
- Le rendu « lueur de brume » = texte quasi transparent + halos de même teinte empilés en mode additif. En CSS : couleur `rgba()` faible + plusieurs `text-shadow` superposés.
- Comparaison utile : les « YOU DIED » de Dark Souls utilisent **Adobe Garamond Pro**, rouge sombre `#640A0A` — Bloodborne se distingue par le Minchō, le rouge translucide et le halo. **[vérifié: même code]**
- Animation : assombrissement, fondu d'entrée lent (~1–2 s), maintien, fondu de sortie ; « PREY SLAUGHTERED » avec brume claire montante. **[analyse communautaire + patrons CSS existants]**

## 4. Autres textes du jeu

- **Nom de zone** (à l'entrée d'un lieu) : rendu de référence en **Spectral Light (300), 42 px, échelle vert. 1.058, Title Case, `#CACBCA`**, aligné sur une petite **croix de filets blancs**, posé sur une **tache d'encre translucide**, dans le tiers inférieur gauche. **[vérifié: code rezuaq + assets]**
- **Barre de boss** : nom en **Spectral Regular (400), 28 px, `#C0C0BD`**, au-dessus de la barre à gauche ; dégâts à droite avec ombre portée. **[vérifié: code rezuaq]**
- **Chiffres du HUD** : chiffres serif de la même fonte, fins et contrastés, blanc os, fine ombre noire. **[analyse communautaire]**
- **Descriptions d'objets, sous-titres** : même serif, petit corps, blanc cassé sur panneau noir translucide (la petitesse du texte original est notoire — des mods existent pour l'agrandir). **[vérifié: Nexus #441]**

## 5. Équivalents Google Fonts / open source — évaluation

Cible = latin Minchō de Reimin : contraste élevé, empattements fins et aigus, axe vertical, dessin un peu condensé, froid, « gravé ».

### Recommandés

| Police | Verdict | Usage |
|---|---|---|
| **Spectral** (Light 300 / Regular 400) | ✅ Le meilleur proxy Google Fonts : contraste marqué, empattements fins et anguleux, axe vertical, dessin légèrement étroit. C'est le choix effectif de la recréation de référence pour le texte UI Bloodborne **[vérifié: code rezuaq]** | Menus, corps, noms, stats, descriptions |
| **Shippori Mincho / Shippori Mincho B1** (500–600) | ✅ Latin authentiquement Minchō — le vrai « goût » de YOU DIED ; substitut libre de Kozuka Mincho Pro | Titrage, messages plein écran, gros caps |
| **Zen Old Mincho** | ✅ Alternative Minchō Google Fonts, latin plus classique | Titres |
| **Noto Serif JP** | ✅ Correct partout (latin minchō-isé) ; moins raffiné que Spectral en corps latin | Fallback |

### À éviter (et pourquoi)

| Police | Verdict |
|---|---|
| **Cormorant / Cormorant Garamond** | ⚠️ Moyennement fidèle : la finesse évoque l'ambiance à grande taille, mais le squelette est un Garalde français chaud ≠ Minchō. (La recréation de référence l'utilise pour… Demon's Souls.) Repli décoratif acceptable |
| **EB Garamond** | ❌ Pour Bloodborne (trop rond, contraste bas, chaleur renaissance). ✅ En revanche pour un style **Dark Souls** (qui utilise réellement Adobe Garamond) |
| **Crimson Pro** | ❌ Trop doux, empattements ronds |
| **Sorts Mill Goudy** | ❌ Rondeur Goudy américaine 1900, étrangère au jeu |
| **Cardo** | ❌ Bembo humaniste chaleureux : mauvais registre |
| **IM Fell** (toutes variantes) | ❌ Contresens fréquent : l'UI de Bloodborne est **propre et nette** ; la patine « vieux livre » d'IM Fell ne correspond qu'à l'esprit du logo, pas au texte |
| **Cinzel** | ❌ Trajan-like : ni le logo ni l'UI. À réserver aux pastiches gréco-romains (plus proche d'Elden Ring — qui utilise en réalité Agmena Pro) |
| Toute **sans-serif** (Inter, etc.) | ❌ N'existe nulle part dans le jeu — l'UI entière est serif |

### Stacks CSS suggérées [estimation raisonnée]

```css
/* Corps / UI */
font-family: 'Spectral', 'Noto Serif JP', 'Yu Mincho', Georgia, serif;
font-weight: 300–400;
letter-spacing: 0.02em;

/* Titrage / messages plein écran */
font-family: 'Shippori Mincho B1', 'Zen Old Mincho', 'Kozuka Mincho Pro', 'Yu Mincho', serif;
font-weight: 500;
text-transform: uppercase;
letter-spacing: 0.045em;
transform: scaleY(0.92);
```

## 6. Ce qui est / n'est pas « Bloodborne » en typo — mémo

- ✅ Une seule famille serif à fort contraste, hiérarchie par taille/casse/opacité.
- ✅ Title Case pour l'UI, CAPITALES espacées écrasées verticalement pour les grands moments.
- ✅ Couleurs de texte : blanc os `#DBD9D5`, secondaire `#9D9D9D`, zone `#CACBCA` (valeurs extraites de recréations fidèles — cf. doc 04).
- ❌ Garamond partout (c'est Dark Souls), petites capitales, ornements typographiques, drop caps enluminées, sans-serif, gras pour hiérarchiser, lettrage « distressed » sur le corps de texte (réservé au logo).

## Sources principales

- dafont forum #403812 « Bloodborne font » (datamine Rei Min) — https://www.dafont.com/forum/read/403812/bloodborne-font
- dafont forum #169438 (logo custom, substituts) — https://www.dafont.com/forum/read/169438/bloodborne-game
- dafont forum #363535 (menu font, resté sans réponse) — https://www.dafont.com/forum/read/363535/bloodborne-s-menu-screen-and-item-description-font
- Noxde / Bloodborne-save-editor (police `A-OTF-ReimPr6-Medium.otf`, couleurs UI) — https://github.com/Noxde/Bloodborne-save-editor
- FromSoft Image Macro Creator (rezuaq.be) + code source — https://rezuaq.be/new-area/image-creator/ ; https://github.com/Sibert-Aerts/sibert-aerts.github.io/tree/master/new-area/image-creator
- Fonts In Use — Reimin — https://fontsinuse.com/typefaces/152130/reimin ; Morisawa, spécimens Reimin — https://en.morisawa.co.jp/fonts/specimen/2670
- Nexus Mods Bloodborne #91 (Custom Font Sets, structure font.gfx), #439, #441 — https://www.nexusmods.com/bloodborne/mods/91
- 1000logos, « Bloodborne Logo » — https://1000logos.net/bloodborne-logo/ ; FontLot — https://fontlot.com/f6/bloodborne-game-font/
- Hypertexthero, « Video game fonts » (Elden Ring = Agmena Pro) — https://hypertexthero.com/video-game-fonts/
- Wikipedia, « Garamond » (différenciation des Garamond) — https://en.wikipedia.org/wiki/Garamond
