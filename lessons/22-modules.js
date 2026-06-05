/* =============================================================================
 * 22 · MODULES — import / export
 * =============================================================================
 * Run:  node lessons/22-modules.js   (the runnable demo at the bottom)
 *
 * WHAT YOU'LL LEARN
 *   • Why we split code into modules (files)
 *   • ES Modules (import/export) — the modern standard
 *   • CommonJS (require/module.exports) — Node's older system
 *   • Dynamic import() — load a module on demand (code splitting)
 *
 * Modules need MULTIPLE files to truly demonstrate, so the import/export
 * examples below are shown as comments — but there is a REAL, runnable pair
 * of files in  lessons/modules-demo/  that you can run right now:
 *
 *     node lessons/modules-demo/app.mjs    # ES Modules (import/export)
 *     node lessons/modules-demo/app.cjs    # CommonJS  (require/exports)
 *
 * Open those four files (math.mjs/app.mjs and math.cjs/app.cjs) alongside this
 * lesson. The self-contained demo at the bottom of THIS file just lets it run
 * on its own with `node lessons/22-modules.js`.
 * ========================================================================== */

/* ── 1. WHY modules? ─────────────────────────────────────────────────────────
 * One giant file is hard to navigate and reuse. Modules let each file own one
 * job and explicitly share (export) only what others need (import). Anything
 * not exported stays private to the file.
 */


/* ── 2. ES MODULES (ESM) — the modern standard ───────────────────────────────
 * Enable in Node by adding  "type": "module"  to package.json,
 * or by naming files with the  .mjs  extension. In the browser, use
 * <script type="module" src="app.js"></script>.
 *
 * ---- file: math.js ----
 *   // Named exports — export many values by name:
 *   export const PI = 3.14159;
 *   export function add(a, b) { return a + b; }
 *
 *   // Default export — ONE main value per file:
 *   export default function multiply(a, b) { return a * b; }
 *
 * ---- file: app.js ----
 *   import multiply, { PI, add } from './math.js';
 *   //     ^default     ^named (names must match, braces required)
 *
 *   import { add as sum } from './math.js';   // rename on import
 *   import * as math from './math.js';        // grab everything as a namespace
 *   console.log(math.PI, math.add(2, 3));
 *
 * Notes:
 *   • import lines are hoisted and run first, before other code.
 *   • Paths are relative ('./') and usually need the .js extension in Node ESM.
 */


/* ── 3. COMMONJS (CJS) — Node's original system ──────────────────────────────
 * The default in Node when there's no "type": "module". You'll see this a lot
 * in existing Node code.
 *
 * ---- file: math.cjs ----
 *   const PI = 3.14159;
 *   function add(a, b) { return a + b; }
 *   module.exports = { PI, add };     // export an object
 *
 * ---- file: app.cjs ----
 *   const { PI, add } = require('./math.cjs');
 *   const math = require('./math.cjs'); // or grab the whole object
 *
 * ESM vs CJS quick map:
 *   export default x   ↔  module.exports = x
 *   export { a, b }    ↔  module.exports = { a, b }
 *   import x from '…'  ↔  const x = require('…')
 */


/* ── 3b. DYNAMIC import() — load a module ON DEMAND ───────────────────────────
 * The `import ... from` form is STATIC: it runs at the top, always, before
 * anything else. `import()` is a FUNCTION that returns a Promise — so you can
 * load a module later, conditionally, or only when it's actually needed.
 *
 *   button.addEventListener('click', async () => {
 *     const { renderChart } = await import('./chart.js'); // fetched only on click
 *     renderChart(data);
 *   });
 *
 * WHY IT MATTERS — CODE SPLITTING (lesson 41):
 *   Bundlers (lesson 44) split each dynamic import into its own file, so the
 *   initial page ships LESS JavaScript and the heavy bits load on demand.
 *
 * Other uses:
 *   • Conditional/lazy loading:  if (isAdmin) await import('./admin-panel.js');
 *   • Load a CommonJS module from ESM:  const cjs = await import('./old.cjs');
 *   • import() works even in plain <script> (no type="module" required).
 *
 * It returns the module's NAMESPACE object (default export is `.default`):
 *   const mod = await import('./math.js');
 *   mod.add(2, 3);     mod.default(4, 5);   // named + default
 */
// Runnable taste of it: import a built-in Node module dynamically.
import('node:os').then((os) => {
  console.log('dynamic import → platform:', os.platform()); // e.g. 'linux'
});


/* ── 3c. TOP-LEVEL await — `await` at module scope (ES2022) ───────────────────
 * Inside an ES module you can use `await` at the TOP LEVEL — no `async`
 * function wrapper needed. The module's own evaluation pauses until it resolves:
 *
 *   // config.mjs
 *   const res = await fetch('https://api.example.com/config');
 *   export const config = await res.json();   // ← awaited at top level
 *
 *   // app.mjs — importing waits until config.mjs has finished awaiting:
 *   import { config } from './config.mjs';     // `config` is already resolved
 *
 * WHY IT MATTERS:
 *   • Initialise things that need async work (config, DB connection, a WASM
 *     module) before the module's exports are usable — no half-ready exports.
 *   • Combine with dynamic import() to pick a module at load time:
 *       const { strings } = await import(`./i18n/${navigator.language}.mjs`);
 *
 * CAVEATS:
 *   • ESM ONLY. It does NOT work in CommonJS (.cjs) or in classic <script>;
 *     needs type="module" / a .mjs file / "type":"module" in package.json.
 *   • A slow top-level await DELAYS every module that imports this one, so keep
 *     it for genuine startup work — not per-request logic.
 */
// Runnable taste of it: this file is CommonJS, so we show it via a dynamic
// import of an ESM data: URL (the imported module uses top-level await itself).
import('data:text/javascript,export default await Promise.resolve(42)')
  .then((m) => console.log('top-level await → default export:', m.default)); // => 42


// ── 4. Runnable demo (no real imports needed) ────────────────────────────────
// This simulates a "module" as a self-contained object so the file still runs.
const mathModule = (() => {
  const PI = 3.14159;                  // "private" until exported
  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;
  return { PI, add, multiply };        // the file's "exports"
})();

console.log('PI:', mathModule.PI);            // => 3.14159
console.log('add:', mathModule.add(2, 3));    // => 5
console.log('multiply:', mathModule.multiply(4, 5)); // => 20


/* PRACTICE -------------------------------------------------------------------
 *   First, RUN the real demo and read its files:
 *      node lessons/modules-demo/app.mjs
 *      node lessons/modules-demo/app.cjs
 *   Then try these:
 *   1. Add a `subtract` named export to modules-demo/math.mjs and import it
 *      in app.mjs. Re-run: node lessons/modules-demo/app.mjs
 *   2. Change which function is the `default` export and update app.mjs.
 *   3. Add a `multiply` export to math.cjs and use it from app.cjs.
 *   4. In app.mjs, load math.mjs with a dynamic `await import('./math.mjs')`
 *      instead of a top-of-file import — log the returned namespace object.
 *   5. Add a top-level `await` to math.mjs (e.g. `export const ready =
 *      await Promise.resolve(true);`), import `ready` in app.mjs, and confirm
 *      it's already resolved when app.mjs runs.
 * ------------------------------------------------------------------------- */
