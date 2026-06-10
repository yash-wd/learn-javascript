/* =============================================================================
 * 54 · MODERN AUTHENTICATION
 * =============================================================================
 * Run:  node lessons/54-modern-auth.js
 *
 * WHAT YOU'LL LEARN
 *   • AuthN vs AuthZ — who you are vs what you're allowed to do
 *   • Storing passwords safely with a slow, salted KDF (scrypt/bcrypt/argon2)
 *   • Sessions vs tokens (JWT): the trade-offs, and how to choose
 *   • JWT anatomy, cookie security flags, OAuth/OIDC, passkeys, refresh tokens
 *
 * Auth is the front door of every app — get it wrong and nothing else matters.
 * Lesson 40 grazed tokens & cookies; this goes deeper. Rule #1: don't roll your
 * own crypto or your own auth protocol — use vetted libraries and providers.
 * ========================================================================== */

const { scryptSync, randomBytes, timingSafeEqual } = require('node:crypto');

// ── 1. AuthN vs AuthZ ────────────────────────────────────────────────────────
// Two different questions people constantly conflate:
//   • AUTHENTICATION (authn) = WHO ARE YOU?  Proving identity (login).
//   • AUTHORIZATION  (authz) = WHAT MAY YOU DO?  Permissions/roles (access).
// You authenticate ONCE, then authorize EVERY request. A logged-in user is not
// automatically allowed to do everything — check permissions on each action.
function can(user, action) {
  const policy = { admin: ['read', 'write', 'delete'], member: ['read', 'write'] };
  return (policy[user.role] ?? []).includes(action);
}
const ana = { name: 'ana', role: 'member' };
console.log(can(ana, 'read'));   // => true
console.log(can(ana, 'delete')); // => false   (authenticated, but not authorized)


// ── 2. Passwords — NEVER store plaintext, hash with a slow salted KDF ─────────
// If your DB leaks, plaintext passwords are an instant catastrophe. Even a fast
// hash (md5/sha256) is broken: GPUs guess billions/sec. Use a SLOW, SALTED
// password KDF: bcrypt, argon2, or scrypt. Two ideas do the work:
//   • SALT  — random per-user bytes mixed in, so identical passwords hash
//             differently and precomputed "rainbow tables" are useless.
//   • SLOW  — deliberately expensive (cost factor) so brute-force is painful.
// Below: a real scrypt hash + verify with node:crypto. Store `salt:hash`.
function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);          // 32-byte derived key
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}
function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), 32);
  return timingSafeEqual(actual, expected);             // constant-time compare
}
const record = hashPassword('correct horse battery staple');
console.log('stored looks like  salt:hash =>', record.slice(0, 12) + '…'); // => stored looks like  salt:hash => <first 12 chars of salt:hash>…
console.log(verifyPassword('correct horse battery staple', record)); // => true
console.log(verifyPassword('wrong password', record));               // => false


// ── 3. Constant-time comparison — don't leak secrets via timing ──────────────
// `a === b` on strings/buffers can return EARLY at the first mismatched byte.
// An attacker measuring response time can recover a secret byte-by-byte. For
// secrets (tokens, MACs, hashes) compare in CONSTANT time — same work no matter
// where the first difference is. node:crypto gives you timingSafeEqual:
function safeEqual(a, b) {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;            // length isn't secret
  return timingSafeEqual(ba, bb);
}
console.log(safeEqual('token-abc', 'token-abc')); // => true
console.log(safeEqual('token-abc', 'token-xyz')); // => false


// ── 4. Sessions vs Tokens — two ways to "stay logged in" ─────────────────────
// After login the server must remember you across requests. Two models:
//   • SESSIONS (stateful): server stores session data; the cookie holds only an
//     OPAQUE id. Easy to revoke (delete the row) — but needs a session store.
//   • TOKENS (stateless, JWT): a SELF-CONTAINED signed token carries the claims.
//     No server lookup — but you can't easily revoke before it expires.
// Trade-off in one line: sessions are easy to revoke / harder to scale; tokens
// scale across services / are harder to revoke. A blunt decision helper:
function chooseAuth({ multipleServices, needInstantRevoke, mobileOrApi }) {
  if (needInstantRevoke) return 'session';             // logout must be immediate
  if (multipleServices || mobileOrApi) return 'token'; // stateless across services
  return 'session';                                    // default: simplest
}
console.log(chooseAuth({ needInstantRevoke: true }));                  // => session
console.log(chooseAuth({ multipleServices: true }));                   // => token
console.log(chooseAuth({ mobileOrApi: true }));                        // => token
console.log(chooseAuth({}));                                          // => session


// ── 5. JWT anatomy — header.payload.signature (base64url) ────────────────────
// A JWT is THREE base64url parts joined by dots:  xxxxx.yyyyy.zzzzz
//   • header    — { alg, typ }   which signing algorithm
//   • payload   — the CLAIMS (sub, exp, role…). NOT encrypted — anyone can read.
//   • signature — proves it wasn't tampered with, computed with a SECRET KEY.
// "Signed, not encrypted" → NEVER put secrets/passwords in a JWT payload.
const sampleJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +          // header
  '.eyJzdWIiOiJ1c2VyXzQyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzAwMDAwMDAwfQ' + // payload
  '.c2lnbmF0dXJl';                                  // signature (fake here)
const parts = sampleJwt.split('.');
console.log('parts:', parts.length); // => parts: 3
const decode = (p) => JSON.parse(Buffer.from(p, 'base64url').toString());
console.log('header :', decode(parts[0]));  // => header : { alg: 'HS256', typ: 'JWT' }
console.log('payload:', decode(parts[1]));  // => payload: { sub: 'user_42', role: 'admin', exp: 1700000000 }
// ⚠️ Decoding ≠ trusting. On the SERVER you MUST VERIFY the signature with your
// secret/public key (e.g. jsonwebtoken's verify, or jose) AND check `exp`.
// Anyone can craft a payload; only signature verification makes it trustworthy.


// ── 6. Cookie security flags — where the credential actually lives ───────────
// However you authenticate, the browser credential belongs in a hardened cookie:
//   Set-Cookie: sid=…; HttpOnly; Secure; SameSite=Lax; Path=/
//   • HttpOnly  — JS can't read it (document.cookie) → an XSS bug can't steal it.
//   • Secure    — sent only over HTTPS → not exposed on plaintext connections.
//   • SameSite  — Lax/Strict stops the cookie riding along on cross-site requests
//                 → a strong CSRF defense (lesson 40 §2).
// ❌ The classic mistake: storing a JWT in localStorage. localStorage is readable
//    by ANY script on the page, so one XSS = stolen token. Prefer an HttpOnly
//    cookie; if you must use a token in JS, keep it short-lived (see §8).


// ── 7. OAuth 2.0 / OIDC — "log in with Google", don't roll your own ──────────
// OAuth 2.0 = DELEGATED AUTHORIZATION (let app A act on a resource for the user).
// OpenID Connect (OIDC) adds an IDENTITY layer on top (an id_token = who you are).
// The AUTHORIZATION-CODE flow, in plain steps:
const oauthFlow = [
  '1. App redirects user to the provider (Google) with client_id + scopes',
  '2. User authenticates & CONSENTS on the provider (your app never sees the pw)',
  '3. Provider redirects back with a one-time ?code=…',
  '4. App exchanges code (+ client_secret) server-side for access/id tokens',
  '5. App uses the access token to call APIs / reads the id_token for identity',
];
oauthFlow.forEach((s) => console.log(s));
// => 1. App redirects user to the provider (Google) with client_id + scopes
// => 2. User authenticates & CONSENTS on the provider (your app never sees the pw)
// => 3. Provider redirects back with a one-time ?code=…
// => 4. App exchanges code (+ client_secret) server-side for access/id tokens
// => 5. App uses the access token to call APIs / reads the id_token for identity
// Use PKCE for public clients (SPAs/mobile) and a `state` param against CSRF.
// Don't implement the protocol yourself — use a library/provider (Auth0, Clerk,
// next-auth, Passport, Keycloak). Auth is a minefield; lean on vetted tooling.


// ── 8. Refresh tokens & rotation — short access, long refresh ────────────────
// Best practice splits credentials by lifetime:
//   • ACCESS TOKEN  — short-lived (minutes). Used on every API call. If leaked,
//     it expires fast, limiting the blast radius.
//   • REFRESH TOKEN — longer-lived, kept in an HttpOnly cookie. Trades itself
//     for a NEW access token when the old one expires (no re-login).
// ROTATION: each refresh issues a new refresh token and invalidates the old one;
// if an already-used (stolen) one is replayed, you detect theft and revoke the
// whole family. LOGOUT = delete the session / revoke the refresh token server-side
// (you can't "unsign" a still-valid access JWT — hence keep it short).
let serverEpoch = 1; // bump this to invalidate all access tokens at once
function issueAccessToken(userId) { return { userId, epoch: serverEpoch, ttl: '15m' }; }
function isStillValid(tok) { return tok.epoch === serverEpoch; }
const access = issueAccessToken('user_42');
console.log('valid before logout:', isStillValid(access)); // => valid before logout: true
serverEpoch++; // "log out everywhere" / rotate the signing epoch
console.log('valid after  logout:', isStillValid(access)); // => valid after  logout: false


// ── 9. Passkeys / WebAuthn — the passwordless 2026 direction ─────────────────
// Passkeys (built on the WebAuthn standard) replace passwords with PUBLIC-KEY
// crypto. At signup the device generates a key PAIR; the server stores only the
// PUBLIC key. To log in, the device SIGNS a server challenge with the private
// key (unlocked by Face ID / fingerprint / PIN). The private key never leaves
// the device and is bound to the site's origin, so passkeys are:
//   • PHISHING-RESISTANT — a fake site can't get a signature for the real origin.
//   • Nothing reusable to STEAL — the server holds only a public key.
//   • Syncable across your devices via the platform keychain.
// Browser API: navigator.credentials.create()/get() with publicKey options.
// This is where modern auth is heading; offer passkeys alongside OAuth/passwords.


// ── 10. Common mistakes checklist ────────────────────────────────────────────
// ❌ Plaintext or fast-hash (md5/sha1) passwords        ✅ scrypt/bcrypt/argon2 + salt
// ❌ JWT in localStorage                                 ✅ HttpOnly + Secure cookie
// ❌ No `exp` / never-expiring tokens                    ✅ short access + refresh
// ❌ Weak/shared signing secret                          ✅ long random per-env secret
// ❌ Trusting a decoded JWT without verifying signature  ✅ verify on the server
// ❌ Rolling your own auth protocol/crypto               ✅ vetted libs & providers


/* PRACTICE -------------------------------------------------------------------
 *   1. Write decodeJwtPayload(token) that returns the parsed payload object
 *      from a JWT string (split on '.', base64url-decode the middle part).
 *   2. Write isExpired(payload, nowSeconds) using the JWT `exp` claim (seconds).
 *      Return true when the token is past its expiry.
 *   3. Extend chooseAuth() so a 'thirdPartyApi' need also returns 'token'.
 *   4. Using scryptSync + timingSafeEqual, write needsRehash(stored) that
 *      returns true when a stored hash's derived-key length is below 32 bytes
 *      (a signal to upgrade the user's hash on next login).
 * ------------------------------------------------------------------------- */
