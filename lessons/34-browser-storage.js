/* =============================================================================
 * 34 · BROWSER STORAGE   ⚠️ MOSTLY BROWSER
 * =============================================================================
 * Run:  node lessons/34-browser-storage.js  (runs a Node-safe simulation)
 *       OR load via index.html to use REAL localStorage in the browser.
 *
 * WHAT YOU'LL LEARN
 *   • localStorage vs sessionStorage vs cookies — when to use each
 *   • Storing & reading data (it's always strings → use JSON)
 *   • A typical "save/load app state" pattern
 *
 * localStorage doesn't exist in Node, so this file runs a tiny in-memory
 * stand-in when needed, and shows the REAL browser API in comments.
 * ========================================================================== */

// ── 0. Get a storage object (real in browser, simulated in Node) ─────────────
const storage =
  typeof localStorage !== 'undefined'
    ? localStorage
    : (() => {
        // Minimal in-memory mock so the lesson runs in Node:
        const map = new Map();
        return {
          setItem: (k, v) => map.set(k, String(v)),
          getItem: (k) => (map.has(k) ? map.get(k) : null),
          removeItem: (k) => map.delete(k),
          clear: () => map.clear(),
        };
      })();


// ── 1. The basics: setItem / getItem / removeItem ────────────────────────────
// ⚠️ Storage only holds STRINGS. Numbers/booleans get converted to strings.
storage.setItem('username', 'Sam');
console.log(storage.getItem('username')); // => Sam
console.log(storage.getItem('missing'));  // => null  (not undefined!)

storage.setItem('count', 5);
console.log(typeof storage.getItem('count')); // => string ("5", not 5!)


// ── 2. Storing objects/arrays → JSON.stringify on the way in, parse on out ───
const user = { name: 'Ana', theme: 'dark', favorites: ['js', 'css'] };

storage.setItem('user', JSON.stringify(user));        // object → string
const loaded = JSON.parse(storage.getItem('user'));   // string → object
console.log(loaded.favorites); // => [ 'js', 'css' ]


// ── 3. A safe save/load helper (handles missing keys & bad JSON) ─────────────
function save(key, value) {
  storage.setItem(key, JSON.stringify(value));
}
function load(key, fallback = null) {
  const raw = storage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback; // corrupted data → return the default instead of crashing
  }
}

save('settings', { volume: 0.8, muted: false });
console.log(load('settings'));            // => { volume: 0.8, muted: false }
console.log(load('nothing', 'default'));  // => default


// ── 4. Removing & clearing ───────────────────────────────────────────────────
storage.removeItem('count'); // delete one key
console.log(storage.getItem('count')); // => null
// storage.clear();          // ⚠️ wipes EVERYTHING for this site


/* ── 5. localStorage vs sessionStorage vs cookies ────────────────────────────
 *
 *   localStorage   → persists FOREVER (until cleared). Same API as above.
 *                    Use for: theme, settings, draft content, cached data.
 *
 *   sessionStorage → cleared when the TAB closes. Identical API:
 *                    sessionStorage.setItem('k', 'v')
 *                    Use for: one-visit state, multi-step form progress.
 *
 *   cookies        → small (~4KB), sent to the SERVER on every request.
 *                    Read/write the raw string:
 *                      document.cookie = 'token=abc; max-age=3600; path=/';
 *                      document.cookie  // "token=abc; other=..."
 *                    Use for: auth tokens / things the server must see.
 *                    (For real apps, set auth cookies from the server as
 *                     HttpOnly so JS can't read them — safer.)
 *
 *   LIMITS: localStorage/sessionStorage ~5MB, synchronous, strings only,
 *           per-origin (one site can't read another's storage).
 */


/* ── 6. Real browser example (uncomment when loaded via index.html) ──────────
 *   // Persist a counter across page reloads:
 *   const n = Number(localStorage.getItem('visits') || 0) + 1;
 *   localStorage.setItem('visits', n);
 *   console.log(`You've visited ${n} times`);
 */


/* PRACTICE -------------------------------------------------------------------
 *   1. Save a to-do array to storage, reload it, and add one item.
 *   2. Build loadTheme()/saveTheme() that default to 'light' when unset.
 *   3. In the browser, make a counter that survives page refreshes.
 * ------------------------------------------------------------------------- */
