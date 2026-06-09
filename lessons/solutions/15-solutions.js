/* =============================================================================
 * SOLUTIONS · 15 · DESTRUCTURING & SPREAD / REST
 * =============================================================================
 * Run:  node lessons/solutions/15-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/15-destructuring-spread.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Destructure { title, year } from a movie object, defaulting year to 2024. ──
const movie = { title: 'Dune' }; // note: no `year` key
const { title, year = 2024 } = movie; // default kicks in when the key is missing
console.log('1.', title, year); // => 1. Dune 2024

// ── 2. Merge two arrays and dedupe them with [...new Set([...a, ...b])]. ─────
const a = [1, 2, 3, 4];
const b = [3, 4, 5, 6];
const merged = [...new Set([...a, ...b])]; // Set drops duplicates, spread back to array
console.log('2.', merged); // => 2. [ 1, 2, 3, 4, 5, 6 ]

// ── 3. Write a function printFirstAndRest(first, ...rest) and test it. ───────
function printFirstAndRest(first, ...rest) {
  console.log('3.', 'first:', first, 'rest:', rest);
}
printFirstAndRest('a', 'b', 'c', 'd'); // => 3. first: a rest: [ 'b', 'c', 'd' ]
printFirstAndRest('solo');             // => 3. first: solo rest: []
