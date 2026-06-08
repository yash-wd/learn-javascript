/* =============================================================================
 * 35 · DEBUGGING & THE CONSOLE
 * =============================================================================
 * Run:  node lessons/35-debugging-console.js
 *
 * WHAT YOU'LL LEARN
 *   • The console methods beyond console.log
 *   • Reading error messages & stack traces
 *   • The `debugger` statement and breakpoints
 *   • A practical debugging mindset
 *
 * Debugging is HALF of programming. Knowing your tools turns "why won't this
 * work?!" into a calm, 2-minute investigation.
 * ========================================================================== */

// ── 1. Beyond console.log — the full console toolkit ─────────────────────────
console.log('plain message');
console.info('ℹ️  informational');
console.warn('⚠️  a warning (yellow in browsers)');
console.error('❌ an error (red — does NOT stop the program)');

// console.table — gorgeous for arrays of objects:
console.table([
  { name: 'Ana', age: 25 },
  { name: 'Bob', age: 30 },
]);

// Grouping related logs (indented; collapsible in the browser):
console.group('User load');
console.log('fetching...');
console.log('done');
console.groupEnd();

// Counting how many times a line runs:
console.count('loop'); // => loop: 1
console.count('loop'); // => loop: 2

// Timing how long something takes:
console.time('work');
let sum = 0;
for (let i = 0; i < 1e6; i++) sum += i;
console.timeEnd('work'); // => work: 1.2ms (your number will vary)

// Assertions — log ONLY if the condition is false (great for sanity checks):
console.assert(sum > 0, 'sum should be positive'); // (prints nothing — it passed)


// ── 2. The log-the-label trick (see WHICH variable is which) ─────────────────
const x = 5, y = 10;
// Wrap variables in an object → labels come for free:
console.log({ x, y }); // => { x: 5, y: 10 }   (clearer than console.log(x, y))


// ── 3. Reading a stack trace ─────────────────────────────────────────────────
function level3() {
  throw new Error('something failed deep down');
}
function level2() { level3(); }
function level1() { level2(); }

try {
  level1();
} catch (err) {
  console.log('message:', err.message); // => something failed deep down
  // err.stack lists the call path innermost-first: where it threw, then its callers.
  console.log('first stack line:', err.stack.split('\n')[1].trim());
  // Read stacks from the TOP: the first line is where the error actually happened.
}


// ── 4. The `debugger` statement & breakpoints ────────────────────────────────
// Drop `debugger;` into your code. When DevTools (browser) or an inspector
// (node --inspect) is open, execution PAUSES there so you can inspect variables
// step by step. It's ignored when no debugger is attached.
function buggyAverage(nums) {
  // debugger; // ← uncomment, run `node --inspect-brk` or use VS Code's debugger
  const total = nums.reduce((a, b) => a + b, 0);
  return total / nums.length;
}
console.log(buggyAverage([2, 4, 6])); // => 4


/* ── 5. A debugging MINDSET (more useful than any tool) ──────────────────────
 *   1. Reproduce it reliably — know the exact steps that trigger the bug.
 *   2. Read the FULL error message + the FIRST line of the stack trace.
 *   3. Isolate: log values right BEFORE the failing line. What's unexpected?
 *   4. Check assumptions: log the TYPE too — console.log(typeof x, x).
 *      (Most bugs are "I thought this was a number but it's a string/undefined.")
 *   5. Narrow it down: comment out half, see if the bug remains. Repeat.
 *   6. Fix the CAUSE, not the symptom. Then re-run to confirm.
 *
 *   COMMON ERROR MESSAGES, DECODED:
 *     "x is not defined"            → typo, or used before declaring (TDZ).
 *     "Cannot read properties of    → you accessed .foo on null/undefined.
 *      undefined (reading 'foo')"      Log the object first; use ?. (lesson 03).
 *     "x is not a function"         → it's not what you think (typo, or undefined).
 *     "Unexpected token"            → a syntax error (missing }, ), or comma).
 */


/* PRACTICE -------------------------------------------------------------------
 *   1. Use console.table to print an array of 3 product objects.
 *   2. Trigger a "Cannot read properties of undefined" on purpose, then fix it
 *      with optional chaining.
 *   3. Wrap a slow loop in console.time/timeEnd and read the duration.
 * ------------------------------------------------------------------------- */
