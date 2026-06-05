/* =============================================================================
 * 05 · STRINGS
 * =============================================================================
 * Run:  node lessons/05-strings.js
 *
 * WHAT YOU'LL LEARN
 *   • Creating strings and template literals
 *   • The most-used string methods
 *   • Strings are immutable — methods return NEW strings
 * ========================================================================== */

// ── 1. Creating strings ──────────────────────────────────────────────────────
const single = 'single quotes';
const double = "double quotes";        // identical to single quotes
const name = 'Sam';
const age = 25;

// Template literals (backticks): allow ${expressions} and multi-line text.
// PREFER these — they're cleaner than + concatenation.
const greeting = `Hi, I'm ${name} and I'm ${age} years old.`;
console.log(greeting); // => Hi, I'm Sam and I'm 25 years old.

const multiline = `Line one
Line two`;
console.log(multiline);


// ── 2. Length & accessing characters ─────────────────────────────────────────
const text = 'JavaScript';
console.log(text.length);    // => 10
console.log(text[0]);        // => J     (zero-indexed)
console.log(text.at(-1));    // => t     (.at() supports negative indexes)


// ── 3. Searching ─────────────────────────────────────────────────────────────
console.log(text.includes('Script')); // => true
console.log(text.startsWith('Java'));  // => true
console.log(text.endsWith('pt'));      // => true
console.log(text.indexOf('S'));        // => 4   (-1 if not found)


// ── 4. Transforming (returns a NEW string — originals never change) ──────────
console.log(text.toUpperCase());       // => JAVASCRIPT
console.log(text.toLowerCase());       // => javascript
console.log('  trim me  '.trim());     // => "trim me"
console.log(text.replace('Java', 'Type')); // => TypeScript
console.log('a-b-c'.replaceAll('-', '/')); // => a/b/c
console.log('ab'.repeat(3));           // => ababab

// slice(start, end) — extract a portion (end not included)
console.log(text.slice(0, 4));   // => Java
console.log(text.slice(4));      // => Script
console.log(text.slice(-6));     // => Script  (negative = from the end)

// Immutability proof: text itself is unchanged
console.log(text); // => JavaScript


// ── 5. Splitting & joining ───────────────────────────────────────────────────
const csv = 'red,green,blue';
const colors = csv.split(',');     // string → array
console.log(colors);               // => [ 'red', 'green', 'blue' ]
console.log(colors.join(' | '));   // array → string  => red | green | blue


// ── 6. Padding & numbers-as-strings ──────────────────────────────────────────
console.log('5'.padStart(3, '0'));  // => 005   (handy for time/IDs)
console.log('5'.padEnd(3, '.'));    // => 5..


/* PRACTICE -------------------------------------------------------------------
 *   1. Build a sentence with a template literal using two variables.
 *   2. Take "  Hello World  ", trim it, lowercase it, and replace the space.
 *   3. Split "2024-06-04" by "-" and log the year, month, day separately.
 * ------------------------------------------------------------------------- */
