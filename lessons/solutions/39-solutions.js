/* =============================================================================
 * SOLUTIONS · 39 · TESTING — proving your code works
 * =============================================================================
 * Run:  node --test lessons/solutions/39-solutions.js
 *   (or just: node lessons/solutions/39-solutions.js — the runner auto-starts)
 *
 * Worked answers to the PRACTICE block in lessons/39-testing.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

const { test, mock } = require('node:test');
const assert = require('node:assert');

// The function under test.
function capitalize(str) {
  if (!str) return ''; // empty / falsy → empty string (see test 2)
  return str[0].toUpperCase() + str.slice(1);
}

// ── 1. Write a test for a `capitalize(str)` function (first letter upper). ───
test('capitalize uppercases the first letter', () => {
  assert.strictEqual(capitalize('hello'), 'Hello');
  assert.strictEqual(capitalize('a'), 'A');
});

// ── 2. Test that it throws (or returns '') on an empty string. ───────────────
test('capitalize returns "" for an empty string', () => {
  assert.strictEqual(capitalize(''), '');
});

// ── 3. Mock a `logger` and assert it was called with the right message. ──────
test('greet() logs the right message', () => {
  const logger = { info: mock.fn() }; // a fake we can inspect
  function greet(name, log) {
    log.info(`Hi ${name}`);
  }
  greet('Ada', logger);
  assert.strictEqual(logger.info.mock.calls.length, 1);
  assert.deepStrictEqual(logger.info.mock.calls[0].arguments, ['Hi Ada']);
});

// ── 4. Run this file with --experimental-test-coverage and read the report. ──
//    node --test --experimental-test-coverage lessons/solutions/39-solutions.js
//    The report prints a table of % lines/branches/functions covered per file,
//    plus the exact line numbers never executed — your "what did I forget to
//    test?" checklist.

// ── 5. Sketch one unit, one integration, and one E2E test for a login feature. ──
//    UNIT:        validatePassword('abc') === false.  Pure, fast, no I/O.
//                 Catches logic bugs; can't catch wiring/DB problems.
//    INTEGRATION: POST /login with a real (test) DB returns a session token.
//                 Catches DB/route/serialization bugs; slower; can't catch UI.
//    E2E:         a browser fills the form, clicks "Log in", lands on /dashboard.
//                 Catches the whole flow incl. UI/JS; slowest & flakiest;
//                 doesn't pinpoint WHICH layer broke when it fails.
