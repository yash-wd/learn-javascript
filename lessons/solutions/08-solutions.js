/* =============================================================================
 * SOLUTIONS · 08 · LOOPS
 * =============================================================================
 * Run:  node lessons/solutions/08-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/08-loops.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Print 1–10, skipping multiples of 3 (continue) ────────────────────────
const kept = [];
for (let i = 1; i <= 10; i++) {
  if (i % 3 === 0) continue; // jump straight to the next iteration
  kept.push(i);
}
console.log('1.', kept.join(' ')); // => 1. 1 2 4 5 7 8 10

// ── 2. Sum an array with for...of ────────────────────────────────────────────
let sum = 0;
for (const n of [4, 8, 15, 16, 23, 42]) sum += n;
console.log('2.', sum); // => 2. 108

// ── 3. Loop an object's keys and values with for...in ────────────────────────
const user = { name: 'Ada', role: 'engineer' };
for (const key in user) {
  console.log('3.', key, '=', user[key]);
}
// => 3. name = Ada
// => 3. role = engineer
