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
 *   related   lessons/projects it touches (e.g. ['25-fetch-apis', 'proj:2'])
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
      'Lesson 27 covers sync generators and 29 touches async, but there is no dedicated ' +
      'worked example of consuming an async iterable. Add a focused section (likely in 29).',
    related: ['27-generators-iterators', '29-advanced-async'],
    priority: 'med',
    status: 'todo',
    added: '2026-06-10',
  },
  {
    id: 'fetch-retry-backoff',
    kind: 'lesson-gap',
    title: 'Real network-failure recovery in the fetch lesson',
    detail:
      'Lesson 25 shows the happy path + timeout. Add a short, real-world section on ' +
      'retry with exponential backoff and distinguishing retryable (5xx, network) from ' +
      'fatal (4xx) errors. The backoff helper already exists in lesson 29 — cross-link it.',
    related: ['25-fetch-apis', '29-advanced-async'],
    priority: 'med',
    status: 'todo',
    added: '2026-06-10',
  },
  {
    id: 'observability-sdks',
    kind: 'lesson-gap',
    title: 'Production observability: error aggregation & tracing',
    detail:
      'Lesson 47 covers structured logging but not error-aggregation SDKs (Sentry-style), ' +
      'distributed tracing (OpenTelemetry), or APM. Add a conceptual section — no vendor ' +
      'lock-in, just the patterns: capture → enrich → ship → alert.',
    related: ['47-realtime-and-production'],
    priority: 'low',
    status: 'todo',
    added: '2026-06-10',
  },
  {
    id: 'backpressure-queues',
    kind: 'lesson-gap',
    title: 'Rate limiting, queues & backpressure',
    detail:
      'Lesson 29 has mapLimit + backoff; lesson 47 is production ops. Neither covers ' +
      'rate-limiting, work queues (p-queue / Bull style), or stream backpressure. Worth a ' +
      'short conceptual add for learners heading into backend work.',
    related: ['29-advanced-async', '47-realtime-and-production'],
    priority: 'low',
    status: 'todo',
    added: '2026-06-10',
  },
  {
    id: 'monorepo-tooling',
    kind: 'lesson-gap',
    title: 'Monorepos / workspaces in the tooling lesson',
    detail:
      'Lesson 44 tours npm/semver/bundlers but barely mentions workspaces, monorepos, or ' +
      'cross-package sharing — common in real 2026 codebases. Add a short section.',
    related: ['44-tooling'],
    priority: 'low',
    status: 'todo',
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
    status: 'todo',
    added: '2026-06-10',
  },
  {
    id: 'virtual-list-varheight-note',
    kind: 'docs',
    title: 'Explain why variable row heights are hard (Virtual List)',
    detail:
      'solution.js is fixed-height. Add a comment near the math noting that variable ' +
      'heights need a cumulative offset index (what react-window / TanStack Virtual do).',
    related: ['proj:5-virtual-list', '41-performance'],
    priority: 'low',
    status: 'todo',
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
    status: 'todo',
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
