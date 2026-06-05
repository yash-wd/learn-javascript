/* =============================================================================
 * 19 · CALLBACKS & PROMISES (asynchronous JavaScript)
 * =============================================================================
 * Run:  node lessons/19-callbacks-promises.js
 *
 * WHAT YOU'LL LEARN
 *   • Why JS needs async (it's single-threaded)
 *   • Callbacks and "callback hell"
 *   • Promises: then / catch / finally
 *   • Promise.all / race / allSettled
 *
 * Watch the OUTPUT ORDER when you run this — it teaches the event loop.
 * ========================================================================== */

// ── 1. JS is single-threaded — it can't "wait" and block ─────────────────────
// Slow things (timers, network, files) are handed off and finish LATER.
console.log('1: start');

setTimeout(() => console.log('3: timeout finished (later)'), 0);

console.log('2: end');
// Output order: 1, 2, THEN 3 — even though the timeout was 0ms. The synchronous
// code runs first; the callback waits in a queue until the stack is clear.


// ── 2. Callbacks — "call this function when you're done" ─────────────────────
function fetchUser(id, callback) {
  setTimeout(() => {
    callback({ id, name: 'Sam' }); // simulate a 200ms network delay
  }, 200);
}
fetchUser(1, (user) => console.log('callback got:', user.name)); // => Sam (after 200ms)

// ⚠️ CALLBACK HELL: nesting callbacks for sequential async steps gets ugly:
//   fetchUser(1, (user) => {
//     fetchPosts(user, (posts) => {
//       fetchComments(posts[0], (comments) => { ... }); // deeply nested 😖
//     });
//   });
// Promises were invented to flatten this.


// ── 3. Promises — an object representing a future value ──────────────────────
// A Promise is in one of three states: pending → fulfilled (resolve) or rejected.
const promise = new Promise((resolve, reject) => {
  const success = true;
  setTimeout(() => {
    if (success) resolve('✅ data loaded');
    else reject(new Error('❌ failed'));
  }, 100);
});

promise
  .then((result) => console.log('then:', result))   // runs on resolve
  .catch((err) => console.log('catch:', err.message)) // runs on reject
  .finally(() => console.log('finally: always runs'));


// ── 4. Chaining — each .then returns a new promise (no more nesting!) ────────
function getUser(id) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ id, name: 'Ana' }), 50)
  );
}
function getPosts(user) {
  return new Promise((resolve) =>
    setTimeout(() => resolve([`${user.name}'s post`]), 50)
  );
}

getUser(1)
  .then((user) => getPosts(user))   // return a promise → the chain waits for it
  .then((posts) => console.log('chained:', posts)) // => [ "Ana's post" ]
  .catch((err) => console.log('error:', err));


// ── 5. Running promises together ─────────────────────────────────────────────
const p1 = Promise.resolve('a');
const p2 = new Promise((r) => setTimeout(() => r('b'), 80));
const p3 = Promise.resolve('c');

// Promise.all — wait for ALL to finish (rejects if ANY one rejects):
Promise.all([p1, p2, p3]).then((values) => console.log('all:', values)); // => ['a','b','c']

// Promise.race — settle as soon as the FIRST one settles:
Promise.race([p2, Promise.resolve('fast')]).then((v) => console.log('race:', v)); // => fast

// Promise.allSettled — wait for all, never rejects; reports each outcome:
Promise.allSettled([Promise.resolve('ok'), Promise.reject('bad')]).then((results) =>
  console.log('allSettled:', results)
); // => [{status:'fulfilled',value:'ok'}, {status:'rejected',reason:'bad'}]


/* KEY TAKEAWAYS --------------------------------------------------------------
 *   • Synchronous code always runs before any async callback/promise.
 *   • .then chains replace nested callbacks.
 *   • Always end a chain with .catch to handle errors.
 *   • Next lesson (async/await) makes promises read like normal code.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Wrap setTimeout in a `delay(ms)` function that returns a Promise.
 *   2. Chain delay(100) → log "done after 100ms".
 *   3. Use Promise.all to wait for delay(50) and delay(150) together.
 * ------------------------------------------------------------------------- */
