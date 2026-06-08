# CLAUDE.md — maintenance & sync guide

Instructions for Claude Code (and any maintainer) working in this repo. Claude
Code loads this file automatically every session. **Read the "When you change X"
matrix below before editing — it lists every file that must stay in sync.**

---

## What this repo is

A self-paced JavaScript course: **52 lessons** (`lessons/NN-name.js`) + **6
projects** (`projects/N-name/`). Each lesson is one runnable file you read → run
with Node → move on. There is **no build step** for the course itself; the only
generated artifact is the offline bundle (PDF/Markdown).

Live site (GitHub Pages): https://yash-wd.github.io/learn-javascript/
Remote: `git@github.com:yash-wd/learn-javascript.git` (branch `main`)

---

## Mental model: source of truth vs generated

| Kind | Files | Rule |
| --- | --- | --- |
| **Source of truth** | `lessons/*.js`, `lessons/solutions/*.js`, `projects/**`, `README.md`, `projects/README.md`, `curriculum.html`, `index.html`, `playground.html`, `assets/*`, `findtopic.sh` | Hand-edited. |
| **Generated** | `bundle/JS_Learn_Everything.md`, `.pdf`, `.html` | **Never hand-edit.** Always regenerate with `node tools/build-bundle.mjs` (+ PDF step). |

The bundle is built from: **every `lessons/*.js`** + the **Roadmap section of
`README.md`** (the slice between `## Roadmap` and `## 🛠️ Projects`) + **all of
`projects/README.md`**. ⚠️ The HTML/PDF embed **lessons only** — the projects
appear only in the `.md`.

---

## When you change X, update Y  (the core checklist)

### ✏️ Edit a lesson's content (`lessons/NN-name.js`)
- [ ] Make the edit. Keep the lesson's shape: header `NN · TOPIC`, `WHAT YOU'LL
      LEARN`, a `Run:` line, `// ── N. ──` dividers, and a closing `/* PRACTICE */`.
- [ ] If you changed any `// =>` output comment, **run the lesson** and confirm it
      matches: `node lessons/NN-name.js`.
- [ ] If the topic coverage changed, update the lesson's row in **README.md**
      ("What you learn" column) and its `<p class="desc">` in **curriculum.html**.
- [ ] **Regenerate the bundle** (see Commands).

### ➕ Add a new lesson
- [ ] `lessons/NN-name.js` (follow the standard shape above).
- [ ] `lessons/solutions/NN-solutions.js` — a scaffold mirroring its PRACTICE block
      (header + each question as a `// ── N. ──` divider + `// TODO:`). Match the
      style of an existing solutions file.
- [ ] **README.md**: add a row to the right Level table; bump every lesson-count
      ("52") — intro line, `<br>` line, repo-layout note, hero/stat text.
- [ ] **curriculum.html**: add a lesson card under the right Level; update the
      "All 52 lessons" heading, hero `<b>52</b>` stat, footer, and `<meta>` description.
- [ ] **assets/script.js**: update the level map if the range changed.
- [ ] If browser-only, tag it `(browser)` and add it to the playground picker
      (`playground.html`) and the browser-lesson lists (README + curriculum).
- [ ] **Regenerate the bundle.**

### 🔢 Remove or renumber a lesson
- [ ] Same surface as "add", in reverse. Filenames are zero-padded and sequential
      (`01`…`52`) — renumbering touches the file, its `solutions/` twin, README,
      curriculum links, and any cross-references in other lessons/projects.
- [ ] **Regenerate the bundle.**

### 📝 Change a lesson's PRACTICE block
- [ ] Update the matching `lessons/solutions/NN-solutions.js` so its questions
      still line up (48–50 have *worked* answers — keep those correct).
- [ ] `findtopic.sh` reads PRACTICE blocks live — no code change needed, but its
      example output in **README.md** may need refreshing if you changed wording.
- [ ] **Regenerate the bundle.**

### 🛠️ Add or remove a project
- [ ] Create/delete `projects/N-name/` with all 5 files: `index.html`,
      `style.css`, `app.js` (starter w/ `// TODO:`), `solution.js` (complete),
      `README.md`. Match an existing project's structure & dark theme.
- [ ] Bump the **project count ("6")** everywhere:
      **README.md** (projects table + "N real projects" prose + repo-layout note),
      **projects/README.md** (table + "these N projects" / "build all N" prose),
      **curriculum.html** (project cards, hero `<b>6</b>` stat, "N real projects"
      heading, footer, `<meta>` description).
- [ ] Keep the project's "lessons used" list consistent across **3 places**: the
      root README table, `projects/README.md`, and the file header comments in
      `app.js`/`solution.js`.
- [ ] **Regenerate the bundle** (projects feed the `.md` via `projects/README.md`).

### 🎨 UI change (`curriculum.html`, `index.html`, `playground.html`, `assets/*`)
- [ ] These are **not** in the bundle — no regenerate needed for pure UI tweaks.
- [ ] Keep counts (52 lessons / 6 projects) consistent if you touch hero stats,
      headings, or the footer.
- [ ] The curriculum "enhancement layer" (progress tracking, lesson filter, mobile
      nav) is one `<style>`+`<script>` block at the **bottom of `curriculum.html`**,
      just before `</body>`. It targets `a.lesson`, `#lessons .parts`, and
      `header.nav nav` — keep those selectors intact when restructuring markup.
- [ ] If you change the lesson **header structure** (title `·` line, `WHAT YOU'LL
      LEARN`, `PRACTICE`), also update `findtopic.sh`'s zone extractors — it greps
      those exact markers.

---

## Counts that must stay consistent

| Value | Lives in |
| --- | --- |
| **52 lessons** | `README.md` (table + intro + stats), `curriculum.html` (links, `<b>52</b>`, "All 52 lessons", `<meta>`), `assets/script.js` (level map), bundle |
| **6 projects** | `README.md` (table + prose + layout), `projects/README.md` (table + prose), `curriculum.html` (cards, `<b>6</b>`, heading, footer, `<meta>`), bundle |
| **5 levels / browser lessons (23, 24, 46)** | `README.md`, `curriculum.html`, `playground.html` |

---

## Commands

```bash
# Run a lesson (the core study loop)
node lessons/01-variables.js

# Regenerate the bundle .md + .html  (run after editing ANY lesson or the README)
node tools/build-bundle.mjs

# Regenerate the PDF from the freshly-built HTML (needs LibreOffice / soffice)
soffice --headless --convert-to pdf --outdir bundle bundle/JS_Learn_Everything.html

# Find which lesson teaches a topic
./findtopic.sh reduce        # or:  ./findtopic.sh --word map   |   -v scope

# Run the test lesson’s tests
node --test lessons/38-testing.js
```

⚠️ **Bump the date** in `tools/build-bundle.mjs` (`const today = 'YYYY-MM-DD'`)
when you regenerate the bundle for a release — it's hardcoded on purpose
(`Date.now()` is avoided so rebuilds are reproducible).

---

## Invariants & gotchas (don't break these)

- **`package.json` has NO `"type"` field — on purpose.** `.js` then defaults to
  CommonJS (lesson 22 relies on this), while Node still auto-detects the few
  lessons that use ESM `import` syntax (**37, 38, 45**). Setting `type` to either
  `commonjs` or `module` breaks one group or the other. After any change here,
  run every lesson (see verification) to confirm all 52 still exit 0.
- **`.gitignore`**: `bundle/*.html` is intentionally ignored (transient build
  step); the `.md` and `.pdf` ARE committed. Don't commit the HTML.
- **PDF/HTML bundle = lessons only.** Projects live only in the `.md`. If you ever
  want projects in the PDF, extend `tools/build-bundle.mjs` (it builds `body` from
  `lessons` only).
- **`findtopic.sh`** searches only top-level `lessons/*.js` (never `solutions/` or
  `modules-demo/`) and matches keywords as **fixed strings** (`-iF`). Keep both.
- **Browser-only lessons (23, 24, 46)** can't run in Node — they print a guard
  notice. They're run via `playground.html`.
- **Don't hand-edit** anything under `bundle/`.

---

## Before you commit — verification block

```bash
# 1. every lesson still runs cleanly
for f in lessons/[0-9]*.js; do node "$f" >/dev/null 2>&1 || echo "FAIL: $f"; done

# 2. bundle is in sync with sources (expect NO diff on the .md)
node tools/build-bundle.mjs && git diff --quiet bundle/JS_Learn_Everything.md \
  && echo "bundle .md in sync" || echo "bundle .md drifted — commit it"

# 3. counts line up
echo "lessons: $(ls lessons/[0-9]*.js | wc -l)  solutions: $(ls lessons/solutions/*.js | wc -l)  curriculum-links: $(grep -o 'lessons/[0-9][0-9]-[a-z-]*\.js' curriculum.html | sort -u | wc -l)"
echo "projects: $(ls -d projects/[0-9]* | wc -l)  curriculum-cards: $(grep -c 'class=\"project\"' curriculum.html)"

# 4. no stale counts
grep -rniI "5 real project\|5 projects\|~13.*DOM" README.md projects curriculum.html || echo "no stale counts"
```

Then commit (branch off `main` if you aren't on it) and push. End commit messages
with the required `Co-Authored-By` trailer.
