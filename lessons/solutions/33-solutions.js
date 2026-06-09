/* =============================================================================
 * SOLUTIONS · 33 · BROWSER STORAGE   ⚠️ MOSTLY BROWSER
 * =============================================================================
 * Run:  node lessons/solutions/33-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/33-browser-storage.js.
 * Try each problem YOURSELF first — then compare.
 * In the browser `storage` IS localStorage; in Node we use the same in-memory
 * mock the lesson uses, so the logic is identical.
 * ========================================================================== */

const storage =
  typeof localStorage !== 'undefined'
    ? localStorage
    : (() => {
        const map = new Map();
        return {
          setItem: (k, v) => map.set(k, String(v)),
          getItem: (k) => (map.has(k) ? map.get(k) : null),
          removeItem: (k) => map.delete(k),
        };
      })();

// Helpers: storage only holds STRINGS, so JSON in and out.
const save = (key, value) => storage.setItem(key, JSON.stringify(value));
const load = (key, fallback = null) => {
  const raw = storage.getItem(key);
  return raw === null ? fallback : JSON.parse(raw);
};

// ── 1. Save a to-do array to storage, reload it, and add one item. ───────────
save('todos', ['buy milk', 'walk dog']);
const todos = load('todos', []); // "reload" — read it back from storage
todos.push('write code');
save('todos', todos);
console.log('1.', load('todos')); // => 1. [ 'buy milk', 'walk dog', 'write code' ]

// ── 2. Build loadTheme()/saveTheme() that default to 'light' when unset. ─────
const saveTheme = (theme) => save('theme', theme);
const loadTheme = () => load('theme', 'light'); // fallback when the key is missing
console.log('2.', loadTheme()); // => 2. light   (nothing saved yet)
saveTheme('dark');
console.log('2.', loadTheme()); // => 2. dark

// ── 3. In the browser, make a counter that survives page refreshes. ──────────
// Each "page load" reads the saved count, bumps it, and saves it back. In the
// browser this survives refreshes because localStorage persists across loads.
function visit() {
  const count = load('visits', 0) + 1;
  save('visits', count);
  return count;
}
console.log('3.', visit(), visit(), visit()); // => 3. 1 2 3  (each call = one "refresh")
