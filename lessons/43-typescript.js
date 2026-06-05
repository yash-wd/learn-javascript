/* =============================================================================
 * 43 · TYPESCRIPT ON-RAMP — JavaScript with types
 * =============================================================================
 * Run:  node lessons/43-typescript.js   (the runnable parts are plain JS)
 *
 * WHAT YOU'LL LEARN
 *   What TypeScript adds on top of the JS you already know, why teams use it,
 *   and the core syntax — so your first .ts file feels familiar.
 *
 * TypeScript = JavaScript + a TYPE LAYER checked BEFORE you run. The types are
 * erased at build time; the browser/Node runs plain JS. It catches a whole
 * class of bugs ("undefined is not a function") at your desk, not in production.
 *
 * Run real TS:  npm i -D typescript && npx tsc file.ts   (or use ts-node / Bun / Deno)
 * Below, the TS is shown in comments; the runnable code is the JS equivalent.
 * ========================================================================== */

console.log('=== TypeScript concepts (TS in comments, JS runs) ===');

/* ── 1. Basic types ──────────────────────────────────────────────────────────
 *   let name: string = 'Ana';
 *   let age: number = 30;
 *   let active: boolean = true;
 *   let tags: string[] = ['js', 'ts'];
 *   let pair: [string, number] = ['x', 1];   // tuple
 * Type INFERENCE means you rarely annotate obvious things:
 *   let count = 0;          // inferred as number — reassigning to 'hi' errors
 */

/* ── 2. Function signatures ──────────────────────────────────────────────────
 *   function add(a: number, b: number): number { return a + b; }
 *   const greet = (name: string): string => `Hi ${name}`;
 *   add(2, 'x');   // ❌ compile error: 'x' is not a number  ← caught early!
 */
function add(a, b) { return a + b; } // the JS this compiles to
console.log('add(2,3):', add(2, 3)); // => 5

/* ── 3. Interfaces & type aliases — shapes of objects ────────────────────────
 *   interface User { id: number; name: string; email?: string }  // ? = optional
 *   type ID = number | string;                                    // union type
 *   function format(u: User): string { return `${u.id}:${u.name}`; }
 */
const user = { id: 1, name: 'Ana' }; // a value matching the User shape
console.log('user:', `${user.id}:${user.name}`); // => 1:Ana

/* ── 4. Union types & narrowing ──────────────────────────────────────────────
 *   function len(x: string | string[]): number {
 *     if (typeof x === 'string') return x.length;  // TS NARROWS x to string here
 *     return x.length;                             // here x is string[]
 *   }
 * Narrowing = TS uses your runtime checks (typeof, in, Array.isArray) to know
 * the precise type inside each branch. */
function len(x) {
  return typeof x === 'string' ? x.length : x.length;
}
console.log('len:', len('hello'), len(['a', 'b'])); // => 5 2

/* ── 5. Generics — reusable, type-safe containers/functions ──────────────────
 *   function first<T>(arr: T[]): T | undefined { return arr[0]; }
 *   first<number>([1, 2, 3]);   // returns number
 *   first(['a', 'b']);          // T inferred as string
 * Think "a type parameter" — like a function argument, but for types. */
function first(arr) { return arr[0]; }
console.log('first:', first([10, 20]), first(['x'])); // => 10 x

/* ── 6. Utility & helpers you'll meet ────────────────────────────────────────
 *   Partial<User>      // all fields optional
 *   Readonly<User>     // all fields immutable
 *   Pick<User,'id'>    // just some fields
 *   enum Role { Admin, Editor, Viewer }
 *   as const           // freeze a literal's type
 *   unknown vs any     // prefer `unknown` (forces you to check before use)
 */

/* ── 7. JSDoc — types WITHOUT TypeScript ─────────────────────────────────────
 * You can get editor type-checking in plain .js files using JSDoc comments —
 * a nice on-ramp before adopting .ts. This is real and checkable: */
/** @param {number} n  @returns {number} */
function double(n) { return n * 2; }
console.log('double:', double(21)); // => 42

/* WHY TEAMS USE IT ------------------------------------------------------------
 *   • Bugs caught at compile time, not runtime.
 *   • Autocomplete & refactoring that actually understands your data.
 *   • Types document the code and survive refactors.
 *   Cost: a build step and a learning curve. For anything beyond a small
 *   script, most 2026 production codebases are TypeScript.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Write (in a comment) a `Product` interface: id:number, name:string,
 *      price:number, inStock?:boolean.
 *   2. Annotate a `total(items: Product[]): number` signature.
 *   3. Add JSDoc types to a real isEven(n) function in this file.
 * ------------------------------------------------------------------------- */
