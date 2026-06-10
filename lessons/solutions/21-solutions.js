/* =============================================================================
 * 21 · HOW JAVASCRIPT RUNS — practice solutions
 * =============================================================================
 * Run:  node lessons/solutions/21-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/21-how-javascript-runs.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

'use strict';

// ── 1. Predict the output order. ─────────────────────────────────────────────
// Sync runs first (A, D), then microtasks (C), then macrotasks (B):
console.log('A'); // => A
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D'); // => D
// Printed order:  A, D, C, B
// => C
// => B

// ── 2. Infinite recursion → a RangeError (stack overflow). ───────────────────
function boom() {
  return boom(); // no base case → the call stack never pops
}
try {
  boom();
} catch (err) {
  console.log('caught:', err.name); // => caught: RangeError
}

// ── 3. Why `typeof y; let y = 1;` THROWS but `var` prints undefined. ─────────
// In the CREATION phase, `var y` is reserved AND initialised to `undefined`, so
// reading it early is legal (prints "undefined"). `let y` is also reserved, but
// left UNINITIALISED until its line runs — the gap is the "temporal dead zone",
// and touching the binding inside it throws a ReferenceError. So:
//   console.log(typeof y); let y = 1;   // ❌ ReferenceError (TDZ)
//   console.log(typeof v); var v = 1;   // ✅ prints "undefined"
console.log('explained: let lives in the TDZ until its line; var is pre-undefined');
// => explained: let lives in the TDZ until its line; var is pre-undefined

// ── 4. Force the order 1, 2 (sync) · 3 (microtask) · 4 (macrotask). ──────────
setTimeout(() => console.log('4 (macrotask)'), 0); // queued last to run
Promise.resolve().then(() => console.log('3 (microtask)')); // runs before the timer
console.log('1 (sync)'); // => 1
console.log('2 (sync)'); // => 2
// Printed order: 1, 2, 3, 4 — sync drains the stack, then the microtask, then
// the macrotask.
// => 3 (microtask)
// => 4 (macrotask)
