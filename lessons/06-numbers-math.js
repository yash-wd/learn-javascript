/* =============================================================================
 * 06 · NUMBERS & MATH
 * =============================================================================
 * Run:  node lessons/06-numbers-math.js
 *
 * WHAT YOU'LL LEARN
 *   • How JS represents numbers (one type for ints and decimals)
 *   • Rounding and formatting
 *   • The Math object
 *   • The floating-point precision gotcha
 * ========================================================================== */

// ── 1. One number type ───────────────────────────────────────────────────────
console.log(10);     // integer
console.log(10.5);   // decimal — both are the same `number` type
console.log(1e6);    // => 1000000  (scientific notation)
console.log(0xff);   // => 255      (hexadecimal)


// ── 2. Formatting & rounding ─────────────────────────────────────────────────
const price = 19.99876;
console.log(price.toFixed(2));   // => "20.00"  (string — toFixed ROUNDS: ...876 rounds up)
console.log(Math.round(2.5));    // => 3   (nearest integer)
console.log(Math.floor(2.9));    // => 2   (round DOWN)
console.log(Math.ceil(2.1));     // => 3   (round UP)
console.log(Math.trunc(-2.7));   // => -2  (drop the decimal, no rounding)

// Format with thousands separators:
console.log((1234567.89).toLocaleString('en-US')); // => 1,234,567.89

// Intl.NumberFormat — the full-control formatter (currency, percent, locales).
// Build it once and reuse it; it handles the currency symbol and rounding.
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
console.log(usd.format(1234.5));  // => $1,234.50

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
console.log(inr.format(1234567)); // => ₹12,34,567.00  (note Indian digit grouping)

const pct = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });
console.log(pct.format(0.1487));  // => 14.9%


// ── 3. The Math object ───────────────────────────────────────────────────────
console.log(Math.max(3, 7, 2));  // => 7
console.log(Math.min(3, 7, 2));  // => 3
console.log(Math.abs(-9));       // => 9
console.log(Math.sqrt(81));      // => 9
console.log(Math.pow(2, 10));    // => 1024  (or use 2 ** 10)
console.log(Math.PI);            // => 3.14159...

// Random number between 0 (inclusive) and 1 (exclusive):
// (commented out so the lesson's output stays stable when you re-run it)
// console.log(Math.random());

// Random integer between min and max (inclusive) — a reusable pattern:
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// console.log(randomInt(1, 6)); // a dice roll: 1–6


// ── 4. Parsing & validating ──────────────────────────────────────────────────
console.log(parseInt('42px', 10)); // => 42   (always pass the radix 10)
console.log(parseFloat('3.14m'));  // => 3.14
console.log(Number.isInteger(5));  // => true
console.log(Number.isInteger(5.1));// => false
console.log(Number.isNaN(0 / 0));  // => true  (0/0 is NaN)
console.log(Number.isFinite(1/0)); // => false (1/0 is Infinity)


// ── 5. ⚠️ The floating-point gotcha ──────────────────────────────────────────
// Computers store decimals in binary, which can't represent some values exactly.
console.log(0.1 + 0.2);            // => 0.30000000000000004  (not 0.3!)
console.log(0.1 + 0.2 === 0.3);    // => false

// Fixes:
console.log((0.1 + 0.2).toFixed(2));               // => "0.30"
console.log(Math.abs(0.1 + 0.2 - 0.3) < 1e-9);     // => true (compare with tolerance)
// For money, work in the smallest unit (cents) as integers to avoid this entirely.


/* PRACTICE -------------------------------------------------------------------
 *   1. Round 7.456 to 1 decimal place as a string.
 *   2. Find the largest of [12, 7, 25, 3] using Math.max with the spread (...).
 *   3. Write a function that returns a random integer between 1 and 100.
 * ------------------------------------------------------------------------- */
