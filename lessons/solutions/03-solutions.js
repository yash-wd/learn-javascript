/* =============================================================================
 * SOLUTIONS · 03 · OPERATORS
 * =============================================================================
 * Run:  node lessons/solutions/03-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/03-operators.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Even or odd with the remainder operator % ─────────────────────────────
console.log('1.', 17 % 2 === 0 ? 'even' : 'odd'); // => 1. odd

// ── 2. Predict, then verify the equalities ───────────────────────────────────
// 0 == ''  → true  (both coerce to 0)
// 0 === '' → false (different types, no coercion)
// null == undefined → true (special rule, only equal to each other)
console.log('2.', 0 == '', 0 === '', null == undefined); // => 2. true false true

// ── 3. Default with ?? where 0 must stay valid ───────────────────────────────
// `||` would wrongly replace 0; `??` only defaults on null/undefined.
const volume = 0;
const setting = volume ?? 5;
console.log('3.', setting); // => 3. 0
