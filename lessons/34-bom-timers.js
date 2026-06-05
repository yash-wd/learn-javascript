/* =============================================================================
 * 34 · BOM & TIMERS (the Browser Object Model)
 * =============================================================================
 * Run:  node lessons/34-bom-timers.js   (timers run; BOM parts are shown safely)
 *
 * WHAT YOU'LL LEARN
 *   • setTimeout / setInterval and how to cancel them
 *   • The BOM: window, location, history, navigator, screen
 *   • A practical countdown timer pattern
 *
 * The DOM (lessons 23–24) is the PAGE. The BOM is the BROWSER around it —
 * the window, the URL, history, the device. Timers work everywhere.
 * ========================================================================== */

// ── 1. setTimeout — run once after a delay ───────────────────────────────────
const id = setTimeout(() => {
  console.log('runs after 50ms');
}, 50);
// Cancel it before it fires with clearTimeout(id):
// clearTimeout(id);


// ── 2. setInterval — run repeatedly every N ms ───────────────────────────────
let ticks = 0;
const intervalId = setInterval(() => {
  ticks++;
  console.log('tick', ticks);
  if (ticks >= 3) {
    clearInterval(intervalId); // ⚠️ ALWAYS stop intervals or they run forever
    console.log('interval stopped');
  }
}, 20);


// ── 3. A practical countdown ─────────────────────────────────────────────────
function countdown(from, onTick, onDone) {
  let n = from;
  const t = setInterval(() => {
    onTick(n);
    if (n === 0) {
      clearInterval(t);
      onDone();
    }
    n--;
  }, 15);
  return t;
}
countdown(3, (n) => console.log(`T-minus ${n}`), () => console.log('🚀 liftoff'));


// ── 4. setTimeout(0) — defer work to "after the current code" ────────────────
// Not actually 0ms — it runs after the current synchronous code & microtasks.
console.log('sync 1');
setTimeout(() => console.log('deferred (macrotask)'), 0);
console.log('sync 2'); // logs before "deferred" — see lesson 29's event loop


/* ── 5. The BOM objects (browser only — shown as comments) ───────────────────
 *
 *  window — the global object in browsers. window.x === x at top level.
 *           window.innerWidth / innerHeight  → viewport size
 *           window.alert() / confirm() / prompt()  → dialog boxes
 *           window.scrollTo(0, 0)             → scroll the page
 *
 *  location — the current URL (read AND navigate):
 *           location.href      // "https://site.com/page?q=1#top"
 *           location.pathname  // "/page"
 *           location.search    // "?q=1"
 *           location.hash      // "#top"
 *           location.href = 'https://example.com'  // navigate to a new page
 *           location.reload()                      // refresh
 *
 *  history — the back/forward stack:
 *           history.back();  history.forward();  history.go(-2);
 *           history.pushState({}, '', '/new-url'); // change URL, no reload (SPAs)
 *
 *  navigator — info about the browser/device:
 *           navigator.language          // "en-US"
 *           navigator.onLine            // true / false
 *           navigator.clipboard.writeText('copied!')
 *           navigator.geolocation.getCurrentPosition(...)
 *
 *  screen — the physical display:  screen.width, screen.height
 */


// ── 6. Reading query params (works in browser; demo'd with URL here) ─────────
// In a browser you'd use: new URLSearchParams(location.search)
const params = new URLSearchParams('?user=sam&page=2');
console.log(params.get('user')); // => sam
console.log(params.get('page')); // => 2
console.log([...params]);        // => [ [ 'user', 'sam' ], [ 'page', '2' ] ]


/* globalThis — the global object EVERYWHERE -----------------------------------
 *   In browsers the global is `window`; in Node it's `global`. `globalThis`
 *   works in both, so portable code uses it.
 */
console.log(typeof globalThis); // => object


/* PRACTICE -------------------------------------------------------------------
 *   1. Build a clock that logs the time every second, then stops after 5.
 *   2. Parse "?theme=dark&lang=en" with URLSearchParams and read both values.
 *   3. (Browser) Log location.pathname and navigator.language in the console.
 * ------------------------------------------------------------------------- */
