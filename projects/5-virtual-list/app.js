/* =============================================================================
 * VIRTUAL LIST — STARTER
 * =============================================================================
 * Fill in the TODOs. README has the full walkthrough. Solution in solution.js.
 *
 * THE IDEA (lesson 41): rendering 50,000 <div>s freezes the page. Instead we
 * render ONLY the ~10 rows currently visible, and reposition them as you scroll.
 * The list FEELS infinite; the DOM stays tiny.
 *
 * Lessons used: 41 performance/virtualization · 13 array methods · 23 DOM · 24 Events · 29 throttle (rAF)
 * ========================================================================== */

const TOTAL = 50_000; // how many rows the list "contains"
const ROW_H = 48;     // px height of one row — MUST match .row height in CSS
const OVERSCAN = 4;   // extra rows above/below the window (smooth scrolling)

// ── Elements ─────────────────────────────────────────────────────────────────
const viewport = document.querySelector('#viewport');
const sizer = document.querySelector('#sizer');
const statsEl = document.querySelector('#stats');
const totalEl = document.querySelector('#total');
const jumpBtn = document.querySelector('#jump');

totalEl.textContent = TOTAL.toLocaleString();

// ── 1. The data (generated, not stored in the DOM) ───────────────────────────
const COLORS = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];
// TODO 1: build an array `items` of length TOTAL. Each item:
//   { name: `Person ${i}`, email: `person${i}@example.com`, color: <pick one> }
//   (hint: Array.from({ length: TOTAL }, (_, i) => ({ ... })) — lesson 13)
const items = [];

// ── 2. Make the scrollbar the RIGHT size ─────────────────────────────────────
// The sizer is empty but tall, so the scrollbar behaves as if all rows exist.
// TODO 2: sizer.style.height = (TOTAL * ROW_H) + 'px';

// ── 3. Render only the visible window ─────────────────────────────────────────
function render() {
  // TODO 3:
  //   a. const scrollTop = viewport.scrollTop;
  //   b. first visible index  = floor(scrollTop / ROW_H) − OVERSCAN (min 0)
  //   c. how many rows fit     = ceil(viewport.clientHeight / ROW_H) + OVERSCAN*2
  //   d. last index            = min(TOTAL, start + count)
  //   e. clear sizer, then for i in [start, last):
  //        - create a .row div
  //        - position it: row.style.top = (i * ROW_H) + 'px'
  //        - fill it with the avatar initial, index, name, email
  //        - append to sizer
  //   f. update statsEl: how many rows are actually in the DOM right now.
}

// ── 4. Re-render on scroll ────────────────────────────────────────────────────
// TODO 4: viewport.addEventListener('scroll', render);
// (Bonus: wrap render in requestAnimationFrame so it runs at most once per frame.)

// ── Jump to a random row ─────────────────────────────────────────────────────
jumpBtn.addEventListener('click', () => {
  // TODO 5: set viewport.scrollTop to a random row's offset, then render().
});

// ── Start ────────────────────────────────────────────────────────────────────
render();
