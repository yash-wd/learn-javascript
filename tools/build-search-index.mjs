#!/usr/bin/env node
/* =============================================================================
 * build-search-index.mjs — generate the in-browser lesson search index.
 * =============================================================================
 * The web page's lesson filter used to match only each card's title + short
 * description, so a content keyword like "redeclaration" (which lives in a
 * lesson's BODY, not its title) found nothing — even though `findtopic.sh`
 * locates it on the CLI. This tool mirrors findtopic.sh's *zones* so the UI can
 * search and SCORE lessons the same way:
 *
 *     title   — the "NN · TOPIC" line          (CLI score +5)
 *     learn   — the WHAT YOU'LL LEARN block     (CLI score +3)
 *     practice— the PRACTICE block              (CLI score +3)
 *     body    — the whole lesson file           (CLI score +1, presence)
 *   (+ the filename/href is scored +2 by the browser, same as the CLI.)
 *
 * Outputs (both plain `<script src>`-loadable, NOT JSON+fetch — on purpose:
 * <script src> works from file:// with no server, keeping the page offline-first):
 *   assets/search-index.js   — window.LESSON_INDEX  (zones, for the page search)
 *   assets/lesson-sources.js — window.LESSON_SOURCES (raw lesson source, so the
 *                              Playground's "▶ playground" can load a lesson into
 *                              the editor offline — no server / fetch needed)
 *   assets/lessons-manifest.js — window.LESSONS_MANIFEST (tiny: per-lesson num,
 *                              title, level, browser flag, practice questions —
 *                              powers the Playground's "practice any lesson" picker
 *                              without loading the full sources up front)
 *
 * Run:  node tools/build-search-index.mjs   (re-run after editing any lesson)
 * ========================================================================== */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LESSONS = join(ROOT, 'lessons');
const OUT_INDEX = join(ROOT, 'assets', 'search-index.js');
const OUT_SOURCES = join(ROOT, 'assets', 'lesson-sources.js');
const OUT_MANIFEST = join(ROOT, 'assets', 'lessons-manifest.js');

// ── zone extractors — the JS twins of findtopic.sh's awk zone_* functions ──
const titleZone = (src) => (src.split('\n').find((l) => l.includes('·')) || '').trim();

function learnZone(src) {
  const lines = src.split('\n');
  const start = lines.findIndex((l) => /WHAT YOU'LL LEARN/.test(l));
  if (start === -1) return '';
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/\*\//.test(lines[i])) break;
    out.push(lines[i]);
  }
  return out.join('\n');
}

function practiceZone(src) {
  const lines = src.split('\n');
  const start = lines.findIndex((l) => /PRACTICE/.test(l));
  if (start === -1) return '';
  const out = [];
  for (let i = start; i < lines.length; i++) {
    out.push(lines[i]);
    if (i > start && /\*\//.test(lines[i])) break;
  }
  return out.join('\n');
}

// collapse whitespace and lowercase, so the browser can match case-insensitively
// (like findtopic.sh's `grep -i`) without lowercasing 350KB on every keystroke.
const squash = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();

// ── manifest helpers: proper-case title parts, level band, practice questions ──
const BROWSER = { 24: 1, 25: 1, 47: 1 }; // lessons that run on the demo stage

function levelOf(n) {
  if (n <= 8) return 'Level 1 · Foundation';
  if (n <= 16) return 'Level 2 · Core Concepts';
  if (n <= 26) return 'Level 3 · Intermediate';
  if (n <= 38) return 'Level 4 · Advanced';
  return 'Level 5 · Expert';
}

function titleParts(src) {
  const line = titleZone(src).replace(/^[\s*]+/, '').trim(); // "NN · TOPIC — tagline"
  const num = parseInt(line, 10) || 0;
  const afterDot = line.split('·').slice(1).join('·').trim(); // "TOPIC — tagline"
  const parts = afterDot.split(/\s[—–-]\s/); // split only on a spaced dash
  return { num, topic: (parts[0] || afterDot).trim(), tagline: parts.slice(1).join(' — ').trim() };
}

function questionsOf(src) {
  const qs = [];
  practiceZone(src).split('\n').forEach((l) => {
    const m = l.replace(/^[\s*]+/, '').match(/^\d+\.\s*(.+)/);
    if (m) qs.push(m[1].replace(/\s*\*+\/?\s*$/, '').trim());
  });
  return qs;
}

const files = readdirSync(LESSONS)
  .filter((f) => /^[0-9].*\.js$/.test(f))
  .sort();

const index = {};
const sources = {};
const manifest = [];
for (const f of files) {
  const src = readFileSync(join(LESSONS, f), 'utf8');
  const href = 'lessons/' + f;
  index[href] = {
    title: squash(titleZone(src)),
    learn: squash(learnZone(src)),
    practice: squash(practiceZone(src)),
    body: squash(src),
  };
  sources[href] = src; // raw, unmodified — fed straight into the editor

  const t = titleParts(src);
  manifest.push({
    href,
    num: t.num,
    topic: t.topic,
    tagline: t.tagline,
    level: levelOf(t.num),
    browser: !!BROWSER[t.num],
    questions: questionsOf(src),
  });
}

const banner =
  '/* AUTO-GENERATED by tools/build-search-index.mjs — do not hand-edit.\n' +
  ' * Re-run `node tools/build-search-index.mjs` after editing any lesson. */\n';
writeFileSync(OUT_INDEX, banner + 'window.LESSON_INDEX = ' + JSON.stringify(index) + ';\n');
writeFileSync(OUT_SOURCES, banner + 'window.LESSON_SOURCES = ' + JSON.stringify(sources) + ';\n');
writeFileSync(OUT_MANIFEST, banner + 'window.LESSONS_MANIFEST = ' + JSON.stringify(manifest) + ';\n');

console.log(
  `search index + sources + manifest: ${files.length} lessons → ` +
  `assets/search-index.js, assets/lesson-sources.js, assets/lessons-manifest.js`
);
