/* =============================================================================
 * 16 · SETS & MAPS
 * =============================================================================
 * Run:  node lessons/16-sets-maps.js
 *
 * WHAT YOU'LL LEARN
 *   • Set — a collection of UNIQUE values
 *   • Map — key/value pairs where keys can be ANY type
 *   • When to reach for these instead of arrays/objects
 * ========================================================================== */

// ── 1. Set — unique values, fast membership checks ───────────────────────────
const ids = new Set();
ids.add(1);
ids.add(2);
ids.add(2);   // ignored — already present
ids.add(3);
console.log(ids);        // => Set(3) { 1, 2, 3 }
console.log(ids.size);   // => 3
console.log(ids.has(2)); // => true   (fast lookup, unlike array.includes)
ids.delete(1);
console.log([...ids]);   // => [ 2, 3 ]  (spread to convert back to an array)

// ⭐ Most common use: remove duplicates from an array in one line.
const withDupes = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(withDupes)];
console.log(unique); // => [ 1, 2, 3, 4 ]

// Iterating a Set:
for (const id of ids) console.log('id:', id);


// ── 2. Map — key/value pairs with ANY key type ───────────────────────────────
// Unlike objects (whose keys are always strings), Map keys can be numbers,
// objects, functions — anything. And it remembers insertion order.
const scores = new Map();
scores.set('Ana', 90);
scores.set('Bob', 75);
console.log(scores.get('Ana')); // => 90
console.log(scores.has('Bob')); // => true
console.log(scores.size);       // => 2
scores.delete('Bob');

// Object keys (impossible with a plain object):
const userA = { id: 1 };
const lastSeen = new Map();
lastSeen.set(userA, '2026-06-04');
console.log(lastSeen.get(userA)); // => 2026-06-04

// Iterating a Map (entries are [key, value] pairs):
const colors = new Map([
  ['red', '#f00'],
  ['green', '#0f0'],
]);
for (const [name, hex] of colors) {
  console.log(`${name} → ${hex}`); // => red → #f00, green → #0f0
}
console.log([...colors.keys()]);   // => [ 'red', 'green' ]
console.log([...colors.values()]); // => [ '#f00', '#0f0' ]


// ── 3. Object vs Map — which to use? ─────────────────────────────────────────
//   Use a plain OBJECT when:
//     • keys are fixed, known strings ("structured record")
//     • you want JSON serialization (JSON.stringify works on objects)
//   Use a MAP when:
//     • keys are dynamic, or not strings
//     • you frequently add/remove entries
//     • you need a reliable .size and guaranteed insertion order

// Convert between them:
const obj = Object.fromEntries(colors); // Map → object
console.log(obj); // => { red: '#f00', green: '#0f0' }
const backToMap = new Map(Object.entries(obj)); // object → Map
console.log(backToMap.size); // => 2


/* PRACTICE -------------------------------------------------------------------
 *   1. Count unique words in "the cat the dog the bird" using a Set.
 *   2. Build a Map of country → capital and print each pair.
 *   3. Use a Map to tally how many times each letter appears in "banana".
 * ------------------------------------------------------------------------- */
