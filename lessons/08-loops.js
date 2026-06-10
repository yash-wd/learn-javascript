/* =============================================================================
 * 08 · LOOPS
 * =============================================================================
 * Run:  node lessons/08-loops.js
 *
 * WHAT YOU'LL LEARN
 *   • for, while, do...while
 *   • for...of (values) vs for...in (keys)
 *   • break and continue
 *   • Which loop to reach for
 * ========================================================================== */

// ── 1. Classic for loop — when you need an index/counter ─────────────────────
for (let i = 0; i < 3; i++) {
  console.log('for', i); // => 0, 1, 2
}
// Anatomy:  for (initialize; condition; afterEachLoop) { body }


// ── 2. while — loop until a condition becomes false ──────────────────────────
let count = 3;
while (count > 0) {
  console.log('while', count); // => 3, 2, 1
  count--;
}

// ── 3. do...while — runs the body AT LEAST once, then checks ─────────────────
let n = 0;
do {
  console.log('do-while runs once even though condition is false');
} while (n > 0);


// ── 4. for...of — iterate over VALUES (arrays, strings, Sets, Maps) ──────────
// This is the modern go-to for looping over a collection.
const fruits = ['apple', 'banana', 'cherry'];
for (const fruit of fruits) {
  console.log(fruit); // => apple, banana, cherry
}

// Need the index too? Use .entries():
for (const [index, fruit] of fruits.entries()) {
  console.log(index, fruit); // => 0 apple, 1 banana, 2 cherry
}

// Strings are iterable too:
for (const char of 'hi') {
  console.log(char); // => h, i
}


// ── 5. for...in — iterate over KEYS of an object ─────────────────────────────
// Use this for objects. (Avoid it for arrays — for...of is better there.)
// ⚠️ for...in also visits INHERITED enumerable keys (up the prototype chain),
// not just an object's own. For own keys only, prefer Object.keys() (lesson 14).
const user = { name: 'Sam', age: 25, city: 'Pune' };
for (const key in user) {
  console.log(`${key}: ${user[key]}`); // => name: Sam, age: 25, city: Pune
}


// ── 6. break & continue ──────────────────────────────────────────────────────
for (let i = 1; i <= 5; i++) {
  if (i === 4) break;       // stop the loop entirely
  if (i === 2) continue;    // skip the rest of THIS iteration only
  console.log('flow', i);   // => 1, 3
}


// ── 7. Array helper loops (preview of lesson 13) ─────────────────────────────
// forEach runs a function for each element — no manual index needed.
fruits.forEach((fruit, i) => console.log(i, fruit));


/* WHICH LOOP? ----------------------------------------------------------------
 *   • Looping over array/string values .......... for...of
 *   • Looping over object keys .................. for...in
 *   • Need a numeric counter / step ............. classic for
 *   • Repeat until a condition .................. while
 *   • Transforming an array into a new one ...... .map() (lesson 13)
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Print 1–10 with a for loop, but skip multiples of 3 (continue).
 *   2. Sum all numbers in [4, 8, 15, 16, 23, 42] with for...of.
 *   3. Loop over an object's keys and values with for...in.
 * ------------------------------------------------------------------------- */
