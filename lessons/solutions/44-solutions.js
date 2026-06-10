/* =============================================================================
 * SOLUTIONS · 44 · TYPESCRIPT ON-RAMP — JavaScript with types
 * =============================================================================
 * Run:  node lessons/solutions/44-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/44-typescript.js.
 * Try each problem YOURSELF first — then compare.
 * (TypeScript syntax lives in comments; the runnable code is plain JS + JSDoc.)
 * ========================================================================== */

// ── 1. Write (in a comment) a `Product` interface. ───────────────────────────
//   interface Product {
//     id: number;
//     name: string;
//     price: number;
//     inStock?: boolean;   // the ? makes it OPTIONAL
//   }

// ── 2. Annotate a `total(items: Product[]): number` signature. ───────────────
//   function total(items: Product[]): number {
//     return items.reduce((sum, item) => sum + item.price, 0);
//   }
// Plain-JS version we can actually run:
function total(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
console.log('2.', total([{ price: 10 }, { price: 25 }, { price: 5 }])); // => 2. 40

// ── 3. Add JSDoc types to a real isEven(n) function in this file. ────────────
// Editors (and `tsc --checkJs`) read these JSDoc tags to type-check plain JS —
// you get red squiggles on isEven('hi') without ever writing a .ts file.
/**
 * @param {number} n
 * @returns {boolean}
 */
function isEven(n) {
  return n % 2 === 0;
}
console.log('3.', isEven(4), isEven(7)); // => 3. true false
