/* =============================================================================
 * 38 · TESTING — proving your code works
 * =============================================================================
 * Run:  node --test lessons/38-testing.js   (or just: node lessons/38-testing.js)
 *
 * WHAT YOU'LL LEARN
 *   • Why we write automated tests
 *   • Node's BUILT-IN test runner (node:test) + assert — zero install
 *   • Unit tests, grouping, async tests, and mocking
 *   • The testing pyramid: unit → integration → end-to-end (E2E)
 *   • Code coverage
 *   • The TDD loop (red → green → refactor)
 *
 * Node 18+ ships a real test runner. The same ideas map 1:1 onto Jest/Vitest
 * (describe/it/expect) — only the import and matcher names differ.
 * ========================================================================== */

import { test, describe, mock, before, after } from 'node:test';
import assert from 'node:assert/strict'; // "strict" = uses === by default

// ── The code we want to test (normally this lives in another file) ───────────
function add(a, b) {
  return a + b;
}
function divide(a, b) {
  if (b === 0) throw new Error('cannot divide by zero');
  return a / b;
}
async function fetchUser(id) {
  // pretend this hits a network; resolves after a tick
  return { id, name: 'Sam' };
}


// ── 1. A single unit test ────────────────────────────────────────────────────
test('add() sums two numbers', () => {
  assert.equal(add(2, 3), 5);          // pass: 2 + 3 === 5
  assert.notEqual(add(2, 3), 6);
});


// ── 2. Grouping related tests with describe ──────────────────────────────────
describe('divide()', () => {
  test('divides normally', () => {
    assert.equal(divide(10, 2), 5);
  });

  test('throws on divide-by-zero', () => {
    // assert.throws checks that the function DOES throw (and the message matches)
    assert.throws(() => divide(1, 0), /cannot divide by zero/);
  });
});


// ── 3. Common assertions ─────────────────────────────────────────────────────
test('assertion styles', () => {
  assert.ok(1 < 2);                          // truthy check
  assert.equal('a', 'a');                    // === for primitives
  assert.deepEqual({ a: 1 }, { a: 1 });      // structural equality for objects
  assert.deepEqual([1, 2], [1, 2]);          // ...and arrays
});


// ── 4. Async tests — just make the test function async and await ─────────────
test('fetchUser() resolves with a user', async () => {
  const user = await fetchUser(7);
  assert.equal(user.id, 7);
  assert.equal(user.name, 'Sam');
});


// ── 5. Mocking — replace a real dependency with a fake you control ───────────
describe('mocking', () => {
  test('mock.fn records calls and returns what you tell it', () => {
    const sendEmail = mock.fn(() => 'sent'); // fake function

    function notify(send, to) {
      return send(`hello ${to}`);
    }

    const result = notify(sendEmail, 'ana@example.com');
    assert.equal(result, 'sent');
    assert.equal(sendEmail.mock.callCount(), 1);                 // called once
    assert.equal(sendEmail.mock.calls[0].arguments[0], 'hello ana@example.com');
  });
});


// ── 6. Setup / teardown hooks ────────────────────────────────────────────────
describe('hooks (before/after)', () => {
  let db;
  before(() => { db = { rows: [] }; });   // runs once before the tests below
  after(() => { db = null; });            // cleanup after

  test('starts empty', () => {
    assert.equal(db.rows.length, 0);
  });
});


/* ── 7. THE TESTING PYRAMID — unit / integration / E2E ───────────────────────
 * Different tests catch different bugs. The PYRAMID = lots of fast unit tests,
 * fewer integration tests, a handful of slow end-to-end tests.
 *
 *   UNIT (most)        — one function/module in isolation (everything above).
 *                        Fast, run on every save. Mock the outside world.
 *   INTEGRATION (some) — several pieces TOGETHER (e.g. a route + its database).
 *                        Catches "they each work but don't fit" bugs.
 *   E2E (few)          — drive the REAL app in a REAL browser like a user would:
 *                        click, type, assert what's on screen. Slow but proves
 *                        the whole thing actually works.
 *
 * E2E is done with a browser-automation tool — PLAYWRIGHT (or Cypress):
 *   // npm i -D @playwright/test  &&  npx playwright install
 *   import { test, expect } from '@playwright/test';
 *   test('user can log in', async ({ page }) => {
 *     await page.goto('https://localhost:3000');
 *     await page.fill('#email', 'ana@example.com');
 *     await page.fill('#password', 'secret');
 *     await page.click('button[type=submit]');
 *     await expect(page.getByText('Welcome, Ana')).toBeVisible(); // real UI check
 *   });
 * Playwright can also test across Chromium/Firefox/WebKit and take screenshots.
 */


/* ── 8. CODE COVERAGE — how much of your code the tests run ───────────────────
 * Coverage shows which lines/branches your tests actually exercise. Node has it
 * built in — no install:
 *
 *   node --test --experimental-test-coverage lessons/38-testing.js
 *
 * It prints a table of % lines/branches/functions covered, and which lines were
 * MISSED. (Jest/Vitest: `--coverage`.) ⚠️ 100% coverage ≠ bug-free — it means
 * "executed", not "asserted correctly". Use it to FIND untested code, not as a
 * trophy.
 */


/* THE TDD LOOP ----------------------------------------------------------------
 *   1. RED   — write a failing test for the behavior you want.
 *   2. GREEN — write the SIMPLEST code that makes it pass.
 *   3. REFACTOR — clean up, tests still green. Repeat.
 *   Tests are a safety net: they let you change code fearlessly.
 *
 * JEST / VITEST EQUIVALENT (same idea, different names):
 *   import { describe, it, expect } from 'vitest';
 *   it('adds', () => { expect(add(2,3)).toBe(5); });
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Write a test for a `capitalize(str)` function (first letter upper).
 *   2. Test that it throws (or returns '') on an empty string.
 *   3. Mock a `logger` and assert it was called with the right message.
 *   4. Run this file with --experimental-test-coverage and read the report.
 *   5. Sketch (in comments) one unit, one integration, and one E2E test for a
 *      login feature — note what each would and wouldn't catch.
 * ------------------------------------------------------------------------- */
