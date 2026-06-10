/* =============================================================================
 * 56 · CLEAN CODE — practice solutions
 * =============================================================================
 * Run:  node lessons/solutions/56-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/56-clean-code.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

'use strict';

// ── 1. Rename for intent: a * 0.01 * b  ──────────────────────────────────────
// It's "percent of total". Names make the comment unnecessary:
const percentOf = (percent, total) => (percent / 100) * total;
console.log(percentOf(20, 250)); // => 50
// (Bonus: 0.01 became `/ 100`, which reads as "percent" instead of a magic 0.01.)

// ── 2. Flatten the nested ifs with guard clauses. ────────────────────────────
function notify(user) {
  if (!user) return 'no user';
  if (!user.email) return 'no email';
  if (!user.verified) return 'not verified';
  return `sent to ${user.email}`; // happy path, un-nested
}
console.log(notify(null)); // => no user
console.log(notify({ email: 'a@b.com' })); // => not verified
console.log(notify({ email: 'a@b.com', verified: true })); // => sent to a@b.com

// ── 3. Positional args → an options object with defaults. ────────────────────
// ❌ makeButton('Save', true, false, true)  ← unreadable at the call site
function makeButton({ label, primary = false, disabled = false, large = false }) {
  return { label, primary, disabled, large };
}
console.log(makeButton({ label: 'Save', primary: true, large: true }));
// => { label: 'Save', primary: true, disabled: false, large: true }
// The call site now documents itself, and new options don't break arg order.

// ── 4. Spot the smell. ───────────────────────────────────────────────────────
// `function save(u){ db.write(u); analytics.track(u); sendEmail(u); }` does
// THREE jobs → it violates the SINGLE RESPONSIBILITY PRINCIPLE (three reasons to
// change: storage, analytics, email). Split each out and let the caller compose
// them (and inject the collaborators, so it's testable):
const saveUser = (user, { db, analytics, mailer }) => {
  db.write(user);
  analytics.track('user.saved', user);
  mailer.welcome(user);
};
const calls = [];
saveUser(
  { name: 'Ada' },
  {
    db: { write: (u) => calls.push('db:' + u.name) },
    analytics: { track: (e) => calls.push('track:' + e) },
    mailer: { welcome: (u) => calls.push('mail:' + u.name) },
  }
);
console.log(calls); // => [ 'db:Ada', 'track:user.saved', 'mail:Ada' ]
// Now each collaborator can change independently, and the test above needed no
// real database, analytics service, or email server.
