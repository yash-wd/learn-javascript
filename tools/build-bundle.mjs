/* =============================================================================
 * build-bundle.mjs — regenerate the "Learn Everything" bundle from the lessons
 * =============================================================================
 * Produces bundle/JS_Learn_Everything.md and .html from every lessons/*.js +
 * the 8 projects + READMEs, so the bundle never drifts from the source files.
 * Run this after editing lessons/projects, then convert the HTML to PDF:
 *
 *   node tools/build-bundle.mjs           # writes bundle/.md and bundle/.html
 *   soffice --headless --convert-to pdf --outdir bundle bundle/JS_Learn_Everything.html
 *   # (any "print to PDF" works too — open the .html and Ctrl+P → Save as PDF)
 *
 * The files in lessons/ and projects/ are the SOURCE OF TRUTH; this is a snapshot.
 * ========================================================================== */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

// This script lives in tools/; the project ROOT is its parent directory.
const ROOT = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), '..');
const L = join(ROOT, 'lessons');
const P = join(ROOT, 'projects');
const OUT = join(ROOT, 'bundle');
mkdirSync(OUT, { recursive: true });
const today = '2026-06-10'; // Date.now() is intentionally avoided; bump on rebuild

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── tiny, safe Markdown → HTML for the project READMEs (headings, lists, code,
//    bold/italic/inline-code). Not a full parser — enough to render cleanly. ──
function mdLite(src) {
  const lines = src.split('\n');
  let html = '';
  let inCode = false;
  let inList = false;
  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };
  const inline = (s) =>
    esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
  for (const raw of lines) {
    if (raw.startsWith('```')) {
      if (!inCode) { closeList(); html += '<pre><code>'; inCode = true; }
      else { html += '</code></pre>'; inCode = false; }
      continue;
    }
    if (inCode) { html += esc(raw) + '\n'; continue; }
    if (/^#{1,6}\s/.test(raw)) {
      closeList();
      const level = raw.match(/^#+/)[0].length;
      const tag = level <= 1 ? 'h3' : level === 2 ? 'h4' : 'h5';
      html += `<${tag}>${inline(raw.replace(/^#+\s/, ''))}</${tag}>`;
    } else if (/^\s*[-*]\s/.test(raw)) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inline(raw.replace(/^\s*[-*]\s/, ''))}</li>`;
    } else if (raw.trim() === '') {
      closeList();
    } else {
      closeList();
      html += `<p>${inline(raw)}</p>`;
    }
  }
  closeList();
  if (inCode) html += '</code></pre>';
  return html;
}

// ── lessons ───────────────────────────────────────────────────────────────────
const lessonFiles = readdirSync(L).filter((f) => /^\d+.*\.js$/.test(f)).sort();
function titleOf(src, file) {
  const m = src.match(/^\s*\*\s*(\d+\s*[·.\-].*)$/m);
  return (m ? m[1] : basename(file, '.js')).replace(/\s+/g, ' ').trim();
}
const lessons = lessonFiles.map((f) => {
  const src = readFileSync(join(L, f), 'utf8');
  return { file: f, num: f.match(/^\d+/)[0], title: titleOf(src, f), src };
});

// ── projects (each folder: README.md spec + solution.js code) ─────────────────
const projectDirs = readdirSync(P).filter((d) => /^\d+-/.test(d)).sort();
const projects = projectDirs.map((d) => {
  const readme = readFileSync(join(P, d, 'README.md'), 'utf8');
  const solPath = join(P, d, 'solution.js');
  const solution = existsSync(solPath) ? readFileSync(solPath, 'utf8') : '';
  const m = readme.match(/^#\s+(.*)$/m);
  const title = (m ? m[1] : d).replace(/^Project\s+\d+\s*[—-]\s*/i, '').trim();
  return { dir: d, num: d.match(/^\d+/)[0], title, readme, solution };
});

const projectsReadme = readFileSync(join(ROOT, 'projects', 'README.md'), 'utf8');
const rootReadme = readFileSync(join(ROOT, 'README.md'), 'utf8');

/* ---------- 1. Combined Markdown ---------- */
let md = `# JavaScript — Learn Everything\n\n`;
md += `> Complete course bundle · ${lessons.length} lessons · ${projects.length} projects · generated ${today}\n`;
md += `> Every lesson's full, runnable source in one document. Source of truth: the\n`;
md += `> individual files in \`lessons/\` and \`projects/\` — regenerate after edits.\n\n`;
md += `## Roadmap\n\n`;
md += rootReadme.split('## Roadmap')[1].split('## 🛠️ Projects')[0].trim() + '\n\n';
md += `---\n\n# Lessons\n\n`;
for (const l of lessons) {
  md += `## ${l.title}\n\n\`\`\`js\n${l.src.trimEnd()}\n\`\`\`\n\n---\n\n`;
}
md += `# Projects\n\n${projectsReadme.trim()}\n\n`;
for (const p of projects) {
  md += `---\n\n## Project ${p.num} — ${p.title}\n\n${p.readme.replace(/^#\s.*\n/, '').trim()}\n\n`;
  if (p.solution) md += `### solution.js\n\n\`\`\`js\n${p.solution.trimEnd()}\n\`\`\`\n\n`;
}
writeFileSync(join(OUT, 'JS_Learn_Everything.md'), md);

/* ---------- 2. Styled, print-friendly HTML ---------- */
const lessonToc = lessons.map((l) => `<li><a href="#l${l.num}">${esc(l.title)}</a></li>`).join('\n');
const projectToc = projects
  .map((p) => `<li><a href="#p${p.num}">Project ${p.num} — ${esc(p.title)}</a></li>`)
  .join('\n');

const lessonBody = lessons
  .map(
    (l) => `
  <section class="lesson">
    <h2 id="l${l.num}">${esc(l.title)}</h2>
    <pre><code>${esc(l.src.trimEnd())}</code></pre>
  </section>`
  )
  .join('\n');

const projectBody = projects
  .map(
    (p) => `
  <section class="lesson">
    <h2 id="p${p.num}">Project ${p.num} — ${esc(p.title)}</h2>
    <div class="readme">${mdLite(p.readme.replace(/^#\s.*\n/, ''))}</div>
    ${p.solution ? `<h3>solution.js</h3><pre><code>${esc(p.solution.trimEnd())}</code></pre>` : ''}
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
  h3 { font-size: 12pt; color: #4338ca; margin: 12pt 0 4pt; }
  h4 { font-size: 11pt; color: #334155; margin: 9pt 0 3pt; }
  h5 { font-size: 10.5pt; color: #475569; margin: 7pt 0 2pt; }
  .cover { text-align: center; padding: 60pt 0 30pt; }
  .cover p { color: #475569; }
  .meta { color: #64748b; font-size: 10pt; }
  ol.toc { columns: 2; font-size: 10pt; color: #334155; }
  ol.toc a { color: #334155; text-decoration: none; }
  .lesson { page-break-before: always; margin-bottom: 14pt; }
  .readme ul { margin: 4pt 0 8pt 16pt; }
  .readme li { margin: 2pt 0; }
  .readme p { margin: 5pt 0; }
  pre { background: #f4f4f8; border: 1px solid #d9d9e3; border-radius: 6px; padding: 8pt 10pt;
        white-space: pre-wrap; word-wrap: break-word; }
  code { font-family: "DejaVu Sans Mono", "Courier New", monospace; font-size: 8.6pt; color: #1a1a1a; }
  .readme p code, .readme li code { background: #eef; padding: 0 2pt; border-radius: 3px; }
  h1.section { page-break-before: always; font-size: 20pt; color: #6366f1; }
</style></head>
<body>
  <div class="cover">
    <h1>JavaScript — Learn&nbsp;Everything</h1>
    <p>The complete course, from <code>var/let/const</code> to algorithms, i18n &amp; production.</p>
    <p class="meta">${lessons.length} lessons · ${projects.length} projects · generated ${today}</p>
  </div>
  <h1 class="section">Contents</h1>
  <ol class="toc">${lessonToc}
${projectToc}</ol>
  <h1 class="section">Lessons</h1>
  ${lessonBody}
  <h1 class="section">Projects</h1>
  ${projectBody}
</body></html>`;
writeFileSync(join(OUT, 'JS_Learn_Everything.html'), html);

console.log(
  `✅ wrote bundle/JS_Learn_Everything.md and .html — ${lessons.length} lessons + ${projects.length} projects embedded`
);
console.log(`   next: soffice --headless --convert-to pdf --outdir bundle bundle/JS_Learn_Everything.html`);
