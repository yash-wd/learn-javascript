/* =============================================================================
 * 20 · ASYNC / AWAIT
 * =============================================================================
 * Run:  node lessons/20-async-await.js
 *
 * WHAT YOU'LL LEARN
 *   • async/await — write asynchronous code that READS like synchronous code
 *   • Error handling with try/catch
 *   • Running tasks in sequence vs in parallel (a common performance trap)
 *
 * async/await is just nicer syntax over Promises (lesson 19). Under the hood,
 * an async function always returns a Promise.
 * ========================================================================== */

// A tiny helper used throughout: resolves after `ms` milliseconds.
function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}


// ── 1. The basics: async marks a function, await pauses for a Promise ────────
async function loadData() {
  console.log('loading...');
  const result = await delay(100, '✅ data'); // pause here until it resolves
  console.log('got:', result);                // runs AFTER the await
  return result;                              // async functions return a Promise
}

// Compare to the promise version — same thing, fewer .then() callbacks:
//   loadData() === getData().then(result => ...)


// ── 2. Error handling with try/catch (clean!) ────────────────────────────────
async function riskyLoad() {
  try {
    const data = await Promise.reject(new Error('network down'));
    console.log(data); // skipped — the await threw
  } catch (err) {
    console.log('caught:', err.message); // => caught: network down
  } finally {
    console.log('cleanup runs either way');
  }
}


// ── 3. Sequential vs parallel — a critical distinction ───────────────────────
async function sequential() {
  // ❌ SLOW: each await waits for the previous one. Total ≈ 100+100+100 = 300ms.
  const a = await delay(100, 'a');
  const b = await delay(100, 'b');
  const c = await delay(100, 'c');
  return [a, b, c];
}

async function parallel() {
  // ✅ FAST: start all three FIRST, then await them together. Total ≈ 100ms.
  const pA = delay(100, 'a'); // started now
  const pB = delay(100, 'b'); // started now
  const pC = delay(100, 'c'); // started now
  return Promise.all([pA, pB, pC]); // wait for all in parallel
}
// Rule: if tasks DON'T depend on each other, run them in parallel.


// ── 4. await in a loop ───────────────────────────────────────────────────────
async function processInOrder(items) {
  const results = [];
  for (const item of items) {
    const r = await delay(30, item.toUpperCase()); // one at a time, in order
    results.push(r);
  }
  return results;
}
// For independent items, prefer: await Promise.all(items.map(processOne))


// ── 5. Run everything (top-level) ────────────────────────────────────────────
// We use an async IIFE so we can `await` at the top level in any environment.
(async () => {
  await loadData();                              // => loading... / got: ✅ data
  await riskyLoad();                             // => caught: network down / cleanup...
  console.log('sequential:', await sequential());// => [ 'a', 'b', 'c' ]  (~300ms)
  console.log('parallel:', await parallel());    // => [ 'a', 'b', 'c' ]  (~100ms)
  console.log('inOrder:', await processInOrder(['x', 'y', 'z'])); // => ['X','Y','Z']
})();


/* MENTAL MODEL ---------------------------------------------------------------
 *   • `await x` means "pause this function until promise x settles, then
 *      give me its value (or throw its error)".
 *   • The rest of your program keeps running while an async function awaits.
 *   • await ONLY works inside an async function.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Rewrite a .then() chain from lesson 19 using async/await.
 *   2. Fetch two things in parallel with Promise.all and time the difference.
 *   3. Wrap a failing await in try/catch and log a friendly error message.
 * ------------------------------------------------------------------------- */
