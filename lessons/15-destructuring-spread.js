/* =============================================================================
 * 15 · DESTRUCTURING & SPREAD / REST
 * =============================================================================
 * Run:  node lessons/15-destructuring-spread.js
 *
 * WHAT YOU'LL LEARN
 *   • Pulling values out of arrays and objects in one line (destructuring)
 *   • Spreading (...) to expand arrays/objects
 *   • Rest (...) to collect leftovers
 * These show up EVERYWHERE in modern JS — learn them well.
 * ========================================================================== */

// ── 1. Array destructuring ───────────────────────────────────────────────────
const rgb = [255, 128, 0];
const [red, green, blue] = rgb; // unpack by position
console.log(red, green, blue);  // => 255 128 0

// Skip items with empty commas:
const [first, , third] = ['a', 'b', 'c'];
console.log(first, third); // => a c

// Default values for missing items:
const [x = 0, y = 0, z = 0] = [10, 20];
console.log(x, y, z); // => 10 20 0

// Swap variables without a temp variable:
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // => 2 1


// ── 2. Object destructuring ──────────────────────────────────────────────────
const user = { name: 'Sam', age: 25, city: 'Pune' };
const { name, age } = user; // unpack by KEY name (order doesn't matter)
console.log(name, age);     // => Sam 25

// Rename while unpacking:
const { name: fullName } = user;
console.log(fullName);      // => Sam

// Defaults for missing keys:
const { country = 'India' } = user;
console.log(country);       // => India

// Nested destructuring:
const order = { id: 7, customer: { email: 'a@b.com' } };
const { customer: { email } } = order;
console.log(email);         // => a@b.com


// ── 3. Destructuring in function parameters (very common) ────────────────────
// Instead of accepting an object and reading props inside:
function greet({ name, greeting = 'Hello' }) {
  return `${greeting}, ${name}!`;
}
console.log(greet({ name: 'Ana' }));                    // => Hello, Ana!
console.log(greet({ name: 'Bob', greeting: 'Hey' }));   // => Hey, Bob!


// ── 4. Spread (...) — expand an iterable into individual elements ────────────
// Combine arrays:
const lows = [1, 2];
const highs = [3, 4];
console.log([...lows, ...highs]);   // => [ 1, 2, 3, 4 ]

// Copy an array (shallow):
const copy = [...lows];

// Pass array items as separate arguments:
console.log(Math.max(...[5, 9, 2])); // => 9

// Merge / clone objects (later keys win):
const base = { theme: 'light', size: 14 };
const custom = { ...base, size: 18 }; // => { theme: 'light', size: 18 }
console.log(custom);

// Spread a string into characters:
console.log([...'abc']); // => [ 'a', 'b', 'c' ]


// ── 5. Rest (...) — collect "the rest" into an array/object ──────────────────
// In array destructuring:
const [winner, ...runnersUp] = ['gold', 'silver', 'bronze'];
console.log(winner);     // => gold
console.log(runnersUp);  // => [ 'silver', 'bronze' ]

// In object destructuring:
const { id, ...details } = { id: 1, name: 'Sam', age: 25 };
console.log(id);      // => 1
console.log(details); // => { name: 'Sam', age: 25 }

// In function parameters (gather all arguments):
function sum(...nums) {
  return nums.reduce((t, n) => t + n, 0);
}
console.log(sum(1, 2, 3, 4)); // => 10

// SPREAD vs REST: same `...` symbol, opposite jobs.
//   Spread → EXPANDS something out (used in calls/literals).
//   Rest   → COLLECTS many into one (used in parameters/patterns).


/* PRACTICE -------------------------------------------------------------------
 *   1. Destructure { title, year } from a movie object, defaulting year to 2024.
 *   2. Merge two arrays and dedupe them with [...new Set([...a, ...b])].
 *   3. Write a function printFirstAndRest(first, ...rest) and test it.
 * ------------------------------------------------------------------------- */
