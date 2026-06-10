# Project 7 — Notes App

A full **CRUD** app that talks to a REST API: load notes, add, edit, and delete
them. The headline skill is **optimistic UI** — the screen updates instantly and
the app quietly **rolls back** if a request fails.

## What it does
- Loads existing notes from the API on startup (with a **loading** state)
- **Add** a note (POST), **edit** a note (PUT), **delete** a note (DELETE)
- Updates the list **immediately** on every change, before the request finishes
- Shows a per-note **"saving…"** indicator while a request is in flight
- **Rolls back** the change and shows a friendly error if the request fails

## Why this API?
It uses **JSONPlaceholder** — free, **no API key**, and it accepts write
requests (`POST`/`PUT`/`DELETE`) and replies realistically:

- `GET    https://jsonplaceholder.typicode.com/posts?_limit=5` → starter notes
- `POST   /posts` → returns the created record (with an `id`)
- `PUT    /posts/:id` → returns the updated record
- `DELETE /posts/:id` → confirms the delete

> ⚠️ It's a **mock**: it doesn't truly persist, so a page reload shows the
> original notes again. That's expected — it's ideal for practising the request
> flow without standing up a backend.

## Lessons you'll apply
- **26 Fetch & APIs** — `fetch` with `POST`/`PUT`/`DELETE`, checking `response.ok`
- **20 Async/Await** — `async` functions and `await` for each request
- **22 Error handling** — `try/catch` to detect failure and trigger a rollback
- **14 Objects** — modelling each note as `{ id, serverId, text, pending }`
- **24 DOM / 25 Events** — rendering the list and wiring add/edit/delete

## How to run
Open `index.html` in your browser (you need an internet connection).
It loads `app.js` (starter). Switch to `solution.js` to see it finished.

> ⚠️ Some browsers restrict `fetch` from a `file://` page. If a request is
> blocked, run a tiny local server from this folder instead:
> `python3 -m http.server` then open http://localhost:8000

## Build it step by step
1. **noteEl(note)** — build one `<li>` with the note's text (use `textContent`,
   never `innerHTML`), a "saving…" badge, and edit/delete buttons. Add the
   `pending` class and disable the buttons while a request is in flight.
2. **render()** — replace the list's children with `notes.map(noteEl)`.
3. **load()** — `GET ?_limit=5`, map each post to a note, render. Show loading
   and handle errors.
4. **addNote(text)** — make a `pending` note, put it at the top, render *now*,
   then `POST`. On success record the server id and clear `pending`; on failure
   remove the note (roll back) and flash an error.
5. **editNote(id)** — `prompt` for new text, update optimistically, `PUT`. On
   failure restore the old text.
6. **deleteNote(id)** — snapshot the list, remove the note, render, then
   `DELETE`. On failure restore the snapshot.
7. **Wire the form** — on submit: `preventDefault`, add the note, clear the input.

## Make it your own
- Add a "retry" button on the error message instead of an auto-rollback.
- Debounce a search box that filters notes by text (lesson 30).
- Persist a local copy in `localStorage` (lesson 34) so notes survive reloads.
- Inline-edit on double-click instead of using `prompt`.

## Concepts this cements
- **Optimistic UI**: respond to the user instantly, reconcile with the server
  after. It's what makes modern apps feel fast — and why rollback matters.
- **Mutating server state**: `POST`/`PUT`/`DELETE` change data, so failures are
  higher-stakes than a failed `GET`. Always have a rollback plan.
- **Local id vs server id**: track items by your OWN id so re-renders and edits
  stay correct no matter what the server returns.
