/* =============================================================================
 * 44 · TOOLING & BUILD SYSTEMS — the modern JS workflow
 * =============================================================================
 * Run:  node lessons/44-tooling.js   (a guided tour; prints the key concepts)
 *
 * WHAT YOU'LL LEARN
 *   The tools that turn your source code into a shippable app, and what each
 *   one is FOR. You don't memorize commands — you learn the moving parts.
 *
 *   npm/package.json · semver · bundlers · transpilers · linters · git · CI/CD
 * ========================================================================== */

console.log('=== The modern JavaScript toolchain ===\n');

// ── 1. npm & package.json — the project manifest ─────────────────────────────
// `npm init -y` creates package.json. It records dependencies and scripts.
const packageJson = {
  name: 'my-app',
  version: '1.0.0',
  type: 'module',                       // use ES modules (lesson 22)
  scripts: {
    dev: 'vite',                        // run with: npm run dev
    build: 'vite build',
    test: 'vitest',
    lint: 'eslint .',
  },
  dependencies: { /* runtime deps:  npm install <pkg>       */ },
  devDependencies: { /* build/test:  npm install -D <pkg>   */ },
};
console.log('package.json scripts → run with `npm run <name>`:');
console.log(Object.keys(packageJson.scripts).join(', ')); // => dev, build, test, lint
// • node_modules/  — installed packages (never commit it; it's huge).
// • package-lock.json — pins EXACT versions so installs are reproducible.

// ── 2. Semantic versioning (semver):  MAJOR.MINOR.PATCH ──────────────────────
//   ^1.2.3  → allow 1.x.x (minor+patch updates)   ← npm default
//   ~1.2.3  → allow 1.2.x (patch only)
//   1.2.3   → exactly this version
console.log('semver: MAJOR(breaking).MINOR(features).PATCH(fixes)');

// ── 3. Bundlers — many files → optimized output ──────────────────────────────
// A bundler resolves your imports, bundles them, tree-shakes dead code, and
// minifies for production. Modern choices:
//   • Vite   — fast dev server + build (most common in 2026)
//   • esbuild / Rollup — the engines under many tools
//   • Webpack — older, powerful, lots of legacy projects
console.log('bundler job: resolve imports → tree-shake → minify → split');

// ── 4. Transpiling — new syntax → widely-supported JS ────────────────────────
// • Babel / esbuild convert modern JS (and JSX/TS) into code older browsers run.
// • A "browserslist" config decides how far back to compile.
// • This is why you can write ES2025 today and still support older targets.

// ── 5. Linting & formatting — consistency + catching mistakes ────────────────
// • ESLint  — flags bugs & bad patterns (unused vars, == misuse). `npx eslint .`
// • Prettier — auto-formats code so the team never argues about style.
// Run them on save and in CI so problems never reach main.

// ── 6. Git — version control basics (every project) ──────────────────────────
const gitFlow = ['git init', 'git add .', 'git commit -m "msg"', 'git push',
  'git branch feature', 'git merge', 'open a Pull Request → review → merge'];
console.log('\ngit flow:', gitFlow.join('  →  '));
// • .gitignore keeps node_modules/, .env, and build output out of the repo.

// ── 7. CI/CD — automate test & deploy ────────────────────────────────────────
// Continuous Integration: on every push, a server (GitHub Actions, etc.) runs
//   install → lint → test → build. Red build = don't merge.
// Continuous Deployment: green build auto-ships to staging/production.
console.log('CI on push: install → lint → test → build → deploy');

// ── 8. Source maps — debug the original code, not the bundle ─────────────────
// Build tools emit .map files linking minified output back to your source, so
// DevTools shows YOUR code in the debugger even in production builds.

/* THE BIG PICTURE -------------------------------------------------------------
 *   write code → lint/format → transpile → bundle → test → CI → deploy
 *   You rarely wire this by hand: `npm create vite@latest` scaffolds most of it.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Run `npm init -y` in a folder and add a "start": "node index.js" script.
 *   2. Explain the difference between dependencies and devDependencies.
 *   3. Scaffold a real app: `npm create vite@latest` and run `npm run dev`.
 * ------------------------------------------------------------------------- */
