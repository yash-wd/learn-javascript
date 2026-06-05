/* =============================================================================
 * 03 · OPERATORS
 * =============================================================================
 * Run:  node lessons/03-operators.js
 *
 * WHAT YOU'LL LEARN
 *   • Arithmetic, assignment, comparison, and logical operators
 *   • Strict (===) vs loose (==) equality — and why you should use ===
 *   • Modern operators: nullish (??) and optional chaining (?.)
 * ========================================================================== */

// ── 1. Arithmetic ────────────────────────────────────────────────────────────
console.log(7 + 3);  // => 10
console.log(7 - 3);  // => 4
console.log(7 * 3);  // => 21
console.log(7 / 3);  // => 2.333...
console.log(7 % 3);  // => 1   (modulo / remainder — great for "is it even?")
console.log(2 ** 3); // => 8   (exponentiation: 2 to the power of 3)

// ── 2. Assignment shorthands ─────────────────────────────────────────────────
let n = 10;
n += 5;  console.log(n); // => 15   (same as n = n + 5)
n -= 3;  console.log(n); // => 12
n *= 2;  console.log(n); // => 24
n /= 4;  console.log(n); // => 6

// Increment / decrement
let i = 0;
console.log(i++); // => 0  (post: returns THEN increments → i is now 1)
console.log(++i); // => 2  (pre: increments THEN returns)

// ── 3. Comparison ────────────────────────────────────────────────────────────
console.log(5 > 3);   // => true
console.log(5 <= 5);  // => true

// === is STRICT equality: compares value AND type, no conversion. Prefer it.
console.log(5 === 5);    // => true
console.log(5 === '5');  // => false  (number vs string)

// == is LOOSE equality: converts types first → surprising results. Avoid it.
console.log(5 == '5');   // => true   (string '5' gets converted to number 5)
console.log(0 == false); // => true   (😱 this is why we avoid ==)
console.log(0 === false);// => false

// ── 4. Logical operators ─────────────────────────────────────────────────────
console.log(true && false); // => false  (AND — both must be true)
console.log(true || false); // => true   (OR — at least one true)
console.log(!true);         // => false  (NOT — flips the boolean)

// && and || actually return one of the OPERANDS, not just true/false:
console.log('' || 'fallback');     // => fallback  (first truthy value)
console.log('hi' && 'world');      // => world     (last value if all truthy)

// ── 5. Nullish coalescing (??) ───────────────────────────────────────────────
// ?? returns the right side ONLY when the left is null or undefined.
// Unlike ||, it treats 0 and '' as valid values.
const volume = 0;
console.log(volume || 5);  // => 5   (|| sees 0 as falsy — wrong here!)
console.log(volume ?? 5);  // => 0   (?? keeps 0 — correct)

// ── 6. Optional chaining (?.) ────────────────────────────────────────────────
// Safely read deep properties without crashing on null/undefined.
const profile = { name: 'Sam', address: { city: 'Pune' } };
console.log(profile.address?.city);   // => Pune
console.log(profile.contact?.email);  // => undefined  (no crash!)
// console.log(profile.contact.email); // ❌ TypeError without the ?.


/* PRACTICE -------------------------------------------------------------------
 *   1. Use % to check whether 17 is even or odd.
 *   2. Predict then verify: 0 == '', 0 === '', null == undefined.
 *   3. Give a setting a default with ?? where 0 should be a valid value.
 * ------------------------------------------------------------------------- */
