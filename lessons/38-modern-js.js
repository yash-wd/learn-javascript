/* =============================================================================
 * 38 · MODERN JAVASCRIPT (ES2021 → ES2026)
 * =============================================================================
 * Run:  node lessons/38-modern-js.js   (needs Node 22+ ; you have v24 ✅)
 *
 * (Heads-up: Node prints a harmless "MODULE_TYPELESS_PACKAGE_JSON" warning —
 *  this file is an ES module and package.json has no "type" on purpose. Ignore it.)
 *
 * WHAT YOU'LL LEARN
 *   The newest, genuinely useful additions to JavaScript — grouped by year.
 *   These make a lot of older patterns cleaner. Several REPLACE workarounds
 *   you saw earlier in the course (noted with "↪ replaces ...").
 *
 * NOTE: very new features need an up-to-date runtime. Everything here runs in
 *       Node 22/24 and current browsers (2024+). Older environments may not
 *       support the ES2024/ES2025 items yet.
 * ========================================================================== */

console.log('===== ES2021 =====');

// ── Logical assignment: ??=  ||=  &&= ────────────────────────────────────────
// Combine a logical check with assignment. Super handy for defaults.
let config = { theme: null, retries: 0 };
config.theme ??= 'light';   // assign ONLY if null/undefined  → 'light'
config.retries ||= 3;       // assign if falsy (0 counts!)     → 3
config.theme &&= 'dark';    // assign only if already truthy   → 'dark'
console.log(config);        // => { theme: 'dark', retries: 3 }
// ↪ replaces:  if (config.theme == null) config.theme = 'light'

// ── Promise.any — first to SUCCEED wins ──────────────────────────────────────
// (vs Promise.race which settles on the first to finish, success OR fail)
const fastest = await Promise.any([
  Promise.reject('server A down'),
  Promise.resolve('server B responded'),
]);
console.log(fastest); // => server B responded


console.log('===== ES2022 =====');

// ── Top-level await ──────────────────────────────────────────────────────────
// In ES modules you can `await` at the top level — no async IIFE wrapper.
// (This file uses it; that's why awaits above work without an async function.)
const ready = await Promise.resolve('no IIFE needed');
console.log(ready); // => no IIFE needed

// ── Object.hasOwn(obj, key) — the safe "has own property" check ──────────────
const obj = { a: 1 };
console.log(Object.hasOwn(obj, 'a'));        // => true
console.log(Object.hasOwn(obj, 'toString')); // => false (inherited, not own)
// ↪ replaces the clunky:  Object.prototype.hasOwnProperty.call(obj, 'a')

// ── Error cause — chain errors without losing the original ───────────────────
try {
  try {
    throw new Error('low-level network fail');
  } catch (original) {
    throw new Error('Could not load user', { cause: original });
  }
} catch (err) {
  console.log(err.message, '| caused by:', err.cause.message);
  // => Could not load user | caused by: low-level network fail
}


console.log('===== ES2023 =====');

// ── findLast / findLastIndex — search from the END ───────────────────────────
const nums = [1, 2, 3, 4, 5];
console.log(nums.findLast((n) => n % 2 === 1));      // => 5 (last odd)
console.log(nums.findLastIndex((n) => n % 2 === 1)); // => 4

// ── Immutable array methods — return a NEW array, no mutation ⭐ ──────────────
// These are the modern fix for the "copy-before-sort" dance from lessons 12/13.
const original = [3, 1, 2];
console.log(original.toSorted((a, b) => a - b)); // => [1, 2, 3]
console.log(original.toReversed());              // => [2, 1, 3]
console.log(original.with(0, 99));               // => [99, 1, 2]  (replace index 0)
console.log(original.toSpliced(1, 1));           // => [3, 2]      (remove 1 at idx 1)
console.log(original);                           // => [3, 1, 2]  UNCHANGED ✅
// ↪ replaces:  [...arr].sort(...)   and   [...arr].reverse()


console.log('===== ES2024 =====');

// ── Object.groupBy — group array items by a key ⭐ ───────────────────────────
const people = [
  { name: 'Ana', dept: 'eng' },
  { name: 'Bob', dept: 'sales' },
  { name: 'Cy', dept: 'eng' },
];
const byDept = Object.groupBy(people, (p) => p.dept);
console.log(byDept.eng.map((p) => p.name)); // => [ 'Ana', 'Cy' ]
// ↪ replaces a whole reduce() into an object (you wrote one in lesson 13!)

// Map.groupBy is the same, but returns a Map (keys can be any type):
const byParity = Map.groupBy([1, 2, 3, 4], (n) => (n % 2 ? 'odd' : 'even'));
console.log(byParity.get('odd')); // => [ 1, 3 ]

// ── Promise.withResolvers — get a promise + its resolve/reject together ──────
// Cleaner than capturing them inside the executor with outer `let`s.
const { promise, resolve } = Promise.withResolvers();
setTimeout(() => resolve('done!'), 10);
console.log(await promise); // => done!

// ── Array.fromAsync — build an array from an async iterable ──────────────────
async function* drip() { yield 1; yield 2; yield 3; }
console.log(await Array.fromAsync(drip())); // => [ 1, 2, 3 ]


console.log('===== ES2025 (newest) =====');

// ── Iterator helpers — map/filter/take LAZILY, without arrays ⭐ ──────────────
// You can now chain methods directly on iterators (e.g. from .values(),
// generators, Map/Set entries) — processed lazily, one item at a time.
function* naturals() { let i = 1; while (true) yield i++; }
const firstThreeEvens = naturals()
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10)
  .take(3)                       // stop after 3 — works on an INFINITE source
  .toArray();
console.log(firstThreeEvens); // => [ 20, 40, 60 ]
// ↪ before, .map/.filter only existed on arrays (you had to materialize first)

// ── New Set methods — real set algebra ⭐ ────────────────────────────────────
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);
console.log([...a.union(b)]);              // => [ 1, 2, 3, 4, 5, 6 ]
console.log([...a.intersection(b)]);       // => [ 3, 4 ]
console.log([...a.difference(b)]);         // => [ 1, 2 ]
console.log([...a.symmetricDifference(b)]);// => [ 1, 2, 5, 6 ]
console.log(new Set([1, 2]).isSubsetOf(a));// => true

// ── Promise.try — run a function and ALWAYS get a promise back ────────────────
// Wraps sync OR async functions uniformly; sync throws become rejections.
const result = await Promise.try(() => 42);
console.log(result); // => 42

// ── RegExp.escape — safely put arbitrary text into a regex ───────────────────
const userInput = 'a.b*c';
const safe = new RegExp(RegExp.escape(userInput)); // dots/stars treated literally
console.log(safe.test('a.b*c')); // => true
console.log(safe.test('aXbYc')); // => false (the . and * are NOT wildcards now)


console.log('===== ES2026 & THE CUTTING EDGE =====');

// ── using / await using — automatic cleanup (explicit resource management) ────
// A `using` declaration auto-calls the resource's [Symbol.dispose]() when the
// block ends — like try/finally, but automatic. `await using` calls the async
// [Symbol.asyncDispose](). Perfect for files, DB connections, locks, sockets.
// (Stage 3 / ES2026; needs a very recent runtime. Shown so you recognize it.)
//
//   function openResource(name) {
//     return { [Symbol.dispose]() { console.log(`closing ${name}`); } };
//   }
//   {
//     using db = openResource('db');   // no manual close needed
//     using file = openResource('file');
//     // ...use them...
//   } // ← here both are disposed automatically, in REVERSE order
//   // ↪ replaces the try { } finally { db.close(); file.close(); } dance.

// ── Import attributes — import non-JS modules safely ─────────────────────────
// Tell the engine what kind of module you're importing (currently JSON):
//   import config from './config.json' with { type: 'json' };
//   const data = await import('./data.json', { with: { type: 'json' } });
// ↪ replaces reading + JSON.parse-ing a file by hand for static config.

// ── Decorators — annotate classes/methods with @reusable behavior ─────────────
// A decorator is a function that wraps a class/method to add behavior (logging,
// validation, memoization) declaratively. (Stage 3; TypeScript/Angular already
// use them; frameworks lean on them heavily.)
//
//   function logged(originalMethod, ctx) {
//     return function (...args) {
//       console.log(`calling ${ctx.name}`);
//       return originalMethod.call(this, ...args);
//     };
//   }
//   class Api { @logged getUser(id) { /* ... */ } } // @logged wraps the method
// ↪ a standardized version of the "decorator" pattern from lesson 41.

// ── Float16Array & Math.f16round — half-precision numbers (ES2025/26) ─────────
// 16-bit floats: half the memory, enough precision for ML weights, graphics,
// and GPU data. A typed array (lesson 51) for compact decimal data.
if (typeof Float16Array !== 'undefined') {
  const half = new Float16Array([1.5, 2.25]);
  console.log('Float16Array:', half[0]); // => 1.5
} else {
  console.log('Float16Array: not in this runtime yet (very new)');
}


console.log('===== ON THE HORIZON =====');

/* ── Temporal API — the modern replacement for Date (NOT shipped yet) ─────────
 * Date is famously awkward (0-based months, mutable, no time-zone clarity).
 * Temporal fixes all of it. It's at Stage 3 and not yet in Node/most browsers,
 * so this is shown as a comment. Use the @js-temporal/polyfill package to try it.
 *
 *   const today = Temporal.Now.plainDateISO();      // 2026-06-04 (immutable)
 *   const next = today.add({ days: 7 });            // clean date math
 *   const meeting = Temporal.ZonedDateTime.from('2026-06-04T15:00[Asia/Kolkata]');
 *   today.month            // 6  (1-based — finally sane!)
 *   today.until(next).days // 7
 *
 * Until it ships, use lesson 33's Date + Intl, or a library (date-fns, Day.js).
 */
console.log('Temporal: coming soon — see comments. For now use lesson 33.');


/* WHAT CHANGED FOR YOUR EVERYDAY CODE ----------------------------------------
 *   • Sorting without mutating ......... arr.toSorted()       (was [...arr].sort())
 *   • Grouping data .................... Object.groupBy(...)   (was a reduce)
 *   • Defaults ......................... x ??= value
 *   • Own-property check ............... Object.hasOwn(o, k)
 *   • Lazy pipelines ................... iterator.map().filter().take()
 *   • Set math ......................... a.union(b), a.intersection(b)
 *   These are all "nice to have" — the fundamentals you already learned still
 *   work everywhere. Reach for these when your runtime supports them.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Rewrite lesson 13's letter-counting reduce using Object.groupBy.
 *   2. Replace a [...arr].sort() somewhere in your code with arr.toSorted().
 *   3. Use Set.intersection to find common items in two arrays of tags.
 * ------------------------------------------------------------------------- */
