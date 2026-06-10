# Changelog

All notable changes to this course are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/), and the
project aims to follow [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-06-10

First public release: a complete, self-paced JavaScript course that takes a
learner from absolute beginner to professional/interview level.

### Added
- **56 lessons** (`lessons/NN-name.js`) across five levels — foundation → core →
  intermediate → advanced → expert — each a single runnable file you read, run,
  then change.
- **56 worked-solution files** (`lessons/solutions/`) — one per lesson, with
  runnable answers to every PRACTICE block.
- **8 projects** (`projects/`) — seven browser apps + one Node REST API backend,
  each with a starter (`// TODO`s), a complete solution, and a README.
- **Graded practice** (`practice/`) — fill-in exercises (one set per level) plus a
  capstone, with `node:test` suites and a `PRACTICE=mine` self-grading toggle.
- **Web experience** — `curriculum.html` (visual path + FAQ), `lesson.html`
  (in-browser lesson viewer), and `playground.html` (run any lesson, with a live
  demo stage for the browser-only lessons 24/25/47).
- **Offline bundle** — `bundle/JS_Learn_Everything.{md,pdf}` embedding every
  lesson and project.
- **Topic finder** — `findtopic.sh` ranks which lesson teaches a given keyword.
- **Quality gates** — a self-verifying output harness (`tools/check-outputs.mjs`,
  583 `// =>` assertions), `scripts/verify.sh`, and GitHub Actions CI.

### Fixed (final pre-release audit)
- Corrected a family of **lesson cross-reference drift** introduced as the course
  grew past 50 lessons: stale "see lesson NN" pointers in lessons 37/39/40/51, the
  Interview-Prep / Best-Practices track numbers in `README.md`, and the level-range
  and browser-lesson labels in the web UI (`curriculum.html`, `playground.html`,
  `lesson.html`).
- Rewrote **every project README's "lessons you'll apply"** list to the correct,
  authoritative lesson numbers.
- Renamed two practice sets to match the lesson they teach
  (`30-functional` → `31-functional`, `42-polyfills` → `43-polyfills`) and fixed a
  stale command reference in `practice/README.md`.
- Clarified a `copy` vs `transfer` explanation for `ArrayBuffer`/Web Workers
  (lesson 51) and an `https://localhost` → `http://localhost` example (lesson 39).

### Improved
- **To-Do project** now uses `crypto.randomUUID()` for task ids instead of
  `Date.now()` (no same-millisecond collisions; consistent with the REST-API
  project).
- **Form-Validation project** now sets `aria-invalid` and links inputs to their
  error messages via `aria-describedby`, so screen readers announce validation
  errors.
- **REST-API tests** use `AbortSignal.timeout`, so an unimplemented handler
  (`PRACTICE=mine`) fails cleanly instead of hanging the test runner.
- `scripts/verify.sh` now also checks the generated browser assets
  (`search-index.js`, `lesson-sources.js`, `lessons-manifest.js`) for drift, not
  just the bundle.

[1.0.0]: https://github.com/yash-wd/learn-javascript/releases/tag/v1.0.0
