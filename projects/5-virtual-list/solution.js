/* =============================================================================
 * VIRTUAL LIST — SOLUTION
 * =============================================================================
 * Complete, working version. Compare with your app.js after trying.
 *
 * THE IDEA (lesson 41): render ONLY the visible rows, repositioned on scroll.
 * 50,000 logical rows, but only ~13 <div>s in the DOM at any moment.
 *
 * Lessons used: 41 performance/virtualization · 13 array methods · 23 DOM · 24 Events
 * ========================================================================== */

const TOTAL = 50_000;
const ROW_H = 48;   // must match .row height in CSS
const OVERSCAN = 4; // extra rows above/below the window so scrolling looks seamless

// ── Elements ─────────────────────────────────────────────────────────────────
const viewport = document.querySelector('#viewport');
const sizer = document.querySelector('#sizer');
const statsEl = document.querySelector('#stats');
const totalEl = document.querySelector('#total');
const jumpBtn = document.querySelector('#jump');

totalEl.textContent = TOTAL.toLocaleString();

// ── 1. The data — held in JS, NOT in the DOM ─────────────────────────────────
const COLORS = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];
const items = Array.from({ length: TOTAL }, (_, i) => ({
  name: `Person ${i}`,
  email: `person${i}@example.com`,
  color: COLORS[i % COLORS.length],
}));

// ── 2. Size the scrollbar as if every row existed ────────────────────────────
sizer.style.height = `${TOTAL * ROW_H}px`;

// ── 3. Render only the visible window ─────────────────────────────────────────
function render() {
  const scrollTop = viewport.scrollTop;

  // Which slice of items is on screen right now?
  const start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
  const visibleCount = Math.ceil(viewport.clientHeight / ROW_H) + OVERSCAN * 2;
  const end = Math.min(TOTAL, start + visibleCount);

  // Rebuild just those rows. (Rebuilding ~13 nodes per frame is cheap.)
  sizer.innerHTML = '';
  for (let i = start; i < end; i++) {
    const item = items[i];
    const row = document.createElement('div');
    row.className = 'row';
    row.style.top = `${i * ROW_H}px`; // place it at its REAL position
    row.innerHTML = `
      <span class="avatar" style="background:${item.color}">${item.name[0]}</span>
      <span class="index">#${i}</span>
      <span class="name">${item.name}</span>
      <span class="email">${item.email}</span>`;
    sizer.appendChild(row);
  }

  // Proof it's working: tiny DOM, huge list.
  const inDom = sizer.children.length;
  statsEl.textContent =
    `Rows ${start.toLocaleString()}–${(end - 1).toLocaleString()} on screen · ` +
    `${inDom} <div>s in the DOM (not ${TOTAL.toLocaleString()})`;
}

// ── 4. Re-render on scroll — throttled to one render per animation frame ──────
let ticking = false;
viewport.addEventListener('scroll', () => {
  if (ticking) return;           // already scheduled → skip (lesson 29 throttle idea)
  ticking = true;
  requestAnimationFrame(() => {  // run at most once per frame (lesson 46 rAF)
    render();
    ticking = false;
  });
});

// ── 5. Jump to a random row ──────────────────────────────────────────────────
jumpBtn.addEventListener('click', () => {
  const target = Math.floor(Math.random() * TOTAL);
  viewport.scrollTop = target * ROW_H; // scroll fires → render() runs
  render();                            // render immediately too (no flash)
});

// ── Start ────────────────────────────────────────────────────────────────────
render();
