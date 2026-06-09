/* =============================================================================
 * SOLUTIONS · 31 · TRICKY CONCEPTS & INTERVIEW GOTCHAS
 * =============================================================================
 * Run:  node lessons/solutions/31-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/31-tricky-concepts.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Fix a "3,3,3" var loop two ways: with let, and with an IIFE closure. ──
// The bug: `var` has ONE shared binding, so by the time the callbacks run the
// loop has finished and i is 3 for all of them.
const withLet = [];
for (let i = 0; i < 3; i++) withLet.push(() => i); // `let` → a fresh i per iteration
console.log('1a.', withLet.map((f) => f())); // => 1a. [ 0, 1, 2 ]

const withIIFE = [];
for (var j = 0; j < 3; j++) {
  ((snapshot) => withIIFE.push(() => snapshot))(j); // IIFE captures j's value now
}
console.log('1b.', withIIFE.map((f) => f())); // => 1b. [ 0, 1, 2 ]

// ── 2. Explain out loud why [] == ![] is true, token by token. ───────────────
console.log('2.', [] == ![]); // => 2. true
// 1) ![]  → [] is an object, objects are truthy, so !truthy === false.
// 2) Now:  [] == false.
// 3) == with a boolean coerces the boolean to a number: false → 0.  → [] == 0
// 4) == with object vs number coerces the object to a primitive: [].toString()
//    is "" , and Number("") is 0.                                  → 0 == 0
// 5) 0 == 0 → true.  (Use === to avoid this whole circus.)

// ── 3. Write a function that safely copies before mutating its array argument. ──
function withItem(arr, item) {
  const copy = [...arr]; // never mutate the caller's array
  copy.push(item);
  return copy;
}
const original = [1, 2, 3];
const updated = withItem(original, 4);
console.log('3.', 'original:', original, 'updated:', updated);
// => 3. original: [ 1, 2, 3 ] updated: [ 1, 2, 3, 4 ]
