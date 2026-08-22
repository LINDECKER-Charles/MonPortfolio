# 02 — Couleur, lumière, matières

> FromSoftware n'a jamais publié de spécifications colorimétriques. Les HEX ci-dessous viennent soit de palettes communautaires extraites de captures (SchemeColor, color-hex, COLOURlovers — cohérentes entre elles mais non officielles), soit d'estimations d'après captures, signalées comme telles. Les seuls éléments premiers vérifiés sont les intentions de Miyazaki (sang « symbolique et pictural », ciel « paleblood » bleu très pâle, victorien lugubre façon Dracula).

## 1. La palette globale

- **Dominantes** : « gris sombres et bruns, ponctués d'éclats cramoisis » **[vérifié: Tech4Gamers]** ; couleurs « sombres et sales », ciel couvert, brouillard permanent, nuit ou crépuscule perpétuels **[analyse communautaire]**. Aucune vibrance — à l'exception notable des robes blanches de l'Église.
- **Saturation** : très faible sur ~90 % de l'image. Les albédos évitent le blanc pur et le noir pur pour laisser la lumière sculpter la scène. **[analyse communautaire: recréations d'artistes]**
- **Contraste** : contraste de **valeur** élevé (clair-obscur), contraste de **teinte** faible — c'est la pauvreté chromatique volontaire qui rend chaque accent lisible.
- **Température** : base froide (nuit bleu-gris, pierre neutre) réchauffée localement par le feu et le gaz — formule bleu/orange classique.
- **Répartition approximative [estimation]** : ~70–80 % valeurs sombres neutres (noir-brun, gris pierre) · ~15–20 % tons moyens froids (bleu-gris lunaire, brume) · ~5–10 % accents (rouge sang, orange feu, blanc ivoire, cyan arcane). Les accents saturés dépassent rarement quelques pourcents de la surface d'un écran.

### HEX sourcés (palettes communautaires)

| Source | Valeurs |
|---|---|
| SchemeColor « Bloodborne » | `#1A0B06` brun quasi-noir · `#34302F` charbon brun · `#7F3335` bordeaux éteint · `#9A1818` rouge profond · `#99585C` vieux rose poussiéreux · `#C5A8AA` taupe pâle |
| color-hex #7239 | `#131718` noir bleuté · `#414F36` olive sombre · `#63020C` bourgogne profond · `#90AE6E` vert sauge · `#B0D1EA` bleu pâle lunaire |
| COLOURlovers « bloodborne » | `#30302F` charbon · `#6C6B6B` gris acier · `#1D421E` vert marécage · `#42351D` brun terreux · `#27273D` bleu nuit |
| Pierre de Yharnam [estimation] | `#3E3A36` · `#57504A` · `#6B635A` (gris-brun mêlés de suie) |

## 2. Les accents et leur rôle sémantique

| Accent | Valeurs | Où dans le jeu | Ce que ça signale |
|---|---|---|---|
| **Rouge sang** — jamais vermillon ; oxblood/bourgogne tirant vers le brun | Gamme sourcée « Horror of Blood » : `#8A0303 → #740404 → #5E0505 → #480707 → #320808 → #1C0909` ; frais `#7A1010`, séché `#3E1510` [estimation] | Éclaboussures, pavés, bandages, fioles, barre de PV, iconographie de l'Église | Violence, ressource (échos), contamination, sacrement. Miyazaki : le sang ne doit pas révulser mais faire « craindre l'ennemi » **[vérifié: 4Gamer]** |
| **Orange feu / lanternes** | Cœur `#FFB45C`, halo `#D9822B`, braises `#D9622B` [estimation] | Réverbères, torches, brasiers de la Traque, Old Yharnam, checkpoints | Civilisation mourante, « brève sécurité trompeuse » **[vérifié: Tech4Gamers]**, purification par le feu, havre |
| **Or / laiton patiné** | Vieil or `#8A6E3A`, laiton `#9C7C4A`, reflets `#C9A25E` [estimation] | Encensoirs, lustres, ornements de la Grande Cathédrale, garnitures | Autorité et faste corrompu de la Healing Church, sacré déchu |
| **Bleu-gris lunaire** | `#B0D1EA` [sourcé] à `#8FA3B8` [estimation] | Toits, Byrgenwerth, Cainhurst, ciel nocturne | Le regard de la lune, le rêve, les Great Ones passifs |
| **Cyan / arcane** | Argent-bleu `#C9D8E8`, turquoise `#7FD4C1` (Holy Moonlight Sword) [estimation] | Outils cosmiques, Tonitrus, phantasmes, Ebrietas | Savoir interdit, cosmos, Insight |
| **Vert maladif** | Marécage `#1D421E` [sourcé], olive `#414F36` [sourcé], poison `#5A6B33` [estimation] | Forbidden Woods, jauges de poison, serpents | Corruption organique, maladie |
| **Blanc os / ivoire** | Fleurs et robes `#E8E4D8`, os `#D8CBB0` [estimation] | Robes de l'Église (le seul « blanc vibrant » du jeu), la Poupée, fleurs du Dream, ossements, Kos | Sacré ambigu, pureté suspecte, mort calme |
| **Violet pâle** | Yeux « échos volés » light purple **[vérifié: Fextralife]** ; prune Blood Moon `#632B58` [sourcé color-hex] | Ennemis ayant absorbé vos échos, lune de sang | Le seuil du cauchemar |

## 3. Les états du ciel

Quatre « fuseaux » scriptés, déclenchés par la progression **[vérifié: Fextralife « Moon Phases », bloodborne-wiki « Timezones »]** :

1. **Soir gris (début)** — ciel couvert gris-brun, lumière terne. `#8A8578` voilé, horizon `#B0A48E` [estimation].
2. **Coucher orangé** (après Gascoigne) — lune teintée orange. Ciel `#C97B3A`, halo `#E39A4C`, nuages `#7A5A44` [estimation].
3. **Nuit** (après Vicar Amelia) — lune blanche plus grosse et proche. Ciel `#1C2430`–`#2A3444`, lune `#E8E6D8` [estimation]. C'est le ciel « paleblood » : « un bleu très pâle, comme un corps vidé de son sang » **[vérifié: Miyazaki, Future Press]** — gris-bleu exsangue `#9FB4C4`/`#B8C4CC` [estimation].
4. **Blood Moon** (après Rom) — ciel rouge profond, Amygdalas visibles. Gamme communautaire : `#D64B4B → #BF3A55 → #903F5C → #7A3A64 → #632B58` [sourcé color-hex] ; in-game plus sombre : fond `#6E1F1F`, disque `#C4483C`, halo `#8A2E24` [estimation]. Détail : Forbidden Woods et Old Yharnam **gardent une lune blanche** pendant la Blood Moon **[vérifié: Fextralife]**.
5. **Hunter's Dream** (hors cycle) — crépuscule perpétuel doux, brume grise ; l'atelier **brûle** en fin de partie. **[vérifié: Fextralife]**

## 4. Palettes par zone

| Zone | Palette dominante [estimation sauf mention] |
|---|---|
| **Central Yharnam** | Pierre gris-brun `#3E3A36`/`#57504A`, boiseries sombres, pavés humides ; accents lanternes orange, sang, corbeaux. Froid/chaud ≈ 80/20 |
| **Old Yharnam** | La plus chaude du jeu : charbon `#241E1A`, bois calciné, braises `#D9622B`, fumée `#4A423C` |
| **Cathedral Ward** | Pierre plus claire et froide `#5A574F`, statues voilées, or patiné, bannières, nuit bleu-gris |
| **Hemwick** | Herbe morte `#5E5238`, brume grise, os `#D8CBB0`, feux de four sourds, ciel gris-lavande |
| **Forbidden Woods** | La seule zone « verte » : canopée `#2E3A26`, olive `#414F36` [sourcé], marécage `#1D421E` [sourcé], brouillard vert-gris |
| **Byrgenwerth** | Extérieur bleu lunaire argenté `#A9B8C6` sur lac noir ; intérieur bois `#5C4630`, parchemin, bougies `#E0A55A` |
| **Cainhurst** | La zone « hiver » : neige `#C7CCD4`, pierre gris-bleu `#4C5158`, ciel de tempête `#303845` ; intérieurs : velours pourpre, or terni, marbre |
| **Yahar'gul** | Pierre noire-indigo `#20202E`, chaînes, cloches ; sous Blood Moon : contre-jours rouges permanents `#6E1F1F` |
| **Nightmare of Mensis** | Brun-pourpre orageux `#3A2028`, pierre noire, éclat malsain gris-blanc du « projecteur » de la Brain |
| **Fishing Hamlet (DLC)** | La plus désaturée, « aquarelle » : brume gris-vert `#8C9A96`, eau teal `#4F6B6A`, bois flotté `#6B5D4C`, ciel laiteux, Kos pâle `#C8C4B8` |
| **Hunter's Dream** | Le contrepoint chaleureux : crépuscule lavande `#6E6C7E`, lanternes chaudes `#E0A55A`, bois brun, fleurs blanches `#E8E4D8`, brume douce |

## 5. La lumière

- **Sources** : lune (key light directionnelle froide), lampes à gaz, torches portées, bougies et lustres, brasiers, encensoirs, fours, phare du Hamlet, « projecteur » organique de la Brain of Mensis.
- **Qualité** : clair-obscur assumé ; la lune projette des « ombres longues et menaçantes » **[vérifié: Tech4Gamers]** ; flammes dures et vacillantes ; bougies douces et locales. Les recréations utilisent une lumière directionnelle faible et un éclairage « dur et désaturé ». **[analyse communautaire: Experience Points, 80.lv]**
- **Brouillard / volumétrie** : brume omniprésente qui découpe la profondeur en plans et « agrandit » l'espace ; volumétrie discrète dans les rais lunaires ; les arrière-plans se noient dans l'ombre.
- **Silhouettes / contre-jour** : flèches, pinacles et gibets découpés en noir sur la lune ; PNJ aux fenêtres réduits à des silhouettes orangées. **Le skyline est le motif graphique.**
- **Vignettage** : naturel (rues étroites et hautes = cadre sombre permanent) + post-process : le jeu applique une **aberration chromatique en périphérie** et un **grain de film**. **[analyse communautaire: ResetEra/TafferKing451, Polycount]**

## 6. Matières et textures

Principe : albédos dans une plage de valeurs resserrée, **spécularité faible et rugosité élevée presque partout** — la lumière modèle, les matériaux absorbent. **[analyse communautaire: études de recréation]**

| Matière | Rendu |
|---|---|
| Pierre taillée sombre | Mate, jointoyée, noircie de suie, mousses discrètes ; pinacles, crockets, remplages |
| Pavés humides | Le seul « miroir » des rues : flaques dans les creux, reflets étirés des lanternes |
| Fer forgé | Grilles, fers de lance, chaînes — noir mat `#1E1C1A`, arêtes à peine polies, rouille ponctuelle |
| Laiton / or patiné | Encensoirs, lustres, reliquaires — métal jauni, spéculaire cassé, hautes lumières chaudes près des flammes uniquement |
| Bois vieilli | Brun grisé, fil marqué, désaturé |
| Cuir usé | Brun-noir mat, plis lustrés aux zones de frottement seulement |
| Feutre / velours / drap | Absorption quasi totale — silhouettes mates (redingotes, capes, velours pourpre de Cainhurst) |
| Plumes | Noir à micro-iridescence froide (Eileen, corbeaux) |
| Os / ivoire | Blanc jauni mat `#D8CBB0` |
| Parchemin / papier | Beige gris `#C9BFA8` — la teinte des textes du jeu |
| Sang | Frais `#7A1010` légèrement brillant → sec `#3E1510` mat |
| Fourrure | Gris-brun hirsute, touffes agglutinées |
| Coraux / bernacles (DLC) | Croûtes gris-vert sur bois flotté |

## 7. VFX de couleur

- **Échos de sang** : rouge sombre ; tache de sang lumineuse au sol à la mort ; l'ennemi qui a absorbé vos échos a les **yeux violet pâle** **[vérifié: Fextralife]**.
- **Arcane** : blanc-argent / bleu pâle `#C9D8E8` (Augur d'Ebrietas, A Call Beyond) ; **Holy Moonlight Sword** : turquoise `#7FD4C1` [estimation].
- **Feu** : orange saturé `#F08A2E` + fumée noire — l'accent le plus chaud et le plus saturé du jeu.
- **Foudre** : bleu-blanc électrique `#9FD8F0`.
- **Poison** : vert jaunâtre `#8A9A3C`.
- **Frenzy** : crépitement gris-blanc, éclat rouge à l'explosion.
- **HUD** : PV rouge sang `#B01818`, endurance vert mousse `#7A9A3C`, texte blanc cassé [estimation — cf. doc 04 pour les valeurs vérifiées].

## Synthèse exploitable

Fond quasi-noir brun `#1A0B06`–`#131718` · surfaces gris pierre `#34302F`/`#57504A` · texte parchemin `#C9BFA8`–`#C5A8AA` · accent primaire oxblood `#8A0303`/`#63020C` (jamais vif) · accent secondaire orange lanterne `#D9822B` réservé aux points d'intérêt · accent froid rare bleu lunaire `#B0D1EA` ou turquoise arcane `#7FD4C1` · saturation basse, fort contraste de valeur, vignettage et brume.

## Sources principales

- SchemeColor « Bloodborne » — https://www.schemecolor.com/bloodborne.php ; « Horror of Blood » — https://www.schemecolor.com/horror-of-blood.php
- color-hex, palettes #7239 et #33534 (Blood Moon) — https://www.color-hex.com/color-palette/7239 ; https://www.color-hex.com/color-palette/33534
- COLOURlovers « bloodborne » — https://www.colourlovers.com/palette/4915798/bloodborne
- Tech4Gamers, « Bloodborne's Atmosphere and Gothic World Are Breathtaking » — https://tech4gamers.com/bloodborne-art-style-breathtaking/
- Interview Miyazaki, guide Future Press (« paleblood sky ») — http://soulslore.wikidot.com/bb-future-press-guide-interview
- Interview 4Gamer (sang symbolique) — https://www.neogaf.com/threads/bloodborne-4gamer-interview-with-hidetaka-miyazaki-fully-translated.840059/
- Fextralife « Moon Phases », « Hunter's Dream », « Blood Echoes », « Arcane » — https://bloodborne.wiki.fextralife.com/Moon+Phases
- Fandom : pages de zones (Old Yharnam, Forbidden Woods, Fishing Hamlet, Nightmare of Mensis…) — https://bloodborne.fandom.com/
- 80 Level, « Studying Set Dressing of Bloodborne with UE4 » — https://80.lv/articles/studying-set-dressing-of-bloodborne-with-ue4
- Experience Points, « Marcin Wiech: Creating A Gothic Horror In Unreal Engine » — https://www.exp-points.com/marcin-wiech-creating-a-gothic-horror-in-unreal-engine
- Polycount, « Bloodborne Workshop Environment Study » — https://polycount.com/discussion/156329/bloodborne-workshop-environment-study
- Art History Fantastics, « Bloodborne, Evil and Gothic Styles » — https://arthistoryfantastics.com/en/aotwplus-008/
