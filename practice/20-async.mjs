/* PRACTICE · 20 Async / Await ───────────────────────────────────────────────
 * Fill in the bodies, then grade your work:
 *   PRACTICE=mine node --test practice/20-async.test.mjs
 * ------------------------------------------------------------------------- */

// delay(ms, value): resolve to `value` after `ms` milliseconds.
//   await delay(10, 'hi') === 'hi'
export function delay(ms, value) {
  // TODO: return a Promise that resolves after ms (use setTimeout)
}

// retry(fn, attempts): call fn(); if it throws/rejects, try again up to
// `attempts` times total. Resolve with the first success, or reject with the
// last error if all attempts fail.  fn may be sync or async (await it).
export async function retry(fn, attempts) {
  // TODO
}
