/* =============================================================================
 * SOLUTIONS · 44 · TOOLING & BUILD SYSTEMS — the modern JS workflow
 * =============================================================================
 * Run:  node lessons/solutions/44-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/44-tooling.js.
 * These are hands-on terminal tasks — the "answers" are the commands and the
 * concepts behind them, demonstrated here in code where it makes sense.
 * ========================================================================== */

// ── 1. Run `npm init -y` in a folder and add a "start": "node index.js" script. ──
//   $ mkdir my-app && cd my-app
//   $ npm init -y                 # creates package.json with defaults
//   then edit package.json:
const examplePackageJson = {
  name: 'my-app',
  version: '1.0.0',
  scripts: {
    start: 'node index.js', // now `npm start` runs your app
  },
};
console.log('1.', examplePackageJson.scripts); // => 1. { start: 'node index.js' }
//   $ npm start                   # runs the "start" script

// ── 2. Explain the difference between dependencies and devDependencies. ──────
console.log('2.', {
  dependencies: 'needed to RUN the app in production (react, express, …)',
  devDependencies: 'needed only to BUILD/TEST during development (vite, eslint, jest, …)',
});
// Installed differently:
//   npm install react          → dependencies
//   npm install -D vite        → devDependencies
// `npm install --omit=dev` (production installs) skips devDependencies entirely.

// ── 3. Scaffold a real app: `npm create vite@latest` and run `npm run dev`. ──
console.log('3.', 'npm create vite@latest my-app  →  cd my-app  →  npm install  →  npm run dev');
// `npm create vite@latest` downloads and runs the Vite scaffolder, which asks
// for a framework/template and generates a ready-to-run project. `npm run dev`
// starts Vite's dev server with hot-module reload at http://localhost:5173.
