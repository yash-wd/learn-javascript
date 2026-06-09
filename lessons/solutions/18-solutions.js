/* =============================================================================
 * SOLUTIONS · 18 · PROTOTYPES — how inheritance REALLY works
 * =============================================================================
 * Run:  node lessons/solutions/18-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/18-prototypes.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Use Object.create to make an object that inherits a `describe` method. ──
const animalProto = {
  describe() {
    return `${this.name} is a ${this.type}`;
  },
};
const cat = Object.create(animalProto); // cat's prototype IS animalProto
cat.name = 'Whiskers';
cat.type = 'cat';
console.log('1.', cat.describe()); // => 1. Whiskers is a cat (method found up the chain)

// ── 2. Check hasOwnProperty for an own vs inherited property. ────────────────
console.log('2.', 'own name?', cat.hasOwnProperty('name'));         // => 2. own name? true
console.log('2.', 'own describe?', cat.hasOwnProperty('describe')); // => 2. own describe? false
// `name` lives ON cat; `describe` is inherited from animalProto, so it's not "own".

// ── 3. Log the prototype chain of [] until you reach null. ───────────────────
const chain = [];
let proto = Object.getPrototypeOf([]); // start above the array instance
while (proto) {
  chain.push(proto.constructor.name);
  proto = Object.getPrototypeOf(proto);
}
chain.push('null'); // the chain always terminates at null
console.log('3.', chain.join(' → ')); // => 3. Array → Object → null
