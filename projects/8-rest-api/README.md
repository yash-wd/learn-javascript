# Project 8 — REST API (backend)

The first **back-end** project. Everything else you built runs in the browser;
this runs on a server. You'll build a real CRUD REST API with **no frameworks
and no npm installs** — just Node's built-in `http` module — so you can see
exactly what Express and friends do for you under the hood.

## What it does
- Serves a JSON REST API for a `tasks` resource on `http://localhost:3000`
- `GET /tasks` · `GET /tasks/:id` · `POST /tasks` · `PATCH /tasks/:id` · `DELETE /tasks/:id`
- A tiny **router** that maps `METHOD + /path/:param` to a handler
- Parses JSON request bodies (with a size guard), **validates** input
- Returns correct **status codes** (200/201/204/400/404) and JSON errors
- **Centralized error handling**: a thrown error becomes a clean 500 — the
  server never crashes on a bad request or a bug in a handler

## Lessons you'll apply
- **46 Node.js** — the `http` module, `req`/`res` streams, `process.env`
- **26 Fetch & HTTP** — the same methods/status codes/REST, now from the server side
- **22 Error handling** — custom error class + one place that catches everything
- **40 Security** — validate all input, cap the body size, don't leak error details
- **39 Testing** — black-box tests that hit the real server with `fetch`

## How to run
```bash
# start the server
node projects/8-rest-api/solution.js          # → listening on http://localhost:3000

# in another terminal, talk to it:
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks -H 'Content-Type: application/json' -d '{"title":"Ship it"}'
curl -X PATCH http://localhost:3000/tasks/<id> -H 'Content-Type: application/json' -d '{"done":true}'
curl -X DELETE http://localhost:3000/tasks/<id> -i      # → 204 No Content

# run the tests (no server needed — they start their own on a random port)
node --test projects/8-rest-api/test.mjs
```
Open `server.js` (the starter) to build it yourself; `solution.js` is the finished version.

## Build it step by step
1. **Plumbing (given)** — the store (a `Map`), `sendJSON`/`sendNoContent`,
   the `HttpError` class, `readJSONBody`, and the router are already wired.
2. **validateTask()** — return a clean `{ title?, done? }` or throw a 400:
   title required on create, non-empty string if present, `done` must be boolean.
3. **listTasks / getTask** — read from the store; 404 when an id isn't found.
4. **createTask** — validate, assign `crypto.randomUUID()`, store, reply **201**.
5. **updateTask** — PATCH = *partial* update: validate with `partial: true`,
   merge onto the existing record, reply **200**.
6. **deleteTask** — remove it, reply **204** (no body).
7. **handler()** — find a route (404 if none), run it, and wrap the whole thing
   in `try/catch`: an `HttpError` maps to its status, anything else is a logged 500.

## Make it your own
- **Persist** the store to a JSON file (lesson 46 `fs`) or SQLite, so restarts
  don't wipe the data.
- Add **pagination** (`GET /tasks?limit=&offset=`) and filtering with `URLSearchParams`.
- Add **auth** — a bearer token or session (lesson 54) gating writes.
- Add **rate limiting / a request log** (lesson 48), and CORS headers (lesson 40).
- Point the **Notes app (project 7)** at this API instead of JSONPlaceholder.

## Concepts this cements
- **A request is just data**: method + path + body in, status + JSON out. A web
  framework is mostly a nicer router and middleware around exactly this loop.
- **Validate at the boundary**: never trust the client; reject bad input with a
  4xx *before* it reaches your data.
- **Fail safely**: one error handler converts every failure into a clean
  response, so a single bad request can't take the whole server down.
