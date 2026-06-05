/* =============================================================================
 * 32 · DATES & TIME
 * =============================================================================
 * Run:  node lessons/32-dates-time.js
 *
 * WHAT YOU'LL LEARN
 *   • Creating Date objects
 *   • Reading & changing parts of a date
 *   • Timestamps and date math (durations)
 *   • Formatting dates for humans with Intl.DateTimeFormat
 *
 * NOTE: Date is quirky (months are 0-based!). Read the comments carefully.
 * ========================================================================== */

// ── 1. Creating dates ────────────────────────────────────────────────────────
const now = new Date();                 // current date & time
const fromISO = new Date('2026-06-04'); // from an ISO string (recommended format)
const fromParts = new Date(2026, 5, 4); // ⚠️ month is 0-based! 5 = JUNE
const fromStamp = new Date(0);          // from a timestamp (ms since 1970-01-01 UTC)

console.log(fromISO.toISOString());     // => 2026-06-04T00:00:00.000Z
console.log(fromParts.getFullYear(), fromParts.getMonth()); // => 2026 5 (June)
console.log(fromStamp.toISOString());   // => 1970-01-01T00:00:00.000Z


// ── 2. Reading parts of a date ───────────────────────────────────────────────
const d = new Date('2026-06-04T09:30:00');
console.log(d.getFullYear());  // => 2026
console.log(d.getMonth());     // => 5    (0=Jan … 5=Jun — add 1 for humans)
console.log(d.getDate());      // => 4    (day of month, 1-based)
console.log(d.getDay());       // => 4    (day of week, 0=Sun … 4=Thu)
console.log(d.getHours(), d.getMinutes()); // => 9 30
// UTC variants exist too: getUTCFullYear(), getUTCHours(), ...


// ── 3. Timestamps & "now" ────────────────────────────────────────────────────
const ms = Date.now();          // milliseconds since 1970 (an integer)
console.log(typeof ms);         // => number
console.log(d.getTime());       // => the timestamp of date d
// Timestamps make dates easy to compare and subtract.


// ── 4. Date math — durations ─────────────────────────────────────────────────
const start = new Date('2026-06-01');
const end = new Date('2026-06-04');
const diffMs = end - start;                 // subtracting dates → milliseconds
const diffDays = diffMs / (1000 * 60 * 60 * 24);
console.log(diffDays);          // => 3

// Add time by working in ms (or with setDate):
const tomorrow = new Date(start);
tomorrow.setDate(start.getDate() + 1);  // setDate handles month rollovers
console.log(tomorrow.toISOString().slice(0, 10)); // => 2026-06-02

// A reusable "days between" helper:
const daysBetween = (a, b) => Math.round((b - a) / 86_400_000);
console.log(daysBetween(start, end)); // => 3


// ── 5. Formatting for humans — Intl.DateTimeFormat (the modern way) ──────────
const date = new Date('2026-06-04T15:05:00');

console.log(new Intl.DateTimeFormat('en-US').format(date));      // => 6/4/2026
console.log(new Intl.DateTimeFormat('en-GB').format(date));      // => 04/06/2026

const long = new Intl.DateTimeFormat('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});
console.log(long.format(date)); // => Thursday, June 4, 2026

const withTime = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit', minute: '2-digit',
});
console.log(withTime.format(date)); // => 03:05 PM

// Quick built-ins (less control, but easy):
console.log(date.toDateString());     // => Thu Jun 04 2026
console.log(date.toLocaleDateString());// => locale-specific short date


// ── 6. "Time ago" — a common real-world function ─────────────────────────────
function timeAgo(date, from) {
  const seconds = Math.floor((from - date) / 1000);
  const units = [
    ['year', 31536000], ['month', 2592000], ['day', 86400],
    ['hour', 3600], ['minute', 60], ['second', 1],
  ];
  for (const [name, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}
const past = new Date('2026-06-01T12:00:00');
const reference = new Date('2026-06-04T12:00:00');
console.log(timeAgo(past, reference)); // => 3 days ago


/* GOTCHAS --------------------------------------------------------------------
 *   • Months are 0-based (January = 0). Days of month are 1-based. Confusing!
 *   • Always prefer ISO strings ('2026-06-04') — other formats are ambiguous.
 *   • Dates carry a time zone; '2026-06-04' is parsed as UTC midnight.
 *   • For heavy date work, libraries like date-fns or Day.js save headaches.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Log today's date as "Weekday, Month Day, Year" using Intl.
 *   2. Compute how many days until a target date.
 *   3. Build a function addDays(date, n) that returns a new date n days later.
 * ------------------------------------------------------------------------- */
