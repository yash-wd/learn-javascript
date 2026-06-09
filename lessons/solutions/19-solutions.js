/* =============================================================================
 * SOLUTIONS · 19 · CALLBACKS & PROMISES (asynchronous JavaScript)
 * =============================================================================
 * Run:  node lessons/solutions/19-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/19-callbacks-promises.js.
 * Try each problem YOURSELF first — then compare.
 * (Output appears over time as the timers fire, not all at once.)
 * ========================================================================== */

// ── 1. Wrap setTimeout in a `delay(ms)` function that returns a Promise. ─────
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
console.log('1.', delay(0) instanceof Promise); // => 1. true

// ── 2. Chain delay(100) → log "done after 100ms". ────────────────────────────
delay(100).then(() => console.log('2.', 'done after 100ms')); // => 2. done after 100ms

// ── 3. Use Promise.all to wait for delay(50) and delay(150) together. ────────
// Promise.all resolves once BOTH are done — so this fires at ~150ms, not 200ms.
Promise.all([delay(50), delay(150)]).then(() =>
  console.log('3.', 'both delays finished (after ~150ms)')
); // => 3. both delays finished (after ~150ms)
