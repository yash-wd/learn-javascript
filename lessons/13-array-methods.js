/* =============================================================================
 * 13 · ARRAY METHODS — map, filter, reduce & friends
 * =============================================================================
 * Run:  node lessons/13-array-methods.js
 *
 * WHAT YOU'LL LEARN
 *   • The "iteration" methods every JS developer uses daily
 *   • How they take a CALLBACK function
 *   • Chaining them together for clean data transformations
 *
 * These are NON-MUTATING — they return new arrays/values and leave the
 * original alone. This is the heart of modern, readable JavaScript.
 * ========================================================================== */

const numbers = [1, 2, 3, 4, 5, 6];

// ── 1. forEach — do something for each item (returns nothing) ─────────────────
numbers.forEach((n) => console.log('item:', n)); // side effects only


// ── 2. map — transform EACH item into a new array (same length) ──────────────
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // => [ 2, 4, 6, 8, 10, 12 ]

const names = ['ana', 'bob'];
console.log(names.map((name) => name.toUpperCase())); // => [ 'ANA', 'BOB' ]


// ── 3. filter — keep only items that pass a test (length may shrink) ─────────
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // => [ 2, 4, 6 ]


// ── 4. reduce — boil an array down to a SINGLE value ─────────────────────────
// reduce((accumulator, current) => ..., startingValue)
const total = numbers.reduce((sum, n) => sum + n, 0);
console.log(total); // => 21

// reduce is powerful — e.g. find the max, or count occurrences:
const max = numbers.reduce((biggest, n) => (n > biggest ? n : biggest));
console.log(max); // => 6

const letters = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = letters.reduce((tally, letter) => {
  tally[letter] = (tally[letter] || 0) + 1;
  return tally;
}, {});
console.log(counts); // => { a: 3, b: 2, c: 1 }


// ── 5. find / findIndex — get the FIRST match ────────────────────────────────
const users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Bob' },
];
console.log(users.find((u) => u.id === 2));      // => { id: 2, name: 'Bob' }
console.log(users.findIndex((u) => u.id === 2)); // => 1
// (find returns undefined and findIndex returns -1 when nothing matches)


// ── 6. some / every — boolean tests across the array ─────────────────────────
console.log(numbers.some((n) => n > 5));   // => true  (at least one matches)
console.log(numbers.every((n) => n > 0));  // => true  (all match)


// ── 7. sort (non-mutating with a copy) ───────────────────────────────────────
const scores = [42, 7, 100, 1];
const sorted = [...scores].sort((a, b) => a - b); // copy first to avoid mutation
console.log(sorted);  // => [ 1, 7, 42, 100 ]
console.log(scores);  // => [ 42, 7, 100, 1 ]  (original preserved)


// ── 8. flat / flatMap ────────────────────────────────────────────────────────
console.log([1, [2, [3]]].flat());      // => [ 1, 2, [3] ]   (one level)
console.log([1, [2, [3]]].flat(Infinity)); // => [ 1, 2, 3 ]  (all levels)


// ── 9. Chaining — the real power ─────────────────────────────────────────────
// "From these orders, get the total of completed orders over $50."
const orders = [
  { item: 'pen',    price: 5,   done: true },
  { item: 'laptop', price: 900, done: true },
  { item: 'mouse',  price: 60,  done: false },
  { item: 'monitor',price: 200, done: true },
];

const revenue = orders
  .filter((o) => o.done)            // keep completed
  .filter((o) => o.price > 50)      // keep > $50
  .map((o) => o.price)              // get just the prices
  .reduce((sum, p) => sum + p, 0);  // add them up
console.log(revenue); // => 1100


/* PRACTICE -------------------------------------------------------------------
 *   1. From [1..10], map to squares, then filter to keep only even squares.
 *   2. Use reduce to find the longest word in ['hi','hello','hey','howdy'].
 *   3. From a list of {name, age} people, get the names of everyone 18+.
 * ------------------------------------------------------------------------- */
