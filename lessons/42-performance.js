/* =============================================================================
 * 42 · PERFORMANCE — make it fast (and know what "fast" means)
 * =============================================================================
 * Run:  node lessons/42-performance.js
 *
 * WHAT YOU'LL LEARN
 *   • Big-O intuition — why algorithm choice beats micro-tweaks
 *   • Memoization & caching
 *   • Debounce/throttle recap (lesson 30)
 *   • Browser rendering: reflow/repaint, lazy loading, code splitting
 *   • Core Web Vitals — how performance is actually measured in 2026
 *   • Measuring & profiling: performance marks, PerformanceObserver
 *   • List virtualization (windowing) for huge lists
 *
 * Rule: measure before optimizing. "Premature optimization is the root of all
 * evil" — make it correct, measure, then fix the real bottleneck.
 * ========================================================================== */

// ── 1. Big-O intuition — how cost grows with input size ──────────────────────
//   O(1)      constant ...... array[i], map.get(key)
//   O(log n)  logarithmic ... binary search
//   O(n)      linear ........ a single loop
//   O(n log n) ............... good sorts
//   O(n²)     quadratic ..... nested loop over the same data — avoid at scale
//
// Picking the right data structure changes the Big-O. "Is X in this list?":
const big = Array.from({ length: 100_000 }, (_, i) => i);
const asSet = new Set(big);
console.log(big.includes(99_999)); // O(n)  — scans up to 100k items
console.log(asSet.has(99_999));    // O(1)  — instant lookup ✅


// ── 2. Memoization — cache expensive results by their inputs ─────────────────
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);  // cache HIT — skip the work
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
let calls = 0;
const slowSquare = (n) => { calls++; return n * n; };
const fastSquare = memoize(slowSquare);
fastSquare(9);
fastSquare(9);            // served from cache — fn body NOT re-run
fastSquare(9);
console.log(fastSquare(9), 'computed', calls, 'time(s)'); // => 81 computed 1 time(s)


// ── 3. Debounce & throttle (limit how OFTEN code runs) — see lesson 30 ───────
// debounce: wait until activity STOPS (search-as-you-type, resize).
// throttle: run at most once per interval (scroll, mousemove).
// Both prevent doing heavy work on every single event.


// ── 4. Browser rendering performance (concept) ───────────────────────────────
// • REFLOW (layout): the browser recomputes geometry — expensive. Triggered by
//   changing size/position or reading layout props (offsetHeight) mid-mutation.
// • REPAINT: redrawing pixels (e.g. color change) — cheaper than reflow.
// Tips: batch DOM writes; build nodes off-DOM then insert once (lesson 24);
//       animate `transform`/`opacity` (GPU) instead of top/left/width.


// ── 5. Loading performance (concept) ─────────────────────────────────────────
// • LAZY LOADING: load things only when needed.
//     <img loading="lazy">           // images
//     const mod = await import('./chart.js');  // dynamic import → CODE SPLITTING
//   Code splitting ships a smaller initial bundle; the rest loads on demand.
// • Defer non-critical JS:  <script defer src="app.js"></script>
// • Compress & cache: gzip/brotli, HTTP caching headers, a CDN.


// ── 6. Core Web Vitals — the metrics that matter (2026) ──────────────────────
//   LCP (Largest Contentful Paint) — load speed   → aim < 2.5s
//   INP (Interaction to Next Paint) — responsiveness → aim < 200ms
//   CLS (Cumulative Layout Shift)   — visual stability → aim < 0.1
// Measure with Lighthouse, the Performance panel, or the web-vitals library.


// ── 7. Measuring in code ─────────────────────────────────────────────────────
const t0 = performance.now();
let sum = 0;
for (let i = 0; i < 1_000_000; i++) sum += i;
const ms = performance.now() - t0;
console.log(`loop took ${ms.toFixed(1)}ms`); // varies by machine
// (console.time/timeEnd from lesson 36 do the same thing more conveniently.)


// ── 8. Profiling with marks & measures (the Performance API) ─────────────────
// performance.now() is one stopwatch. The Performance API lets you drop named
// MARKS and MEASURE the span between them — those show up in browser DevTools'
// Performance panel too, so you can see them on a real timeline.
performance.mark('work-start');
let total = 0;
for (let i = 0; i < 500_000; i++) total += i;
performance.mark('work-end');
const measure = performance.measure('heavy-work', 'work-start', 'work-end');
console.log(`measured "${measure.name}": ${measure.duration.toFixed(1)}ms`);

// A PerformanceObserver reacts to entries as they're recorded — this is how the
// `web-vitals` library and monitoring tools collect LCP/INP/CLS in real users'
// browsers (then report them, lesson 48):
const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`observed ${entry.entryType} "${entry.name}": ${entry.duration.toFixed(1)}ms`);
  }
});
obs.observe({ entryTypes: ['measure'] });
performance.measure('observed-span', 'work-start', 'work-end');
// In the browser you'd also observe: 'largest-contentful-paint', 'event'
// (for INP), 'layout-shift' (for CLS), 'longtask', 'resource', 'navigation'.
setTimeout(() => obs.disconnect(), 50); // stop observing (avoid leaks, lesson 37)


/* ── 9. List virtualization (windowing) — render only what's visible ──────────
 * Rendering 10,000 rows = 10,000 DOM nodes = a frozen page. VIRTUALIZATION
 * renders only the ~20 rows currently in view (a "window") and swaps their
 * contents as you scroll. The list FEELS infinite but the DOM stays tiny.
 *
 *   const ROW_H = 30, visible = Math.ceil(container.clientHeight / ROW_H);
 *   container.onscroll = () => {
 *     const start = Math.floor(container.scrollTop / ROW_H);
 *     render(items.slice(start, start + visible + 2)); // only the window
 *   };
 *
 * Libraries: TanStack Virtual, react-window. This is THE fix for slow long
 * lists/tables/feeds — it turns O(n) DOM nodes into O(window).
 */


/* PRACTICE -------------------------------------------------------------------
 *   1. Memoize a slow fibonacci(n) and compare call counts with/without it.
 *   2. Rewrite an O(n²) "find duplicates" using a Set to get O(n).
 *   3. Name which Web Vital each fixes: slow hero image, janky button, jumpy layout.
 *   4. Wrap two code blocks in performance.mark/measure and log which is slower.
 *   5. In words: why does virtualization keep a 100k-row list fast? (DOM size.)
 * ------------------------------------------------------------------------- */
