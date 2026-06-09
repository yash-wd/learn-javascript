/* =============================================================================
 * SOLUTIONS · 21 · ERROR HANDLING
 * =============================================================================
 * Run:  node lessons/solutions/21-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/21-error-handling.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Write parseAge(str) that throws a RangeError if the age is negative. ──
function parseAge(str) {
  const age = Number(str);
  if (Number.isNaN(age)) throw new TypeError(`"${str}" is not a number`);
  if (age < 0) throw new RangeError(`age cannot be negative: ${age}`);
  return age;
}
console.log('1.', parseAge('25')); // => 1. 25
try {
  parseAge('-3');
} catch (err) {
  console.log('1.', err.constructor.name + ':', err.message);
  // => 1. RangeError: age cannot be negative: -3
}

// ── 2. Create a NotFoundError class and throw it from a lookup function. ─────
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError'; // so err.name and stack traces read clearly
  }
}
function findUser(id) {
  const users = { 1: 'Ada', 2: 'Linus' };
  if (!(id in users)) throw new NotFoundError(`user ${id} not found`);
  return users[id];
}
try {
  findUser(99);
} catch (err) {
  console.log('2.', err.name + ':', err.message); // => 2. NotFoundError: user 99 not found
  console.log('2.', err instanceof Error);         // => 2. true  (it IS a real Error)
}

// ── 3. Wrap a JSON.parse in try/catch and return a default object on failure. ──
function safeParse(json, fallback = {}) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback; // bad JSON → hand back the default instead of crashing
  }
}
console.log('3.', safeParse('{"ok":true}')); // => 3. { ok: true }
console.log('3.', safeParse('not json!'));   // => 3. {}

// ── 4. Add a process.on('unhandledRejection', ...) and trigger it with a ─────
//    Promise.reject that has no .catch — confirm your handler logs it.
process.on('unhandledRejection', (reason) => {
  console.log('4.', 'caught unhandled rejection:', reason.message);
  // => 4. caught unhandled rejection: nobody is handling me
});
Promise.reject(new Error('nobody is handling me')); // no .catch → fires the handler
