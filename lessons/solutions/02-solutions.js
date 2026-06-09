/* =============================================================================
 * SOLUTIONS · 02 · DATA TYPES
 * =============================================================================
 * Run:  node lessons/solutions/02-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/02-data-types.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. typeof of various values ──────────────────────────────────────────────
// Watch the two classic quirks: typeof null is "object", and arrays are "object".
console.log('1.', typeof '5', typeof 5, typeof true, typeof null, typeof undefined, typeof [], typeof {});
// => 1. string number boolean object undefined object object

// ── 2. Copy an object by reference vs with spread ────────────────────────────
const original = { count: 1 };
const byRef = original; // SAME object — a second name for it
const bySpread = { ...original }; // a shallow COPY — independent object
byRef.count = 99; // mutates the original too (same object)
bySpread.count = -1; // independent — original untouched
console.log('2. original:', original, 'byRef:', byRef, 'bySpread:', bySpread);
// => 2. original: { count: 99 } byRef: { count: 99 } bySpread: { count: -1 }
