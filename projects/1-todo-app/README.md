# Project 1 — To-Do App

Your first real app. It uses the DOM, events, arrays/objects, and saves your
tasks so they survive a page refresh.

## What it does
- Add a task by typing and pressing Enter (or clicking **Add**)
- Click a task to mark it **done** (toggles a strikethrough)
- Delete a task with its ✕ button
- Filter: **All / Active / Done**
- Tasks **persist** in `localStorage` — refresh the page and they're still there
- A live count of remaining tasks

## Lessons you'll apply
- **23 DOM** — selecting elements, creating `<li>`s
- **24 Events** — `addEventListener`, form `submit`, event **delegation**
- **13 Array methods** — `filter`, `find`, `push`
- **14 Objects** — each todo is an object `{ id, text, done }`
- **33 Browser Storage** — `localStorage` + `JSON.stringify/parse`

## How to run
Open `index.html` in your browser. It loads `app.js` (the starter).
To see the finished version, change `index.html`'s script tag to `solution.js`.

## Build it step by step
The starter (`app.js`) has these `// TODO:`s. Do them in order:

1. **State** — keep an array `todos`, where each item is
   `{ id, text, done }`.
2. **render()** — clear the list, then for each todo create an `<li>` with the
   text and a delete button. Add a `done` class when `todo.done` is true.
3. **addTodo(text)** — push a new todo object, then `save()` and `render()`.
4. **Form submit** — read the input, call `addTodo`, clear the input.
   Remember `event.preventDefault()` so the page doesn't reload!
5. **Delegation** — one click listener on the `<ul>`:
   - click on the ✕ button → delete that todo
   - click on the text → toggle `done`
6. **Filters** — track `currentFilter` and show all / only active / only done.
7. **Persistence** — `save()` writes `todos` to localStorage; on startup, load
   them back.

## Make it your own (extensions)
- Add an "Edit" button to rename a task (double-click to edit inline).
- Add a "Clear completed" button.
- Show the date each task was created (use **lesson 33**'s Intl formatting).
- Add drag-to-reorder, or a priority flag with colors.

## Concepts this cements
- The **render pattern**: keep data in a JS array (the "state"), and write ONE
  `render()` function that draws the UI from it. Every change → update data →
  re-render. This is the core idea behind React, Vue, and every modern UI lib.
