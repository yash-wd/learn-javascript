/* =============================================================================
 * 31 · TRICKY CONCEPTS & INTERVIEW GOTCHAS
 * =============================================================================
 * Run:  node lessons/31-tricky-concepts.js
 *
 * WHAT YOU'LL LEARN
 *   • The classic puzzles that trip up everyone (and show up in interviews)
 *   • WHY each one behaves the way it does
 *
 * For each: read the setup, GUESS the output, then check the // => comment.
 * Understanding the "why" means you've truly understood the language.
 * ========================================================================== */

// ── 1. var in a loop with setTimeout (the #1 classic) ────────────────────────
// var is function-scoped: all callbacks share ONE i, which is 3 by the time
// they run. let is block-scoped: each iteration gets its OWN i.
console.log('--- var vs let in loops ---');
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var i =', i), 0); // => 3, 3, 3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let j =', j), 10); // => 0, 1, 2
}


// ── 2. Hoisting: function declarations vs expressions ────────────────────────
console.log('--- hoisting ---');
console.log(declared());        // => "I work!"  (declarations hoist fully)
function declared() { return 'I work!'; }
try {
  expressed();                  // ❌ TypeError: expressed is not a function
} catch (e) {
  console.log('expression:', e.constructor.name); // => TypeError
}
var expressed = function () { return 'nope'; }; // var = undefined when called above


// ── 3. Reference equality ────────────────────────────────────────────────────
console.log('--- reference vs value ---');
console.log({} === {});           // => false (two different objects)
console.log([] === []);           // => false
const x = {}; const y = x;
console.log(x === y);             // => true  (same reference)
console.log(0.1 + 0.2 === 0.3);   // => false (floating point — lesson 06)


// ── 4. == coercion landmines (why we use ===) ────────────────────────────────
console.log('--- loose equality ---');
console.log([] == ![]);   // => true  😱  (![] is false → [] == false → '' == 0 → true)
console.log(null == undefined); // => true
console.log(null == 0);         // => false (null only loosely equals undefined)
console.log(NaN === NaN);       // => false (use Number.isNaN instead)


// ── 5. this depends on the CALL SITE ─────────────────────────────────────────
console.log('--- this binding ---');
const obj = {
  name: 'Sam',
  regular() { return this?.name; }, // `this` is whatever is to the LEFT of the dot
};
console.log(obj.regular());        // => Sam        (obj.method() → this = obj)
const detached = obj.regular;
console.log(detached());           // => undefined  (plain call → no object, no this)
// Arrow functions have NO own `this`; they capture it from the surrounding scope.
// That makes them the WRONG choice for a method that needs to reach its object:
const withArrow = { name: 'Sam', get: () => this?.name };
console.log(withArrow.get());      // => undefined  (arrow's `this` is NOT withArrow)


// ── 6. Array holes & common surprises ────────────────────────────────────────
console.log('--- array quirks ---');
console.log(typeof NaN);                  // => number  (NaN is a number!)
console.log([1, 2, 3].map(String));       // => [ '1', '2', '3' ]
console.log(['1', '7', '11'].sort());     // => [ '1', '11', '7' ]  (string sort!)
console.log([1, 7, 11].sort((a, b) => a - b)); // => [ 1, 7, 11 ]  (numeric sort)
console.log(parseInt('08'));              // => 8   (but ALWAYS pass a radix:)
console.log(parseInt('08', 10));          // => 8   (radix 10 — never trust the default)


// ── 7. Closures capturing a shared variable ──────────────────────────────────
console.log('--- closure capture ---');
function makeFns() {
  const fns = [];
  for (let k = 0; k < 3; k++) fns.push(() => k); // let → each captures its own k
  return fns;
}
console.log(makeFns().map((f) => f())); // => [ 0, 1, 2 ]
// (With var k, this would be [3, 3, 3] — same trap as #1.)


// ── 8. Object key coercion ───────────────────────────────────────────────────
console.log('--- object keys are strings ---');
const o = {};
o[1] = 'number one';
o['1'] = 'string one';      // SAME key — keys are coerced to strings
console.log(o[1]);          // => string one  (the second write won)
console.log(Object.keys(o));// => [ '1' ]     (only one key)


// ── 9. Truthy/falsy in conditions ────────────────────────────────────────────
console.log('--- truthy/falsy ---');
if ([]) console.log('empty array is truthy');   // prints (empty array → truthy)
if ('0') console.log('"0" string is truthy');    // prints (non-empty string)
if (!0) console.log('0 is falsy');               // prints
// The 8 falsy values: false, 0, -0, 0n, "", null, undefined, NaN. Else → truthy.


// ── 10. The mutation-by-reference bug ────────────────────────────────────────
console.log('--- shared reference bug ---');
function addItem(item, list = []) { list.push(item); return list; }
console.log(addItem('a')); // => [ 'a' ]
console.log(addItem('b')); // => [ 'b' ]  (default param is fresh each call — safe)
// ⚠️ But a SHARED outer array would accumulate:
const shared = [];
const buggy = (item) => { shared.push(item); return shared; };
buggy('x'); buggy('y');
console.log(shared); // => [ 'x', 'y' ]  (mutated across calls — often a bug)


/* INTERVIEW TIPS -------------------------------------------------------------
 *   • Always prefer let/const over var (kills the loop-closure trap).
 *   • Always use === ; reserve == only for `== null` (catches null+undefined).
 *   • Remember: this is set by HOW a function is called, not where it's defined.
 *   • Objects/arrays are passed by REFERENCE — copy before mutating.
 *   • Know the 8 falsy values cold.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Fix a "3,3,3" var loop two ways: with let, and with an IIFE closure.
 *   2. Explain out loud why [] == ![] is true, token by token.
 *   3. Write a function that safely copies before mutating its array argument.
 * ------------------------------------------------------------------------- */
