/* =============================================================================
 * SOLUTIONS · 35 · BOM & TIMERS (the Browser Object Model)
 * =============================================================================
 * Run:  node lessons/solutions/35-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/35-bom-timers.js.
 * Try each problem YOURSELF first — then compare.
 * (The clock uses a fast interval here so the demo finishes quickly; in real
 *  life you'd pass 1000ms for one tick per second.)
 * ========================================================================== */

// ── 2. Parse "?theme=dark&lang=en" with URLSearchParams and read both values. ──
const params = new URLSearchParams('?theme=dark&lang=en');
console.log('2.', params.get('theme'), '·', params.get('lang')); // => 2. dark · en

// ── 3. (Browser) Log location.pathname and navigator.language in the console. ──
if (typeof location !== 'undefined') {
  console.log('3.', location.pathname, navigator.language);
} else {
  console.log('3.', '(browser only) e.g. "/index.html" and "en-US"');
}

// ── 1. Build a clock that logs the time every second, then stops after 5. ────
// setInterval repeats; clearInterval stops it. We count ticks and stop at 5.
let ticks = 0;
const clock = setInterval(() => {
  ticks++;
  console.log('1.', `tick ${ticks} @`, new Date().toLocaleTimeString());
  if (ticks >= 5) {
    clearInterval(clock); // ⚠️ ALWAYS clear an interval or it runs forever
    console.log('1.', 'clock stopped after 5 ticks');
  }
}, 100); // ← 1000 for once-per-second in real use
