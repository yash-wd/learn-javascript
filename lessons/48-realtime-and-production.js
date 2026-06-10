/* =============================================================================
 * 48 · REAL-TIME NETWORKING & PRODUCTION OPS
 * =============================================================================
 * Run:  node lessons/48-realtime-and-production.js
 *
 * WHAT YOU'LL LEARN
 *   • Pushing data in real time: WebSockets vs Server-Sent Events vs polling
 *   • Running software in production: logging, observability, config, flags
 *   • Not overwhelming downstreams: concurrency/rate limits, queues, backpressure
 *   • Accessibility (a11y) & internationalization (i18n) basics
 *
 * "It works on my machine" isn't done. Production code must be observable,
 * configurable, resilient, and usable by everyone.
 * ========================================================================== */

// ── 1. Real-time: three ways to get fresh data ───────────────────────────────
// • POLLING ........ ask repeatedly on a timer. Simple, but wasteful/laggy.
//     setInterval(() => fetch('/api/messages'), 5000);
// • SSE (EventSource) ... server → client, ONE-WAY stream over plain HTTP.
//     const es = new EventSource('/stream');
//     es.onmessage = (e) => console.log('update:', e.data);   // great for feeds
// • WEBSOCKETS ..... full DUPLEX (both directions), low latency. Chat, games,
//     live cursors. A persistent connection, not request/response.
//     const ws = new WebSocket('wss://example.com');
//     ws.onopen    = () => ws.send('hello');
//     ws.onmessage = (e) => console.log('got:', e.data);
//   On the server (Node) you'd use the `ws` library or Socket.IO.
console.log('real-time: poll (simple) < SSE (one-way) < WebSocket (two-way)');

// Quick decision guide:
function chooseTransport(need) {
  if (need === 'two-way') return 'WebSocket';
  if (need === 'server-push') return 'SSE';
  return 'polling';
}
console.log(chooseTransport('two-way'));    // => WebSocket
console.log(chooseTransport('server-push')); // => SSE


// ── 2. Logging — structured, leveled ─────────────────────────────────────────
// Don't ship console.log spam. Use levels and structured (JSON) logs so they're
// searchable in a log platform. (Libraries: pino, winston.)
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
function log(level, msg, meta = {}) {
  if (LEVELS[level] <= LEVELS.info) {           // current threshold = info
    console.log(JSON.stringify({ level, msg, ...meta }));
  }
}
log('info', 'user signed up', { userId: 42 });
// => {"level":"info","msg":"user signed up","userId":42}
log('debug', 'noisy detail'); // suppressed (below threshold)


// ── 3. Monitoring, error tracking & observability ────────────────────────────
// • Catch and REPORT errors from real users (Sentry, etc.) instead of losing them:
//     window.addEventListener('error', (e) => report(e));
//     window.addEventListener('unhandledrejection', (e) => report(e.reason));
//     process.on('uncaughtException', report); // Node
// • Observability has three pillars: LOGS (events), METRICS (numbers over time),
//   TRACES (one request's path across services). The mental model is the same
//   everywhere: CAPTURE → ENRICH (user, release, request id) → SHIP → ALERT.
//     - Error aggregation (Sentry/Bugsnag-style): groups duplicate crashes,
//       attaches stack + release + breadcrumbs, so one alert ≠ one email per user.
//     - Distributed tracing (OpenTelemetry is the vendor-neutral standard):
//       follow a single request through API → DB → queue to find the slow hop.
//     - APM ties latency/error-rate/throughput to releases so you spot regressions.
// • Track metrics (latency, error rate, throughput) and set alerts.
//   "If you can't see it, you can't fix it."


// ── 4. Configuration & secrets ───────────────────────────────────────────────
// • Config comes from ENVIRONMENT VARIABLES, not hard-coded values (lesson 46).
// • Secrets (API keys, DB passwords) live in a secret manager / .env that is
//   GIT-IGNORED — never committed (lesson 40).
const config = {
  apiUrl: process.env.API_URL ?? 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL ?? 'info',
};
console.log('config:', config);


// ── 5. Feature flags & graceful failure ──────────────────────────────────────
// • Feature flags toggle features without redeploying (gradual rollout, kill-switch).
const flags = { newCheckout: false };
console.log(flags.newCheckout ? 'new checkout' : 'old checkout'); // => old checkout
// • Resilience: retries with backoff (lesson 30), timeouts, circuit breakers,
//   and fallback UI so one failed call doesn't crash the whole app.
// • Don't overwhelm downstreams. When you have more work than a service (or your
//   rate limit) can take, bound the flow:
//     - CONCURRENCY LIMIT: run at most N at once (lesson 30 `mapLimit`).
//     - RATE LIMIT: cap requests-per-second to respect a 429 budget.
//     - QUEUE + BACKPRESSURE: buffer work and let consumers pull at their pace
//       (p-queue/BullMQ in JS; streams signal "slow down" via `.pause()`/drain).
//   The goal: steady throughput instead of a thundering herd that trips 5xx.


// ── 6. Accessibility (a11y) — usable by everyone ─────────────────────────────
// • Semantic HTML first (<button>, <nav>, <label>) — it's accessible by default.
// • Provide alt text, keyboard navigation, visible focus, sufficient contrast.
// • Use ARIA only to fill gaps semantic HTML can't (aria-label, roles, live regions).
// • Test with a keyboard only and a screen reader. It's also often a legal requirement.


// ── 7. Internationalization (i18n) ───────────────────────────────────────────
// • Don't concatenate translated strings; use a message catalog per locale.
// • Format with Intl (lessons 06/32) — numbers, currency, dates, plurals:
const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
console.log('localized price:', price.format(1234.5)); // => 1.234,50 €


/* THE PRODUCTION CHECKLIST ----------------------------------------------------
 *   tested · linted · typed · secured · observable (logs+metrics+alerts) ·
 *   configurable (env) · resilient (retries/timeouts) · accessible · documented
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Add a 'warn' log call and confirm it prints but 'debug' does not.
 *   2. Extend chooseTransport for a 'one-off request' → 'fetch'.
 *   3. Read LOG_LEVEL from env and make the log() threshold respect it.
 * ------------------------------------------------------------------------- */
