/* =============================================================================
 * SOLUTIONS · 37 · WEAKMAP, MEMORY & FINAL LANGUAGE DETAILS
 * =============================================================================
 * Run:  node lessons/solutions/37-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/37-weakmap-memory.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Use a WeakMap to cache a computed result keyed by an object argument. ──
// A WeakMap keyed by the object means the cache entry is GC'd with the object —
// no memory leak. Keys MUST be objects.
const cache = new WeakMap();
function heavyCompute(obj) {
  if (cache.has(obj)) return cache.get(obj); // cache hit
  const result = obj.values.reduce((a, b) => a + b, 0); // pretend this is expensive
  cache.set(obj, result);
  return result;
}
const input = { values: [1, 2, 3, 4] };
console.log('1.', heavyCompute(input), '·', heavyCompute(input)); // => 1. 10 · 10 (2nd is cached)

// ── 2. Add 'use strict' to a function and trigger an accidental-global error. ──
function strictlyTyped() {
  'use strict';
  oops = 5; // no declaration → ReferenceError in strict mode (silent global otherwise)
}
try {
  strictlyTyped();
} catch (err) {
  console.log('2.', err.constructor.name + ':', err.message);
  // => 2. ReferenceError: oops is not defined
}

// ── 3. Write a tag function that uppercases every interpolated value. ────────
function upper(strings, ...values) {
  return strings.reduce(
    (out, str, i) => out + str + (i < values.length ? String(values[i]).toUpperCase() : ''),
    ''
  );
}
const who = 'ada';
const role = 'engineer';
console.log('3.', upper`Hi ${who}, the ${role}!`); // => 3. Hi ADA, the ENGINEER!

// ── 4. Wrap an object in a WeakRef, log .deref()?.x, then set the original to ──
//    null and explain why .deref() MIGHT (eventually) return undefined.
let target = { x: 42 };
const ref = new WeakRef(target);
console.log('4.', ref.deref()?.x); // => 4. 42
target = null; // drop our strong reference
// The object is now only weakly held. The garbage collector MAY reclaim it at
// any later time — once it does, ref.deref() returns undefined. Right after
// nulling, GC usually hasn't run yet, so deref() may still return the object.
console.log('4.', 'deref()?.x now:', ref.deref()?.x); // => 4. deref()?.x now: 42 (until GC runs)
