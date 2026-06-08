/* =============================================================================
 * 12 · ARRAYS — basics
 * =============================================================================
 * Run:  node lessons/12-arrays.js
 *
 * WHAT YOU'LL LEARN
 *   • Creating and accessing arrays
 *   • Adding / removing elements (the mutating methods)
 *   • Mutating vs non-mutating operations
 * (Transform methods like map/filter/reduce get their own lesson — 13.)
 * ========================================================================== */

// ── 1. Creating & accessing ──────────────────────────────────────────────────
const fruits = ['apple', 'banana', 'cherry'];
console.log(fruits[0]);        // => apple   (zero-indexed)
console.log(fruits.at(-1));    // => cherry  (.at supports negative indexes)
console.log(fruits.length);    // => 3

// Arrays can hold any mix of types (but usually keep them consistent):
const mixed = [1, 'two', true, null, { id: 1 }];
console.log(mixed.length);     // => 5


// ── 2. Add / remove at the ENDS (these MUTATE the array) ─────────────────────
const stack = ['a', 'b'];
stack.push('c');         // add to end      → ['a','b','c']
console.log(stack.pop());// remove from end → returns 'c', array is ['a','b']
stack.unshift('z');      // add to start    → ['z','a','b']
console.log(stack.shift());// remove from start → returns 'z', array is ['a','b']
console.log(stack);      // => [ 'a', 'b' ]


// ── 3. splice — remove/insert ANYWHERE (mutates) ─────────────────────────────
const nums = [1, 2, 3, 4, 5];
// splice(startIndex, deleteCount, ...itemsToInsert)
nums.splice(1, 2);          // remove 2 items starting at index 1
console.log(nums);          // => [ 1, 4, 5 ]
nums.splice(1, 0, 'x', 'y');// insert without deleting
console.log(nums);          // => [ 1, 'x', 'y', 4, 5 ]


// ── 4. slice — COPY a portion (does NOT mutate) ──────────────────────────────
const letters = ['a', 'b', 'c', 'd'];
console.log(letters.slice(1, 3)); // => [ 'b', 'c' ]  (end not included)
console.log(letters.slice(-2));   // => [ 'c', 'd' ]
console.log(letters);             // => unchanged: [ 'a','b','c','d' ]


// ── 5. Searching ─────────────────────────────────────────────────────────────
const colors = ['red', 'green', 'blue'];
console.log(colors.includes('green')); // => true
console.log(colors.indexOf('blue'));   // => 2   (-1 if not found)


// ── 6. Combining & converting ────────────────────────────────────────────────
console.log([1, 2].concat([3, 4]));    // => [1,2,3,4]  (non-mutating join)
console.log([1, 2, 3].join('-'));      // => "1-2-3"    (array → string)
console.log([3, 1, 2].sort());         // => [1,2,3]    (⚠️ MUTATES, sorts as text)
console.log([1, 2, 3].reverse());      // => [3,2,1]    (⚠️ MUTATES)

// ⚠️ Default sort is alphabetical! For numbers, pass a comparator:
console.log([10, 2, 1].sort());            // => [1, 10, 2]  (wrong!)
console.log([10, 2, 1].sort((a, b) => a - b)); // => [1, 2, 10]  (correct)


// ── 7. Copying safely (avoid accidental shared references) ───────────────────
const source = [1, 2, 3];
const copy1 = [...source];        // spread copy
const copy2 = source.slice();     // slice copy
copy1.push(4);
console.log(source, copy1);       // => [1,2,3] [1,2,3,4]  (source untouched)

// `fill` overwrites a range with one value (mutates the array):
console.log([1, 2, 3, 4].fill(0, 1, 3)); // => [1, 0, 0, 4]  (indices 1–2 → 0)


/* MUTATING vs NON-MUTATING ---------------------------------------------------
 *   MUTATES:     push pop shift unshift splice sort reverse fill
 *   RETURNS NEW: slice concat map filter [...spread] join
 *   When in doubt, prefer non-mutating — it prevents sneaky bugs.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Start with [], push 3 items, then remove the first one.
 *   2. Sort [42, 7, 100, 1] numerically ascending and descending.
 *   3. Copy an array, mutate the copy, and prove the original is unchanged.
 * ------------------------------------------------------------------------- */
