/* =============================================================================
 * 56 · CLEAN CODE & PROFESSIONAL JAVASCRIPT — write code humans can maintain
 * =============================================================================
 * Run:  node lessons/56-clean-code.js
 *
 * WHAT YOU'LL LEARN
 *   • NAMING — the highest-leverage skill in programming
 *   • Function design: small, one job, few arguments, no surprises
 *   • The Single Responsibility Principle (and the rest of SOLID, briefly)
 *   • DRY — removing duplication without over-abstracting
 *   • Guard clauses: kill nesting and the "arrow of doom"
 *   • COHESION (keep related things together) vs COUPLING (minimise the wires)
 *   • The common CODE SMELLS, each with a before → after refactor
 *   • What TECHNICAL DEBT is and how to manage it
 *
 * You can already MAKE JavaScript work. This lesson is about the gap between
 * "it works" and "a team can change it safely six months from now" — the single
 * biggest difference between a junior and a professional. Every refactor below
 * RUNS and proves the behavior is unchanged: clean code is a rewrite that keeps
 * the same outputs but is far easier to read.
 * ========================================================================== */

'use strict';

// ── 1. NAMING — code is read ~10× more than it's written ─────────────────────
// Reveal intent. A good name removes the need for a comment.
// ❌ const d = 86400000; const x = u.filter((e) => e.a);
// ✅:
const MS_PER_DAY = 86_400_000; // a named constant, not a "magic number"
const activeUsers = (users) => users.filter((user) => user.isActive);
console.log(activeUsers([{ isActive: true }, { isActive: false }]).length); // => 1
// Rules of thumb: searchable (no magic numbers), pronounceable, no encodings
// (no `strName`), booleans read as yes/no (`isActive`, `hasAccess`), and
// functions are verbs (`getUser`, `parseDate`), values are nouns.

// ── 2. FUNCTIONS: small, ONE job, FEW arguments, no hidden side effects ──────
// A function should do one thing at one level of abstraction. 0–2 args is ideal;
// past 3, pass an options OBJECT (also makes calls self-documenting).
// ❌ createUser('Ada', 30, true, false, 'admin')  ← what do the booleans mean?
function createUser({ name, age, isAdmin = false }) {
  return { name, age, role: isAdmin ? 'admin' : 'member' };
}
console.log(createUser({ name: 'Ada', age: 30, isAdmin: true }));
// => { name: 'Ada', age: 30, role: 'admin' }

// COMMAND/QUERY SEPARATION: a function either DOES something (command) or
// ANSWERS something (query) — not both. And prefer PURE functions (output
// depends only on input, no side effects) — they're trivial to test and reuse.
const add = (a, b) => a + b; // pure: same input → same output, touches nothing
console.log(add(2, 3)); // => 5

// ── 3. SINGLE RESPONSIBILITY — one reason to change ──────────────────────────
// ❌ one function that validates, saves, AND emails is three reasons to change.
// ✅ split it; each piece is testable and reusable on its own.
const isValidOrder = (o) => o.items.length > 0 && o.total > 0;
const orderSummary = (o) => `${o.items.length} item(s), $${o.total}`;
function placeOrder(order, { save, notify }) {
  if (!isValidOrder(order)) throw new Error('invalid order');
  save(order); // persistence: someone else's job
  notify(orderSummary(order)); // messaging: someone else's job
  return 'placed';
}
const log = [];
console.log(placeOrder({ items: ['x'], total: 9 }, { save: () => log.push('saved'), notify: (m) => log.push(m) })); // => placed
console.log(log); // => [ 'saved', '1 item(s), $9' ]
// (That's the "D" in SOLID too — Dependency Inversion: placeOrder depends on
//  injected `save`/`notify`, not on a concrete database or email library.)

// ── 4. DRY — don't repeat yourself (but don't over-abstract either) ──────────
// ❌ three near-identical blocks computing a discounted price.
// ✅ one function, called three times:
const withDiscount = (price, pct) => price - price * (pct / 100);
console.log([100, 200, 50].map((p) => withDiscount(p, 10))); // => [ 90, 180, 45 ]
// Caution: DRY is about removing duplicated KNOWLEDGE, not coincidentally
// similar code. Two things that merely look alike but change for different
// reasons should stay separate — premature abstraction is its own smell.

// ── 5. GUARD CLAUSES — return early, kill the nesting ────────────────────────
// ❌ deeply nested "arrow of doom":
//      function pay(u){ if(u){ if(u.active){ if(u.balance>0){ ... } } } }
// ✅ handle the exits first, then write the happy path flat:
function charge(user, amount) {
  if (!user) return 'no user';
  if (!user.active) return 'inactive';
  if (user.balance < amount) return 'insufficient funds';
  return `charged $${amount}`; // the happy path, un-nested
}
console.log(charge(null, 10)); // => no user
console.log(charge({ active: false }, 10)); // => inactive
console.log(charge({ active: true, balance: 100 }, 10)); // => charged $10

// ── 6. COHESION vs COUPLING ──────────────────────────────────────────────────
// HIGH COHESION: a module's parts belong together (a `money` module does money
// things). LOW COUPLING: modules know as little about each other as possible —
// talk through small, stable interfaces, not each other's internals. Aim for
// high cohesion + low coupling: you can change one part without breaking others.
const money = {
  format: (cents) => `$${(cents / 100).toFixed(2)}`,
  add: (a, b) => a + b,
};
console.log(money.format(1099)); // => $10.99

// ── 7. CODE SMELLS — symptoms worth a second look ────────────────────────────
// • Long function / God object   → split by responsibility (§3)
// • Magic numbers/strings         → name them (§1)
// • Boolean/flag parameters       → split the function, or use an options object
// • Deep nesting                  → guard clauses (§5)
// • Duplicated logic              → extract a function (§4)
// • Long parameter lists          → pass an object
// • Comments explaining BAD code  → fix the code; keep comments for WHY, not WHAT
// • Mutating shared state         → prefer pure functions / return new values
// Refactor proof — same behavior, clearer code:
const sumMessy = (a) => { let t = 0; for (let i = 0; i < a.length; i++) { t = t + a[i]; } return t; };
const sum = (nums) => nums.reduce((total, n) => total + n, 0);
console.log(sumMessy([1, 2, 3]) === sum([1, 2, 3])); // => true

// ── 8. TECHNICAL DEBT — borrow deliberately, pay it back ─────────────────────
// Debt = a shortcut taken to ship now, repaid later with interest (slower future
// changes, more bugs). Some debt is smart (ship, learn, refactor). The danger is
// UNTRACKED debt. Make it visible and intentional:
function todoDebt(note, owner) {
  return `// TODO(${owner}): ${note}`; // a searchable, owned marker — not silence
}
console.log(todoDebt('replace O(n²) lookup with a Map before launch', 'ada'));
// => // TODO(ada): replace O(n²) lookup with a Map before launch
// Rules: leave the campsite cleaner than you found it; refactor in small safe
// steps WITH tests (lesson 38) so behavior never changes by accident.

/* -----------------------------------------------------------------------------
 * INTERVIEW CORNER
 *   Q: "What makes code 'clean'?"
 *   A: It reveals intent: good names, small single-purpose functions, shallow
 *      nesting, no duplication, and tests. You can read it top-to-bottom and
 *      change one thing without fear.
 *   Q: "When should you NOT DRY something up?"
 *   A: When the two pieces only look alike but change for different reasons —
 *      coupling them creates a worse problem than the duplication.
 *   Q: "SOLID in one line each?"
 *   A: Single-responsibility, Open/closed, Liskov substitution, Interface
 *      segregation, Dependency inversion — all about isolating reasons to change.
 *
 * COMMON MISTAKES
 *   • Clever one-liners over clear code. Optimise for the next reader, not ego.
 *   • Comments that restate the code (`i++ // increment i`) instead of WHY.
 *   • Premature abstraction / over-engineering for imagined future needs (YAGNI).
 *   • Big-bang rewrites instead of small, test-backed refactors.
 * ---------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Rename for intent: `function f(a, b) { return a * 0.01 * b; }` is a
 *      percentage-of helper — rewrite it with names that need no comment.
 *   2. Refactor with guard clauses: a function that nests `if (user) { if
 *      (user.email) { if (user.verified) { return send(); } } }` — flatten it.
 *   3. Turn a 4-positional-argument function `makeButton(label, primary,
 *      disabled, large)` into one that takes an options object with defaults.
 *   4. Spot the smell: `function save(u){ db.write(u); analytics.track(u);
 *      sendEmail(u); }` — name the principle it violates and split it.
 * ------------------------------------------------------------------------- */
