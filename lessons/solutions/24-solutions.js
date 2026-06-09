/* =============================================================================
 * SOLUTIONS · 24 · EVENTS   ⚠️ BROWSER ONLY
 * =============================================================================
 * Run:  node lessons/solutions/24-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/24-events.js.
 * Try each problem YOURSELF first — then compare.
 *
 * ⚠️  BROWSER ONLY — these need a real page. In Node the guard just prints a
 *     reminder. The markup each one assumes is noted in a comment.
 * ========================================================================== */

if (typeof document === 'undefined') {
  console.log('⚠️  This is a BROWSER lesson. Open it via index.html — see lesson 23.');
} else {
  // ── 1. Add a button that increments a counter shown in a <span>. ───────────
  // Markup: <button id="inc">+1</button> <span id="count">0</span>
  let count = 0;
  document.querySelector('#inc').addEventListener('click', () => {
    count += 1;
    document.querySelector('#count').textContent = String(count);
  });

  // ── 2. Add an input that live-updates an <h2> as you type. ─────────────────
  // Markup: <input id="name"> <h2 id="echo"></h2>
  document.querySelector('#name').addEventListener('input', (event) => {
    document.querySelector('#echo').textContent = event.target.value;
  });

  // ── 3. Use delegation: one listener on a <ul> that strikes through any <li> ──
  //    you click.
  // Markup: <ul id="todos"><li>…</li><li>…</li></ul>
  // ONE listener on the parent handles clicks on any current OR future <li>.
  document.querySelector('#todos').addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
      event.target.style.textDecoration = 'line-through';
    }
  });
}
