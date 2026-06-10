/* =============================================================================
 * check-outputs.mjs — make the course self-verifying
 * =============================================================================
 * Every lesson documents what it prints with `// =>` comments. This script runs
 * each lesson, captures its real output, and asserts that every CLEAN, literal
 * `// =>` expectation actually appears — so the comments can never silently
 * drift from reality. Wire it into CI and a bad `// =>` fails the build.
 *
 *   node tools/check-outputs.mjs
 *
 * Matching is whitespace- and case-insensitive (Node prints `[ 1, 2 ]` where a
 * comment may write `[1,2]`). Deliberately FUZZY comments are skipped, not
 * failed: anything with `...`/`…` (ranges), or a trailing `(annotation)`. The
 * goal is zero false positives — a failure here is a real drift, every time.
 * ========================================================================== */
import { readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const L = join(ROOT, 'lessons');

// Lessons we can't output-check by running them in Node:
//  • browser-only (print only a guard notice under Node): 24 DOM, 25 Events, 47 Browser APIs
//  • needs the network (output varies / fails offline): 26 Fetch
const SKIP = new Set(['24', '25', '26', '47']);

// Normalize for comparison: lowercase and drop everything that's pure
// formatting — whitespace, quotes, commas, slashes, and decoration glyphs —
// because `[ 1, 2 ]` (Node) and `[1,2]` (a comment) are the same OUTPUT, and a
// comment may summarize several printed lines as "a / b" or "0, 1, 2".
const DECOR = /[←→✅❌😱⚠✔🎯💡⭐🚀👋🟡💻📖🔍💪🔤🧭]️?/gu;
const norm = (s) => s.toLowerCase().replace(DECOR, '').replace(/[\s"'`,/]/g, '');

// A few `// =>` comments are environment-dependent (version, OS, locale, time)
// or descriptive prose, not literal output — not assertable, so skip them.
const DYNAMIC = /v\d+\.x|darwin|win32|locale-specific|timestamp of|short date|date d\b|\d+(\.\d+)?ms\b|^comment\.$/i;

// Pull the checkable `// =>` expectations out of a lesson's source.
function expectationsFrom(src) {
  const out = [];
  for (const line of src.split('\n')) {
    const m = line.match(/\/\/\s*=>\s*(.+?)\s*$/);
    if (!m) continue;
    let exp = m[1];
    if (/\.\.\.|…/.test(exp)) continue; // ranges / "and so on" → too fuzzy to assert
    exp = exp.replace(/\s*\(.*$/, ''); // drop a trailing "(human note)"
    const decorAt = exp.search(DECOR); // cut a trailing "✅ exact" / "😱" annotation
    if (decorAt >= 0) exp = exp.slice(0, decorAt);
    exp = exp.split(/\s{2,}/)[0]; // drop a "  ← annotation" after 2+ spaces
    exp = exp.replace(/,\s+[a-z][a-z ]+$/, ''); // drop ", nums untouched" trailing prose
    exp = exp.replace(/\s*,?\s*etc\.?$/i, '').trim(); // drop ", etc."
    if (DYNAMIC.test(exp)) continue; // environment-dependent / descriptive
    if (/^all (false|true)$/i.test(exp)) continue; // descriptive summary of several lines
    if (/^(\d+|\w)(\s*,\s*(\d+|\w))+$/.test(exp)) continue; // counter summary ("0, 1, 2")
    if (norm(exp).length < 2) continue; // nothing literal left to check
    out.push(exp);
  }
  return out;
}

const files = readdirSync(L)
  .filter((f) => /^\d+.*\.js$/.test(f))
  .sort();

let lessonsChecked = 0;
let totalExp = 0;
let matched = 0;
const failures = [];

for (const f of files) {
  const num = f.match(/^\d+/)[0];
  if (SKIP.has(num)) continue;

  const expectations = expectationsFrom(readFileSync(join(L, f), 'utf8'));
  if (!expectations.length) continue;

  const run = spawnSync(process.execPath, [join(L, f)], {
    encoding: 'utf8',
    timeout: 30000,
  });
  if (run.status !== 0) {
    failures.push(`${f}: exited ${run.status} (${(run.stderr || '').split('\n')[0]})`);
    continue;
  }

  const hay = norm((run.stdout || '') + (run.stderr || '')); // some `// =>` sit on console.error
  lessonsChecked++;
  for (const exp of expectations) {
    totalExp++;
    if (hay.includes(norm(exp))) matched++;
    else failures.push(`${f}: NOT printed → // => ${exp}`);
  }
}

console.log(
  `Output check: ${lessonsChecked} lessons · ${matched}/${totalExp} `
  + `\`// =>\` expectations verified · ${SKIP.size} skipped (browser/network)`
);

if (failures.length) {
  console.error('\n✗ MISMATCHES (a comment no longer matches real output):');
  for (const x of failures) console.error('   ' + x);
  process.exit(1);
}
console.log('✅ every checked `// =>` matched real output');
