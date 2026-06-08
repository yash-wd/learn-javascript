/* =============================================================================
 * SOLUTIONS · 22 · MODULES — import / export
 * =============================================================================
 * Run:  node lessons/solutions/22-solutions.js
 *
 * Your workspace for the PRACTICE block in lessons/22-modules.js.
 * Write each answer YOURSELF, then run this file to check. There's always more
 * than one correct approach — aim for clear, not clever.
 * ========================================================================== */

// NOTE:
//   First, RUN the real demo and read its files:
//   node lessons/modules-demo/app.mjs
//   node lessons/modules-demo/app.cjs
//   Then try these:

// ── 1. Add a `subtract` named export to modules-demo/math.mjs and import it ──
//    in app.mjs. Re-run: node lessons/modules-demo/app.mjs
// TODO: write your solution here


// ── 2. Change which function is the `default` export and update app.mjs. ─────
// TODO: write your solution here


// ── 3. Add a `multiply` export to math.cjs and use it from app.cjs. ──────────
// TODO: write your solution here


// ── 4. In app.mjs, load math.mjs with a dynamic `await import('./math.mjs')` ──
//    instead of a top-of-file import — log the returned namespace object.
// TODO: write your solution here


// ── 5. Add a top-level `await` to math.mjs (e.g. `export const ready = ───────
//    await Promise.resolve(true);`), import `ready` in app.mjs, and confirm
//    it's already resolved when app.mjs runs.
// TODO: write your solution here
