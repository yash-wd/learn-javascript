/* =============================================================================
 * 28 · SYMBOLS, PROXY & REFLECT (metaprogramming)
 * =============================================================================
 * Run:  node lessons/28-symbols-proxy-reflect.js
 *
 * WHAT YOU'LL LEARN
 *   • Symbol — unique, hidden-ish keys
 *   • Proxy — intercept operations on an object (get/set/has/delete...)
 *   • Reflect — the standard helpers Proxy traps delegate to
 *
 * This is "metaprogramming": code that customizes how objects behave.
 * You won't use it daily, but libraries (Vue, MobX) are built on it.
 * ========================================================================== */

// ── 1. Symbols — guaranteed-unique values ────────────────────────────────────
const a = Symbol('id');   // the 'id' is just a description (for debugging)
const b = Symbol('id');
console.log(a === b);     // => false  (every Symbol is unique, even same desc)
console.log(a.toString());// => Symbol(id)

// Use as object keys that won't collide with normal string keys:
const ID = Symbol('id');
const user = { name: 'Sam', [ID]: 12345 };
console.log(user[ID]);            // => 12345
console.log(Object.keys(user));  // => [ 'name' ]  (symbol keys are skipped here)
console.log(user.name);          // normal keys still work as usual

// Well-known symbols let you hook into language behavior (lesson 27 used
// Symbol.iterator). Another example — customize toString tagging:
const widget = { [Symbol.toStringTag]: 'Widget' };
console.log(Object.prototype.toString.call(widget)); // => [object Widget]


// ── 2. Proxy — wrap an object and intercept operations ───────────────────────
// A Proxy sits in front of a "target" and runs your "traps" on access.
const target = { message: 'hello' };

const logged = new Proxy(target, {
  get(obj, prop) {
    console.log(`(read ${String(prop)})`);
    return obj[prop];
  },
  set(obj, prop, value) {
    console.log(`(write ${String(prop)} = ${value})`);
    obj[prop] = value;
    return true; // set traps MUST return true on success
  },
});

logged.message;          // => (read message)
logged.message = 'hi';   // => (write message = hi)
console.log(target.message); // => hi   (the real object was updated)


// ── 3. Proxy use-case: validation ────────────────────────────────────────────
function createValidatedUser() {
  return new Proxy({}, {
    set(obj, prop, value) {
      if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
        throw new TypeError('age must be a non-negative number');
      }
      obj[prop] = value;
      return true;
    },
  });
}
const person = createValidatedUser();
person.age = 30;
console.log(person.age); // => 30
try {
  person.age = -5;       // blocked by the trap
} catch (e) {
  console.log('blocked:', e.message); // => blocked: age must be a non-negative number
}


// ── 4. Proxy use-case: default values for missing keys ───────────────────────
const withDefault = new Proxy({}, {
  get: (obj, prop) => (prop in obj ? obj[prop] : `<no ${String(prop)}>`),
});
withDefault.name = 'Ana';
console.log(withDefault.name); // => Ana
console.log(withDefault.email);// => <no email>  (instead of undefined)


// ── 5. Reflect — the "default behaviors" as functions ────────────────────────
// Reflect mirrors the proxy traps. Inside a trap, delegate to Reflect so you
// keep the standard behavior while adding your own logic on top.
const obj = { x: 1 };
console.log(Reflect.get(obj, 'x'));        // => 1   (same as obj.x)
Reflect.set(obj, 'y', 2);                  // same as obj.y = 2
console.log(Reflect.has(obj, 'y'));        // => true  (same as 'y' in obj)
console.log(Reflect.ownKeys(obj));         // => [ 'x', 'y' ]

// Idiomatic proxy using Reflect (forwards everything, logs reads):
const clean = new Proxy({ score: 9 }, {
  get(t, p, r) {
    console.log(`accessed ${String(p)}`);
    return Reflect.get(t, p, r); // default get, no manual t[p]
  },
});
console.log(clean.score); // => accessed score / 9


/* WHEN DO YOU USE THIS? ------------------------------------------------------
 *   • Symbol: unique keys, hooking into iteration/string-tagging.
 *   • Proxy + Reflect: reactive state (Vue 3), observable objects, validation,
 *     logging, virtualized/lazy objects, API mocking.
 *   • For everyday app code you rarely need these — but knowing they exist
 *     explains how "magic" libraries work.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Create two Symbols with the same description and prove they differ.
 *   2. Build a Proxy that makes an object read-only (set throws).
 *   3. Use Reflect.ownKeys to list every key (including symbols) of an object.
 * ------------------------------------------------------------------------- */
