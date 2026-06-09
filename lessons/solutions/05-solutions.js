/* =============================================================================
 * SOLUTIONS · 05 · STRINGS
 * =============================================================================
 * Run:  node lessons/solutions/05-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/05-strings.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. A sentence from a template literal ────────────────────────────────────
const item = 'coffee';
const price = 3;
console.log('1.', `A ${item} costs $${price}.`); // => 1. A coffee costs $3.

// ── 2. trim → lowercase → replace the space ──────────────────────────────────
console.log('2.', '  Hello World  '.trim().toLowerCase().replace(' ', '-'));
// => 2. hello-world

// ── 3. Split a date into year / month / day ──────────────────────────────────
const [year, month, day] = '2024-06-04'.split('-');
console.log('3.', 'year:', year, 'month:', month, 'day:', day);
// => 3. year: 2024 month: 06 day: 04
