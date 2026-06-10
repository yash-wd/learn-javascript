/* =============================================================================
 * 02 · DATA TYPES
 * =============================================================================
 * Run:  node lessons/02-data-types.js
 *
 * WHAT YOU'LL LEARN
 *   • The 7 primitive types and the object type
 *   • How `typeof` reports each type (and its one famous bug)
 *   • The difference between value types and reference types
 * ========================================================================== */

// ── 1. The primitive types ───────────────────────────────────────────────────
// Primitives are immutable, single values. There are 7:

const aString  = 'hello';         // string
const aNumber  = 42;              // number (integers AND decimals)
const aBoolean = true;            // boolean — true / false
const nothing  = null;            // null — an intentional "empty" value
let   notSet;                     // undefined — declared but no value yet
const big      = 9007199254740993n; // bigint — integers beyond Number's safe range
const unique   = Symbol('id');    // symbol — a guaranteed-unique value

console.log(typeof aString);  // => string
console.log(typeof aNumber);  // => number
console.log(typeof aBoolean); // => boolean
console.log(typeof notSet);   // => undefined
console.log(typeof big);      // => bigint
console.log(typeof unique);   // => symbol

// ⚠️ FAMOUS BUG: typeof null is "object". It's a bug from JavaScript's earliest
// days, kept for backwards compatibility. Just memorize it.
console.log(typeof nothing);  // => object  (NOT "null"!)


// ── 2. Objects (everything that isn't a primitive) ───────────────────────────
const obj   = { a: 1 };
const arr   = [1, 2, 3];
const fn    = function () {};

console.log(typeof obj); // => object
console.log(typeof arr); // => object   (arrays are objects! use Array.isArray)
console.log(typeof fn);  // => function (functions are callable objects)

console.log(Array.isArray(arr)); // => true   ← the correct way to detect arrays
console.log(Array.isArray(obj)); // => false


// ── 3. Value vs reference ────────────────────────────────────────────────────
// Primitives are copied BY VALUE — each variable holds its own copy.
let x = 10;
let y = x;   // y gets a COPY of 10
y = 99;
console.log(x, y); // => 10 99   (changing y did not affect x)

// Objects/arrays: assigning copies the REFERENCE (the "address"), not the data —
// so both names end up pointing to the SAME underlying object.
const original = { score: 1 };
const alias = original;   // alias gets a copy of the reference → same object
alias.score = 100;
console.log(original.score); // => 100  (they share one object!)

// To truly copy an object, spread it (shallow copy):
const copy = { ...original };
copy.score = 5;
console.log(original.score, copy.score); // => 100 5


// ── 4. null vs undefined ─────────────────────────────────────────────────────
// undefined → "this has not been given a value yet" (usually by JS)
// null      → "this is intentionally empty" (usually set by you)
let unassigned;
console.log(unassigned);     // => undefined
const cleared = null;
console.log(cleared);        // => null


/* PRACTICE -------------------------------------------------------------------
 *   1. Log the typeof for: "5", 5, true, null, undefined, [], {}.
 *   2. Copy an object two ways: by reference and with spread. Mutate each copy
 *      and observe which one affects the original.
 * ------------------------------------------------------------------------- */
