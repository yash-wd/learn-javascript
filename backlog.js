/* =============================================================================
 * backlog.js · Course backlog & "what's missing" tracker
 * =============================================================================
 * One place to jot down any topic, project idea, fix, or enhancement that the
 * course doesn't cover YET — so nothing gets lost between releases.
 *
 *   Run it:        node backlog.js                 # full grouped report
 *                  node backlog.js todo            # only open items
 *                  node backlog.js next            # the top few to do next
 *                  node backlog.js stats           # one-line summary
 *
 *   Add an item:   open this file and push a new object onto ITEMS below.
 *                  Keep the shape; set status:'todo' (or 'done' when shipped).
 *
 * This is a SOURCE-OF-TRUTH planning doc, not part of the lessons. It is plain
 * CommonJS (the repo has no "type" field on purpose — see CLAUDE.md), so it runs
 * with zero setup on Node >=20.
 *
 * Fields per item:
 *   id        short kebab-case slug (unique)
 *   kind      'lesson-gap' | 'project-idea' | 'enhancement' | 'fix' | 'docs'
 *   title     one line — what it is
 *   detail    why it matters / what "done" looks like
 *   related   lessons/projects it touches (e.g. ['26-fetch-apis', 'proj:2'])
 *   priority  'high' | 'med' | 'low'
 *   status    'todo' | 'done'
 *   added     YYYY-MM-DD  (when it landed on the backlog)
 * ========================================================================== */

'use strict';

const ITEMS = [
  // ── Lesson gaps surfaced by the 2026-06-10 end-to-end audit ──────────────────
  {
    id: 'async-iteration',
    kind: 'lesson-gap',
    title: 'for await...of and async generators',
    detail:
      'Streams, paginated APIs, and async generators all lean on `for await...of`. ' +
      'Already covered: lesson 30 §2 has a runnable async generator + for await...of ' +
      'example (the 1–26 audit missed it because it only read lessons 1–27). No new ' +
      'lesson needed; left here as the record.',
    related: ['28-generators-iterators', '30-advanced-async'],
    priority: 'med',
    status: 'done',
    added: '2026-06-10',
  },
  {
    id: 'fetch-retry-backoff',
    kind: 'lesson-gap',
    title: 'Real network-failure recovery in the fetch lesson',
    detail:
      'Lesson 26 shows the happy path + timeout. Add a short, real-world section on ' +
      'retry with exponential backoff and distinguishing retryable (5xx, network) from ' +
      'fatal (4xx) errors. The backoff helper already exists in lesson 30 — cross-link it.',
    related: ['26-fetch-apis', '30-advanced-async'],
    priority: 'med',
    status: 'done',
    added: '2026-06-10',
  },
  {
    id: 'observability-sdks',
    kind: 'lesson-gap',
    title: 'Production observability: error aggregation & tracing',
    detail:
      'Lesson 48 covers structured logging but not error-aggregation SDKs (Sentry-style), ' +
      'distributed tracing (OpenTelemetry), or APM. Add a conceptual section — no vendor ' +
      'lock-in, just the patterns: capture → enrich → ship → alert.',
    related: ['48-realtime-and-production'],
    priority: 'low',
    status: 'done',
    added: '2026-06-10',
  },
  {
    id: 'backpressure-queues',
    kind: 'lesson-gap',
    title: 'Rate limiting, queues & backpressure',
    detail:
      'Lesson 30 has mapLimit + backoff; lesson 48 is production ops. Neither covers ' +
      'rate-limiting, work queues (p-queue / Bull style), or stream backpressure. Worth a ' +
      'short conceptual add for learners heading into backend work.',
    related: ['30-advanced-async', '48-realtime-and-production'],
    priority: 'low',
    status: 'done',
    added: '2026-06-10',
  },
  {
    id: 'monorepo-tooling',
    kind: 'lesson-gap',
    title: 'Monorepos / workspaces in the tooling lesson',
    detail:
      'Lesson 45 tours npm/semver/bundlers but barely mentions workspaces, monorepos, or ' +
      'cross-package sharing — common in real 2026 codebases. Add a short section.',
    related: ['45-tooling'],
    priority: 'low',
    status: 'done',
    added: '2026-06-10',
  },

  // ── Project & polish ideas from the audit ────────────────────────────────────
  {
    id: 'quiz-shuffle',
    kind: 'enhancement',
    title: 'Built-in Fisher–Yates shuffle for the Quiz app',
    detail:
      'Quiz currently shows a fixed question/option order (shuffle is only suggested as an ' +
      'extension). Promoting it to a built-in feature better teaches array work and avoids ' +
      'answer memorization.',
    related: ['proj:3-quiz-app', '13-array-methods'],
    priority: 'low',
    status: 'done',
    added: '2026-06-10',
  },
  {
    id: 'virtual-list-varheight-note',
    kind: 'docs',
    title: 'Explain why variable row heights are hard (Virtual List)',
    detail:
      'solution.js is fixed-height. Add a comment near the math noting that variable ' +
      'heights need a cumulative offset index (what react-window / TanStack Virtual do).',
    related: ['proj:5-virtual-list', '42-performance'],
    priority: 'low',
    status: 'done',
    added: '2026-06-10',
  },
  {
    id: 'this-broken-demo',
    kind: 'enhancement',
    title: 'Make the `this` "what breaks" case runnable',
    detail:
      'Lesson 11 comments out the broken listBroken() example. Letting it actually run (and ' +
      'print the wrong result) lands the lesson harder than a commented block.',
    related: ['11-this-keyword'],
    priority: 'low',
    status: 'done',
    added: '2026-06-10',
  },

  // ── Example of a shipped item (kept as a template for the shape) ──────────────
  {
    id: 'projects-in-pdf',
    kind: 'enhancement',
    title: 'Embed the 7 projects in the HTML/PDF bundle, not just the .md',
    detail:
      'build-bundle.mjs now appends a Projects section (README + solution.js) to all three ' +
      'outputs. CLAUDE.md updated to match.',
    related: ['tools/build-bundle.mjs'],
    priority: 'med',
    status: 'done',
    added: '2026-06-10',
  },

  // ── Genuinely still open — future work (not yet covered anywhere) ─────────────
  {
    id: 'temporal-dedicated',
    kind: 'lesson-gap',
    title: 'Promote Temporal to first-class once it ships',
    detail:
      'Lesson 38 mentions Temporal as a Stage-3 preview and lesson 33 uses Date. When ' +
      'Temporal reaches Stage 4 / ships in Node + browsers, give it real coverage in 32 ' +
      '(ZonedDateTime, Duration, PlainDate) and demote the Date quirks to "legacy".',
    related: ['33-dates-time', '38-modern-js'],
    priority: 'low',
    status: 'todo',
    added: '2026-06-10',
  },
  {
    id: 'auth-passkeys',
    kind: 'lesson-gap',
    title: 'Modern auth: sessions vs tokens, OAuth, passkeys/WebAuthn',
    detail:
      'Lesson 40 covers auth tokens at a high level. A focused walkthrough of the auth ' +
      'landscape (cookie sessions vs JWT, OAuth/OIDC flow, and passkeys/WebAuthn) would ' +
      'fill a real 2026 gap — most apps get this wrong.',
    related: ['40-security', '34-browser-storage', '54-modern-auth'],
    priority: 'med',
    status: 'done', // shipped as lesson 54 (Modern Authentication) + its solution
    added: '2026-06-10',
  },
  {
    id: 'backend-api-project',
    kind: 'project-idea',
    title: '8th project: a real backend REST API (Node)',
    detail:
      'All 7 projects are front-end. Lesson 46 builds a raw HTTP server but there is no ' +
      'guided project. A small CRUD API (routing, validation, persistence, tests) would ' +
      'let learners apply lessons 22/38/39/45 end-to-end on the server side.',
    related: ['46-nodejs', '39-testing', '40-security', '22-error-handling'],
    priority: 'med',
    status: 'done', // shipped as project 8 (projects/8-rest-api) with passing tests
    added: '2026-06-10',
  },

  // ── Quality infrastructure shipped 2026-06-10 ───────────────────────────────
  {
    id: 'output-harness',
    kind: 'enhancement',
    title: 'Self-verifying lesson output harness',
    detail:
      'tools/check-outputs.mjs runs every non-browser lesson and asserts its `// =>` ' +
      'comments match real output (541 checked). Wired into verify.sh + CI + `npm run check`.',
    related: ['tools/check-outputs.mjs', 'scripts/verify.sh'],
    priority: 'high',
    status: 'done',
    added: '2026-06-10',
  },
  {
    id: 'practice-system',
    kind: 'enhancement',
    title: 'Auto-graded practice exercises + capstone',
    detail:
      'practice/ has fill-in stubs + reference solutions + node:test suites (one set per ' +
      'level) plus a 5-question capstone. PRACTICE=mine grades the learner; default grades ' +
      'the solution so CI stays green.',
    related: ['practice/'],
    priority: 'med',
    status: 'done',
    added: '2026-06-10',
  },
  {
    id: 'browser-lesson-sandbox',
    kind: 'enhancement',
    title: 'Runnable demo stage for browser lessons 24/24/46',
    detail:
      'playground.html now runs the browser lessons in an isolated iframe with a real ' +
      'scaffold DOM (#box, #myButton, etc.) and a visible console mirror, instead of ' +
      'loading them against a page with none of the elements they query.',
    related: ['playground.html'],
    priority: 'med',
    status: 'done',
    added: '2026-06-10',
  },
];

// ── reporting ────────────────────────────────────────────────────────────────
const C = process.stdout.isTTY
  ? { dim: '\x1b[2m', b: '\x1b[1m', red: '\x1b[31m', yel: '\x1b[33m', grn: '\x1b[32m', cyan: '\x1b[36m', off: '\x1b[0m' }
  : { dim: '', b: '', red: '', yel: '', grn: '', cyan: '', off: '' };

const PRIO = { high: `${C.red}● high${C.off}`, med: `${C.yel}● med ${C.off}`, low: `${C.dim}● low ${C.off}` };
const KINDS = ['lesson-gap', 'project-idea', 'enhancement', 'fix', 'docs'];

function assertShape() {
  const seen = new Set();
  for (const it of ITEMS) {
    for (const k of ['id', 'kind', 'title', 'detail', 'priority', 'status', 'added']) {
      if (!it[k]) throw new Error(`backlog item "${it.id || '?'}" is missing "${k}"`);
    }
    if (seen.has(it.id)) throw new Error(`duplicate backlog id: ${it.id}`);
    seen.add(it.id);
  }
}

function stats() {
  const todo = ITEMS.filter((i) => i.status === 'todo').length;
  const done = ITEMS.length - todo;
  return `${C.b}${ITEMS.length}${C.off} items · ${C.yel}${todo} todo${C.off} · ${C.grn}${done} done${C.off}`;
}

function line(it) {
  const mark = it.status === 'done' ? `${C.grn}✓${C.off}` : `${C.yel}○${C.off}`;
  return `  ${mark} ${PRIO[it.priority]} ${C.b}${it.title}${C.off}\n` +
         `      ${C.dim}[${it.id} · ${it.related.join(', ')}]${C.off}\n` +
         `      ${it.detail}`;
}

function report(filter) {
  const items = filter ? ITEMS.filter(filter) : ITEMS;
  console.log(`\n${C.cyan}${C.b}JS-Learn · course backlog${C.off}   ${stats()}\n`);
  for (const kind of KINDS) {
    const group = items.filter((i) => i.kind === kind);
    if (!group.length) continue;
    console.log(`${C.b}${kind}${C.off} (${group.length})`);
    group.sort((a, b) => ({ high: 0, med: 1, low: 2 }[a.priority] - { high: 0, med: 1, low: 2 }[b.priority]));
    for (const it of group) console.log(line(it) + '\n');
  }
}

// ── CLI ──────────────────────────────────────────────────────────────────────
function main() {
  assertShape();
  const cmd = (process.argv[2] || 'all').toLowerCase();
  switch (cmd) {
    case 'todo':
      report((i) => i.status === 'todo');
      break;
    case 'next': {
      const order = { high: 0, med: 1, low: 2 };
      const next = ITEMS.filter((i) => i.status === 'todo')
        .sort((a, b) => order[a.priority] - order[b.priority])
        .slice(0, 3);
      console.log(`\n${C.cyan}${C.b}Up next${C.off}   ${stats()}\n`);
      next.forEach((it, i) => console.log(`${C.b}${i + 1}.${C.off}\n` + line(it) + '\n'));
      break;
    }
    case 'stats':
      console.log(stats());
      break;
    case 'all':
    default:
      report();
  }
}

main();

module.exports = { ITEMS }; // importable if other tooling ever wants the list
