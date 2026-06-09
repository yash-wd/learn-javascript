/* =============================================================================
 * SOLUTIONS · 30 · FUNCTIONAL PROGRAMMING
 * =============================================================================
 * Run:  node lessons/solutions/30-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/30-functional-programming.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Rewrite a loop that mutates an array as a pure map/filter chain. ──────
// Imperative (mutates a result array):
//   const out = []; for (const n of nums) if (n % 2 === 0) out.push(n * 10);
// Functional (no mutation — inputs untouched, a new array comes out):
const nums = [1, 2, 3, 4, 5, 6];
const result = nums.filter((n) => n % 2 === 0).map((n) => n * 10);
console.log('1.', result, '· original untouched:', nums);
// => 1. [ 20, 40, 60 ] · original untouched: [ 1, 2, 3, 4, 5, 6 ]

// ── 2. Curry a function divide(a)(b) and make a halve = divide-by-2 helper. ──
const divide = (a) => (b) => a / b; // divide(10)(2) === 5
const halve = (n) => divide(n)(2);  // reuse divide to build a one-arg helper
console.log('2.', divide(10)(2), '·', halve(50)); // => 2. 5 · 25

// ── 3. Use pipe to: trim → lowercase → replace spaces with "-" on a string. ──
const pipe = (...fns) => (input) => fns.reduce((value, fn) => fn(value), input);
const slugify = pipe(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replaceAll(' ', '-')
);
console.log('3.', slugify('  Hello World Wide Web  ')); // => 3. hello-world-wide-web
