/* =============================================================================
 * SOLUTIONS · 09 · FUNCTIONS
 * =============================================================================
 * Run:  node lessons/solutions/09-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/09-functions.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Write isEven(n) three ways: declaration, expression, arrow. ───────────
function isEvenDecl(n) {           // declaration — hoisted
  return n % 2 === 0;
}
const isEvenExpr = function (n) {  // expression — assigned to a const
  return n % 2 === 0;
};
const isEvenArrow = (n) => n % 2 === 0; // arrow — implicit return
console.log('1.', isEvenDecl(4), isEvenExpr(7), isEvenArrow(10)); // => 1. true false true

// ── 2. Write a function with a default greeting parameter. ───────────────────
function greet(name, greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}
console.log('2.', greet('Ada'));            // => 2. Hello, Ada!
console.log('2.', greet('Ada', 'Welcome')); // => 2. Welcome, Ada!

// ── 3. Write average(...nums) that returns the mean of any count of numbers. ──
function average(...nums) {
  if (nums.length === 0) return 0; // avoid dividing by zero
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}
console.log('3.', average(4, 8, 15, 16, 23, 42)); // => 3. 18

// ── 4. Write a recursive countdown(n) that logs n, n-1, ... down to 0. ───────
function countdown(n) {
  if (n < 0) return;      // base case — stop recursing
  console.log('4.', n);
  countdown(n - 1);       // recursive case — step toward the base
}
countdown(3); // => 4. 3 / 4. 2 / 4. 1 / 4. 0

// ── 5. Write a recursive power(base, exp) — no Math.pow, no ** operator. ─────
function power(base, exp) {
  if (exp === 0) return 1;            // anything^0 is 1
  return base * power(base, exp - 1); // base * base^(exp-1)
}
console.log('5.', power(2, 10)); // => 5. 1024
