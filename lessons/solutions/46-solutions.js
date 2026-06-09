/* =============================================================================
 * SOLUTIONS · 46 · ADVANCED BROWSER APIs  (browser)
 * =============================================================================
 * Run:  node lessons/solutions/46-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/46-browser-apis.js.
 * Try each problem YOURSELF first — then compare.
 *
 * ⚠️  BROWSER ONLY — these need a real page. In Node the guard prints a notice;
 *     the worked code lives in the else-branch.
 * ========================================================================== */

if (typeof window === 'undefined') {
  console.log('⚠️  This is a BROWSER lesson. Open it via index.html — see lesson 23.');
} else {
  // ── 1. Use IntersectionObserver to log when a bottom element scrolls into view. ──
  // Markup: <div id="sentinel">…</div> near the bottom of the page.
  const sentinel = document.querySelector('#sentinel');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        console.log('sentinel is visible — load more!');
        // e.g. fetch the next page of results here (infinite scroll)
      }
    }
  });
  observer.observe(sentinel);

  // ── 2. Define a <hello-world> Web Component that renders your name. ────────
  customElements.define(
    'hello-world',
    class extends HTMLElement {
      connectedCallback() {
        // `name` attribute → <hello-world name="Ada"></hello-world>
        this.textContent = `Hello, ${this.getAttribute('name') ?? 'world'}!`;
      }
    }
  );

  // ── 3. Animate a box across the screen with requestAnimationFrame. ─────────
  // Markup: <div id="box" style="position:absolute"></div>
  const box = document.querySelector('#box');
  let x = 0;
  function step() {
    x += 2;
    box.style.transform = `translateX(${x}px)`;
    if (x < 300) requestAnimationFrame(step); // ~60fps, synced to the display
  }
  requestAnimationFrame(step);
}
