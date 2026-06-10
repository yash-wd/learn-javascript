/* =============================================================================
 * SOLUTIONS · 40 · SECURITY ESSENTIALS — don't get hacked
 * =============================================================================
 * Run:  node lessons/solutions/40-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/40-security.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Write a safeRender(el, text) helper that uses textContent. ────────────
// textContent inserts text as DATA — the browser never parses it as HTML, so
// script/img/onerror payloads render as harmless literal characters (no XSS).
// (innerHTML would PARSE the string and could execute injected markup.)
function safeRender(el, text) {
  el.textContent = text;
}
const fakeEl = { textContent: '' }; // stand-in for a real DOM node in Node
safeRender(fakeEl, '<img src=x onerror="steal()">');
console.log('1.', fakeEl.textContent);
// => 1. <img src=x onerror="steal()">   (shown as text, NOT executed)

// ── 2. Add password-strength validation (min length, has number) to validateSignup. ──
function validateSignup({ email, password }) {
  const errors = [];
  // Same rigorous check the lesson teaches — not a loose `.includes('@')`.
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push('email looks invalid');
  if (password.length < 8) errors.push('password must be at least 8 characters');
  if (!/\d/.test(password)) errors.push('password must contain a number');
  return { ok: errors.length === 0, errors };
}
console.log('2.', validateSignup({ email: 'a@b.com', password: 'weak' }));
// => 2. { ok: false, errors: [ 'password must be at least 8 characters', 'password must contain a number' ] }
console.log('2.', validateSignup({ email: 'a@b.com', password: 'strongpass1' }));
// => 2. { ok: true, errors: [] }

// ── 3. Explain in a comment why CORS errors can't be fixed from the browser. ──
// CORS is enforced by the BROWSER on behalf of the user, based on headers the
// SERVER sends (Access-Control-Allow-Origin, etc.). The browser blocks reading
// a cross-origin response unless the server opts in. Client code can't grant
// itself that permission — only the server (or a proxy you control) can send
// the right headers. So "fixing CORS in JS" is impossible by design; it's a
// server-side configuration concern.
console.log('3.', 'CORS is granted by server headers — the browser only enforces them.');
