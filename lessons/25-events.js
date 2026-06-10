/* =============================================================================
 * 25 · EVENTS   ⚠️ BROWSER ONLY
 * =============================================================================
 * Events are how your page REACTS to the user: clicks, typing, submitting forms,
 * scrolling, etc. Like the DOM lesson, this runs in a browser, not Node.
 *
 * HOW TO RUN: see lesson 24's header (open via index.html, check the console).
 *
 * WHAT YOU'LL LEARN
 *   • addEventListener
 *   • The event object (event.target, preventDefault)
 *   • Event bubbling and delegation
 *   • Common events (click, input, submit, keydown)
 * ========================================================================== */

if (typeof document === 'undefined') {
  console.log('⚠️  This is a BROWSER lesson. Open it via index.html — see lesson 24.');
} else {
  // ── 1. addEventListener — the standard way to respond to events ────────────
  const button = document.querySelector('#myButton');
  if (button) {
    button.addEventListener('click', (event) => {
      console.log('Button clicked!');
      console.log('clicked element:', event.target); // the element that fired it
    });
    // You can attach MANY listeners to the same element — they all run.
    // Remove one later with button.removeEventListener('click', namedHandler).
  }

  // ── 2. The event object ────────────────────────────────────────────────────
  const input = document.querySelector('#nameInput');
  if (input) {
    // 'input' fires on every keystroke; event.target.value is the current text.
    input.addEventListener('input', (event) => {
      console.log('typing:', event.target.value);
    });
  }

  // ── 3. Forms — preventDefault stops the page reload ────────────────────────
  const form = document.querySelector('#myForm');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // stop the browser's default submit/reload
      const data = new FormData(form);
      console.log('form name field:', data.get('name'));
    });
  }

  // ── 4. Keyboard events ─────────────────────────────────────────────────────
  document.addEventListener('keydown', (event) => {
    console.log('key pressed:', event.key); // e.g. "Enter", "a", "Escape"
    if (event.key === 'Escape') console.log('Escape pressed!');
  });

  // ── 5. Bubbling & delegation ───────────────────────────────────────────────
  // When you click a child, the event "bubbles" UP through its ancestors.
  // DELEGATION uses this: attach ONE listener to a parent instead of many to
  // each child — great for lists that change over time.
  const list = document.querySelector('#todoList');
  if (list) {
    list.addEventListener('click', (event) => {
      // Did the click land on an <li>? (closest walks up to find a match)
      const li = event.target.closest('li');
      if (li) {
        li.classList.toggle('done');
        console.log('toggled:', li.textContent);
      }
    });
    // Now ANY <li> inside #todoList responds — even ones added later.
  }
}

/* COMMON EVENTS --------------------------------------------------------------
 *   click, dblclick     → mouse clicks
 *   input, change       → form field value changed
 *   submit              → form submitted (use preventDefault)
 *   keydown, keyup      → keyboard
 *   mouseover, mouseout → hover
 *   load, DOMContentLoaded → page/resources ready
 * --------------------------------------------------------------------------- */

/* PRACTICE (in the browser) --------------------------------------------------
 *   1. Add a button that increments a counter shown in a <span>.
 *   2. Add an input that live-updates an <h2> as you type.
 *   3. Use delegation: one listener on a <ul> that strikes through any <li>
 *      you click.
 * ------------------------------------------------------------------------- */
