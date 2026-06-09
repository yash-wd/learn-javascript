/* =============================================================================
 * SOLUTIONS · 32 · DATES & TIME
 * =============================================================================
 * Run:  node lessons/solutions/32-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/32-dates-time.js.
 * Try each problem YOURSELF first — then compare.
 * (Fixed sample dates are used so the output is reproducible; swap in
 *  `new Date()` for the real "today".)
 * ========================================================================== */

// ── 1. Log today's date as "Weekday, Month Day, Year" using Intl. ────────────
const today = new Date('2026-06-09T12:00:00');
const formatted = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(today);
console.log('1.', formatted); // => 1. Tuesday, June 9, 2026

// ── 2. Compute how many days until a target date. ────────────────────────────
const MS_PER_DAY = 1000 * 60 * 60 * 24;
function daysUntil(target, from = new Date()) {
  // Compare at UTC midnight so partial days don't skew the count.
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((b - a) / MS_PER_DAY);
}
console.log('2.', daysUntil(new Date('2026-12-25'), today), 'days until Christmas');
// => 2. 199 days until Christmas

// ── 3. Build a function addDays(date, n) that returns a new date n days later. ──
function addDays(date, n) {
  const copy = new Date(date);     // copy first — don't mutate the input
  copy.setDate(copy.getDate() + n);
  return copy;
}
console.log('3.', addDays(today, 30).toISOString().slice(0, 10));
// => 3. 2026-07-09
