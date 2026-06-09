/* =============================================================================
 * SOLUTIONS · 16 · SETS & MAPS
 * =============================================================================
 * Run:  node lessons/solutions/16-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/16-sets-maps.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Count unique words in "the cat the dog the bird" using a Set. ─────────
const words = 'the cat the dog the bird'.split(' ');
const unique = new Set(words); // a Set keeps only distinct values
console.log('1.', unique.size, '→', [...unique]);
// => 1. 4 → [ 'the', 'cat', 'dog', 'bird' ]

// ── 2. Build a Map of country → capital and print each pair. ─────────────────
const capitals = new Map([
  ['France', 'Paris'],
  ['Japan', 'Tokyo'],
  ['Kenya', 'Nairobi'],
]);
for (const [country, capital] of capitals) {
  console.log('2.', `${country} → ${capital}`);
}
// => 2. France → Paris / 2. Japan → Tokyo / 2. Kenya → Nairobi

// ── 3. Use a Map to tally how many times each letter appears in "banana". ────
const tally = new Map();
for (const letter of 'banana') {
  tally.set(letter, (tally.get(letter) ?? 0) + 1); // start at 0 the first time
}
console.log('3.', Object.fromEntries(tally)); // => 3. { b: 1, a: 3, n: 2 }
