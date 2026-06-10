# Contributing

Thanks for helping improve this JavaScript course! Whether you're fixing a typo,
correcting an explanation, or adding a lesson, this guide keeps the repo in sync.

## Ground rules

- **Lessons are runnable files.** Every `lessons/NN-name.js` must run clean on
  Node ≥ 20 and exit 0. Each `// =>` comment must match the code's real output.
- **Some files are generated — never hand-edit them.** The offline bundle
  (`bundle/`) and the browser assets (`assets/search-index.js`,
  `assets/lesson-sources.js`, `assets/lessons-manifest.js`) are built from the
  lessons. Edit the source, then regenerate.
- **`CLAUDE.md` is the source-of-truth maintenance guide.** It has a
  "when you change X, update Y" matrix — read the relevant row before editing.

## Workflow

```bash
# 1. Make your change to the source (a lesson, solution, project, or doc).

# 2. If you touched a lesson's // => output, confirm it still matches:
node lessons/NN-name.js
npm run check          # verifies all // => assertions

# 3. Regenerate anything downstream of your edit:
npm run bundle         # rebuilds bundle/.md + .html  (then regen the PDF — see CLAUDE.md)
npm run search-index   # rebuilds the three assets/*.js files

# 4. Run the full health check before opening a PR:
npm run verify         # lessons + outputs + tests + bundle/asset sync + counts
```

`npm run verify` must print **✅ ALL CHECKS PASSED** (and must be green in CI)
before a PR can be merged.

## Adding or renumbering a lesson / project

These touch several files that must stay consistent (counts, curriculum cards,
cross-references, the bundle). Follow the step-by-step checklists in **`CLAUDE.md`**
— they enumerate every file to update.

## Style

Match the surrounding code: the same comment density, the standard lesson shape
(`NN · TOPIC` header, `WHAT YOU'LL LEARN`, `Run:` line, `// ── N. ──` dividers,
a closing `/* PRACTICE */`), and the existing dark theme for project UIs.
