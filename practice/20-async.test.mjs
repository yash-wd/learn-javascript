import { test } from 'node:test';
import assert from 'node:assert/strict';

const src = process.env.PRACTICE === 'mine' ? './20-async.mjs' : './20-async.solution.mjs';
const { delay, retry } = await import(src);

test('delay resolves with its value', async () => {
  assert.equal(await delay(5, 'hi'), 'hi');
});

test('retry returns the first success', async () => {
  let calls = 0;
  const flaky = async () => {
    calls++;
    if (calls < 3) throw new Error('not yet');
    return 'ok';
  };
  assert.equal(await retry(flaky, 5), 'ok');
  assert.equal(calls, 3); // failed twice, succeeded on the third
});

test('retry rejects with the last error when all attempts fail', async () => {
  const always = () => {
    throw new Error('nope');
  };
  await assert.rejects(() => retry(always, 2), /nope/);
});
