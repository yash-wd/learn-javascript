/* =============================================================================
 * SOLUTIONS · 47 · REAL-TIME NETWORKING & PRODUCTION OPS
 * =============================================================================
 * Run:  node lessons/solutions/47-solutions.js
 *       LOG_LEVEL=debug node lessons/solutions/47-solutions.js   (try it!)
 *
 * Worked answers to the PRACTICE block in lessons/47-realtime-and-production.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 3. Read LOG_LEVEL from env and make the log() threshold respect it. ──────
// (Done first so parts 1–2 can use it.) Each level has a numeric weight; we
// only print messages at or above the configured threshold.
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const configured = process.env.LOG_LEVEL ?? 'info';
const threshold = LEVELS[configured] ?? LEVELS.info;
function log(level, message) {
  if (LEVELS[level] >= threshold) console.log(`[${level}] ${message}`);
}

// ── 1. Add a 'warn' log call and confirm it prints but 'debug' does not. ─────
log('debug', 'connection pool size = 8'); // suppressed at default LOG_LEVEL=info
log('warn', 'request latency is high');   // printed (warn ≥ info)
console.log('1.', `(debug hidden, warn shown — threshold is '${configured}')`);

// ── 2. Extend chooseTransport for a 'one-off request' → 'fetch'. ─────────────
function chooseTransport(need) {
  switch (need) {
    case 'two-way realtime':
      return 'WebSocket'; // full-duplex: chat, multiplayer, live cursors
    case 'server push':
      return 'SSE'; // one-way stream from server: notifications, live feeds
    case 'one-off request':
      return 'fetch'; // ← the new case: a single request/response
    default:
      return 'polling'; // fallback: ask repeatedly on a timer
  }
}
console.log('2.', chooseTransport('one-off request')); // => 2. fetch
console.log('2.', chooseTransport('two-way realtime')); // => 2. WebSocket

// ── 3. (cont.) ────────────────────────────────────────────────────────────
console.log('3.', `set LOG_LEVEL=debug to lower the threshold and reveal debug logs`);
