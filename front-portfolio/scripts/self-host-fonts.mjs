/**
 * Auto-hébergement des polices Google (RGPD + CSP stricte `font-src 'self'`).
 *
 * Récupère le CSS Google Fonts (avec un User-Agent moderne pour obtenir du woff2),
 * télécharge chaque fichier woff2 unique dans `public/fonts/`, et régénère
 * `src/styles/fonts.css` avec des `@font-face` pointant en local.
 *
 * Les `unicode-range` d'origine sont conservés : le navigateur ne télécharge que
 * les sous-ensembles réellement nécessaires (aucun coût runtime ajouté).
 *
 * Régénérer après modification des familles/graisses : `node scripts/self-host-fonts.mjs`
 */
import { writeFile, mkdir } from 'node:fs/promises';

// display=optional : pas de swap tardif — le texte peint avec la police si elle
// est arrivée dans la fenêtre de blocage (~100 ms, garanti par les preloads),
// sinon fallback définitif. Évite le re-layout du swap et sort les fonts du
// graphe LCP de Lighthouse (lantern).
const CSS_URL =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600;700&display=optional';

// UA Chrome desktop → Google renvoie des sources woff2 (le format le plus compact).
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const FONTS_DIR = new URL('../public/fonts/', import.meta.url);
const CSS_OUT = new URL('../src/styles/fonts.css', import.meta.url);

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const fetchAsset = async (url, as) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`);
  return as === 'text' ? res.text() : Buffer.from(await res.arrayBuffer());
};

const css = await fetchAsset(CSS_URL, 'text');
const blocks = css.match(/@font-face\s*{[^}]*}/g) ?? [];
if (blocks.length === 0) throw new Error('Aucun @font-face récupéré — vérifier l’URL/UA.');

await mkdir(FONTS_DIR, { recursive: true });

const downloaded = new Map(); // url distante -> nom de fichier local (dédup)
let out =
  '/* AUTO-GÉNÉRÉ par scripts/self-host-fonts.mjs — ne pas éditer à la main.\n' +
  "   Polices auto-hébergées (RGPD + CSP `font-src 'self'`). */\n\n";

for (const block of blocks) {
  const family = block.match(/font-family:\s*'([^']+)'/)?.[1] ?? 'font';
  const url = block.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
  if (!url) {
    out += block + '\n';
    continue;
  }

  let local = downloaded.get(url);
  if (!local) {
    local = `${slug(family)}-${url.split('/').pop()}`;
    const buf = await fetchAsset(url, 'bin');
    await writeFile(new URL(local, FONTS_DIR), buf);
    downloaded.set(url, local);
    console.log(`↓ ${local} (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  out += block.replace(url, `/fonts/${local}`) + '\n';
}

await writeFile(CSS_OUT, out);
console.log(`\n✓ ${blocks.length} @font-face, ${downloaded.size} fichiers woff2 → public/fonts/`);
console.log('✓ src/styles/fonts.css régénéré');
