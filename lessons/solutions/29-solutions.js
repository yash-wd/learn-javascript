/* =============================================================================
 * SOLUTIONS · 29 · SYMBOLS, PROXY & REFLECT (metaprogramming)
 * =============================================================================
 * Run:  node lessons/solutions/29-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/29-symbols-proxy-reflect.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Create two Symbols with the same description and prove they differ. ───
const a = Symbol('id');
const b = Symbol('id'); // same description, but a brand-new unique value
console.log('1.', a === b, '·', a.description); // => 1. false · id
// Every Symbol() call is unique — the description is just a label for debugging.

// ── 2. Build a Proxy that makes an object read-only (set throws). ────────────
function readOnly(target) {
  return new Proxy(target, {
    set(_obj, prop) {
      throw new TypeError(`Cannot assign "${String(prop)}" — object is read-only`);
    },
  });
}
const frozen = readOnly({ name: 'Ada' });
console.log('2.', frozen.name); // => 2. Ada  (reads still work)
try {
  frozen.name = 'Linus';
} catch (err) {
  console.log('2.', err.message); // => 2. Cannot assign "name" — object is read-only
}

// ── 3. Use Reflect.ownKeys to list every key (including symbols) of an object. ──
const tag = Symbol('tag');
const obj = { a: 1, b: 2, [tag]: 'secret' };
console.log('3.', Reflect.ownKeys(obj)); // => 3. [ 'a', 'b', Symbol(tag) ]
// Object.keys() would MISS the symbol key — Reflect.ownKeys sees everything.
