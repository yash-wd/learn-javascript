/* =============================================================================
 * 14 · OBJECTS
 * =============================================================================
 * Run:  node lessons/14-objects.js
 *
 * WHAT YOU'LL LEARN
 *   • Creating objects, reading/writing/deleting properties
 *   • Methods and shorthand syntax
 *   • Iterating with Object.keys / values / entries
 *   • Copying and merging objects
 *   • Getters/setters, property descriptors, and freezing
 *   • JSON — turning objects into text and back
 * ========================================================================== */

// ── 1. Creating & accessing ──────────────────────────────────────────────────
const user = {
  name: 'Sam',
  age: 25,
  'favorite color': 'blue', // keys with spaces need quotes
};

console.log(user.name);              // => Sam   (dot notation — preferred)
console.log(user['age']);            // => 25    (bracket notation)
console.log(user['favorite color']); // => blue  (brackets required for odd keys)

// Bracket notation is essential when the key is in a variable:
const key = 'name';
console.log(user[key]);              // => Sam


// ── 2. Adding, updating, deleting ────────────────────────────────────────────
user.email = 'sam@example.com'; // add
user.age = 26;                  // update
delete user['favorite color'];  // delete
console.log(user); // => { name: 'Sam', age: 26, email: 'sam@example.com' }

// Check if a key exists:
console.log('email' in user);          // => true
console.log(user.phone === undefined); // => true (phone doesn't exist)


// ── 3. Methods & `this` ──────────────────────────────────────────────────────
const account = {
  owner: 'Alex',
  balance: 100,
  // method shorthand (no `function` keyword needed):
  describe() {
    return `${this.owner} has $${this.balance}`;
  },
};
console.log(account.describe()); // => Alex has $100


// ── 4. Shorthand property names ──────────────────────────────────────────────
const name = 'Dana';
const age = 30;
// Instead of { name: name, age: age }:
const person = { name, age };
console.log(person); // => { name: 'Dana', age: 30 }


// ── 5. Computed property names ───────────────────────────────────────────────
const field = 'score';
const result = { [field]: 95 }; // the key comes from a variable
console.log(result); // => { score: 95 }


// ── 6. Iterating over an object ──────────────────────────────────────────────
const car = { make: 'Toyota', model: 'Corolla', year: 2020 };

console.log(Object.keys(car));   // => [ 'make', 'model', 'year' ]
console.log(Object.values(car)); // => [ 'Toyota', 'Corolla', 2020 ]
console.log(Object.entries(car));// => [ ['make','Toyota'], ['model','Corolla'], ['year',2020] ]

// entries() pairs nicely with for...of and destructuring:
for (const [k, v] of Object.entries(car)) {
  console.log(`${k} = ${v}`); // => make = Toyota, etc.
}


// ── 7. Copying & merging (shallow) ───────────────────────────────────────────
const defaults = { theme: 'light', fontSize: 14 };
const overrides = { fontSize: 18 };

const settings = { ...defaults, ...overrides }; // later keys win
console.log(settings); // => { theme: 'light', fontSize: 18 }

// Object.assign does the same (mutates the first argument):
const merged = Object.assign({}, defaults, overrides);
console.log(merged); // => { theme: 'light', fontSize: 18 }

// ⚠️ Spread is a SHALLOW copy — nested objects are still shared:
const original = { nested: { a: 1 } };
const shallow = { ...original };
shallow.nested.a = 99;
console.log(original.nested.a); // => 99 (the nested object is shared!)
// For a deep copy of plain data: structuredClone(original)
const deep = structuredClone(original);
deep.nested.a = 1;
console.log(original.nested.a, deep.nested.a); // => 99 1


// ── 8. Nested objects & optional chaining ────────────────────────────────────
const company = { ceo: { name: 'Lee', contact: { city: 'Pune' } } };
console.log(company.ceo.contact.city);      // => Pune
console.log(company.cfo?.contact?.city);    // => undefined (no crash)


// ── 9. Getters & setters on plain objects ────────────────────────────────────
// A getter/setter looks like a normal property from the outside, but runs a
// function. Great for computed/derived values. (Classes do this too — lesson 17.)
const temperature = {
  celsius: 25,
  get fahrenheit() {            // read like a property: temperature.fahrenheit
    return this.celsius * 1.8 + 32;
  },
  set fahrenheit(f) {           // write like a property: temperature.fahrenheit = 212
    this.celsius = (f - 32) / 1.8;
  },
};
console.log(temperature.fahrenheit); // => 77   (computed, no parentheses)
temperature.fahrenheit = 212;
console.log(temperature.celsius);    // => 100  (the setter ran)


// ── 10. Property descriptors & Object.defineProperty ─────────────────────────
// Every property secretly has flags: writable, enumerable, configurable.
// Normal assignment makes all three true. defineProperty lets you control them.
const config = {};
Object.defineProperty(config, 'VERSION', {
  value: '1.0',
  writable: false,    // can't be reassigned
  enumerable: false,  // hidden from Object.keys / for...in / JSON
  configurable: false,// can't be deleted or redefined
});
config.VERSION = '2.0';                 // silently ignored (throws in strict mode)
console.log(config.VERSION);            // => 1.0
console.log(Object.keys(config));       // => []  (it's non-enumerable)
console.log(Object.getOwnPropertyDescriptor(config, 'VERSION'));
// => { value: '1.0', writable: false, enumerable: false, configurable: false }


// ── 11. Locking objects: freeze & seal ───────────────────────────────────────
// freeze: no add, no remove, no change — fully read-only (shallow).
const settingsFrozen = Object.freeze({ theme: 'dark', fontSize: 14 });
settingsFrozen.fontSize = 99;           // ignored (throws in strict mode)
settingsFrozen.newKey = 1;              // ignored — can't add either
console.log(settingsFrozen, Object.isFrozen(settingsFrozen)); // => {...unchanged}, true

// seal: can CHANGE existing values, but can't ADD or REMOVE keys.
const sealed = Object.seal({ count: 0 });
sealed.count = 5;                       // ✅ allowed (existing key)
sealed.extra = 1;                       // ❌ ignored (can't add)
console.log(sealed, Object.isSealed(sealed)); // => { count: 5 }, true

// ⚠️ freeze is SHALLOW — nested objects can still change.
// For deep immutability, freeze recursively or keep data flat.


// ── 12. JSON — objects as text ───────────────────────────────────────────────
// JSON (JavaScript Object Notation) is how objects travel: saved to a file,
// stored in localStorage, or sent over the network. It is plain TEXT, not an
// object. Two functions convert back and forth:
const profile = { name: 'Sam', age: 25, tags: ['js', 'css'], active: true };

const text = JSON.stringify(profile); // object → JSON string
console.log(text); // => {"name":"Sam","age":25,"tags":["js","css"],"active":true}

const back = JSON.parse(text);        // JSON string → object (a NEW object)
console.log(back.name, back.tags[0]); // => Sam js

// Pretty-print: pass a "space" argument (great for logs and files):
console.log(JSON.stringify(profile, null, 2)); // 2-space indented, multi-line

// Pick/transform fields with a replacer (array = allowlist, or a function):
console.log(JSON.stringify(profile, ['name', 'age'])); // => {"name":"Sam","age":25}

// Revive values while parsing with a reviver (e.g. rebuild Dates):
const order = JSON.parse('{"id":1,"when":"2026-06-05T00:00:00.000Z"}', (k, v) =>
  k === 'when' ? new Date(v) : v
);
console.log(order.when instanceof Date); // => true

// ⚠️ WHAT JSON DROPS — it only understands plain data:
//   • functions, undefined, and Symbols are OMITTED from objects
//   • Date becomes a STRING (use a reviver to turn it back, as above)
//   • Map/Set become {} ; NaN and Infinity become null
const messy = { fn() {}, skip: undefined, when: new Date(0), n: NaN };
console.log(JSON.stringify(messy)); // => {"when":"1970-01-01T00:00:00.000Z","n":null}

// ⚠️ ALWAYS guard JSON.parse — bad text throws:
try {
  JSON.parse('{ not valid }');
} catch (err) {
  console.log('parse failed:', err.name); // => SyntaxError
}

// The "JSON deep-copy trick" — quick, but only for plain JSON-safe data
// (loses the same things listed above). Prefer structuredClone for general use.
const copy = JSON.parse(JSON.stringify(profile));
copy.tags.push('html');
console.log(profile.tags.length, copy.tags.length); // => 2 3  (independent)


/* PRACTICE -------------------------------------------------------------------
 *   1. Build a `book` object with title, author, and a summary() method.
 *   2. Loop over its entries and print "key: value" lines.
 *   3. Merge two settings objects so the second overrides the first.
 *   4. JSON.stringify the book, then JSON.parse it back — notice the
 *      summary() method is gone. Why? (JSON only stores plain data.)
 * ------------------------------------------------------------------------- */
