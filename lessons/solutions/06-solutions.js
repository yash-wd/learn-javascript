/* =============================================================================
 * SOLUTIONS · 06 · NUMBERS & MATH
 * =============================================================================
 * Run:  node lessons/solutions/06-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/06-numbers-math.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Round 7.456 to 1 decimal place, as a string ───────────────────────────
console.log('1.', (7.456).toFixed(1)); // => 1. 7.5

// ── 2. Largest of the array, using Math.max + spread ─────────────────────────
console.log('2.', Math.max(...[12, 7, 25, 3])); // => 2. 25

// ── 3. A random integer between 1 and 100 (inclusive) ────────────────────────
function randomInt(min, max) {
  // floor() gives 0..(range-1); +min shifts it into [min, max].
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const roll = randomInt(1, 100);
console.log('3.', roll, '— in range:', roll >= 1 && roll <= 100);
// => 3. <varies each run> — in range: true
