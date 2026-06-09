/* =============================================================================
 * SOLUTIONS · 11 · THE `this` KEYWORD
 * =============================================================================
 * Run:  node lessons/solutions/11-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/11-this-keyword.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Make an object `dog` with a name and a bark() method using `this`. ────
const dog = {
  name: 'Rex',
  bark() {
    return `${this.name} says woof!`; // `this` is the object before the dot
  },
};
console.log('1.', dog.bark()); // => 1. Rex says woof!

// ── 2. Break it by extracting the method: const b = dog.bark; b(); — see why. ──
const b = dog.bark; // we grabbed the function, but LOST the `dog.` part
console.log('2.', b()); // => 2. undefined says woof!
// Lesson: `this` is decided by HOW a function is called, not where it's defined.
// `dog.bark()` → `this` is dog.  A bare `b()` has no object before the dot, so
// `this` is no longer dog (here it's the global object, whose `.name` is
// undefined). In strict mode / an ES module, `this` would be undefined and
// `this.name` would throw a TypeError instead.

// ── 3. Fix it with .bind(dog). ───────────────────────────────────────────────
const boundBark = dog.bark.bind(dog); // permanently pin `this` to dog
console.log('3.', boundBark()); // => 3. Rex says woof!
