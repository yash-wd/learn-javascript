/* =============================================================================
 * SOLUTIONS · 17 · CLASSES & OBJECT-ORIENTED PROGRAMMING
 * =============================================================================
 * Run:  node lessons/solutions/17-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/17-classes-oop.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Make a class Rectangle(width, height) with an area() method. ──────────
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width * this.height;
  }
  // ── 3. Add a static method Rectangle.fromObject({width, height}). ──────────
  // A static lives on the class itself — a factory that builds instances.
  static fromObject({ width, height }) {
    return new Rectangle(width, height);
  }
}
const rect = new Rectangle(4, 5);
console.log('1.', rect.area()); // => 1. 20

// ── 2. Extend it as Square(side) using super. ────────────────────────────────
class Square extends Rectangle {
  constructor(side) {
    super(side, side); // a square is a rectangle with equal sides
  }
}
const sq = new Square(6);
console.log('2.', sq.area()); // => 2. 36

// ── 3. (defined above) — call the static factory ─────────────────────────────
const fromObj = Rectangle.fromObject({ width: 3, height: 7 });
console.log('3.', fromObj.area()); // => 3. 21
