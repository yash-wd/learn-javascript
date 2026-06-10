# Changelog

Notable changes to this course. It's versioned simply as **1.0** — small fixes
and improvements are folded in here rather than bumped to new version numbers.

## 1.0

A complete, self-paced JavaScript course — from absolute beginner to
professional / interview level.

### Course
- **56 lessons** across five levels, each a single runnable file you read, run,
  then tweak.
- **56 worked-solution files** — one per lesson, with runnable answers to every
  PRACTICE block.
- **8 projects** — seven browser apps + one Node REST API — each with a starter
  (`// TODO`s), a complete solution, and a README. Every browser project also has
  a one-click **`solution.html`** to see the finished app running.
- **Graded practice** (one set per level) + a capstone, with `node:test` suites
  and a `PRACTICE=mine` self-grading toggle.

### Web experience
- `curriculum.html` (visual path + FAQ), `lesson.html` (in-browser lesson viewer
  — plus a themed viewer for each lesson's **worked solution** via `?sol=`), and
  `playground.html` (run any lesson **or its worked solution** in the browser,
  with a live demo stage for the browser-only lessons 24/25/47).
- Offline bundle: `bundle/JS_Learn_Everything.{md,pdf}`.
- `findtopic.sh` ranks which lesson teaches a given keyword.

### Quality
- Self-verifying output harness (583 `// =>` assertions), a full `verify.sh`
  health check (lessons, tests, bundle + generated-asset drift, counts), and CI.
- Content audit: corrected lesson cross-reference numbering, every project
  README's "lessons you'll apply" list, and the web-UI counts; accessibility and
  robustness fixes across the projects.

[v1.0]: https://github.com/yash-wd/learn-javascript/releases/tag/v1.0
