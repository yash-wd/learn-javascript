# Project 5 — Virtual List

The performance capstone. No internet needed — this is about one high-impact
technique from lesson 42: **virtualization (windowing)**. You'll scroll a list
of **50,000 rows** while keeping only ~17 of them in the DOM.

## What it does
- Renders a 50,000-row contact list that scrolls perfectly smoothly
- Shows a live readout: which rows are on screen, and how few `<div>`s actually
  exist in the DOM (the whole point)
- A "Jump to a random row" button proves it works at any scroll position

## The problem it solves
Naively, `items.map(renderRow)` for 50,000 rows = 50,000 DOM nodes. The browser
chokes: slow first paint, janky scroll, big memory. **Virtualization** renders
only the rows in the viewport and repositions them as you scroll — so DOM size
stays *constant* no matter how long the list is. This is how every fast
table/feed/chat app (and libraries like TanStack Virtual, react-window) work.

## Lessons you'll apply
- **42 Performance** — the windowing technique, and reducing DOM work
- **13 Array methods** — `Array.from` to generate the data
- **24 DOM / 25 Events** — building rows, the scroll listener
- **30 Advanced Async** — throttling the scroll handler with `requestAnimationFrame`

## How to run
Open `index.html`. It loads `app.js` (starter). **To see the finished app, open
`solution.html`** (it loads `solution.js`).

## How it works (the 3 moving parts)
```
.viewport   fixed height, overflow-y:auto   ← the window you see through
  .sizer    height = TOTAL * ROW_H          ← empty but tall → real scrollbar
    .row    position:absolute; top: i*ROW_H ← only the visible ones exist
```
1. The **sizer** is one tall empty element. Its height makes the scrollbar
   behave as if all 50,000 rows were there.
2. On scroll, you compute **which slice** is visible from `scrollTop`, and
   render only those rows — each placed at its true `top: i * ROW_H`.
3. Scroll again → recompute the slice, rebuild ~17 rows. Cheap, every frame.

## Build it step by step
1. **Generate the data** — `Array.from({ length: TOTAL }, (_, i) => ({...}))`.
   Keep it in JS; it never all goes into the DOM.
2. **Size the scrollbar** — `sizer.style.height = TOTAL * ROW_H + 'px'`.
3. **render()** — from `viewport.scrollTop`:
   - `start = floor(scrollTop / ROW_H) − OVERSCAN`
   - `count = ceil(viewport.clientHeight / ROW_H) + OVERSCAN*2`
   - clear the sizer, create rows `start…end`, each at `top: i*ROW_H`
   - update the stats line with how many rows are really in the DOM
4. **Scroll listener** → `render()`. Bonus: wrap it in `requestAnimationFrame`
   so it runs at most once per frame (a throttle — lesson 30).
5. **Jump button** → set `viewport.scrollTop` to a random `i * ROW_H`, render.

## Why `OVERSCAN`?
Rendering exactly the visible rows means a fast scroll can show a blank strip
for a frame before the new rows appear. Rendering a few extra rows above and
below (the "overscan") hides that — a tiny cost for seamless scrolling.

## Make it your own
- **Variable row heights** — the hard mode: track each row's measured height and
  compute offsets from a running total (what real libraries do).
- **Recycle nodes** instead of rebuilding: keep the ~17 row elements and just
  update their text/position (even less work per frame).
- Add a **search box** that filters `items` and re-renders (the virtual list
  just works on the filtered array).
- **Sticky headers** per letter (A, B, C…) like a phone contacts list.
- Compare: render all 50,000 rows the naive way and watch the page freeze —
  feel the difference virtualization makes.

## Concepts this cements
- **DOM size is the bottleneck**, not data size. Keeping the DOM small is the
  single biggest lever for list/table/feed performance.
- **Render what's visible, derive the rest from math** — a pattern that shows up
  in maps, canvases, infinite scroll, and game engines (only draw what's in view).
