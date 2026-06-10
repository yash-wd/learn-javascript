/* =============================================================================
 * SOLUTIONS · 28 · GENERATORS & ITERATORS
 * =============================================================================
 * Run:  node lessons/solutions/28-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/28-generators-iterators.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Write a generator fibonacci() and take the first 10 numbers. ──────────
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {        // safe: a generator only runs when you pull from it
    yield a;
    [a, b] = [b, a + b];
  }
}
function take(iterable, n) {
  const out = [];
  for (const value of iterable) {
    out.push(value);
    if (out.length === n) break; // stop pulling once we have enough
  }
  return out;
}
console.log('1.', take(fibonacci(), 10)); // => 1. [ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 ]

// ── 2. Make an object { from, to } iterable so [...it] counts from→to. ───────
const range = {
  from: 3,
  to: 7,
  *[Symbol.iterator]() {            // the well-known iterator hook, as a generator
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};
console.log('2.', [...range]); // => 2. [ 3, 4, 5, 6, 7 ]

// ── 3. Write a generator that yields only the even numbers of an array. ──────
function* evens(arr) {
  for (const n of arr) if (n % 2 === 0) yield n;
}
console.log('3.', [...evens([1, 2, 3, 4, 5, 6, 7, 8])]); // => 3. [ 2, 4, 6, 8 ]
