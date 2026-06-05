<p align="center">
  <a href="https://yash-wd.github.io/learn-javascript/">
    <img src="https://img.shields.io/badge/%E2%96%B6%20CLICK%20TO%20LAUNCH-Open%20the%20Live%20Course-22c55e?style=for-the-badge&labelColor=15803d" alt="Click to launch the live course" height="46">
  </a>
  <br>
  <sub>Free · runs in your browser · no install needed</sub>
</p>

<br>

---

<br>

# Learn JavaScript — A Complete Step-by-Step Course

A beginner-friendly course that starts from **zero** and goes all the way to
**expert** and **interview** level. **52 short lessons** plus **5 real projects**.
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
   Then go to the next one. Keep going in order, all the way to lesson 52.

```bash
node lessons/01-variables.js     # your first lesson
node lessons/02-data-types.js    # the next one… and so on, in order
```

**The golden rule:** read it → run it → change a value and run again → only move
on once it makes sense.

🟡 **You only ever use two folders:** `lessons/` (what you learn from) and
`projects/` (what you build later). You can safely **ignore** `assets/`,
`bundle/`, and `tools/` — those are just packaging for the website and the
offline PDF.

💻 **Browser lessons:** a few lessons (23, 24, 46) change web pages, so they run
in a browser instead of the terminal. Open `playground.html`, point its
`<script src>` at that lesson, then open the page and press **F12** → Console.

📖 **Read offline / on paper:** every lesson is bundled into
[bundle/JS_Learn_Everything.pdf](bundle/JS_Learn_Everything.pdf) and
[.md](bundle/JS_Learn_Everything.md).

---

## Repository layout

```text
.
├── curriculum.html     → visual learning path + beginner FAQ  (start here)
├── index.html          → front door (sends you to the curriculum)
├── playground.html     → host page for the browser-only lessons
│
├── lessons/            → ⭐ the 52 lessons — this is the course
│   ├── modules-demo/   → small runnable example for lesson 22
│   └── solutions/      → worked answers for exercises 48–50
├── projects/           → ⭐ 5 projects to build (starter + solution + README)
│
├── assets/             → styles/script for the web pages   (ignore)
├── bundle/             → offline PDF + Markdown of the whole course  (ignore)
└── tools/              → script that regenerates the bundle  (ignore)
```

---

## Roadmap

The 52 lessons climb through **five levels**, beginner to expert. Do them
**in order** — each level builds on the one before.

### Level 1 — Foundation

*The absolute basics: storing values, doing math, working with text, making decisions.*

| # | Lesson | What you learn |
| --- | --- | --- |
| 01 | [Variables](lessons/01-variables.js) | `var`, `let`, `const`, scope, hoisting |
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
| 21 | [Error Handling](lessons/21-error-handling.js) | `try/catch`, custom errors, global handlers |
| 22 | [Modules](lessons/22-modules.js) | `import` / `export`, dynamic `import()`, top-level `await` (+ [modules-demo/](lessons/modules-demo/)) |
| 23 | [DOM](lessons/23-dom.js) **(browser)** | selecting & changing the page |
| 24 | [Events](lessons/24-events.js) **(browser)** | listeners, delegation, bubbling |
| 25 | [Fetch & APIs](lessons/25-fetch-apis.js) | HTTP methods/status/headers/REST, `fetch`, JSON, async data |

### Level 4 — Advanced

*Deeper language power and the modern toolbox — including today's newest features.*

| # | Lesson | What you learn |
| --- | --- | --- |
| 26 | [Regular Expressions](lessons/26-regular-expressions.js) | patterns, groups, lookahead/lookbehind, flags, `match`/`replace` |
| 27 | [Generators & Iterators](lessons/27-generators-iterators.js) | `function*`, `yield`, lazy sequences |
| 28 | [Symbols, Proxy & Reflect](lessons/28-symbols-proxy-reflect.js) | metaprogramming, interception |
| 29 | [Advanced Async](lessons/29-advanced-async.js) | microtasks, `for await`, abort, debounce/throttle, retry/backoff, concurrency |
| 30 | [Functional Programming](lessons/30-functional-programming.js) | purity, currying, compose/pipe |
| 31 | [Tricky Concepts](lessons/31-tricky-concepts.js) | the classic interview gotchas |
| 32 | [Dates & Time](lessons/32-dates-time.js) | `Date`, date formatting, durations |
| 33 | [Browser Storage](lessons/33-browser-storage.js) | localStorage, sessionStorage, cookies |
| 34 | [BOM & Timers](lessons/34-bom-timers.js) | `setTimeout`/`setInterval`, `window`, `location`, `history` |
| 35 | [Debugging & Console](lessons/35-debugging-console.js) | console methods, `debugger`, reading errors |
| 36 | [WeakMap & Memory](lessons/36-weakmap-memory.js) | garbage collection, WeakMap/WeakSet, strict mode, tagged templates |
| 37 | [Modern JavaScript (to 2026)](lessons/37-modern-js.js) | logical assignment, `Object.groupBy`, `toSorted`/`with`, iterator helpers, new Set methods, `Promise.withResolvers`/`try`, `using`, import attributes, decorators, `Float16Array`, Temporal preview |

### Level 5 — Expert

*Think like a professional: ship real software, scale it, and pass interviews. This level
includes both the engineering around the language and the computer-science core.*

| # | Lesson | What you learn |
| --- | --- | --- |
| 38 | [Testing](lessons/38-testing.js) | built-in test runner + `assert`, unit/async tests, mocking, the testing pyramid, coverage, the TDD loop |
| 39 | [Security Essentials](lessons/39-security.js) | XSS, CSRF, CORS, CSP, input validation, auth tokens, prototype pollution |
| 40 | [Design Patterns](lessons/40-design-patterns.js) | Module, Singleton, Factory, Observer/PubSub, Strategy, Decorator, Facade, Adapter, Command, DI, MVC/MVVM |
| 41 | [Performance](lessons/41-performance.js) | Big-O, memoization, reflow/repaint, lazy loading, web-vitals, profiling, list virtualization |
| 42 | [Polyfills](lessons/42-polyfills.js) | re-implement `map`/`filter`/`reduce`/`bind`/`debounce`/`Promise` (interview gold) |
| 43 | [TypeScript On-Ramp](lessons/43-typescript.js) | types, interfaces, generics, narrowing, JSDoc types |
| 44 | [Tooling & Build Systems](lessons/44-tooling.js) | package managers, semver, bundlers, transpilers, linters/formatters, git, CI/CD |
| 45 | [Node.js](lessons/45-nodejs.js) | `process`/env, `fs`, `path`, event emitters, streams, a real HTTP server |
| 46 | [Advanced Browser APIs](lessons/46-browser-apis.js) **(browser)** | Web Workers, Service Workers/PWA, IndexedDB, Observers, Web Components, rAF |
| 47 | [Real-Time & Production](lessons/47-realtime-and-production.js) | WebSockets/SSE, logging, monitoring, config/secrets, accessibility, i18n |
| 48 | [Data Structures](lessons/48-data-structures.js) | Stack, Queue, Linked List, Hash Map, Binary Search Tree, Graph — built from scratch |
| 49 | [Algorithms](lessons/49-algorithms.js) | linear/binary search, bubble/merge/quick sort, two-pointer, sliding window, dynamic programming, BFS/DFS |
| 50 | [Binary Data](lessons/50-binary-data.js) | `ArrayBuffer`, typed arrays, `DataView`, `Blob`/`File`, `FormData`, `TextEncoder`, streaming, `Atomics` |
| 51 | [BigInt & Language Corners](lessons/51-bigint-and-language-corners.js) | `BigInt`, `Object.fromEntries`, `flatMap`, labeled statements, `eval`/`Function` (and why to avoid them) |
| 52 | [Internationalization](lessons/52-internationalization.js) | the full `Intl` API: `Collator`, `PluralRules`, `RelativeTimeFormat`, `ListFormat`, `Segmenter` |

> 💡 **Stuck on the exercises in 48–50?** Worked, runnable solutions live in
> [lessons/solutions/](lessons/solutions/). Try each yourself first, then compare —
> e.g. `node lessons/solutions/49-solutions.js`.

### Optional focus tracks (for job seekers)

These add no new lessons — they point you at the ones that matter most for a goal:

- **Interview Prep:** 10 Closures · 11 `this` · 18 Prototypes · 31 Tricky Concepts · 42 Polyfills · 48 Data Structures · 49 Algorithms
- **Best Practices:** 21 Error Handling · 38 Testing · 39 Security · 40 Design Patterns · 41 Performance · 44 Tooling

---

## 🛠️ Projects — build to learn

Once you've worked through the lessons, **apply** them. The [projects/](projects/)
folder has five guided builds, each with a starter (with `// TODO:`s), a complete
solution, and a README. Open the project's `index.html` in your browser.

| # | Project | Builds on | What you practice |
| --- | --- | --- | --- |
| 1 | [To-Do App](projects/1-todo-app/) | 13, 14, 23, 24, 33 | DOM + events + localStorage persistence |
| 2 | [Weather App](projects/2-weather-app/) | 20, 21, 25, 32 | real API calls, async UI, error states |
| 3 | [Quiz App](projects/3-quiz-app/) | 09, 13, 23, 24 | managing app state |
| 4 | [Route Finder](projects/4-route-finder/) | 48, 49, 16, 23, 24 | a graph + BFS shortest path in a real UI |
| 5 | [Virtual List](projects/5-virtual-list/) | 41, 13, 23, 24, 29 | virtualization: scroll 50k rows with ~13 in the DOM |

> Reading shows you *what*; building shows you *how*. Don't skip these.

---

## How to study

1. **Read** the lesson file top to bottom — every concept has a comment + example.
2. **Run** it and confirm the output matches the `// =>` comments.
3. **Break it** — change values, re-run, and see what happens. That's where learning sticks.
4. Move to the next lesson only when the current one makes sense.

Happy coding! 🚀
