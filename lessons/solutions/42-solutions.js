/* =============================================================================
 * SOLUTIONS · 42 · PERFORMANCE — make it fast (and know what "fast" means)
 * =============================================================================
 * Run:  node lessons/solutions/42-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/42-performance.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Memoize a slow fibonacci(n) and compare call counts with/without it. ──
let naiveCalls = 0;
function fibNaive(n) {
  naiveCalls++;
  return n < 2 ? n : fibNaive(n - 1) + fibNaive(n - 2); // recomputes the same n over and over
}
fibNaive(20);

let memoCalls = 0;
const memo = new Map();
function fibMemo(n) {
  if (memo.has(n)) return memo.get(n); // cache hit → no recompute
  memoCalls++;
  const value = n < 2 ? n : fibMemo(n - 1) + fibMemo(n - 2);
  memo.set(n, value);
  return value;
}
fibMemo(20);
console.log('1.', `naive: ${naiveCalls} calls · memoized: ${memoCalls} calls`);
// => 1. naive: 21891 calls · memoized: 21 calls

// ── 2. Rewrite an O(n²) "find duplicates" using a Set to get O(n). ───────────
// O(n²) was: for each item, scan the rest with indexOf/includes.
// O(n): one pass, remember what we've seen in a Set (O(1) lookups).
function findDuplicates(arr) {
  const seen = new Set();
  const dups = new Set();
  for (const x of arr) (seen.has(x) ? dups : seen).add(x);
  return [...dups];
}
console.log('2.', findDuplicates([1, 2, 3, 2, 4, 1, 5])); // => 2. [ 2, 1 ]

// ── 3. Name which Web Vital each fixes: slow hero image, janky button, jumpy layout. ──
console.log('3.', { heroImage: 'LCP', jankyButton: 'INP', jumpyLayout: 'CLS' });
// LCP = Largest Contentful Paint (load speed of the biggest element).
// INP = Interaction to Next Paint (responsiveness to clicks/taps).
// CLS = Cumulative Layout Shift (visual stability — things not jumping around).

// ── 4. Wrap two code blocks in performance.mark/measure and log which is slower. ──
performance.mark('loop-start');
let s = 0;
for (let i = 0; i < 1_000_000; i++) s += i;
performance.mark('loop-end');
performance.measure('loop', 'loop-start', 'loop-end');

performance.mark('arr-start');
Array.from({ length: 1_000_000 }, (_, i) => i).reduce((a, b) => a + b, 0);
performance.mark('arr-end');
performance.measure('array', 'arr-start', 'arr-end');

const loopMs = performance.getEntriesByName('loop')[0].duration;
const arrMs = performance.getEntriesByName('array')[0].duration;
console.log('4.', `loop ${loopMs.toFixed(1)}ms vs array ${arrMs.toFixed(1)}ms — slower:`,
  loopMs > arrMs ? 'loop' : 'array'); // exact numbers vary; the plain loop is usually faster

// ── 5. In words: why does virtualization keep a 100k-row list fast? (DOM size.) ──
console.log('5.', 'It only renders the ~20 rows actually visible, not all 100k.');
// The browser's cost scales with the number of DOM nodes it must lay out, paint,
// and keep in memory. Virtualization renders only the visible window (plus a
// small buffer) and recycles nodes as you scroll — so the DOM stays tiny and
// constant-sized no matter how many rows the data has.
