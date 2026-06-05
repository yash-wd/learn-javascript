/* =============================================================================
 * 07 · CONDITIONALS
 * =============================================================================
 * Run:  node lessons/07-conditionals.js
 *
 * WHAT YOU'LL LEARN
 *   • if / else if / else
 *   • The ternary operator (? :)
 *   • switch statements
 *   • Guard clauses for cleaner code
 * ========================================================================== */

// ── 1. if / else if / else ───────────────────────────────────────────────────
const score = 82;

if (score >= 90) {
  console.log('Grade: A');
} else if (score >= 80) {
  console.log('Grade: B'); // => Grade: B
} else if (score >= 70) {
  console.log('Grade: C');
} else {
  console.log('Grade: F');
}


// ── 2. Ternary operator — a one-line if/else that RETURNS a value ────────────
const age = 20;
const status = age >= 18 ? 'adult' : 'minor';
console.log(status); // => adult

// Great for assigning a value; avoid nesting them deeply (hard to read).
const fee = age < 12 ? 0 : age < 65 ? 100 : 50;
console.log(fee); // => 100


// ── 3. Logical operators as conditionals ─────────────────────────────────────
// && runs the right side only if the left is truthy:
const isLoggedIn = true;
isLoggedIn && console.log('Welcome back!'); // => Welcome back!

// || provides a fallback value:
const username = '' || 'Guest';
console.log(username); // => Guest


// ── 4. switch — clean alternative for many discrete cases ────────────────────
const day = 'SAT';
let kind;

switch (day) {
  case 'SAT':
  case 'SUN':           // cases can share a body (no break between them)
    kind = 'weekend';
    break;              // ⚠️ without break, execution "falls through" to the next case
  case 'MON':
    kind = 'start of week';
    break;
  default:              // runs if nothing matched
    kind = 'weekday';
}
console.log(kind); // => weekend


// ── 5. Guard clauses — return early to avoid deep nesting ────────────────────
// ❌ Nested and hard to read:
function checkoutNested(cart) {
  if (cart) {
    if (cart.items.length > 0) {
      return 'Proceeding to payment';
    } else {
      return 'Cart is empty';
    }
  } else {
    return 'No cart';
  }
}

// ✅ Flat and readable — handle the exits first:
function checkout(cart) {
  if (!cart) return 'No cart';
  if (cart.items.length === 0) return 'Cart is empty';
  return 'Proceeding to payment';
}
console.log(checkout({ items: ['book'] })); // => Proceeding to payment
console.log(checkout({ items: [] }));       // => Cart is empty
console.log(checkout(null));                // => No cart


/* PRACTICE -------------------------------------------------------------------
 *   1. Write an if/else that logs "even" or "odd" for a number (use % 2).
 *   2. Rewrite it as a ternary.
 *   3. Use a switch to map 1–7 to weekday names.
 * ------------------------------------------------------------------------- */
