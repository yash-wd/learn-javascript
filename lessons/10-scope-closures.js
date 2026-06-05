/* =============================================================================
 * 10 · SCOPE & CLOSURES
 * =============================================================================
 * Run:  node lessons/10-scope-closures.js
 *
 * WHAT YOU'LL LEARN
 *   • Global, function, and block scope
 *   • Lexical scope (inner functions see outer variables)
 *   • Closures — the single most important "aha" concept in JS
 * ========================================================================== */

// ── 1. The three scopes ──────────────────────────────────────────────────────
const globalVar = 'I am global';   // visible everywhere

function outer() {
  const functionVar = 'I am in outer()'; // visible inside outer() only
  console.log(globalVar);    // ✅ inner code can see outer scopes
  console.log(functionVar);  // ✅

  if (true) {
    const blockVar = 'I am in this block'; // visible in this { } only
    console.log(blockVar);   // ✅
  }
  // console.log(blockVar);   // ❌ ReferenceError — block-scoped
}
outer();
// console.log(functionVar);  // ❌ ReferenceError — not visible outside


// ── 2. Lexical scope ─────────────────────────────────────────────────────────
// "Lexical" = scope is determined by WHERE code is written, not where it runs.
// Inner functions always have access to the variables of their parents.
function grandparent() {
  const family = 'Smith';
  function parent() {
    function child() {
      return family; // reaches all the way up to grandparent's variable
    }
    return child();
  }
  return parent();
}
console.log(grandparent()); // => Smith


// ── 3. Closures ──────────────────────────────────────────────────────────────
// A closure = a function that "remembers" the variables from where it was
// created, EVEN AFTER that outer function has finished running.

function makeCounter() {
  let count = 0;             // this variable is "enclosed" by the inner function
  return function () {
    count++;                 // it keeps living between calls
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // => 1
console.log(counter()); // => 2
console.log(counter()); // => 3  (count persists — that's the closure!)

// Each closure gets its OWN private copy:
const counterA = makeCounter();
const counterB = makeCounter();
console.log(counterA()); // => 1
console.log(counterA()); // => 2
console.log(counterB()); // => 1  (independent from counterA)


// ── 4. Practical use: data privacy ───────────────────────────────────────────
// Closures let you create "private" variables that can't be touched directly.
function createBankAccount(initial) {
  let balance = initial;     // private — no outside code can read/write it
  return {
    deposit(amount) { balance += amount; return balance; },
    withdraw(amount) {
      if (amount > balance) return 'Insufficient funds';
      balance -= amount;
      return balance;
    },
    getBalance() { return balance; },
  };
}

const account = createBankAccount(100);
console.log(account.deposit(50));  // => 150
console.log(account.withdraw(30)); // => 120
console.log(account.getBalance()); // => 120
// account.balance is undefined — it's truly private.
console.log(account.balance);      // => undefined


/* PRACTICE -------------------------------------------------------------------
 *   1. Write makeAdder(x) that returns a function adding x to its argument.
 *      const add5 = makeAdder(5); add5(10) === 15
 *   2. Build a once(fn) wrapper that runs fn only the first time it's called.
 *   3. Explain in your own words why `count` survives between counter() calls.
 * ------------------------------------------------------------------------- */
