/* =============================================================================
 * 27 · GENERATORS & ITERATORS
 * =============================================================================
 * Run:  node lessons/27-generators-iterators.js
 *
 * WHAT YOU'LL LEARN
 *   • The iterator protocol (what makes something "for...of"-able)
 *   • Generator functions (function*) and yield
 *   • Lazy / infinite sequences
 *   • Making your own objects iterable with Symbol.iterator
 * ========================================================================== */

// ── 1. The iterator protocol ─────────────────────────────────────────────────
// An "iterator" is any object with a .next() that returns { value, done }.
// Arrays, strings, Sets, Maps are "iterable" because they can produce one.
const arr = [10, 20];
const it = arr[Symbol.iterator](); // get the array's iterator
console.log(it.next()); // => { value: 10, done: false }
console.log(it.next()); // => { value: 20, done: false }
console.log(it.next()); // => { value: undefined, done: true }


// ── 2. Generator functions — the easy way to make iterators ──────────────────
// function* + yield. Calling it does NOT run the body — it returns a generator.
// Each .next() runs UNTIL the next yield, then PAUSES there.
function* countToThree() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = countToThree();
console.log(gen.next()); // => { value: 1, done: false }
console.log(gen.next()); // => { value: 2, done: false }
console.log(gen.next()); // => { value: 3, done: false }
console.log(gen.next()); // => { value: undefined, done: true }

// Generators are iterable, so for...of and spread just work:
console.log([...countToThree()]);          // => [ 1, 2, 3 ]
for (const n of countToThree()) console.log('got', n); // => 1, 2, 3


// ── 3. Generators keep state between yields ──────────────────────────────────
function* idMaker() {
  let id = 1;
  while (true) {          // an "infinite" generator — safe because it's LAZY
    yield id++;
  }
}
const ids = idMaker();
console.log(ids.next().value); // => 1
console.log(ids.next().value); // => 2
console.log(ids.next().value); // => 3
// It only computes the next value when you ask — never runs forever.


// ── 4. Lazy sequences — compute only what you need ───────────────────────────
function* take(iterable, n) {
  let count = 0;
  for (const item of iterable) {
    if (count++ >= n) return;
    yield item;
  }
}
function* naturals() {
  let i = 1;
  while (true) yield i++;
}
console.log([...take(naturals(), 5)]); // => [ 1, 2, 3, 4, 5 ]  (from an infinite source!)


// ── 5. yield* — delegate to another generator/iterable ───────────────────────
function* letters() { yield 'a'; yield 'b'; }
function* combined() {
  yield* letters();   // yield everything from letters()
  yield* [1, 2];      // yield* works on any iterable
}
console.log([...combined()]); // => [ 'a', 'b', 1, 2 ]


// ── 6. Make your OWN object iterable ─────────────────────────────────────────
// Add a [Symbol.iterator] method (a generator is the simplest way).
const range = {
  start: 1,
  end: 5,
  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) yield i;
  },
};
console.log([...range]);            // => [ 1, 2, 3, 4, 5 ]
for (const n of range) process.stdout.write(n + ' '); // => 1 2 3 4 5
console.log();


/* WHY USE GENERATORS? --------------------------------------------------------
 *   • Represent infinite or huge sequences without storing them all in memory.
 *   • Produce values lazily, on demand.
 *   • Write custom iteration for your own data structures cleanly.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Write a generator fibonacci() and take the first 10 numbers.
 *   2. Make an object { from, to } iterable so [...it] counts from→to.
 *   3. Write a generator that yields only the even numbers of an array.
 * ------------------------------------------------------------------------- */
