/* =============================================================================
 * SOLUTIONS · 35 · DEBUGGING & THE CONSOLE
 * =============================================================================
 * Run:  node lessons/solutions/35-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/35-debugging-console.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Use console.table to print an array of 3 product objects. ─────────────
const products = [
  { name: 'Keyboard', price: 80, inStock: true },
  { name: 'Mouse', price: 25, inStock: false },
  { name: 'Monitor', price: 300, inStock: true },
];
console.log('1. products:');
console.table(products); // renders a neat grid of rows × columns

// ── 2. Trigger a "Cannot read properties of undefined" on purpose, then fix it ──
//    with optional chaining.
const data = {}; // no `user` key
try {
  console.log(data.user.name); // boom: data.user is undefined
} catch (err) {
  console.log('2.', err.message); // => 2. Cannot read properties of undefined (reading 'name')
}
// Fix: ?. short-circuits to undefined instead of throwing.
console.log('2.', 'safe:', data.user?.name ?? '(no user)'); // => 2. safe: (no user)

// ── 3. Wrap a slow loop in console.time/timeEnd and read the duration. ───────
console.time('sum-loop');
let sum = 0;
for (let i = 0; i < 1_000_000; i++) sum += i;
console.timeEnd('sum-loop'); // => 3. sum-loop: 1.2ms  (timing varies)
console.log('3.', 'sum =', sum); // => 3. sum = 499999500000
