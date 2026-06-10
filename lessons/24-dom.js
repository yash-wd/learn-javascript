/* =============================================================================
 * 24 · THE DOM — Document Object Model   ⚠️ BROWSER ONLY
 * =============================================================================
 * The DOM is how JS reads and changes the web page. It DOES NOT exist in Node
 * (there's no page), so running this with `node` just prints a reminder.
 *
 * HOW TO RUN THIS LESSON:
 *   1. Open index.html in the JS-learn folder.
 *   2. Change its script tag to:  <script src="lessons/24-dom.js"></script>
 *   3. Open the browser, then open DevTools (F12) → Console tab.
 *
 * WHAT YOU'LL LEARN
 *   • Selecting elements
 *   • Reading/changing text, HTML, attributes, classes, and styles
 *   • Creating and removing elements
 * ========================================================================== */

// Guard so this file is harmless when run in Node:
if (typeof document === 'undefined') {
  console.log('⚠️  This is a BROWSER lesson. Open it via index.html — see the header.');
} else {
  // ── 1. Selecting elements ──────────────────────────────────────────────────
  // querySelector uses CSS selectors and returns the FIRST match (or null).
  const title = document.querySelector('h1');          // by tag
  const box = document.querySelector('#box');          // by id (#)
  const items = document.querySelectorAll('.item');    // ALL matches (a NodeList)

  // Older, still-valid alternatives:
  // document.getElementById('box');
  // document.getElementsByClassName('item');

  // ── 2. Reading & changing content ──────────────────────────────────────────
  if (title) {
    console.log(title.textContent);        // read the text
    title.textContent = 'Updated by JS!';  // change the text (safe — no HTML)
    title.innerHTML = 'Now <em>italic</em>'; // parses HTML (⚠️ never with user input — XSS risk)
  }

  // ── 3. Attributes ──────────────────────────────────────────────────────────
  const link = document.querySelector('a');
  if (link) {
    link.getAttribute('href');
    link.setAttribute('target', '_blank');
    link.href = 'https://example.com'; // many attributes are also properties
  }

  // ── 4. Classes & styles ────────────────────────────────────────────────────
  if (box) {
    box.classList.add('active');
    box.classList.remove('hidden');
    box.classList.toggle('open');     // add if absent, remove if present
    box.classList.contains('active'); // => true/false

    box.style.color = 'white';
    box.style.backgroundColor = 'navy'; // note: camelCase (background-color)
  }

  // ── 5. Creating & inserting elements ───────────────────────────────────────
  const list = document.querySelector('ul');
  if (list) {
    const li = document.createElement('li'); // create (not yet on the page)
    li.textContent = 'New item';
    li.classList.add('item');
    list.appendChild(li);            // add as the last child
    // list.prepend(li);             // add as the first child
    // li.remove();                  // remove an element
  }

  // ── 6. Looping over a NodeList ─────────────────────────────────────────────
  items.forEach((item, i) => {
    item.textContent = `Item ${i + 1}`;
  });
}

/* PRACTICE (in the browser) --------------------------------------------------
 *   1. Add a <ul id="list"></ul> to index.html, then append 3 <li>s with JS.
 *   2. Select the <h1> and change its color and text.
 *   3. Toggle a "dark" class on the <body> from the console.
 * ------------------------------------------------------------------------- */
