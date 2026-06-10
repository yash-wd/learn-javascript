/* =============================================================================
 * 53 · MODERN AUTHENTICATION — practice solutions
 * =============================================================================
 * Worked answers to the PRACTICE block in lessons/53-modern-auth.js.
 * Run:  node lessons/solutions/53-solutions.js
 * Try each yourself first, then compare.
 * ========================================================================== */

const { scryptSync, randomBytes, timingSafeEqual } = require('node:crypto');

// A sample token (same shape as the lesson's): header.payload.signature
const sampleJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJ1c2VyXzQyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzAwMDAwMDAwfQ' +
  '.c2lnbmF0dXJl';


// ── 1. decodeJwtPayload(token): read (NOT verify) the payload ────────────────
function decodeJwtPayload(token) {
  const payload = token.split('.')[1];                 // the middle part
  return JSON.parse(Buffer.from(payload, 'base64url').toString());
}
console.log(decodeJwtPayload(sampleJwt));
// => { sub: 'user_42', role: 'admin', exp: 1700000000 }
// Reminder: decoding is not trust — verify the signature server-side.


// ── 2. isExpired(payload, nowSeconds): compare against the `exp` claim ───────
// JWT `exp` is in SECONDS since the epoch (Date.now() is milliseconds — divide).
function isExpired(payload, nowSeconds) {
  return typeof payload.exp === 'number' && nowSeconds >= payload.exp;
}
const claims = decodeJwtPayload(sampleJwt); // exp = 1700000000
console.log(isExpired(claims, 1699999999)); // => false  (one second before)
console.log(isExpired(claims, 1700000001)); // => true   (one second after)


// ── 3. chooseAuth: a third-party API need also picks a token ─────────────────
function chooseAuth({ multipleServices, needInstantRevoke, mobileOrApi, thirdPartyApi }) {
  if (needInstantRevoke) return 'session';
  if (multipleServices || mobileOrApi || thirdPartyApi) return 'token';
  return 'session';
}
console.log(chooseAuth({ thirdPartyApi: true }));    // => token
console.log(chooseAuth({ needInstantRevoke: true })); // => session
console.log(chooseAuth({}));                          // => session


// ── 4. needsRehash(stored): flag hashes weaker than our current 32-byte key ──
// `stored` is "saltHex:hashHex". The derived-key length in bytes is the hash's
// hex length / 2. If it's below our current strength, upgrade on next login.
const KEYLEN = 32;
function hashWith(password, keylen) {
  const salt = randomBytes(16);
  return `${salt.toString('hex')}:${scryptSync(password, salt, keylen).toString('hex')}`;
}
function needsRehash(stored) {
  const hashHex = stored.split(':')[1] ?? '';
  return hashHex.length / 2 < KEYLEN;
}
console.log(needsRehash(hashWith('pw', 16))); // => true   (old 16-byte hash → upgrade)
console.log(needsRehash(hashWith('pw', 32))); // => false  (already current strength)

// Bonus — verify still works at the current strength, in constant time:
const stored = hashWith('s3cret', KEYLEN);
const [saltHex, hashHex] = stored.split(':');
const again = scryptSync('s3cret', Buffer.from(saltHex, 'hex'), KEYLEN);
console.log(timingSafeEqual(again, Buffer.from(hashHex, 'hex'))); // => true
