/* =============================================================================
 * REST API — STARTER
 * =============================================================================
 * Fill in the TODOs. README has the full walkthrough. Solution in solution.js.
 *
 * A backend with NO frameworks and NO npm installs — just Node's `node:http`.
 * The plumbing (server, helpers, router) is given. You write the validation,
 * the five resource handlers, and the central error handling.
 *
 *   Run:   node projects/8-rest-api/server.js
 *   Test:  node --test projects/8-rest-api/test.mjs   (green when you're done)
 *
 * Lessons used: 45 Node · 25 Fetch/HTTP · 21 Error handling · 39 Security · 38 Testing
 * ========================================================================== */

const http = require('node:http');
const crypto = require('node:crypto');

// ── In-memory data store (given) ─────────────────────────────────────────────
const tasks = new Map();
(function seed() {
  const id = crypto.randomUUID();
  tasks.set(id, { id, title: 'Learn the http module', done: false, createdAt: new Date().toISOString() });
})();

const MAX_BODY_BYTES = 1024 * 100; // 100 KB guard (lesson 39)

// ── Helpers (given) ──────────────────────────────────────────────────────────
function sendJSON(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}
function sendNoContent(res) {
  res.writeHead(204);
  res.end();
}
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
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
      if (raw === '') return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new HttpError(400, 'Invalid JSON in request body'));
      }
    });
    req.on('error', reject);
  });
}

// ── TODO 1: validation ───────────────────────────────────────────────────────
//   Return a clean { title?, done? } or throw `new HttpError(400, '...')`.
//   - body must be a plain object (not null/array)
//   - on a CREATE (partial=false) `title` is required
//   - if title is present it must be a non-empty string (trim it)
//   - if done is present it must be a boolean
function validateTask(input, { partial = false } = {}) {
  // ...
  return {};
}

// ── TODO 2–6: the five resource handlers ─────────────────────────────────────
// Each is async, receives (req, res, params). Use the helpers above; throw an
// HttpError for the unhappy paths and let `handler` below turn it into a reply.
async function listTasks(req, res) {
  // TODO 2: sendJSON 200 with every task ([...tasks.values()])
}
async function getTask(req, res, params) {
  // TODO 3: look up tasks.get(params.id); 404 if missing; else 200 with it
}
async function createTask(req, res) {
  // TODO 4: read+validate body; build { id: crypto.randomUUID(), title, done,
  //         createdAt }; store it; sendJSON 201 with the new task
}
async function updateTask(req, res, params) {
  // TODO 5: 404 if missing; read+validate body as { partial: true };
  //         merge onto the existing task; store; sendJSON 200 with the result
}
async function deleteTask(req, res, params) {
  // TODO 6: 404 if missing; tasks.delete(id); sendNoContent (204)
}

// ── A tiny router (given) — compiles `/tasks/:id` to a RegExp + param names ───
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

// ── TODO 7: the request handler + centralized error handling ─────────────────
async function handler(req, res) {
  // - parse pathname:  const { pathname } = new URL(req.url, 'http://localhost')
  // - const match = matchRoute(req.method, pathname); 404 if none
  // - await match.handler(req, res, match.params)
  // - wrap it ALL in try/catch: an HttpError → its status; anything else → 500
  //   (log the 500, but don't leak the message). Skip if res.headersSent.
}

function createServer() {
  return http.createServer(handler);
}

module.exports = { handler, createServer, tasks };

if (require.main === module) {
  const PORT = process.env.PORT ?? 3000;
  createServer().listen(PORT, () => {
    console.log(`REST API listening on http://localhost:${PORT}`);
    console.log('Try:  curl http://localhost:' + PORT + '/tasks');
  });
}
