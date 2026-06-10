/* =============================================================================
 * 21 · HOW JAVASCRIPT RUNS — execution context, the call stack & the event loop
 * =============================================================================
 * Run:  node lessons/21-how-javascript-runs.js
 *
 * WHAT YOU'LL LEARN
 *   • What an EXECUTION CONTEXT is (global + one per function call)
 *   • Its two phases — CREATION (memory) then EXECUTION — and how HOISTING
 *     falls right out of that
 *   • The CALL STACK: how JS keeps track of "where am I?"
 *   • Why JS is single-threaded, and what the EVENT LOOP actually does
 *   • MICROTASKS (promises) vs MACROTASKS (timers) — and who runs first
 *   • How async/await is "just" promises + the event loop underneath
 *
 * You've already USED promises (lesson 19) and async/await (lesson 20). This
 * lesson reveals the machine underneath — the model that explains every
 * "why did it log in THAT order?" surprise. It's the single most-probed topic
 * in senior JavaScript interviews.
 * ========================================================================== */

'use strict';

// ── 1. EXECUTION CONTEXT & HOISTING ──────────────────────────────────────────
// When JS runs a file (or enters a function) it builds an "execution context"
// in TWO phases:
//   (a) CREATION phase  — it scans the code and reserves memory: `var`s start as
//       `undefined`, function DECLARATIONS are stored whole, `let`/`const` are
//       reserved but left UNINITIALISED (the "temporal dead zone", lesson 01).
//   (b) EXECUTION phase  — it runs the lines top to bottom, assigning values.
// "Hoisting" isn't magic — it's just what you SEE because of the creation phase.

console.log(typeof reserved); // => undefined   (var seen in creation, set later)
var reserved = 42;
console.log(reserved); // => 42

// Function declarations are stored whole in the creation phase, so you can call
// them BEFORE their line in the source:
console.log(square(5)); // => 25
function square(n) {
  return n * n;
}

// ── 2. THE CALL STACK ────────────────────────────────────────────────────────
// JS does ONE thing at a time. The call stack is the to-do pile: calling a
// function PUSHES a context on top; returning POPS it off. The function on top
// is the one currently running.
function greet(name) {
  return 'hi ' + name;
}
function welcome(name) {
  return greet(name) + '!'; // welcome pushes greet on top of itself
}
console.log(welcome('Ada')); // => hi Ada!
//   stack grows:  [global] → [welcome] → [greet]   then unwinds greet → welcome
// If the stack never pops (infinite recursion) you get "Maximum call stack size
// exceeded" — a stack overflow. (Try it yourself in the exercises below.)

// ── 3. THE EVENT LOOP: microtasks vs macrotasks ──────────────────────────────
// One thread can't BLOCK on slow things (timers, network, disk). So slow work is
// handed to the host (Node / the browser); when it's ready, its CALLBACK is put
// on a queue. The EVENT LOOP runs that callback only once the call stack is
// empty. There are TWO queues, and the order between them is the classic gotcha:
//
//        ┌─────────────┐   stack empty?   ┌────────────────────────────┐
//        │  call stack │ ───────────────▶ │ 1. drain ALL microtasks    │
//        └─────────────┘                  │    (promise .then, await,   │
//              ▲                           │     queueMicrotask)         │
//              │ run next                  │ 2. then ONE macrotask       │
//              └───────────────────────────│    (setTimeout, setInterval,│
//                                          │     I/O) — then back to 1   │
//                                          └────────────────────────────┘
//   Rule of thumb: ALL microtasks run before the NEXT macrotask.

console.log('sync 1'); // => sync 1
setTimeout(() => console.log('macrotask setTimeout'), 0);
Promise.resolve().then(() => console.log('microtask promise then'));
queueMicrotask(() => console.log('microtask queueMicrotask'));
console.log('sync 2'); // => sync 2
// Both sync lines run first (they're on the stack). THEN the loop drains the
// microtask queue (FIFO), THEN the one macrotask. Real printed order:
// => microtask promise then
// => microtask queueMicrotask
// => macrotask setTimeout

// ── 4. async/await IS promises + the event loop ──────────────────────────────
// `async` makes a function return a promise. `await` SPLITS the function: the
// part before it runs now (synchronously); everything after it is resumed LATER
// as a microtask, once the awaited value settles. So `await` never "blocks the
// thread" — it yields control back to the event loop.
async function task() {
  console.log('task sync part'); // runs immediately, on the calling stack
  await Promise.resolve();
  console.log('task resumed after await'); // scheduled as a MICROTASK
}
// We run this phase from inside a timer so its output prints cleanly AFTER the
// section-3 tasks have drained (a timer is a macrotask, so it waits its turn):
setTimeout(() => {
  console.log('before calling task'); // => before calling task
  task();
  console.log('after calling task'); // => after calling task
  // Order here: 'before calling task', then 'task sync part' (the sync half of
  // task runs on this stack), then 'after calling task', and finally — once the
  // stack is empty — the microtask resumes: 'task resumed after await'.
  // => task sync part
  // => task resumed after await
}, 10);

/* -----------------------------------------------------------------------------
 * INTERVIEW CORNER
 *   Q: "What logs first — a setTimeout(fn, 0) or a Promise.resolve().then(fn)?"
 *   A: The promise. Timers are MACROtasks; promise callbacks are MICROtasks, and
 *      every microtask runs before the next macrotask.
 *
 *   Q: "Does `await` block the thread?"
 *   A: No. It suspends only the async function and returns control to the event
 *      loop; the rest resumes as a microtask when the awaited promise settles.
 *
 *   Q: "Why does `console.log(x); var x = 1;` print `undefined`, not crash?"
 *   A: Creation phase reserved `x` as `undefined`; the assignment happens later.
 *      (With `let`, the same code throws — the temporal dead zone.)
 *
 * COMMON MISTAKES
 *   • Thinking timers are precise. setTimeout(fn, 0) means "after >= 0 ms AND the
 *     stack is clear AND microtasks have drained" — often much later than 0 ms.
 *   • A long synchronous loop "freezes" everything: it never lets the stack empty,
 *     so no callbacks, no rendering. Break big work up (see lesson 30 · advanced
 *     async) or move it off-thread (Workers, lesson 47).
 *   • Assuming `await` parallelises. `await a(); await b();` is SEQUENTIAL; use
 *     `Promise.all([a(), b()])` to overlap them (lesson 20).
 * ---------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Predict the output order, then run to check:
 *        console.log('A');
 *        setTimeout(() => console.log('B'), 0);
 *        Promise.resolve().then(() => console.log('C'));
 *        console.log('D');
 *   2. Write `boom()` that calls itself with no base case, wrap the call in
 *      try/catch, and log the error's `.name` (you should see RangeError).
 *   3. Explain in a comment why `console.log(typeof y); let y = 1;` THROWS while
 *      the same code with `var` prints `undefined`.
 *   4. Using only Promise.resolve().then(...) and setTimeout(...), make four
 *      logs print in the exact order: 1, 2, 3, 4 — where 1 & 2 are sync,
 *      3 is a microtask, and 4 is a macrotask.
 * ------------------------------------------------------------------------- */
