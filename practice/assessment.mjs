/* CAPSTONE ASSESSMENT — one problem per level ───────────────────────────────
 * Your "final exam". Implement all five; make the suite green WITHOUT peeking:
 *   PRACTICE=mine node --test practice/assessment.test.mjs
 * Each function maps to a level of the course (see the lesson in brackets).
 * Reference answers are in assessment.solution.mjs.
 * ------------------------------------------------------------------------- */

// L1 · Foundation [07 conditionals, 08 loops]
// fizzbuzz(n): array 1..n, but 'Fizz' for multiples of 3, 'Buzz' for 5,
// 'FizzBuzz' for both.  fizzbuzz(5) === [1, 2, 'Fizz', 4, 'Buzz']
export function fizzbuzz(n) {
  // TODO
}

// L2 · Core [12 arrays, 16 sets]
// dedupe(arr): unique values, original order preserved.  dedupe([1,1,2,1,3]) === [1,2,3]
export function dedupe(arr) {
  // TODO
}

// L3 · Intermediate [20 async]
// mapSeries(items, asyncFn): run asyncFn over items ONE AT A TIME (sequential),
// resolve to the results in order.  await mapSeries([1,2], async x => x*10) === [10,20]
export async function mapSeries(items, asyncFn) {
  // TODO
}

// L4 · Advanced [10 closures, 30 FP]
// memoize(fn): cache results by the first argument so fn runs once per input.
export function memoize(fn) {
  // TODO
}

// L5 · Expert [49 algorithms]
// binarySearch(sorted, target): index of target in an ascending array, or -1.
export function binarySearch(sorted, target) {
  // TODO
}
