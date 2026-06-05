/* =============================================================================
 * 18 · PROTOTYPES — how inheritance REALLY works
 * =============================================================================
 * Run:  node lessons/18-prototypes.js
 *
 * WHAT YOU'LL LEARN
 *   • The prototype chain — JS's actual inheritance mechanism
 *   • That `class` (lesson 17) is "syntactic sugar" over prototypes
 *   • How property lookup walks up the chain
 *
 * This is more advanced/theoretical. You can write JS for a long time using
 * only `class`, but understanding prototypes explains WHY things work.
 * ========================================================================== */

// ── 1. Every object has a hidden link to a "prototype" ───────────────────────
// When you read obj.something, JS looks on obj first; if not found, it follows
// the link to obj's prototype, then ITS prototype, and so on — the "chain".

const animal = {
  eats: true,
  walk() {
    return 'walking...';
  },
};

// Create `rabbit` whose prototype is `animal`:
const rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.jumps); // => true  (own property)
console.log(rabbit.eats);  // => true  (inherited from animal via the chain)
console.log(rabbit.walk());// => walking...  (method found on the prototype)

// Where did each property come from?
console.log(rabbit.hasOwnProperty('jumps')); // => true  (its own)
console.log(rabbit.hasOwnProperty('eats'));  // => false (inherited)


// ── 2. The chain ends at null ────────────────────────────────────────────────
// rabbit → animal → Object.prototype → null
console.log(Object.getPrototypeOf(rabbit) === animal);            // => true
console.log(Object.getPrototypeOf(animal) === Object.prototype);  // => true
console.log(Object.getPrototypeOf(Object.prototype));             // => null


// ── 3. Built-in methods live on prototypes ───────────────────────────────────
// When you call [1,2,3].map(...), `map` isn't on your array — it's on
// Array.prototype, found by walking the chain.
const arr = [1, 2, 3];
console.log(Object.getPrototypeOf(arr) === Array.prototype); // => true
console.log(arr.map === Array.prototype.map);                // => true


// ── 4. Constructor functions (the pre-`class` style) ─────────────────────────
// Before ES6 classes, this is how "classes" were written. Methods go on
// the constructor's .prototype so all instances SHARE one copy (memory-efficient).
function Person(name) {
  this.name = name;            // instance-specific data
}
Person.prototype.greet = function () {  // shared method
  return `Hi, I'm ${this.name}`;
};

const sam = new Person('Sam');
console.log(sam.greet());                     // => Hi, I'm Sam
console.log(sam.greet === new Person('X').greet); // => true (same shared function)


// ── 5. `class` is sugar over all of this ─────────────────────────────────────
// These two are essentially equivalent:
class PersonClass {
  constructor(name) { this.name = name; }
  greet() { return `Hi, I'm ${this.name}`; }
}
const sam2 = new PersonClass('Sam');
console.log(typeof PersonClass);                       // => function (!)
console.log(PersonClass.prototype.greet === Object.getPrototypeOf(sam2).greet); // => true
// The class syntax just put `greet` on the prototype for you, like §4.


/* MENTAL MODEL ---------------------------------------------------------------
 *   • Reading a property → JS walks UP the prototype chain until it finds it.
 *   • Methods are stored ONCE on the prototype and shared by all instances.
 *   • `class` is friendlier syntax; under the hood it's prototypes all the way.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Use Object.create to make an object that inherits a `describe` method.
 *   2. Check hasOwnProperty for an own vs inherited property.
 *   3. Log the prototype chain of [] until you reach null.
 * ------------------------------------------------------------------------- */
