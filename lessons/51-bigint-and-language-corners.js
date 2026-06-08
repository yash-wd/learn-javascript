/* =============================================================================
 * 51 · BIGINT & LANGUAGE CORNERS
 * =============================================================================
 * Run:  node lessons/51-bigint-and-language-corners.js
 *
 * WHAT YOU'LL LEARN
 *   The last few language features that round out "I know ALL of JavaScript":
 *   • BigInt — integers bigger than Number can safely hold
 *   • Object.fromEntries — build an object from key/value pairs
 *   • Array.prototype.flatMap — map + flatten in one step
 *   • Labeled statements — break/continue an OUTER loop
 *   • eval & the Function constructor — running code from a string (and why
 *     you almost never should)
 *
 * These are niche — you won't reach for them daily — but knowing they exist
 * (and their gotchas) is the difference between "most of JS" and "all of JS".
 * ========================================================================== */

// ── 1. BigInt — arbitrary-precision integers ─────────────────────────────────
// Regular numbers are 64-bit floats. They can only represent integers EXACTLY
// up to Number.MAX_SAFE_INTEGER. Past that, math silently goes wrong:
console.log(Number.MAX_SAFE_INTEGER);       // => 9007199254740991 (2^53 - 1)
console.log(9007199254740991 + 1);          // => 9007199254740992 ✅
console.log(9007199254740991 + 2);          // => 9007199254740992 ❌ (should be ...93!)

// BigInt fixes this — write `n` after an integer literal, or call BigInt():
const big = 9007199254740991n;
console.log(big + 2n);                       // => 9007199254740993n ✅ exact
console.log(BigInt(42), typeof 42n);         // => 42n 'bigint'

// Arithmetic works as usual — but division TRUNCATES (BigInt has no decimals):
console.log(10n / 3n);                       // => 3n  (not 3.333…)
console.log(2n ** 64n);                      // => 18446744073709551616n (huge, exact)

// ⚠️ You CANNOT mix BigInt and Number in math — it throws on purpose:
try { 1n + 1; } catch (e) { console.log('mix error:', e.message); } // TypeError
console.log(1n + BigInt(1));                 // => 2n   (convert first)

// Comparisons DO work across types (no error):
console.log(2n > 1, 2n === 2, 2n == 2);      // => true false true
//                       ^ === is false: different TYPES (bigint vs number)

// Gotchas: no Math.* (Math.sqrt(4n) throws); JSON.stringify can't serialize it:
try { JSON.stringify({ id: 5n }); } catch (e) { console.log('json error:', e.message); }
// Fix: convert to string in a replacer → JSON.stringify(obj, (k,v) =>
//      typeof v === 'bigint' ? v.toString() : v)
// USE CASES: database BIGINT ids, Twitter/Discord "snowflake" ids, nanosecond
// timestamps, cryptography — anywhere integers exceed 2^53.


// ── 2. Object.fromEntries — [[k,v]] → { k: v } ───────────────────────────────
// The inverse of Object.entries (lesson 14). Turns pairs back into an object.
const pairs = [['name', 'Ana'], ['age', 30]];
console.log(Object.fromEntries(pairs));      // => { name: 'Ana', age: 30 }

// Killer combo: transform an object by going object → entries → map → object.
const prices = { apple: 1, pear: 2 };
const doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2])
);
console.log(doubled);                        // => { apple: 2, pear: 4 }

// Also converts a Map (lesson 16) or URLSearchParams (lesson 25) into an object:
console.log(Object.fromEntries(new Map([['a', 1]]))); // => { a: 1 }


// ── 3. Array.prototype.flatMap — map, then flatten one level ──────────────────
// Equivalent to arr.map(fn).flat(1), but in a single pass. Great when each item
// maps to ZERO, ONE, or MANY results.
console.log([1, 2, 3].flatMap((n) => [n, n * 10])); // => [1, 10, 2, 20, 3, 30]

// Return [] to DROP an item, [x] to keep it → map + filter in one step:
console.log([1, -2, 3, -4].flatMap((n) => (n > 0 ? [n] : []))); // => [1, 3]

// Split sentences into words across an array:
console.log(['a b', 'c d'].flatMap((s) => s.split(' '))); // => ['a','b','c','d']
// (Note: flatMap only flattens ONE level; use .flat(Infinity) for deep nesting.)


// ── 4. Labeled statements — break/continue an OUTER loop ─────────────────────
// By default break/continue affect the NEAREST loop. A label lets you target an
// outer one — handy for breaking out of nested loops without a flag variable.
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i + j === 3) {
      console.log(`breaking outer at i=${i}, j=${j}`);
      break outer;                 // jumps ALL the way out, not just the inner loop
    }
  }
}
// `continue label` similarly skips to the next iteration of the labeled loop.
// Use sparingly — often a helper function with an early `return` is clearer.


// ── 5. eval & the Function constructor — code from strings (avoid!) ───────────
// eval() runs a string as code IN THE CURRENT SCOPE. It works…
console.log(eval('2 + 3'));                  // => 5
// …but it's a security hole (runs ANY code, incl. attacker input), it's slow
// (defeats engine optimizations), and it can read/modify your local variables.
// RULE: never eval untrusted input. You almost never need eval at all —
//   JSON.parse for data, optional chaining/bracket access for dynamic props.

// The Function constructor is slightly less dangerous: it builds a function from
// a string but runs in the GLOBAL scope (it can't see your locals):
const addFn = new Function('a', 'b', 'return a + b');
console.log(addFn(4, 5));                    // => 9
// Same security/perf caveats apply. Legit uses are rare (templating engines,
// sandboxes, REPLs) — for everyday code, treat both as "do not use".


/* QUICK REFERENCE ------------------------------------------------------------
 *   BigInt ............ 123n / BigInt(x) — exact integers past 2^53; no mixing
 *                       with Number, no decimals, no Math, no direct JSON.
 *   Object.fromEntries  pairs → object; pair with Object.entries to transform.
 *   flatMap ........... map + flat(1); return [] to drop, [x] to keep.
 *   label: loop ....... break/continue an outer loop by name.
 *   eval/Function ..... run strings as code — security + perf risk. Avoid.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Compute 100! (factorial) with BigInt — impossible to do exactly with Number.
 *   2. Use Object.entries + map + Object.fromEntries to UPPERCASE every value
 *      of { a: 'x', b: 'y' }.
 *   3. Use flatMap to turn [{tags:['js','ts']},{tags:['css']}] into one tag list.
 *   4. Use a labeled loop to find the first pair (i,j) in two arrays that sums to 7.
 * ------------------------------------------------------------------------- */
