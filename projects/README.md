# JavaScript Projects — Build to Learn

Reading teaches you *what*. Building teaches you *how*. These eight projects make
you apply the lessons in real, working apps — the first seven run in the browser,
and the eighth is a back-end REST API you run with Node.

## How each project works

Every project folder has:

- **README.md** — the goal, the spec, and step-by-step build instructions
- **index.html** — the page structure + the **starter** (`app.js`); this is where you work
- **style.css** — basic styling (already done)
- **app.js** — the **starter**: scaffolding with `// TODO:` comments for YOU to fill in
- **solution.js** — the **complete** working version to check yourself against
- **solution.html** — open this to see the finished app running (it loads `solution.js`)

### To run a project

1. Open the project's `index.html` in your browser (double-click it).
2. Open DevTools (F12) → Console to see logs / errors.
3. Edit `app.js`, save, and refresh the page to see your changes.

> `index.html` loads **app.js** (your version) by default.
> To see the finished app working, just open **`solution.html`** — no editing needed.

## The projects (do them in order)

| # | Project | Lessons it uses | New skill |
| --- | --- | --- | --- |
| 1 | [To-Do App](1-todo-app/) | 13–14 arrays/objects, 24 DOM, 25 events, 34 storage | DOM + events + persistence |
| 2 | [Weather App](2-weather-app/) | 20–22 async, 26 fetch, 33 dates | real API calls + async UI |
| 3 | [Quiz App](3-quiz-app/) | 09 functions, 13 array methods, 15 destructuring, 24–25 DOM/events | managing app "state" |
| 4 | [Route Finder](4-route-finder/) | 49 graph, 50 BFS, 16 Map/Set, 24–25 DOM/events | data structures + algorithms in a real UI |
| 5 | [Virtual List](5-virtual-list/) | 42 performance, 13 array methods, 24–25 DOM/events, 30 throttle | virtualization — render only what's visible |
| 6 | [Form Validation](6-form-validation/) | 24 DOM, 25 events, 27 regex, 22 errors, 07 conditionals | validate input before you trust it |
| 7 | [Notes App](7-notes-app/) | 14 objects, 20 async, 26 fetch, 22 errors, 24–25 DOM/events | mutate server state with optimistic UI + rollback |
| 8 | [REST API](8-rest-api/) **(backend)** | 46 Node, 26 HTTP, 22 errors, 40 security, 39 testing | build the server: routing, validation, status codes |

> **Project 8 is back-end** — no browser. Run it with `node projects/8-rest-api/solution.js`
> and test it with `node --test projects/8-rest-api/test.mjs`. Fill in `server.js` (the
> starter) instead of `app.js`.

## The right way to use these

1. **Read the project README** and try to build it yourself in `app.js`.
2. **Get stuck? Good.** Re-read the linked lesson, then keep going.
3. **Only peek at `solution.js`** after a real attempt — compare your approach.
4. **Then extend it** — every README has "Make it your own" ideas. That's where
   real learning happens.

Build all eight and you'll have gone from "I read about JavaScript" to
"I build things with JavaScript." 🚀
