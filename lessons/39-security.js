/* =============================================================================
 * 39 · SECURITY ESSENTIALS — don't get hacked
 * =============================================================================
 * Run:  node lessons/39-security.js
 *
 * WHAT YOU'LL LEARN
 *   • XSS and how to render user input safely
 *   • CSRF, CORS, and CSP in plain English
 *   • Input validation, auth tokens, and secure cookies
 *   • Prototype pollution & dependency safety
 *
 * Security is about NOT TRUSTING input. Most web vulnerabilities come from
 * treating user-controlled data as if it were safe code or markup.
 * ========================================================================== */

// ── 1. XSS (Cross-Site Scripting) — the #1 frontend vulnerability ─────────────
// XSS happens when user input is injected into the page AS HTML/script.
// ❌ DANGEROUS:  el.innerHTML = userInput   ← a <script> or onerror runs!
// ✅ SAFE:       el.textContent = userInput  ← rendered as plain text, never run.
const userInput = '<img src=x onerror="stealCookies()">';

// If you MUST build HTML, escape the dangerous characters first:
function escapeHTML(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
console.log(escapeHTML(userInput));
// => &lt;img src=x onerror=&quot;stealCookies()&quot;&gt;  (harmless text now)
// In real apps, prefer textContent, or a vetted sanitizer like DOMPurify for
// rich HTML. Frameworks (React/Vue) escape by default — don't bypass them.


// ── 2. CSRF (Cross-Site Request Forgery) ─────────────────────────────────────
// A malicious site tricks the user's browser into sending a request to YOUR
// site using their logged-in cookies (e.g. a hidden form that transfers money).
// Defenses:
//   • CSRF tokens — a secret per-session value the server checks on writes.
//   • SameSite cookies — `Set-Cookie: token=...; SameSite=Strict` (or Lax).
//   • Check the Origin/Referer header on state-changing requests.


// ── 3. CORS (Cross-Origin Resource Sharing) ──────────────────────────────────
// Browsers BLOCK JS from reading responses across origins UNLESS the server
// opts in with headers. CORS is the SERVER granting permission — it is NOT a
// way to "fix" a blocked request from the client side.
//   Server sends:  Access-Control-Allow-Origin: https://your-app.com
// "No 'Access-Control-Allow-Origin' header" = the API must allow your origin.


// ── 4. CSP (Content Security Policy) ─────────────────────────────────────────
// An HTTP header that whitelists where scripts/styles/images may load from.
// A strong CSP turns many XSS bugs into no-ops (inline scripts won't run).
//   Content-Security-Policy: default-src 'self'; script-src 'self'


// ── 5. Validate & sanitize ALL input ─────────────────────────────────────────
// Never trust the client — validate on the SERVER too (client checks are UX).
function validateSignup({ email, age }) {
  const errors = [];
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.push('invalid email');
  if (!Number.isInteger(age) || age < 13 || age > 120) errors.push('invalid age');
  return { ok: errors.length === 0, errors };
}
console.log(validateSignup({ email: 'bad', age: 5 }));
// => { ok: false, errors: [ 'invalid email', 'invalid age' ] }
console.log(validateSignup({ email: 'a@b.co', age: 30 })); // => { ok: true, errors: [] }


// ── 6. Auth tokens & cookies — rules of thumb ────────────────────────────────
// • NEVER store secrets/passwords in plain text — hash with bcrypt/argon2 (server).
// • A JWT is 3 base64 parts: header.payload.signature. The payload is NOT
//   encrypted — anyone can read it. Don't put secrets in it; verify the signature.
const fakeJwt = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYW5hIn0.sig';
const [, payload] = fakeJwt.split('.');
console.log(JSON.parse(Buffer.from(payload, 'base64url').toString())); // => { user: 'ana' }  (JWTs use base64url, not plain base64)
// • Store session tokens in cookies set:  HttpOnly; Secure; SameSite=Strict
//   (HttpOnly = JS can't read it → safe from XSS theft; Secure = HTTPS only.)


// ── 7. Prototype pollution ───────────────────────────────────────────────────
// Merging untrusted JSON that contains "__proto__" can poison EVERY object.
// Guard against keys named __proto__ / constructor / prototype when merging,
// or use Object.create(null) / Map for untrusted key-value data.
const safeMap = new Map();
safeMap.set('__proto__', 'harmless here'); // a Map key is just data, not the proto
console.log(safeMap.get('__proto__')); // => harmless here


// ── 8. Dependency & supply-chain safety ──────────────────────────────────────
// • Run `npm audit` and keep dependencies patched.
// • Pin versions (lockfile) and review what you install — packages run code.
// • Don't commit secrets; use environment variables (see lesson 44/45).


/* PRACTICE -------------------------------------------------------------------
 *   1. Write a safeRender(el, text) helper that uses textContent.
 *   2. Add password-strength validation (min length, has number) to validateSignup.
 *   3. Explain in a comment why CORS errors can't be fixed from the browser.
 * ------------------------------------------------------------------------- */
