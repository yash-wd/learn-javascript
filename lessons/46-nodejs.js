/* =============================================================================
 * 46 · NODE.JS — JavaScript on the server
 * =============================================================================
 * Run:  node lessons/46-nodejs.js
 *
 * (Heads-up: Node prints a harmless "MODULE_TYPELESS_PACKAGE_JSON" warning —
 *  this file is an ES module and package.json has no "type" on purpose. Ignore it.)
 *
 * WHAT YOU'LL LEARN
 *   The Node-specific APIs that the browser doesn't have: process & env,
 *   the file system, paths, events, streams, and a real HTTP server.
 *
 * Node is JavaScript outside the browser — it powers backends, CLIs, and
 * tooling. Core modules live under the `node:` prefix.
 * ========================================================================== */

import process from 'node:process';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { EventEmitter } from 'node:events';
import http from 'node:http';

// ── 1. process — info about the running program ──────────────────────────────
console.log('node version :', process.version);          // => v24.x
console.log('platform     :', process.platform);         // => linux / darwin / win32
console.log('cwd          :', process.cwd().split('/').pop()); // current folder name
// CLI args:  node script.js foo bar  → process.argv = [node, script, 'foo', 'bar']
console.log('args         :', process.argv.slice(2));     // => [] (none here)
// Environment variables — where secrets/config live (NEVER hard-code secrets):
//   run:  API_KEY=abc node lessons/46-nodejs.js
console.log('API_KEY      :', process.env.API_KEY ?? '(not set — see lesson 40)');


// ── 2. path — build file paths the cross-platform way ────────────────────────
console.log('join         :', path.join('src', 'utils', 'math.js')); // src/utils/math.js
console.log('extname      :', path.extname('report.pdf'));           // => .pdf
console.log('basename     :', path.basename('/a/b/notes.txt'));      // => notes.txt


// ── 3. fs — read & write files (async/await) ─────────────────────────────────
const tmpFile = path.join(os.tmpdir(), 'js-learn-demo.txt');
await fs.writeFile(tmpFile, 'hello from Node\n');     // create/overwrite
const contents = await fs.readFile(tmpFile, 'utf8');  // read back as text
console.log('file says    :', contents.trim());       // => hello from Node
await fs.appendFile(tmpFile, 'second line\n');         // append
await fs.unlink(tmpFile);                              // delete (cleanup)
console.log('temp file cleaned up ✅');


// ── 4. EventEmitter — Node's built-in observer (lesson 41 pattern) ───────────
class Order extends EventEmitter {}
const order = new Order();
order.on('paid', (amount) => console.log(`order paid: $${amount}`)); // listener
order.emit('paid', 99); // => order paid: $99
// Many Node objects (streams, servers, sockets) ARE EventEmitters.


// ── 5. Streams — process data piece by piece, not all at once ────────────────
// Streams let you handle huge files/responses with low memory by working on
// CHUNKS. (Conceptual — fs.createReadStream(path).on('data', chunk => ...).)
// Examples: reading a 2GB log line-by-line, or piping a download to disk.


// ── 6. A real HTTP server ────────────────────────────────────────────────────
// http.createServer gives you a callback per request. We start it on a random
// free port (0), make one request to ourselves, print the reply, then close.
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, path: req.url }));
});

await new Promise((resolve) => server.listen(0, resolve)); // 0 = pick a free port
const { port } = server.address();
const reply = await fetch(`http://localhost:${port}/hello`).then((r) => r.json());
console.log('server replied:', reply); // => { ok: true, path: '/hello' }
server.close(); // stop listening so the program can exit
// In real apps you'd use a framework (Express/Fastify/Hono) on top of this.


/* BROWSER vs NODE -------------------------------------------------------------
 *   Browser has: window, document, DOM, localStorage.
 *   Node has:    process, fs, path, http, os, Buffer, EventEmitter.
 *   Shared:      JS syntax, fetch, Promises, console, timers, JSON.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Read process.argv and greet a name passed on the command line.
 *   2. Write an object to a JSON file with fs.writeFile, then read it back.
 *   3. Add a '/time' route to the server that returns the current time.
 * ------------------------------------------------------------------------- */
