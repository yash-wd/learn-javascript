/* =============================================================================
 * SOLUTIONS · 04 · TYPE CONVERSION & COERCION
 * =============================================================================
 * Run:  node lessons/solutions/04-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/04-type-conversion.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. "100" to a number, three ways ─────────────────────────────────────────
console.log('1.', Number('100'), parseInt('100', 10), +'100'); // => 1. 100 100 100

// ── 2. Coercion oddities ─────────────────────────────────────────────────────
// [] + []  → '' (both arrays become empty strings, then concatenate)
// [] + {}  → '[object Object]'
// true + 1 → 2  (true becomes the number 1)
console.log('2.', JSON.stringify([] + []), '|', [] + {}, '|', true + 1);
// => 2. "" | [object Object] | 2

// ── 3. The 8 falsy values ────────────────────────────────────────────────────
const falsy = [false, 0, -0, 0n, '', null, undefined, NaN];
console.log('3.', falsy.length, 'values, all falsy:', falsy.every((v) => !v));
// => 3. 8 values, all falsy: true
