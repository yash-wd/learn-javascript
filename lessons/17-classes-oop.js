/* =============================================================================
 * 17 · CLASSES & OBJECT-ORIENTED PROGRAMMING
 * =============================================================================
 * Run:  node lessons/17-classes-oop.js
 *
 * WHAT YOU'LL LEARN
 *   • Defining a class with a constructor and methods
 *   • Creating instances with `new`
 *   • Inheritance with `extends` and `super`
 *   • Getters/setters, static members, and private fields (#)
 * ========================================================================== */

// ── 1. A basic class ─────────────────────────────────────────────────────────
class Animal {
  // The constructor runs when you do `new Animal(...)`.
  constructor(name, sound) {
    this.name = name;   // instance properties
    this.sound = sound;
  }

  // A method (shared by all instances):
  speak() {
    return `${this.name} says ${this.sound}`;
  }
}

const dog = new Animal('Rex', 'Woof');
console.log(dog.speak());       // => Rex says Woof
console.log(dog instanceof Animal); // => true


// ── 2. Inheritance with extends / super ──────────────────────────────────────
class Dog extends Animal {
  constructor(name, breed) {
    super(name, 'Woof');   // call the parent constructor FIRST
    this.breed = breed;
  }

  // Add new behavior:
  fetch() {
    return `${this.name} fetches the ball`;
  }

  // Override a parent method (and optionally reuse it via super):
  speak() {
    return `${super.speak()} (a ${this.breed})`;
  }
}

const buddy = new Dog('Buddy', 'Labrador');
console.log(buddy.speak()); // => Buddy says Woof (a Labrador)
console.log(buddy.fetch()); // => Buddy fetches the ball


// ── 3. Getters & setters — computed/guarded properties ───────────────────────
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  // Accessed like a property (no parentheses): temp.fahrenheit
  get fahrenheit() {
    return this.celsius * 1.8 + 32;
  }
  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  }
}

const temp = new Temperature(25);
console.log(temp.fahrenheit); // => 77   (getter — note: no () )
temp.fahrenheit = 212;        // setter
console.log(temp.celsius);    // => 100


// ── 4. Static members — belong to the class, not instances ───────────────────
class MathUtils {
  static PI = 3.14159;
  static double(n) {
    return n * 2;
  }
}
console.log(MathUtils.PI);        // => 3.14159   (called on the class itself)
console.log(MathUtils.double(8)); // => 16
// const m = new MathUtils(); m.double(8) // ❌ static methods aren't on instances


// ── 5. Private fields (#) — true encapsulation ───────────────────────────────
class BankAccount {
  #balance = 0;            // private — only accessible inside this class

  constructor(initial) {
    this.#balance = initial;
  }
  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }
  get balance() {
    return this.#balance;
  }
}

const acct = new BankAccount(100);
console.log(acct.deposit(50)); // => 150
console.log(acct.balance);     // => 150
// console.log(acct.#balance); // ❌ SyntaxError — private outside the class


/* OOP VOCAB ------------------------------------------------------------------
 *   class       → a blueprint for objects
 *   instance    → an object made from a class (via `new`)
 *   constructor → sets up a new instance
 *   inheritance → a class building on another (extends/super)
 *   encapsulation → hiding internal state (#private fields)
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Make a class Rectangle(width, height) with an area() method.
 *   2. Extend it as Square(side) using super.
 *   3. Add a static method Rectangle.fromObject({width, height}).
 * ------------------------------------------------------------------------- */
