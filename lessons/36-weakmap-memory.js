/* =============================================================================
 * 36 · WEAKMAP, MEMORY & FINAL LANGUAGE DETAILS
 * =============================================================================
 * Run:  node lessons/36-weakmap-memory.js
 *
 * WHAT YOU'LL LEARN
 *   • How JS memory & garbage collection work (the short version)
 *   • WeakMap / WeakSet and why "weak" matters
 *   • WeakRef & FinalizationRegistry (advanced GC hooks)
 *   • Strict mode
 *   • Tagged template literals
 *
 * The last few pieces to round out your JavaScript knowledge.
 * ========================================================================== */

// ── 1. Garbage collection in 60 seconds ──────────────────────────────────────
// JS manages memory FOR you. An object stays in memory as long as something
// can still REACH it (a variable, an array, a property...). When nothing
// references it anymore, the garbage collector frees it automatically.
let data = { big: 'lots of stuff' };
data = null; // the object is now unreachable → eligible to be cleaned up
// You don't free memory manually — but you CAN cause "leaks" by holding
// references you forgot about (e.g. an ever-growing array, or listeners you
// never remove). The fix is usually: stop referencing what you're done with.


// ── 2. Map vs WeakMap ────────────────────────────────────────────────────────
// A normal Map holds its keys STRONGLY — they can never be garbage-collected
// while the Map exists. A WeakMap holds keys WEAKLY: if the key object is no
// longer referenced anywhere else, it (and its value) can be cleaned up.

const weak = new WeakMap();
let user = { name: 'Sam' };
weak.set(user, { lastLogin: '2026-06-04' }); // associate metadata with an object
console.log(weak.get(user)); // => { lastLogin: '2026-06-04' }
console.log(weak.has(user)); // => true

user = null; // now nothing else references the user object →
             // the WeakMap entry becomes eligible for garbage collection.

// RESTRICTIONS (the price of being "weak"):
//   • Keys MUST be objects (not strings/numbers).
//   • NOT iterable — no .size, no for...of, no .keys(). You can't list entries.
// USE CASES: attach private/extra data to objects without preventing their
// cleanup — caches, metadata, "have I processed this object?" tracking.


// ── 3. WeakSet — same idea, for a set of objects ─────────────────────────────
const seen = new WeakSet();
let task = { id: 1 };
seen.add(task);
console.log(seen.has(task)); // => true
task = null; // entry can be garbage-collected; you don't have to clean up
// Great for "have I already handled this object?" without leaking memory.


// ── 3b. WeakRef & FinalizationRegistry (advanced — use rarely) ───────────────
// A WeakRef holds a reference that does NOT keep its target alive: the GC may
// still collect the object. Call .deref() to get it back — or `undefined` if
// it's already been collected. Useful for memory-sensitive caches.
let cached = { data: 'expensive to compute' };
const ref = new WeakRef(cached);
console.log(ref.deref()?.data); // => expensive to compute  (still alive here)
// After `cached = null` AND a GC cycle, ref.deref() would return undefined.
// ⚠️ You can't predict WHEN the GC runs, so never rely on timing.

// A FinalizationRegistry lets you register a cleanup callback that MAY run after
// an object is collected — e.g. to release an external resource tied to it.
const registry = new FinalizationRegistry((heldValue) => {
  console.log('cleanup ran for:', heldValue); // may fire later, or never
});
registry.register(cached, 'cache-entry-1'); // associate a label with the object
// ⚠️ Finalizers are NOT guaranteed to run (e.g. on exit) and timing is
// unpredictable. Treat them as a best-effort safety net, never your main logic.
// RULE OF THUMB: prefer WeakMap/WeakSet; reach for WeakRef/FinalizationRegistry
// only for genuine memory caches or wrapping external (C/WASM) resources.


// ── 4. Strict mode ───────────────────────────────────────────────────────────
// 'use strict' opts into a safer JS: it turns silent mistakes into errors.
// ES modules (lesson 22) and class bodies are ALWAYS strict automatically.
function sloppyVsStrict() {
  'use strict';
  // mistyped = 5;  // ❌ in strict mode: ReferenceError (without it: silently
  //                //    creates a global — a classic hard-to-find bug!)
  return 'strict mode catches accidental globals & other footguns';
}
console.log(sloppyVsStrict());
// Strict mode also: forbids duplicate params, makes `this` undefined in plain
// function calls (lesson 11), and disallows deleting variables. Prefer it
// (you get it free with modules/classes).


// ── 5. Tagged template literals ──────────────────────────────────────────────
// A function placed before a template literal receives the string PIECES and
// the interpolated VALUES separately — letting you process them.
function highlight(strings, ...values) {
  // strings: the text chunks; values: the ${...} results
  return strings.reduce(
    (out, str, i) => out + str + (i < values.length ? `[${values[i]}]` : ''),
    ''
  );
}
const name = 'Sam';
const score = 95;
console.log(highlight`User ${name} scored ${score} points`);
// => User [Sam] scored [95] points

// Real-world tags: styled-components (CSS-in-JS), String.raw, safe HTML/SQL
// escaping, i18n. String.raw is a built-in tag that ignores escape sequences:
console.log(String.raw`C:\new\test`); // => C:\new\test  (\n NOT a newline)


/* MEMORY-LEAK AVOIDANCE TIPS -------------------------------------------------
 *   • Remove event listeners when you're done (removeEventListener).
 *   • Clear timers you no longer need (clearInterval / clearTimeout).
 *   • Don't let global arrays/objects grow forever — cap or clear them.
 *   • Use WeakMap/WeakSet when associating data with objects you don't own.
 * --------------------------------------------------------------------------- */

/* 🎉 THAT'S THE WHOLE CORE LANGUAGE — basics, intermediate, advanced, and the
 *    browser. From here the course shifts gears:
 *      • Part 10  (37)     — modern JS (ES2021–ES2026)
 *      • Part 11  (38–47)  — professional & production engineering
 *      • Part 12  (48–50)  — computer-science core (data structures,
 *                            algorithms) and binary data
 *    A great next step right now: build a small app (to-do, weather, quiz)
 *    using lessons 23–25 + 33. Building is what makes it all stick. */

/* PRACTICE -------------------------------------------------------------------
 *   1. Use a WeakMap to cache a computed result keyed by an object argument.
 *   2. Add 'use strict' to a function and trigger an accidental-global error.
 *   3. Write a tag function that uppercases every interpolated value.
 *   4. Wrap an object in a WeakRef, log .deref()?.x, then set the original to
 *      null and explain why .deref() MIGHT (eventually) return undefined.
 * ------------------------------------------------------------------------- */
