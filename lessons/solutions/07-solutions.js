/* =============================================================================
 * SOLUTIONS · 07 · CONDITIONALS
 * =============================================================================
 * Run:  node lessons/solutions/07-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/07-conditionals.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. if/else: "even" or "odd" ──────────────────────────────────────────────
function evenOdd(n) {
  if (n % 2 === 0) return 'even';
  else return 'odd';
}
console.log('1.', evenOdd(4), evenOdd(7)); // => 1. even odd

// ── 2. The same thing as a ternary ───────────────────────────────────────────
const evenOddTernary = (n) => (n % 2 === 0 ? 'even' : 'odd');
console.log('2.', evenOddTernary(4), evenOddTernary(7)); // => 2. even odd

// ── 3. switch: map 1–7 to weekday names ──────────────────────────────────────
function weekday(n) {
  switch (n) {
    case 1: return 'Monday';
    case 2: return 'Tuesday';
    case 3: return 'Wednesday';
    case 4: return 'Thursday';
    case 5: return 'Friday';
    case 6: return 'Saturday';
    case 7: return 'Sunday';
    default: return 'unknown';
  }
}
console.log('3.', weekday(1), '…', weekday(7)); // => 3. Monday … Sunday
