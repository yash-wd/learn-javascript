/* =============================================================================
 * 01 · VARIABLES — var, let, const
 * =============================================================================
 * Run:  node lessons/01-variables.js
 *
 * WHAT YOU'LL LEARN
 *   • How to declare variables with var, let, and const
 *   • The difference between declaration, initialization, and reassignment
 *   • Scope: function-scope (var) vs block-scope (let/const)
 *   • Hoisting and the "temporal dead zone"
 *
 * RULE OF THUMB
 *   Use `const` by default. Use `let` only when you must reassign.
 *   Avoid `var` — it has confusing scoping and is considered legacy.
 *
 * NOTE: reserved keywords (var, let, const, if, else, for, while, function,
 *       return, ...) cannot be used as variable names.
 * ========================================================================== */

// ── 1. Declaration & initialization ──────────────────────────────────────────
// "Declaration" = create the variable. "Initialization" = give it a value.

let count;            // declaration only — value is `undefined` for now
count = 12;           // initialization
console.log(count);   // => 12

const TAX_RATE = 0.2; // const MUST be declared AND initialized together
console.log(TAX_RATE); // => 0.2

// const RATE;        // ❌ SyntaxError: Missing initializer in const declaration


// ── 2. Reassignment ──────────────────────────────────────────────────────────
let score = 10;
score = 25;           // ✅ let can be reassigned
console.log(score);   // => 25

// TAX_RATE = 0.3;    // ❌ TypeError: Assignment to constant variable
console.log(TAX_RATE); // => 0.2  (const can never be reassigned)

// IMPORTANT: `const` means the *binding* can't change — but if it holds an
// object or array, the contents can still be mutated:
const user = { name: 'Sam' };
user.name = 'Alex';   // ✅ allowed — we mutate the object, not the binding
console.log(user);    // => { name: 'Alex' }


// ── 3. Redeclaration ─────────────────────────────────────────────────────────
// "Redeclaration" = declaring a variable with the SAME name twice in the SAME
// scope. This is different from reassignment (which only changes the value).

// `var` ALLOWS redeclaration — the second `var` is silently merged into the
// first. This is a common source of bugs, since you can clobber a variable
// without realising it:
var total = 1;
var total = 2;        // ✅ no error — `var` lets you redeclare
console.log(total);   // => 2

// `let` and `const` FORBID redeclaration in the same scope:
// let count = 1;
// let count = 2;     // ❌ SyntaxError: Identifier 'count' has already been declared
//
// const PI = 3.14;
// const PI = 3.15;   // ❌ SyntaxError: Identifier 'PI' has already been declared

// NOTE: redeclaring in a *different* (nested) block is fine — that's a brand new
// variable that "shadows" the outer one, not a redeclaration:
let level = 'outer';
{
  let level = 'inner'; // ✅ separate variable in its own block
  console.log(level);  // => inner
}
console.log(level);    // => outer


// ── 4. Scope ─────────────────────────────────────────────────────────────────
// `var` is FUNCTION-scoped. `let`/`const` are BLOCK-scoped ({ ... }).

function demoScope() {
  var functionScoped = 'I live in the whole function';
  let blockScoped = 'I live only in my block';
  console.log(functionScoped, '|', blockScoped);
}
demoScope(); // => I live in the whole function | I live only in my block
// console.log(functionScoped); // ❌ ReferenceError — not visible outside

// var ignores block boundaries:
{
  var leaks = 'I escape the block';
}
console.log(leaks); // => I escape the block  (this is why var is confusing)

// let/const respect block boundaries:
{
  let trapped = 'I stay inside';
}
// console.log(trapped); // ❌ ReferenceError: trapped is not defined


// ── 5. Hoisting & the Temporal Dead Zone (TDZ) ──────────────────────────────
// `var` declarations are "hoisted" to the top and start as `undefined`.
console.log(hoistedVar); // => undefined  (declared below, but already exists)
var hoistedVar = 'now I have a value';

// `let`/`const` are also hoisted, but you CANNOT use them before their line.
// That gap is the "Temporal Dead Zone".
try {
  console.log(hoistedLet);   // ❌ throws — we're in the TDZ
} catch (err) {
  console.log(err.message);  // => Cannot access 'hoistedLet' before initialization
}
let hoistedLet = 'safe to use now';


/* PRACTICE -------------------------------------------------------------------
 *   1. Declare a const for your name and log it.
 *   2. Declare a let counter, set it to 0, then reassign it to 5.
 *   3. Try reassigning a const and read the exact error message.
 * ------------------------------------------------------------------------- */
