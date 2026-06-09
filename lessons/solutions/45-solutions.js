/* =============================================================================
 * SOLUTIONS · 45 · NODE.JS — JavaScript on the server
 * =============================================================================
 * Run:  node lessons/solutions/45-solutions.js          (try adding a name:)
 *       node lessons/solutions/45-solutions.js Ada
 *
 * Worked answers to the PRACTICE block in lessons/45-nodejs.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');

// ── 1. Read process.argv and greet a name passed on the command line. ────────
// argv[0] = node, argv[1] = this file, argv[2+] = your args.
const name = process.argv[2] ?? 'world';
console.log('1.', `Hello, ${name}!`); // => 1. Hello, world!  (or your name)

async function main() {
  // ── 2. Write an object to a JSON file with fs.writeFile, then read it back. ──
  const file = path.join(os.tmpdir(), 'js-learn-45.json'); // temp dir → no clutter
  await fs.writeFile(file, JSON.stringify({ user: 'Ada', score: 99 }, null, 2));
  const back = JSON.parse(await fs.readFile(file, 'utf8'));
  console.log('2.', back); // => 2. { user: 'Ada', score: 99 }
  await fs.rm(file); // clean up after ourselves

  // ── 3. Add a '/time' route to the server that returns the current time. ──────
  const server = http.createServer((req, res) => {
    if (req.url === '/time') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ time: new Date().toISOString() }));
    } else {
      res.writeHead(404);
      res.end('not found');
    }
  });
  // Listen on an OS-assigned free port, hit /time once, then shut down so the
  // script exits (a real server would just keep listening).
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const res = await fetch(`http://localhost:${port}/time`);
  const body = await res.json();
  console.log('3.', `/time → ${res.status}, got time:`, typeof body.time === 'string');
  // => 3. /time → 200, got time: true
  server.close();
}

main();
