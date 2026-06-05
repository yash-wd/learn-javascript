/* =============================================================================
 * 11 · THE `this` KEYWORD
 * =============================================================================
 * Run:  node lessons/11-this-keyword.js
 *
 * WHAT YOU'LL LEARN
 *   • What `this` refers to (it depends on HOW a function is called)
 *   • Why arrow functions don't have their own `this`
 *   • call, apply, and bind
 *
 * BIG IDEA: `this` is NOT decided where a function is written — it's decided
 *           by HOW the function is called.
 * ========================================================================== */

// ── 1. `this` inside an object method = the object ───────────────────────────
const user = {
  name: 'Sam',
  greet() {
    return `Hi, I'm ${this.name}`; // `this` = the object the method is called on
  },
};
console.log(user.greet()); // => Hi, I'm Sam


// ── 2. The classic gotcha: a regular function inside a method ────────────────
const team = {
  name: 'Rockets',
  members: ['Ana', 'Bob'],
  listBroken() {
    // ❌ A normal function gets its OWN `this` (undefined in strict mode),
    //    so `this.name` is lost here.
    this.members.forEach(function (m) {
      // console.log(`${m} is on ${this.name}`); // would throw / be undefined
    });
  },
  listFixed() {
    // ✅ Arrow functions DON'T have their own `this` — they reuse the
    //    surrounding `this` (the team object). This is why arrows shine here.
    this.members.forEach((m) => {
      console.log(`${m} is on ${this.name}`);
    });
  },
};
team.listFixed(); // => Ana is on Rockets / Bob is on Rockets


// ── 3. Arrow functions inherit `this` ────────────────────────────────────────
const counter = {
  count: 0,
  // ❌ Don't use an arrow for the METHOD itself — it would grab the outer
  //    (module/global) `this`, not the object.
  increment() {
    const helper = () => ++this.count; // arrow keeps `this` = counter
    return helper();
  },
};
console.log(counter.increment()); // => 1
console.log(counter.increment()); // => 2


// ── 4. call / apply / bind — manually set `this` ─────────────────────────────
function introduce(greeting) {
  return `${greeting}, I'm ${this.name}`;
}
const person = { name: 'Alex' };

// call: run now, pass `this` then arguments one by one
console.log(introduce.call(person, 'Hello'));  // => Hello, I'm Alex

// apply: like call, but arguments come as an array
console.log(introduce.apply(person, ['Hi']));  // => Hi, I'm Alex

// bind: DON'T run now — return a NEW function with `this` permanently fixed
const boundIntro = introduce.bind(person);
console.log(boundIntro('Hey')); // => Hey, I'm Alex


/* QUICK REFERENCE ------------------------------------------------------------
 *   obj.method()        → this = obj
 *   standalone()        → this = undefined (strict) or globalThis
 *   arrow function      → this = whatever it was in the enclosing scope
 *   fn.call/apply/bind  → this = the object you provide
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Make an object `dog` with a name and a bark() method using `this`.
 *   2. Break it by extracting the method: const b = dog.bark; b(); — see why.
 *   3. Fix it with .bind(dog).
 * ------------------------------------------------------------------------- */
