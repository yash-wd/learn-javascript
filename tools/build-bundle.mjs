/* =============================================================================
 * build-bundle.mjs — regenerate the "Learn Everything" bundle from the lessons
 * =============================================================================
 * Produces bundle/JS_Learn_Everything.md and .html from every lessons/*.js +
 * READMEs, so the bundle never drifts from the source files. Run this after
 * editing lessons, then convert the HTML to PDF:
 *
 *   node tools/build-bundle.mjs           # writes bundle/.md and bundle/.html
 *   soffice --headless --convert-to pdf --outdir bundle bundle/JS_Learn_Everything.html
 *   # (any "print to PDF" works too — open the .html and Ctrl+P → Save as PDF)
 *
 * The individual files in lessons/ are the SOURCE OF TRUTH; this is a snapshot.
 * ========================================================================== */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

// This script lives in tools/; the project ROOT is its parent directory.
const ROOT = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), '..');
const L = join(ROOT, 'lessons');
const OUT = join(ROOT, 'bundle');
mkdirSync(OUT, { recursive: true });
const today = '2026-06-08'; // Date.now() is intentionally avoided; bump on rebuild

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lessonFiles = readdirSync(L).filter((f) => /^\d+.*\.js$/.test(f)).sort();

function titleOf(src, file) {
  const m = src.match(/^\s*\*\s*(\d+\s*[·.\-].*)$/m);
  return (m ? m[1] : basename(file, '.js')).replace(/\s+/g, ' ').trim();
}

const lessons = lessonFiles.map((f) => {
  const src = readFileSync(join(L, f), 'utf8');
  return { file: f, num: f.match(/^\d+/)[0], title: titleOf(src, f), src };
});

const projectsReadme = readFileSync(join(ROOT, 'projects', 'README.md'), 'utf8');
const rootReadme = readFileSync(join(ROOT, 'README.md'), 'utf8');

/* ---------- 1. Combined Markdown ---------- */
let md = `# JavaScript — Learn Everything\n\n`;
md += `> Complete course bundle · ${lessons.length} lessons · generated ${today}\n`;
md += `> Every lesson's full, runnable source in one document. Source of truth: the\n`;
md += `> individual files in \`lessons/\` — regenerate this bundle after edits.\n\n`;
md += `## Roadmap\n\n`;
md += rootReadme.split('## Roadmap')[1].split('## How to study')[0].trim() + '\n\n';
md += `---\n\n# Lessons\n\n`;
for (const l of lessons) {
  md += `## ${l.title}\n\n\`\`\`js\n${l.src.trimEnd()}\n\`\`\`\n\n---\n\n`;
}
md += `# Projects\n\n${projectsReadme.trim()}\n`;
writeFileSync(join(OUT, 'JS_Learn_Everything.md'), md);

/* ---------- 2. Styled, print-friendly HTML ---------- */
const toc = lessons.map((l) => `<li><a href="#l${l.num}">${esc(l.title)}</a></li>`).join('\n');
const body = lessons
  .map(
    (l) => `
  <section class="lesson">
    <h2 id="l${l.num}">${esc(l.title)}</h2>
    <pre><code>${esc(l.src.trimEnd())}</code></pre>
  </section>`
  )
  .join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>JavaScript — Learn Everything</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: "DejaVu Sans", Arial, sans-serif; color: #111; line-height: 1.45; font-size: 11pt; }
  h1 { font-size: 26pt; margin: 0 0 4pt; }
  h2 { font-size: 15pt; color: #1e293b; border-bottom: 2px solid #6366f1; padding-bottom: 3pt; margin: 0 0 8pt; }
  .cover { text-align: center; padding: 60pt 0 30pt; }
  .cover p { color: #475569; }
  .meta { color: #64748b; font-size: 10pt; }
  ol.toc { columns: 2; font-size: 10pt; color: #334155; }
  ol.toc a { color: #334155; text-decoration: none; }
  .lesson { page-break-before: always; margin-bottom: 14pt; }
  pre { background: #f4f4f8; border: 1px solid #d9d9e3; border-radius: 6px; padding: 8pt 10pt;
        white-space: pre-wrap; word-wrap: break-word; }
  code { font-family: "DejaVu Sans Mono", "Courier New", monospace; font-size: 8.6pt; color: #1a1a1a; }
  h1.section { page-break-before: always; font-size: 20pt; color: #6366f1; }
</style></head>
<body>
  <div class="cover">
    <h1>JavaScript — Learn&nbsp;Everything</h1>
    <p>The complete course, from <code>var/let/const</code> to algorithms, i18n &amp; production.</p>
    <p class="meta">${lessons.length} lessons · 5 projects · generated ${today}</p>
  </div>
  <h1 class="section">Contents</h1>
  <ol class="toc">${toc}</ol>
  <h1 class="section">Lessons</h1>
  ${body}
</body></html>`;
writeFileSync(join(OUT, 'JS_Learn_Everything.html'), html);

console.log(`✅ wrote bundle/JS_Learn_Everything.md and .html — ${lessons.length} lessons embedded`);
console.log(`   next: soffice --headless --convert-to pdf --outdir bundle bundle/JS_Learn_Everything.html`);
