/* =============================================================================
 * REST API — SOLUTION
 * =============================================================================
 * Complete, working version. Compare with your server.js after trying.
 *
 * Lessons used: 45 Node · 25 Fetch/HTTP · 21 Error handling · 39 Security · 38 Testing
 *
 * A backend with NO frameworks and NO npm installs — just Node's built-in
 * `node:http`. It serves a full CRUD REST API over an in-memory "tasks"
 * resource, with a tiny router, JSON body parsing, validation, proper status
 * codes, and centralized error handling so a thrown error becomes a clean 500
 * instead of crashing the process.
 *
 * Run it directly:   node projects/8-rest-api/solution.js
 * Test it:           node --test projects/8-rest-api/test.mjs
 *
 * Endpoints:
 *   GET    /tasks         → 200  list all tasks
 *   GET    /tasks/:id     → 200  one task   (404 if missing)
 *   POST   /tasks         → 201  create     (400 if invalid)
 *   PATCH  /tasks/:id     → 200  update     (400 invalid · 404 missing)
 *   DELETE /tasks/:id     → 204  delete     (404 if missing)
 * ========================================================================== */

const http = require('node:http');
const crypto = require('node:crypto');

// ── In-memory data store ─────────────────────────────────────────────────────
// A Map keyed by id. This lives in memory only: restart the server and it's
// empty again. (See "Make it your own" in the README for persisting to disk.)
const tasks = new Map();

// Seed one task so GET /tasks isn't empty on a fresh start.
(function seed() {
  const id = crypto.randomUUID();
  tasks.set(id, { id, title: 'Learn the http module', done: false, createdAt: new Date().toISOString() });
})();

const MAX_BODY_BYTES = 1024 * 100; // 100 KB — guard against huge/abusive bodies (lesson 39)

// ── Small helpers ────────────────────────────────────────────────────────────
// Send any JS value as a JSON response with the right headers + status code.
function sendJSON(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

// 204 No Content has an empty body by definition (used by DELETE).
function sendNoContent(res) {
  res.writeHead(204);
  res.end();
}

// An error we throw on purpose to map to a specific HTTP status. Anything else
// that throws is treated as an unexpected 500 by the centralized handler.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Read the whole request body, reject if it's empty-or-not, parse JSON, and
// enforce a size cap so a client can't stream us out of memory.
function readJSONBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new HttpError(413, 'Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (raw === '') return resolve({}); // empty body → empty object
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new HttpError(400, 'Invalid JSON in request body'));
      }
    });
    req.on('error', reject);
  });
}

// ── Validation ───────────────────────────────────────────────────────────────
// Returns a clean { title, done } or throws a 400 HttpError. `partial` allows
// missing fields (for PATCH); a full create requires `title`.
function validateTask(input, { partial = false } = {}) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new HttpError(400, 'Body must be a JSON object');
  }
  const out = {};

  const hasTitle = 'title' in input;
  if (!partial && !hasTitle) throw new HttpError(400, 'title is required');
  if (hasTitle) {
    if (typeof input.title !== 'string' || input.title.trim() === '') {
      throw new HttpError(400, 'title must be a non-empty string');
    }
    out.title = input.title.trim();
  }

  if ('done' in input) {
    if (typeof input.done !== 'boolean') throw new HttpError(400, 'done must be a boolean');
    out.done = input.done;
  }

  return out;
}

// ── Resource handlers (one async function per endpoint) ──────────────────────
async function listTasks(req, res) {
  sendJSON(res, 200, [...tasks.values()]);
}

async function getTask(req, res, params) {
  const task = tasks.get(params.id);
  if (!task) throw new HttpError(404, 'Task not found');
  sendJSON(res, 200, task);
}

async function createTask(req, res) {
  const body = await readJSONBody(req);
  const data = validateTask(body); // throws 400 if invalid
  const task = {
    id: crypto.randomUUID(),
    title: data.title,
    done: data.done ?? false,
    createdAt: new Date().toISOString(),
  };
  tasks.set(task.id, task);
  sendJSON(res, 201, task); // 201 Created + the new record (with its id)
}

async function updateTask(req, res, params) {
  const existing = tasks.get(params.id);
  if (!existing) throw new HttpError(404, 'Task not found');
  const body = await readJSONBody(req);
  const data = validateTask(body, { partial: true }); // PATCH = partial update
  const updated = { ...existing, ...data };
  tasks.set(params.id, updated);
  sendJSON(res, 200, updated);
}

async function deleteTask(req, res, params) {
  if (!tasks.has(params.id)) throw new HttpError(404, 'Task not found');
  tasks.delete(params.id);
  sendNoContent(res); // 204 No Content
}

// ── A tiny router ────────────────────────────────────────────────────────────
// Each route is a method + a path PATTERN. A `:name` segment becomes a captured
// param. We compile each pattern to a RegExp once, then match incoming URLs.
function compile(pattern) {
  const names = [];
  const source = pattern.replace(/:([^/]+)/g, (_, name) => {
    names.push(name);
    return '([^/]+)';
  });
  return { regex: new RegExp(`^${source}$`), names };
}

const routes = [
  { method: 'GET', ...compile('/tasks'), handler: listTasks },
  { method: 'POST', ...compile('/tasks'), handler: createTask },
  { method: 'GET', ...compile('/tasks/:id'), handler: getTask },
  { method: 'PATCH', ...compile('/tasks/:id'), handler: updateTask },
  { method: 'DELETE', ...compile('/tasks/:id'), handler: deleteTask },
];

function matchRoute(method, pathname) {
  for (const route of routes) {
    if (route.method !== method) continue;
    const m = route.regex.exec(pathname);
    if (!m) continue;
    const params = {};
    route.names.forEach((name, i) => (params[name] = decodeURIComponent(m[i + 1])));
    return { handler: route.handler, params };
  }
  return null;
}

// ── The request handler (with centralized error handling) ────────────────────
// This is the single function passed to http.createServer. It finds a route,
// runs its handler, and turns ANY failure into a clean JSON response — so the
// server never crashes on a bad request or a bug in a handler (lesson 21).
async function handler(req, res) {
  try {
    // Parse the path only; the URL needs a base because req.url is path-relative.
    const { pathname } = new URL(req.url, 'http://localhost');
    const match = matchRoute(req.method, pathname);
    if (!match) throw new HttpError(404, `No route for ${req.method} ${pathname}`);
    await match.handler(req, res, match.params);
  } catch (err) {
    if (res.headersSent) return; // a handler already started replying — don't double-send
    const status = err instanceof HttpError ? err.status : 500;
    if (status === 500) console.error('Unexpected error:', err); // log bugs, but don't leak them
    const message = status === 500 ? 'Internal Server Error' : err.message;
    sendJSON(res, status, { error: message });
  }
}

// Factory so tests (and other callers) can spin up a fresh server easily.
function createServer() {
  return http.createServer(handler);
}

module.exports = { handler, createServer, tasks };

// ── Only listen when run directly (not when imported by the test file) ───────
if (require.main === module) {
  const PORT = process.env.PORT ?? 3000;
  createServer().listen(PORT, () => {
    console.log(`REST API listening on http://localhost:${PORT}`);
    console.log('Try:  curl http://localhost:' + PORT + '/tasks');
  });
}
