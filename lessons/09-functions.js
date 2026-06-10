/* =============================================================================
 * 09 · FUNCTIONS
 * =============================================================================
 * Run:  node lessons/09-functions.js
 *
 * WHAT YOU'LL LEARN
 *   • Function declarations vs expressions vs arrow functions
 *   • Parameters: default values, rest parameters
 *   • Returning values
 *   • Functions are "first-class" — they're values you can pass around
 *   • Recursion — a function that calls itself
 * ========================================================================== */

// ── 1. Function declaration ──────────────────────────────────────────────────
// Hoisted — you can call it BEFORE it's defined in the file.
console.log(add(2, 3)); // => 5  (works even though add is defined below)

function add(a, b) {
  return a + b; // `return` sends a value back to the caller
}
// A function with no `return` returns undefined.


// ── 2. Function expression ───────────────────────────────────────────────────
// Stored in a variable. NOT hoisted — must be defined before use.
const multiply = function (a, b) {
  return a * b;
};
console.log(multiply(4, 5)); // => 20


// ── 3. Arrow functions — shorter syntax ──────────────────────────────────────
const square = (x) => x * x;          // single expression → implicit return
console.log(square(6));               // => 36

const subtract = (a, b) => a - b;     // multiple params need parentheses
console.log(subtract(10, 4));         // => 6

const greet = () => 'Hello!';         // no params → empty parentheses
console.log(greet());                 // => Hello!

// Need multiple lines? Use a block { } and an explicit return:
const describe = (name, age) => {
  const label = `${name} is ${age}`;
  return label;
};
console.log(describe('Sam', 25));     // => Sam is 25
// NOTE: arrows handle `this` differently — covered in lesson 11.


// ── 4. Default parameters ────────────────────────────────────────────────────
function greetUser(name = 'Guest') {
  return `Welcome, ${name}!`;
}
console.log(greetUser('Alex')); // => Welcome, Alex!
console.log(greetUser());       // => Welcome, Guest!  (default kicks in)


// ── 5. Rest parameters — collect "the rest" into an array ────────────────────
function sum(...numbers) {        // numbers is a real array: [1, 2, 3, 4]
  return numbers.reduce((total, n) => total + n, 0); // reduce = "sum the array" (lesson 13)
}
console.log(sum(1, 2, 3, 4));   // => 10
console.log(sum(5, 5));         // => 10


// ── 6. Functions are values (first-class) ────────────────────────────────────
// You can store them, pass them as arguments, and return them.
function applyTwice(fn, value) {
  return fn(fn(value));         // call the passed-in function twice
}
console.log(applyTwice(square, 2)); // => 16  (square(square(2)) = square(4))

// A function returned by another function (a "factory"):
function makeMultiplier(factor) {
  return (x) => x * factor;
}
const triple = makeMultiplier(3);
console.log(triple(5)); // => 15


// ── 7. Recursion — a function that calls itself ──────────────────────────────
// Every recursion needs TWO things:
//   1. a BASE CASE that stops it (no base case → "Maximum call stack" crash)
//   2. a step that moves CLOSER to the base case on each call
function factorial(n) {
  if (n <= 1) return 1;          // base case — stop here
  return n * factorial(n - 1);   // recursive step — n gets smaller each time
}
console.log(factorial(5)); // => 120   (5 * 4 * 3 * 2 * 1)

// Anything you can do with a loop, you can do with recursion:
function sumTo(n) {
  if (n === 0) return 0;         // base case
  return n + sumTo(n - 1);
}
console.log(sumTo(4)); // => 10  (4 + 3 + 2 + 1 + 0)

// Recursion SHINES on nested/tree-shaped data, where loops get awkward.
// Here we add up every number in an arbitrarily deep nested array:
function deepSum(arr) {
  let total = 0;
  for (const item of arr) {
    // if it's an array, recurse into it; otherwise add the number
    total += Array.isArray(item) ? deepSum(item) : item;
  }
  return total;
}
console.log(deepSum([1, [2, [3, 4], 5], [6]])); // => 21

// Mental model: each call waits ("on the call stack") for the deeper call to
// finish, then combines the result — like opening boxes inside boxes, then
// re-stacking them on the way back out.


/* PRACTICE -------------------------------------------------------------------
 *   1. Write isEven(n) three ways: declaration, expression, arrow.
 *   2. Write a function with a default greeting parameter.
 *   3. Write average(...nums) that returns the mean of any count of numbers.
 *   4. Write a recursive countdown(n) that logs n, n-1, ... down to 0.
 *   5. Write a recursive power(base, exp) — no Math.pow, no ** operator.
 * ------------------------------------------------------------------------- */
