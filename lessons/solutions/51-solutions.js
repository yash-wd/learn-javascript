/* =============================================================================
 * SOLUTIONS · 51 · BIGINT & LANGUAGE CORNERS
 * =============================================================================
 * Run:  node lessons/solutions/51-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/51-bigint-and-language-corners.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Compute 100! (factorial) with BigInt — impossible to do exactly with Number. ──
let factorial = 1n; // the `n` suffix makes a BigInt
for (let i = 2n; i <= 100n; i++) factorial *= i;
console.log('1.', `100! has ${factorial.toString().length} digits`); // => 1. 100! has 158 digits
console.log('1.', factorial.toString().slice(0, 30) + '…'); // first 30 digits, all exact
// A regular Number can only hold ~15 significant digits, so 100! as a Number
// would be a rounded, inexact value (and far past Number.MAX_SAFE_INTEGER).

// ── 2. Use Object.entries + map + Object.fromEntries to UPPERCASE every value. ──
const upper = Object.fromEntries(
  Object.entries({ a: 'x', b: 'y' }).map(([key, value]) => [key, value.toUpperCase()])
);
console.log('2.', upper); // => 2. { a: 'X', b: 'Y' }

// ── 3. Use flatMap to turn [{tags:['js','ts']},{tags:['css']}] into one tag list. ──
// flatMap = map then flatten one level — perfect for "array of arrays" fields.
const allTags = [{ tags: ['js', 'ts'] }, { tags: ['css'] }].flatMap((o) => o.tags);
console.log('3.', allTags); // => 3. [ 'js', 'ts', 'css' ]

// ── 4. Use a labeled loop to find the first pair (i,j) in two arrays that sums to 7. ──
// A label lets `break` jump out of BOTH loops at once.
const A = [1, 2, 3];
const B = [9, 5, 4];
let pair = null;
search: for (let i = 0; i < A.length; i++) {
  for (let j = 0; j < B.length; j++) {
    if (A[i] + B[j] === 7) {
      pair = { i, j, sum: `${A[i]}+${B[j]}` };
      break search; // exits both loops immediately
    }
  }
}
console.log('4.', pair); // => 4. { i: 1, j: 1, sum: '2+5' }
