/* =============================================================================
 * 30 · FUNCTIONAL PROGRAMMING
 * =============================================================================
 * Run:  node lessons/30-functional-programming.js
 *
 * WHAT YOU'LL LEARN
 *   • Pure functions & immutability
 *   • Higher-order functions
 *   • Currying & partial application
 *   • Function composition (pipe / compose)
 *
 * FP is a STYLE: build programs from small, predictable functions that don't
 * change shared state. It makes code easier to test and reason about.
 * ========================================================================== */

// ── 1. Pure functions ────────────────────────────────────────────────────────
// A pure function: (1) same input → same output, (2) no side effects.
const addPure = (a, b) => a + b;        // ✅ pure
console.log(addPure(2, 3));             // => 5  (always)

let total = 0;
const addImpure = (n) => (total += n);  // ❌ impure — mutates outside state
addImpure(5);
console.log(total);                     // => 5  (depends on history; harder to test)


// ── 2. Immutability — don't mutate, return new data ──────────────────────────
const nums = [1, 2, 3];

// ❌ mutating:
// nums.push(4);  nums.sort();

// ✅ immutable: produce NEW arrays/objects instead
const added = [...nums, 4];                 // => [1,2,3,4], nums untouched
const doubled = nums.map((n) => n * 2);     // => [2,4,6]
const sorted = [...nums].sort((a, b) => b - a); // copy before sort
console.log(nums, added, doubled, sorted);  // => [1,2,3] [1,2,3,4] [2,4,6] [3,2,1]

const user = { name: 'Sam', age: 25 };
const older = { ...user, age: 26 };         // new object, original unchanged
console.log(user.age, older.age);           // => 25 26


// ── 3. Higher-order functions (take or return functions) ─────────────────────
// map/filter/reduce are HOFs (lesson 13). You can write your own:
const withLogging = (fn) => (...args) => {
  console.log(`calling with ${args}`);
  return fn(...args);
};
const loggedAdd = withLogging(addPure);
console.log(loggedAdd(4, 5)); // => calling with 4,5 / 9


// ── 4. Currying — turn f(a, b, c) into f(a)(b)(c) ────────────────────────────
// Lets you "fix" arguments one at a time and build specialized functions.
const multiply = (a) => (b) => a * b;
console.log(multiply(3)(4));   // => 12
const triple = multiply(3);    // pre-fill the first argument
console.log(triple(10));       // => 30

// A generic curry helper:
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
const sum3 = curry((a, b, c) => a + b + c);
console.log(sum3(1)(2)(3));   // => 6
console.log(sum3(1, 2)(3));   // => 6
console.log(sum3(1)(2, 3));   // => 6


// ── 5. Partial application — pre-fill SOME arguments ─────────────────────────
const greet = (greeting, name) => `${greeting}, ${name}!`;
const sayHello = greet.bind(null, 'Hello'); // fix the first arg
console.log(sayHello('Ana')); // => Hello, Ana!


// ── 6. Composition — pipe data through a series of functions ─────────────────
// pipe: left → right (read top to bottom). compose: right → left (math style).
const pipe = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input);
const compose = (...fns) => (input) => fns.reduceRight((acc, fn) => fn(acc), input);

const inc = (n) => n + 1;
const double = (n) => n * 2;
const square = (n) => n * n;

const transform = pipe(inc, double, square); // ((n+1)*2)^2
console.log(transform(3)); // => 64   (3→4→8→64)

const transform2 = compose(square, double, inc); // same result, reversed order
console.log(transform2(3)); // => 64


// ── 7. Putting it together (declarative data pipeline) ───────────────────────
const orders = [
  { item: 'pen', price: 5, qty: 3 },
  { item: 'pad', price: 8, qty: 2 },
  { item: 'ink', price: 12, qty: 1 },
];
const grandTotal = orders
  .map((o) => o.price * o.qty)   // line totals: [15, 16, 12]
  .filter((t) => t >= 12)        // keep big lines: [15, 16, 12]
  .reduce((sum, t) => sum + t, 0);
console.log(grandTotal); // => 43


/* WHY FP? --------------------------------------------------------------------
 *   • Pure + immutable = predictable, easy to test, fewer "spooky" bugs.
 *   • Small composable functions read like a recipe.
 *   • You don't have to go 100% FP — adopting purity & immutability where it
 *     helps already makes most codebases cleaner.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Rewrite a loop that mutates an array as a pure map/filter chain.
 *   2. Curry a function divide(a)(b) and make a halve = divide-by-2 helper.
 *   3. Use pipe to: trim → lowercase → replace spaces with "-" on a string.
 * ------------------------------------------------------------------------- */
