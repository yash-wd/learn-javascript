/* =============================================================================
 * SOLUTIONS · 24 · THE DOM — Document Object Model   ⚠️ BROWSER ONLY
 * =============================================================================
 * Run:  node lessons/solutions/24-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/24-dom.js.
 * Try each problem YOURSELF first — then compare.
 *
 * ⚠️  BROWSER ONLY — open index.html and paste these into the console, or wire
 *     this file in via a <script> tag. In Node there's no `document`, so the
 *     guard below just prints a reminder.
 * ========================================================================== */

if (typeof document === 'undefined') {
  console.log('⚠️  This is a BROWSER lesson. Open it via index.html — see lesson 24.');
} else {
  // ── 1. Add a <ul id="list"></ul> to index.html, then append 3 <li>s with JS. ──
  const list = document.querySelector('#list');
  ['Apples', 'Bread', 'Coffee'].forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;     // safe: sets text, not HTML
    list.appendChild(li);      // attach it to the page
  });

  // ── 2. Select the <h1> and change its color and text. ──────────────────────
  const title = document.querySelector('h1');
  title.textContent = 'Changed by JS!';
  title.style.color = 'rebeccapurple'; // inline style wins over the stylesheet

  // ── 3. Toggle a "dark" class on the <body> from the console. ───────────────
  // .toggle adds the class if absent, removes it if present — returns the new state.
  const isDark = document.body.classList.toggle('dark');
  console.log('body is now dark?', isDark);
}
