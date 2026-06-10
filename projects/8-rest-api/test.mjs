/* =============================================================================
 * REST API — TESTS  (lesson 38)
 * =============================================================================
 * Black-box tests: start the real server on an ephemeral port (listen(0)) and
 * drive it with fetch, exactly like a client would. No mocks needed.
 *
 *   Run:  node --test projects/8-rest-api/test.mjs
 *
 * Imports the COMPLETE server from solution.js. To test your own work, change
 * the import to './server.js' once your TODOs are filled in.
 * ========================================================================== */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from './solution.js';

let base; // e.g. http://localhost:54213
let server;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

const json = (path, options) =>
  fetch(base + path, { headers: { 'Content-Type': 'application/json' }, ...options });

test('GET /tasks returns an array (with the seeded task)', async () => {
  const res = await json('/tasks');
  assert.equal(res.status, 200);
  const list = await res.json();
  assert.ok(Array.isArray(list));
  assert.ok(list.length >= 1);
});

test('POST /tasks creates a task → 201 with an id', async () => {
  const res = await json('/tasks', { method: 'POST', body: JSON.stringify({ title: 'Write tests' }) });
  assert.equal(res.status, 201);
  const task = await res.json();
  assert.ok(task.id, 'a new id was assigned');
  assert.equal(task.title, 'Write tests');
  assert.equal(task.done, false);
});

test('POST /tasks with no title → 400', async () => {
  const res = await json('/tasks', { method: 'POST', body: JSON.stringify({ done: true }) });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.error, /title/i);
});

test('full lifecycle: create → get → patch → delete', async () => {
  // create
  const created = await (await json('/tasks', { method: 'POST', body: JSON.stringify({ title: 'Temp' }) })).json();
  const url = `/tasks/${created.id}`;

  // get
  const got = await json(url);
  assert.equal(got.status, 200);
  assert.equal((await got.json()).title, 'Temp');

  // patch
  const patched = await json(url, { method: 'PATCH', body: JSON.stringify({ done: true }) });
  assert.equal(patched.status, 200);
  assert.equal((await patched.json()).done, true);

  // delete
  const del = await json(url, { method: 'DELETE' });
  assert.equal(del.status, 204);

  // gone now
  const gone = await json(url);
  assert.equal(gone.status, 404);
});

test('GET /tasks/:id for a missing id → 404', async () => {
  const res = await json('/tasks/does-not-exist');
  assert.equal(res.status, 404);
});

test('unknown route → 404', async () => {
  const res = await json('/widgets');
  assert.equal(res.status, 404);
});
