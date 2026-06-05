/* =============================================================================
 * 46 · ADVANCED BROWSER APIs  (browser)
 * =============================================================================
 * HOW TO RUN: these are BROWSER features. Open index.html and try them in the
 * console/devtools — they don't exist in Node. This file runs harmlessly in
 * Node (it just prints a notice); the real examples are in the comments.
 *
 * WHAT YOU'LL LEARN
 *   The powerful platform APIs beyond DOM/events:
 *   Web Workers · Service Workers/PWA · IndexedDB · Observers ·
 *   Web Components · requestAnimationFrame · device APIs
 * ========================================================================== */

// Guard so the file is harmless in Node:
if (typeof window === 'undefined') {
  console.log('⚠️  Lesson 46 is BROWSER-only. Open index.html and read the code in devtools.');
}

/* ── 1. Web Workers — run heavy JS off the main thread ───────────────────────
 * The main thread renders the UI; long loops there FREEZE the page. A Worker
 * runs in parallel and talks via messages — no shared variables.
 *
 *   // main.js
 *   const worker = new Worker('worker.js');
 *   worker.postMessage({ n: 40 });
 *   worker.onmessage = (e) => console.log('result', e.data);
 *
 *   // worker.js
 *   onmessage = (e) => postMessage(fib(e.data.n));  // CPU work, UI stays smooth
 */

/* ── 2. Service Workers & PWAs — offline + installable ───────────────────────
 * A Service Worker is a proxy between your app and the network. It can CACHE
 * assets so the app works offline and loads instantly. Plus a manifest.json =
 * an installable Progressive Web App.
 *
 *   navigator.serviceWorker.register('/sw.js');
 *   // sw.js
 *   self.addEventListener('fetch', (e) =>
 *     e.respondWith(caches.match(e.request).then((c) => c ?? fetch(e.request))));
 */

/* ── 3. IndexedDB — a real database in the browser ───────────────────────────
 * localStorage (lesson 33) holds small strings synchronously. IndexedDB stores
 * large, structured, queryable data (objects, blobs) asynchronously.
 *
 *   const req = indexedDB.open('myDB', 1);
 *   req.onupgradeneeded = (e) => e.target.result.createObjectStore('users', { keyPath: 'id' });
 *   req.onsuccess = (e) => { const db = e.target.result;  ... transactions ... };
 * Libraries like `idb` make its callback API far nicer.
 */

/* ── 4. Observer APIs — react to changes efficiently ─────────────────────────
 * • IntersectionObserver — "is this element on screen?" → lazy-load images,
 *   infinite scroll, fade-in-on-scroll (no scroll-event spam).
 *     new IntersectionObserver(es => es.forEach(e => e.isIntersecting && load(e.target)))
 *       .observe(img);
 * • MutationObserver — watch the DOM for added/removed/changed nodes.
 * • ResizeObserver — react when an element's SIZE changes.
 */

/* ── 5. Web Components — reusable custom elements (framework-free) ────────────
 * Define your own HTML tags with encapsulated markup/style via Shadow DOM.
 *
 *   class MyCounter extends HTMLElement {
 *     connectedCallback() {
 *       const root = this.attachShadow({ mode: 'open' }); // isolated DOM/CSS
 *       root.innerHTML = `<button>+</button><span>0</span>`;
 *     }
 *   }
 *   customElements.define('my-counter', MyCounter);  // <my-counter></my-counter>
 */

/* ── 6. requestAnimationFrame — smooth 60fps animation ───────────────────────
 * Don't animate with setInterval. rAF runs your callback right before the next
 * paint, syncing to the display and pausing in background tabs.
 *
 *   function tick(t) { move(); requestAnimationFrame(tick); }
 *   requestAnimationFrame(tick);
 */

/* ── 7. Device & misc APIs (ask permission; HTTPS only) ──────────────────────
 *   navigator.geolocation.getCurrentPosition(pos => ...);   // location
 *   await navigator.clipboard.writeText('copied!');         // clipboard
 *   new Notification('Hi!');                                // notifications
 *   matchMedia('(prefers-color-scheme: dark)').matches;     // dark mode
 *   navigator.onLine;                                       // online status
 */

/* PRACTICE (in the browser) --------------------------------------------------
 *   1. Use IntersectionObserver to log when a bottom element scrolls into view.
 *   2. Define a <hello-world> Web Component that renders your name.
 *   3. Animate a box across the screen with requestAnimationFrame.
 * ------------------------------------------------------------------------- */
