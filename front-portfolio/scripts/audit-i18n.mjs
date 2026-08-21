/**
 * Audit i18n — compare chaque langue avec le fichier FR de référence.
 *
 *  - Signale les clés FR absentes dans les autres langues
 *  - Signale les clés "orphelines" (présentes dans une langue mais pas en FR)
 *  - Liste les fichiers manquants par namespace
 *
 * Utilisation :
 *   npm run audit:i18n
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LANG_DIR = fileURLToPath(new URL('../public/lang', import.meta.url));
const REF = 'fr';

async function listNamespaces() {
  const entries = await readdir(LANG_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function listLangsIn(ns) {
  const entries = await readdir(join(LANG_DIR, ns));
  return entries
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(`${ns}.`, '').replace('.json', ''));
}

async function readJson(ns, lang) {
  const path = join(LANG_DIR, ns, `${ns}.${lang}.json`);
  try {
    const raw = await readFile(path, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function diffKeys(refKeys, otherKeys) {
  const missing = refKeys.filter((k) => !otherKeys.includes(k));
  const extra = otherKeys.filter((k) => !refKeys.includes(k));
  return { missing, extra };
}

async function main() {
  const namespaces = await listNamespaces();

  // Construit la liste complète des langues connues (union par ns).
  const allLangs = new Set();
  for (const ns of namespaces) {
    const langs = await listLangsIn(ns);
    langs.forEach((l) => allLangs.add(l));
  }
  const sortedLangs = [...allLangs].sort();

  console.log(`\n  Référence : ${REF}`);
  console.log(`  Namespaces (${namespaces.length}) : ${namespaces.join(', ')}`);
  console.log(`  Langues (${sortedLangs.length}) : ${sortedLangs.join(', ')}\n`);

  let totalMissingFiles = 0;
  let totalMissingKeys = 0;
  let totalExtraKeys = 0;

  for (const ns of namespaces) {
    const ref = await readJson(ns, REF);
    if (!ref) {
      console.log(`❌ ${ns} — pas de fichier FR de référence`);
      continue;
    }
    const refKeys = Object.keys(ref);

    const missingFiles = [];
    const langsWithIssues = [];

    for (const lang of sortedLangs) {
      if (lang === REF) continue;

      const other = await readJson(ns, lang);
      if (!other) {
        missingFiles.push(lang);
        totalMissingFiles += 1;
        continue;
      }

      const { missing, extra } = diffKeys(refKeys, Object.keys(other));
      if (missing.length > 0 || extra.length > 0) {
        langsWithIssues.push({ lang, missing, extra });
        totalMissingKeys += missing.length;
        totalExtraKeys += extra.length;
      }
    }

    const hasIssues = missingFiles.length > 0 || langsWithIssues.length > 0;
    const header = hasIssues ? `⚠  ${ns}` : `✓  ${ns}`;
    console.log(`${header}  (${refKeys.length} clés FR)`);

    if (missingFiles.length > 0) {
      console.log(`   → fichiers manquants : ${missingFiles.join(', ')}`);
    }

    for (const { lang, missing, extra } of langsWithIssues) {
      const parts = [];
      if (missing.length > 0) parts.push(`${missing.length} manquante(s) : ${missing.join(', ')}`);
      if (extra.length > 0) parts.push(`${extra.length} orpheline(s) : ${extra.join(', ')}`);
      console.log(`   → ${lang.padEnd(6)} ${parts.join(' | ')}`);
    }
  }

  console.log(
    `\n  Total : ${totalMissingFiles} fichier(s) manquant(s), ` +
      `${totalMissingKeys} clé(s) manquante(s), ` +
      `${totalExtraKeys} clé(s) orpheline(s)\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
