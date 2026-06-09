/* =============================================================================
 * SOLUTIONS · 14 · OBJECTS
 * =============================================================================
 * Run:  node lessons/solutions/14-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/14-objects.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Build a `book` object with title, author, and a summary() method. ─────
const book = {
  title: 'The Pragmatic Programmer',
  author: 'Hunt & Thomas',
  summary() {
    return `${this.title} by ${this.author}`;
  },
};
console.log('1.', book.summary()); // => 1. The Pragmatic Programmer by Hunt & Thomas

// ── 2. Loop over its entries and print "key: value" lines. ───────────────────
for (const [key, value] of Object.entries(book)) {
  if (typeof value === 'function') continue; // skip the method, print data only
  console.log('2.', `${key}: ${value}`);
}
// => 2. title: The Pragmatic Programmer
// => 2. author: Hunt & Thomas

// ── 3. Merge two settings objects so the second overrides the first. ─────────
const defaults = { theme: 'light', fontSize: 14, showTips: true };
const userPrefs = { theme: 'dark', fontSize: 16 };
const settings = { ...defaults, ...userPrefs }; // later keys win
console.log('3.', settings);
// => 3. { theme: 'dark', fontSize: 16, showTips: true }

// ── 4. JSON.stringify the book, then JSON.parse it back — notice the ─────────
//    summary() method is gone. Why? (JSON only stores plain data.)
const restored = JSON.parse(JSON.stringify(book));
console.log('4.', restored);                 // => 4. { title: '...', author: '...' }
console.log('4.', typeof restored.summary);  // => 4. undefined
// JSON is a DATA format — it has no concept of functions, so methods are dropped
// during stringify. Only the plain title/author survive the round-trip.
