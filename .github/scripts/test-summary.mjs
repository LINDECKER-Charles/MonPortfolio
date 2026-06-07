// Génère un résumé markdown des tests + coverage pour $GITHUB_STEP_SUMMARY.
// Usage : node scripts/test-summary.mjs [karma.log] [coverage-summary.json]
// Ne fait jamais échouer le job : le step de test porte déjà l'exit code.
import { existsSync, readFileSync } from 'node:fs';

const logPath = process.argv[2] ?? 'karma.log';
const summaryPath = process.argv[3] ?? 'coverage/front-portfolio/coverage-summary.json';

const out = ['## 🧪 Tests & Coverage'];

// --- Tests : dernière ligne "Executed X of Y (N FAILED)" du log Karma ---
const log = existsSync(logPath)
  ? readFileSync(logPath, 'utf8').replace(/\x1b\[[0-9;]*[A-Za-z]/g, '')
  : '';
const exec = [...log.matchAll(/Executed (\d+) of (\d+)/g)].at(-1);
const failedMatch = [...log.matchAll(/\((\d+) FAILED\)/g)].at(-1);
const failed = failedMatch ? Number(failedMatch[1]) : 0;

if (exec) {
  const executed = Number(exec[1]);
  const total = Number(exec[2]);
  const passed = executed - failed;
  const icon = failed === 0 && executed === total ? '✅' : '❌';
  const suffix = failed > 0 ? ` — **${failed} échec(s)**` : '';
  out.push('', `${icon} **Tests : ${passed}/${total} réussis**${suffix}`);
} else {
  out.push('', '⚠️ Sortie Karma non reconnue — résultat des tests indéterminé.');
}

// --- Coverage : totaux du json-summary istanbul ---
if (existsSync(summaryPath)) {
  const { total } = JSON.parse(readFileSync(summaryPath, 'utf8'));
  const metric = (label, m, threshold) => {
    const icon = m.pct >= threshold ? '✅' : '⚠️';
    return `| ${label} | ${m.covered}/${m.total} | ${m.pct}% | ${icon} ≥${threshold}% |`;
  };
  out.push(
    '',
    '| Métrique | Couvert | % | Seuil |',
    '|---|---:|---:|---|',
    metric('Lignes', total.lines, 95),
    metric('Statements', total.statements, 95),
    metric('Fonctions', total.functions, 95),
    metric('Branches', total.branches, 80),
  );
} else {
  out.push('', '⚠️ `coverage-summary.json` absent — coverage indéterminé.');
}

process.stdout.write(out.join('\n') + '\n');
