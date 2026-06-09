/* =============================================================================
 * SOLUTIONS · 01 · VARIABLES — var, let, const
 * =============================================================================
 * Run:  node lessons/solutions/01-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/01-variables.js.
 * Try each problem YOURSELF first — then compare. There's always more than one
 * correct approach; these aim to be clear, not clever.
 * ========================================================================== */

// ── 1. A const for your name ─────────────────────────────────────────────────
const myName = 'Sam';
console.log('1.', myName); // => 1. Sam

// ── 2. A let counter: 0, then reassign to 5 ──────────────────────────────────
let counter = 0;
counter = 5; // `let` allows reassignment
console.log('2.', counter); // => 2. 5

// ── 3. Reassigning a const throws at runtime ─────────────────────────────────
// A real `const X = 1; X = 2;` in this file would be a SyntaxError and stop the
// whole program from running — so we run it via eval to catch the error live.
try {
  eval('const FROZEN = 1; FROZEN = 2;');
} catch (err) {
  console.log('3.', err.constructor.name + ':', err.message);
  // => 3. TypeError: Assignment to constant variable.
}
