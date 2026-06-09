/* =============================================================================
 * SOLUTIONS · 20 · ASYNC / AWAIT
 * =============================================================================
 * Run:  node lessons/solutions/20-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/20-async-await.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// We run all three parts inside one async function so we can use `await`.
async function main() {
  // ── 1. Rewrite a .then() chain from lesson 19 using async/await. ───────────
  await delay(100);
  console.log('1.', 'done after 100ms'); // => 1. done after 100ms

  // ── 2. Fetch two things in parallel with Promise.all and time the difference. ──
  const start = Date.now();
  const [x, y] = await Promise.all([delay(150, 'X'), delay(150, 'Y')]);
  const ms = Date.now() - start;
  console.log('2.', x, y, `— took ~${ms}ms (parallel ≈150ms, not 300ms)`);
  // => 2. X Y — took ~150ms (parallel ≈150ms, not 300ms)

  // ── 3. Wrap a failing await in try/catch and log a friendly error message. ──
  try {
    await delay(20).then(() => Promise.reject(new Error('network down')));
  } catch (err) {
    console.log('3.', 'Could not load data:', err.message);
    // => 3. Could not load data: network down
  }
}

main();
