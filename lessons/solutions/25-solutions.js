/* =============================================================================
 * SOLUTIONS · 25 · FETCH & APIs — talking to the internet
 * =============================================================================
 * Run:  node lessons/solutions/25-solutions.js   (needs internet; Node 18+ has fetch)
 *
 * Worked answers to the PRACTICE block in lessons/25-fetch-apis.js.
 * Try each problem YOURSELF first — then compare.
 * Everything is wrapped so that with no network it prints a notice instead of
 * crashing.
 * ========================================================================== */

const BASE = 'https://jsonplaceholder.typicode.com';

async function main() {
  // ── 1. Fetch /users and log every name. ────────────────────────────────────
  const users = await (await fetch(`${BASE}/users`)).json();
  console.log('1.', users.map((u) => u.name).join(', '));
  // => 1. Leanne Graham, Ervin Howell, … (10 names)

  // ── 2. Fetch a single todo and log whether it's completed. ──────────────────
  const todo = await (await fetch(`${BASE}/todos/1`)).json();
  console.log('2.', `"${todo.title}" completed?`, todo.completed);
  // => 2. "delectus aut autem" completed? false

  // ── 3. Log a friendly message when response.ok is false. ────────────────────
  const missing = await fetch(`${BASE}/posts/99999999`);
  if (!missing.ok) {
    console.log('3.', `Couldn't load that post (HTTP ${missing.status}).`);
    // => 3. Couldn't load that post (HTTP 404).
  }

  // ── 4. Log response.status and the content-type header for a GET. ───────────
  const res = await fetch(`${BASE}/posts/1`);
  console.log('4.', res.status, res.headers.get('content-type'));
  // => 4. 200 application/json; charset=utf-8

  // ── 5. Send a DELETE to /posts/1 and log the status code you get back. ──────
  const del = await fetch(`${BASE}/posts/1`, { method: 'DELETE' });
  console.log('5.', 'DELETE status:', del.status); // => 5. DELETE status: 200
}

main().catch((err) => {
  console.log('⚠️  Network request failed (are you offline?):', err.message);
});
