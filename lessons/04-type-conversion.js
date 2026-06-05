/* =============================================================================
 * 04 · TYPE CONVERSION & COERCION
 * =============================================================================
 * Run:  node lessons/04-type-conversion.js
 *
 * WHAT YOU'LL LEARN
 *   • Explicit conversion (you do it) vs implicit coercion (JS does it)
 *   • Truthy and falsy values
 *   • The classic gotchas that confuse every beginner
 * ========================================================================== */

// ── 1. Explicit conversion (recommended) ─────────────────────────────────────
// You clearly state the target type. Predictable and readable.

console.log(Number('42'));     // => 42
console.log(Number('42px'));   // => NaN   ("Not a Number" — conversion failed)
console.log(parseInt('42px')); // => 42    (parseInt grabs the leading number)
console.log(parseFloat('3.14rad')); // => 3.14

console.log(String(42));       // => "42"
console.log(String(true));     // => "true"
console.log((42).toString());  // => "42"

console.log(Boolean(1));       // => true
console.log(Boolean(0));       // => false


// ── 2. Truthy & Falsy ────────────────────────────────────────────────────────
// Every value is either "truthy" or "falsy" in a boolean context (if, &&, etc).
// There are exactly 8 FALSY values — memorize these; everything else is truthy.

const falsyValues = [false, 0, -0, 0n, '', null, undefined, NaN];
falsyValues.forEach(v => console.log(Boolean(v))); // => all false

// Common surprises — these are all TRUTHY:
console.log(Boolean('0'));     // => true  (non-empty string!)
console.log(Boolean('false')); // => true  (non-empty string!)
console.log(Boolean([]));      // => true  (empty array is truthy)
console.log(Boolean({}));      // => true  (empty object is truthy)


// ── 3. Implicit coercion (happens automatically) ─────────────────────────────
// The + operator: if EITHER side is a string, it concatenates.
console.log(1 + '2');   // => "12"  (number 1 becomes string "1")
console.log('3' + 4);   // => "34"
console.log(1 + 2 + '3'); // => "33" (left-to-right: 1+2=3, then 3+'3'="33")

// Other math operators (- * / %) convert strings TO numbers:
console.log('6' - 2);   // => 4
console.log('6' * '2'); // => 12
console.log('a' - 2);   // => NaN


// ── 4. The == vs === reminder ────────────────────────────────────────────────
// == coerces types before comparing → unpredictable. Always prefer ===.
console.log('' == 0);          // => true   😱
console.log('0' == 0);         // => true   😱
console.log(null == undefined);// => true   (the one == case that's handy)
console.log(NaN === NaN);      // => false  (NaN is never equal to anything!)
console.log(Number.isNaN(NaN));// => true   (the correct way to check for NaN)


/* PRACTICE -------------------------------------------------------------------
 *   1. Convert the string "100" to a number three different ways.
 *   2. Predict the output of: [] + [], [] + {}, true + 1.  Then run them.
 *   3. List all 8 falsy values from memory, then check yourself above.
 * ------------------------------------------------------------------------- */
