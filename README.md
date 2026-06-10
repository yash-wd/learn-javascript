<div align="center">

## 👉 &nbsp; [Open the Live Course](https://yash-wd.github.io/learn-javascript/) &nbsp; 👈

<sub>Runs right in your browser — no install needed</sub>

<br>

# ⚡ Learn JavaScript

**A complete step-by-step course — from zero to expert.**
<br>56 short lessons · 8 real projects · 100% free · no sign-up

<br>

[![CI](https://github.com/yash-wd/learn-javascript/actions/workflows/ci.yml/badge.svg)](https://github.com/yash-wd/learn-javascript/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A520-339933?logo=node.js&logoColor=white)](https://nodejs.org)

</div>

<br>

---

A beginner-friendly course that starts from **zero** and goes all the way to
**expert** and **interview** level. **56 short lessons** plus **8 real projects**.
Every lesson is a single file you **read**, then **run**, then move on. That's the
whole method.

> 🧭 **Prefer a visual guide?** Open **[`curriculum.html`](curriculum.html)** in
> your browser for a clickable learning path, a beginner FAQ, and links to every
> lesson.

## Start here (3 steps)

1. **Install Node.js** — a free program that runs JavaScript on your computer.
   Get it from [nodejs.org](https://nodejs.org) (pick the **LTS** version).
2. **Open the first lesson** — read [`lessons/01-variables.js`](lessons/01-variables.js)
   top to bottom. Every line is explained, and `// =>` shows what it prints.
3. **Run it, then repeat** — in a terminal, run the lesson and compare the output.
   Then go to the next one. Keep going in order, all the way to lesson 56.

```bash
node lessons/01-variables.js     # your first lesson
node lessons/02-data-types.js    # the next one… and so on, in order
```

**The golden rule:** read it → run it → change a value and run again → only move
on once it makes sense.

🟡 **You mainly use two folders:** `lessons/` (what you learn from) and
`projects/` (what you build later) — plus the optional `practice/` folder for
auto-graded drills. You can safely **ignore** `assets/`, `bundle/`, and `tools/`
— those are just packaging for the website and the offline PDF.

💻 **Browser lessons:** a few lessons (24, 25, 47) change web pages, so they run
in a browser instead of the terminal. Open `playground.html`, pick the lesson
from its dropdown, and it runs on a live demo stage with the console mirrored
right below it (press **F12** for the full DevTools console).

📖 **Read offline / on paper:** every lesson is bundled into
[bundle/JS_Learn_Everything.pdf](bundle/JS_Learn_Everything.pdf) and
[.md](bundle/JS_Learn_Everything.md).

---

## Find a topic fast

Want to practice a specific topic but not sure which lesson covers it? Run the
helper script with a keyword:

```bash
./findtopic.sh reduce
./findtopic.sh closures
./findtopic.sh "async"
./findtopic.sh --word map      # whole-word: matches "map" but not "weakmap"
./findtopic.sh -v scope        # verbose: full ranked table + every match
```

By default it prints a short, clean answer — the **best bet**, **how to run it**,
its **practice exercises**, and a few other lessons that **also teach** the topic:

```text
  scope  →  10-scope-closures.js   [CONFIRMED: title, learn, name]
  run:  node lessons/10-scope-closures.js

  Practice here:
    1. Write makeAdder(x) that returns a function adding x to its argument.
       const add5 = makeAdder(5); add5(10) === 15
    2. Build a once(fn) wrapper that runs fn only the first time it's called.
    3. Explain why `count` survives between counter() calls.

  Also teaches "scope":
    - 01-variables.js  (learn)

  6 lessons mention "scope" · run  ./findtopic.sh -v scope  for the full table
```

The `run:` line uses each lesson's own instructions — so for the browser-based
lessons (24, 25, 47) it tells you to open `index.html` and use DevTools instead
of running `node`.

**How it ranks (a scoring checklist, not "first match wins").** Every lesson has
the same shape — a title header, a `WHAT YOU'LL LEARN` list, and a `PRACTICE`
block. The script scores each lesson by *where* the keyword appears, because
location tells you how central the topic is:

| Keyword appears in… | Points |
| --- | --- |
| the **title** line (`NN · TOPIC`) | +5 |
| **WHAT YOU'LL LEARN** | +3 |
| the **PRACTICE** block | +3 |
| the **filename** | +2 |
| the **body** (presence only, capped) | +1 |

Lessons are ranked by total score. The top one is the **best bet**
(`[CONFIRMED]` if it matched a real signal, `[BEST GUESS]` if it only appears in
the body). Recommendations only ever include lessons that *genuinely* teach the
topic (a title / learn / practice / filename match) — never a file that just
mentions it in passing.

> 🔍 **`-v` / `--verbose`:** adds the full ranked table (every lesson with its
> score and *where* it matched) plus every PRACTICE exercise that names the
> keyword across all lessons — so you can jump straight to a drill.
>
> 💪 **Why it isn't fooled by your own code:** the body only ever adds +1
> (presence, not count). So even if you write a keyword 100 times practicing in
> some unrelated lesson, it still scores 1 there and can't out-rank the lesson
> that actually teaches it.
>
> 🔤 **`--word` flag:** for a short word that's part of another topic (e.g.
> `map` inside `weakmap`), add `--word` to match whole words only. Trade-off: it
> won't match plurals like `maps`, so use it when a substring is causing noise.

(On Windows, run it with `bash findtopic.sh reduce`.)

---

## Repository layout

```text
.
├── curriculum.html     → visual learning path + beginner FAQ  (start here)
├── index.html          → front door (sends you to the curriculum)
├── playground.html     → host page for the browser-only lessons
├── findtopic.sh        → find which lesson teaches a topic + its practice
│
├── lessons/            → ⭐ the 56 lessons — this is the course
│   ├── modules-demo/   → small runnable example for lesson 23
│   └── solutions/      → one worked-answer file per lesson
├── projects/           → ⭐ 8 projects to build (starter + solution + README)
├── practice/           → fill-in exercises with auto-grading tests (optional)
│
├── assets/             → styles/script for the web pages   (ignore)
├── bundle/             → offline PDF + Markdown of the whole course  (ignore)
└── tools/              → build-bundle + check-outputs scripts  (ignore)
```

---

## Roadmap

The 56 lessons climb through **five levels**, beginner to expert. Do them
**in order** — each level builds on the one before.

### Level 1 — Foundation

*The absolute basics: storing values, doing math, working with text, making decisions.*

| # | Lesson | What you learn |
| --- | --- | --- |
| 01 | [Variables](lessons/01-variables.js) | `var`, `let`, `const`, reassignment, redeclaration, scope, hoisting |
| 02 | [Data Types](lessons/02-data-types.js) | primitives vs objects, `typeof` |
| 03 | [Operators](lessons/03-operators.js) | arithmetic, comparison, logical, nullish |
| 04 | [Type Conversion](lessons/04-type-conversion.js) | coercion, truthy/falsy, `==` vs `===` |
| 05 | [Strings](lessons/05-strings.js) | template literals, common methods |
| 06 | [Numbers & Math](lessons/06-numbers-math.js) | `Number`, `Math`, formatting, precision pitfalls |
| 07 | [Conditionals](lessons/07-conditionals.js) | `if/else`, `switch`, ternary |
| 08 | [Loops](lessons/08-loops.js) | `for`, `while`, `for...of`, `for...in`, `break/continue` |

### Level 2 — Core Concepts

*The everyday tools you'll use in almost every program: functions, arrays, objects.*

| # | Lesson | What you learn |
| --- | --- | --- |
| 09 | [Functions](lessons/09-functions.js) | declarations, expressions, arrows, params, **recursion** |
| 10 | [Scope & Closures](lessons/10-scope-closures.js) | lexical scope, closures |
| 11 | [The `this` Keyword](lessons/11-this-keyword.js) | `this`, `call/apply/bind` |
| 12 | [Arrays](lessons/12-arrays.js) | creating & mutating arrays |
| 13 | [Array Methods](lessons/13-array-methods.js) | `map`, `filter`, `reduce`, `find`, ... |
| 14 | [Objects](lessons/14-objects.js) | properties, methods, getters/setters, descriptors, **JSON** |
| 15 | [Destructuring & Spread](lessons/15-destructuring-spread.js) | `{...}`, `[...]`, rest |
| 16 | [Sets & Maps](lessons/16-sets-maps.js) | `Set`, `Map`, when to use them |

### Level 3 — Intermediate

*Build real, interactive apps: objects done properly, async, web pages, and live data.*

| # | Lesson | What you learn |
| --- | --- | --- |
| 17 | [Classes & OOP](lessons/17-classes-oop.js) | `class`, inheritance, getters/setters |
| 18 | [Prototypes](lessons/18-prototypes.js) | the prototype chain |
| 19 | [Callbacks & Promises](lessons/19-callbacks-promises.js) | the event loop, `Promise` |
| 20 | [Async / Await](lessons/20-async-await.js) | `async`, `await`, parallel work |
| 21 | [How JavaScript Runs](lessons/21-how-javascript-runs.js) | execution context, call stack, event loop, micro/macrotasks, async/await internals |
| 22 | [Error Handling](lessons/22-error-handling.js) | `try/catch`, custom errors, global handlers |
| 23 | [Modules](lessons/23-modules.js) | `import` / `export`, dynamic `import()`, top-level `await` (+ [modules-demo/](lessons/modules-demo/)) |
| 24 | [DOM](lessons/24-dom.js) **(browser)** | selecting & changing the page |
| 25 | [Events](lessons/25-events.js) **(browser)** | listeners, delegation, bubbling |
| 26 | [Fetch & APIs](lessons/26-fetch-apis.js) | HTTP methods/status/headers/REST, `fetch`, JSON, async data, retry/backoff |

### Level 4 — Advanced

*Deeper language power and the modern toolbox — including today's newest features.*

| # | Lesson | What you learn |
| --- | --- | --- |
| 27 | [Regular Expressions](lessons/27-regular-expressions.js) | patterns, groups, lookahead/lookbehind, flags, `match`/`replace` |
| 28 | [Generators & Iterators](lessons/28-generators-iterators.js) | `function*`, `yield`, lazy sequences |
| 29 | [Symbols, Proxy & Reflect](lessons/29-symbols-proxy-reflect.js) | metaprogramming, interception |
| 30 | [Advanced Async](lessons/30-advanced-async.js) | microtasks, `for await`, abort, debounce/throttle, retry/backoff, concurrency |
| 31 | [Functional Programming](lessons/31-functional-programming.js) | purity, currying, compose/pipe |
| 32 | [Tricky Concepts](lessons/32-tricky-concepts.js) | the classic interview gotchas |
| 33 | [Dates & Time](lessons/33-dates-time.js) | `Date`, date formatting, durations |
| 34 | [Browser Storage](lessons/34-browser-storage.js) | localStorage, sessionStorage, cookies |
| 35 | [BOM & Timers](lessons/35-bom-timers.js) | `setTimeout`/`setInterval`, `window`, `location`, `history` |
| 36 | [Debugging & Console](lessons/36-debugging-console.js) | console methods, `debugger`, reading errors |
| 37 | [WeakMap & Memory](lessons/37-weakmap-memory.js) | garbage collection, WeakMap/WeakSet, strict mode, tagged templates |
| 38 | [Modern JavaScript (to 2026)](lessons/38-modern-js.js) | logical assignment, `Object.groupBy`, `toSorted`/`with`, iterator helpers, new Set methods, `Promise.withResolvers`/`try`, `using`, import attributes, decorators, `Float16Array`, Temporal preview |

### Level 5 — Expert

*Think like a professional: ship real software, scale it, and pass interviews. This level
includes both the engineering around the language and the computer-science core.*

| # | Lesson | What you learn |
| --- | --- | --- |
| 39 | [Testing](lessons/39-testing.js) | built-in test runner + `assert`, unit/async tests, mocking, the testing pyramid, coverage, the TDD loop |
| 40 | [Security Essentials](lessons/40-security.js) | XSS, CSRF, CORS, CSP, input validation, auth tokens, prototype pollution, SQL injection |
| 41 | [Design Patterns](lessons/41-design-patterns.js) | Module, Singleton, Factory, Observer/PubSub, Strategy, Decorator, Facade, Adapter, Command, DI, MVC/MVVM |
| 42 | [Performance](lessons/42-performance.js) | Big-O, memoization, reflow/repaint, lazy loading, web-vitals, profiling, list virtualization |
| 43 | [Polyfills](lessons/43-polyfills.js) | re-implement `map`/`filter`/`reduce`/`bind`/`debounce`/`Promise` (interview gold) |
| 44 | [TypeScript On-Ramp](lessons/44-typescript.js) | types, interfaces, generics, narrowing, JSDoc types |
| 45 | [Tooling & Build Systems](lessons/45-tooling.js) | package managers, monorepos/workspaces, semver, bundlers, transpilers, linters/formatters, git, CI/CD |
| 46 | [Node.js](lessons/46-nodejs.js) | `process`/env, `fs`, `path`, event emitters, streams, a real HTTP server |
| 47 | [Advanced Browser APIs](lessons/47-browser-apis.js) **(browser)** | Web Workers, Service Workers/PWA, IndexedDB, Observers, Web Components, rAF |
| 48 | [Real-Time & Production](lessons/48-realtime-and-production.js) | WebSockets/SSE, logging, observability/tracing, config/secrets, rate limits/queues/backpressure, accessibility, i18n |
| 49 | [Data Structures](lessons/49-data-structures.js) | Stack, Queue, Linked List, Hash Map, Binary Search Tree, Graph — built from scratch |
| 50 | [Algorithms](lessons/50-algorithms.js) | linear/binary search, bubble/merge/quick sort, two-pointer, sliding window, dynamic programming, BFS/DFS |
| 51 | [Binary Data](lessons/51-binary-data.js) | `ArrayBuffer`, typed arrays, `DataView`, `Blob`/`File`, `FormData`, `TextEncoder`, streaming, `Atomics` |
| 52 | [BigInt & Language Corners](lessons/52-bigint-and-language-corners.js) | `BigInt`, `Object.fromEntries`, `flatMap`, labeled statements, `eval`/`Function` (and why to avoid them) |
| 53 | [Internationalization](lessons/53-internationalization.js) | the full `Intl` API: `Collator`, `PluralRules`, `RelativeTimeFormat`, `ListFormat`, `Segmenter` |
| 54 | [Modern Authentication](lessons/54-modern-auth.js) | authN vs authZ, password hashing (scrypt/salt), sessions vs JWT, cookie flags, OAuth/OIDC, passkeys, refresh tokens |
| 55 | [Accessibility](lessons/55-accessibility.js) | semantic HTML, accessible names, ARIA, keyboard & focus, WCAG contrast, live regions, accessible forms/modals, an a11y linter |
| 56 | [Clean Code](lessons/56-clean-code.js) | naming, small functions, SOLID/SRP, DRY, guard clauses, cohesion vs coupling, code smells, technical debt |

> 💡 **Practice, then compare.** [lessons/solutions/](lessons/solutions/) has a
> matching `NN-solutions.js` file for every lesson — each with clear, runnable
> **worked answers** to that lesson's PRACTICE questions. Try each problem
> YOURSELF first, then run the solution to check yourself
> (e.g. `node lessons/solutions/09-solutions.js`).

### Optional focus tracks (for job seekers)

These add no new lessons — they point you at the ones that matter most for a goal:

- **Interview Prep:** 10 Closures · 11 `this` · 18 Prototypes · 32 Tricky Concepts · 43 Polyfills · 49 Data Structures · 50 Algorithms
- **Best Practices:** 22 Error Handling · 39 Testing · 40 Security · 41 Design Patterns · 42 Performance · 45 Tooling

---

## 🛠️ Projects — build to learn

Once you've worked through the lessons, **apply** them. The [projects/](projects/)
folder has eight guided builds, each with a starter (with `// TODO:`s), a complete
solution, and a README. The first seven open in your browser; the eighth is a
back-end REST API you run with Node.

| # | Project | Builds on | What you practice |
| --- | --- | --- | --- |
| 1 | [To-Do App](projects/1-todo-app/) | 13, 14, 24, 25, 34 | DOM + events + localStorage persistence |
| 2 | [Weather App](projects/2-weather-app/) | 20, 22, 26, 33 | real API calls, async UI, error states |
| 3 | [Quiz App](projects/3-quiz-app/) | 09, 13, 24, 25 | managing app state |
| 4 | [Route Finder](projects/4-route-finder/) | 49, 50, 16, 24, 25 | a graph + BFS shortest path in a real UI |
| 5 | [Virtual List](projects/5-virtual-list/) | 42, 13, 24, 25, 30 | virtualization: scroll 50k rows with ~17 in the DOM |
| 6 | [Form Validation](projects/6-form-validation/) | 24, 25, 27, 22, 07 | live per-field validation, accessible errors, submit gating |
| 7 | [Notes App](projects/7-notes-app/) | 14, 20, 26, 22, 24, 25 | full CRUD against a REST API + optimistic UI with rollback |
| 8 | [REST API](projects/8-rest-api/) **(backend)** | 46, 26, 22, 40, 39 | build the server: routing, validation, status codes, tests |

> Reading shows you *what*; building shows you *how*. Don't skip these.
>
> 🧪 **Want graded practice?** [`practice/`](practice/) has fill-in exercises (one
> per level) with tests that turn red→green as you solve them, plus a capstone.
> Run `PRACTICE=mine node --test practice/43-polyfills.test.mjs`.

---

## How to study

1. **Read** the lesson file top to bottom — every concept has a comment + example.
2. **Run** it and confirm the output matches the `// =>` comments.
3. **Break it** — change values, re-run, and see what happens. That's where learning sticks.
4. Move to the next lesson only when the current one makes sense.

Happy coding! 🚀
