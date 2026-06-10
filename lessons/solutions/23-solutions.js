/* =============================================================================
 * SOLUTIONS · 23 · MODULES — import / export
 * =============================================================================
 * Run:  node lessons/solutions/23-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/23-modules.js.
 * Most of this lesson's practice is EDITING the files in lessons/modules-demo/.
 * Below: the exact edits to make (in comments) plus a live demo of requiring
 * the CommonJS module and dynamically importing the ES module.
 * ========================================================================== */

// ── 1. Add a `subtract` named export to modules-demo/math.mjs and import it. ──
//    In math.mjs add:        export function subtract(a, b) { return a - b; }
//    In app.mjs import it:   import multiply, { PI, add, circleArea, subtract } from './math.mjs';
//    Then:                   console.log(subtract(10, 4)); // => 6

// ── 2. Change which function is the `default` export and update app.mjs. ─────
//    In math.mjs, make `add` the default instead of `multiply`:
//        export default function add(a, b) { return a + b; }   // (drop the named `add`)
//    In app.mjs the default import name is yours to choose:
//        import add, { PI, circleArea } from './math.mjs';      // `add` = the default

// ── 3. Add a `multiply` export to math.cjs and use it from app.cjs. ──────────
//    In math.cjs:    function multiply(a, b) { return a * b; }
//                    module.exports = { PI, add, multiply };
//    In app.cjs:     const { multiply } = require('./math.cjs');
//                    console.log(multiply(4, 5)); // => 20
//    Demo of requiring the existing CommonJS module right now:
const mathCjs = require('../modules-demo/math.cjs');
console.log('3.', 'require(math.cjs):', mathCjs.add(2, 3)); // => 3. require(math.cjs): 5

// ── 4. In app.mjs, load math.mjs with a dynamic `await import('./math.mjs')` ──
//    instead of a top-of-file import — log the returned namespace object.
// Dynamic import() returns a Promise of the module namespace and works even
// from this CommonJS file. (Top-level await isn't allowed here, so we wrap it.)
(async () => {
  const math = await import('../modules-demo/math.mjs');
  console.log('4.', 'namespace keys:', Object.keys(math).sort());
  // => 4. namespace keys: [ 'PI', 'add', 'circleArea', 'default' ]
  console.log('4.', 'default(4,5):', math.default(4, 5)); // => 4. default(4,5): 20

  // ── 5. Add a top-level `await` to math.mjs and import `ready` in app.mjs. ──
  //    In math.mjs:   export const ready = await Promise.resolve(true);
  //    In app.mjs:    import { ready } from './math.mjs';
  //                   console.log(ready); // => true
  // Because math.mjs `await`s at the top level, the engine finishes that work
  // BEFORE app.mjs's code runs — so `ready` is already `true` on first use.
  // (This is "top-level await": the importing module waits for the import.)
  console.log('5.', 'see comments — top-level await resolves before import completes');
})();
