/* =============================================================================
 * 55 · ACCESSIBILITY — practice solutions
 * =============================================================================
 * Run:  node lessons/solutions/55-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/55-accessibility.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

'use strict';

// ── 1. accessibleName: skip empty/whitespace-only sources. ───────────────────
function accessibleName(el) {
  const clean = (s) => (typeof s === 'string' && s.trim() ? s.trim() : null);
  return (
    clean(el.ariaLabelledbyText) ||
    clean(el.ariaLabel) ||
    clean(el.labelText) ||
    clean(el.text) ||
    clean(el.title) ||
    '' // still nameless → a real bug to flag
  );
}
console.log(accessibleName({ text: '   ', ariaLabel: 'Close' })); // => Close
console.log(accessibleName({ text: '  Save  ' })); // => Save
console.log(accessibleName({}) === ''); // => true

// ── 2. Large text needs only 3:1 (vs 4.5:1 for body text). ───────────────────
function relativeLuminance(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
function contrastRatio(fg, bg) {
  const a = relativeLuminance(fg);
  const b = relativeLuminance(bg);
  return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
}
const largeTextMeetsAA = (fg, bg) => contrastRatio(fg, bg) >= 3;
console.log(largeTextMeetsAA('#000000', '#ffffff')); // => true
console.log(largeTextMeetsAA('#949494', '#ffffff')); // => true   (passes 3:1 as large text…)
console.log(contrastRatio('#949494', '#ffffff') >= 4.5); // => false  (…but fails 4.5:1 as body)

// ── 3. Flag an <a> with no href (a "link" that isn't focusable/navigable). ───
function linkWithoutHref(node) {
  return node.tag === 'a' && node.href == null;
}
console.log(linkWithoutHref({ tag: 'a', text: 'Open' })); // => true
console.log(linkWithoutHref({ tag: 'a', href: '/home' })); // => false
// → fix: if it performs an action (not navigation), use a <button>.

// ── 4. trapFocus — the core of a modal focus trap (Tab wraps at the ends). ───
function trapFocus(focusables, current, shiftKey) {
  const i = focusables.indexOf(current);
  const last = focusables.length - 1;
  if (shiftKey) return i <= 0 ? focusables[last] : focusables[i - 1]; // Shift+Tab
  return i >= last ? focusables[0] : focusables[i + 1]; // Tab
}
const ring = ['close', 'name', 'email', 'submit'];
console.log(trapFocus(ring, 'submit', false)); // => close   (Tab wraps end → start)
console.log(trapFocus(ring, 'close', true)); // => submit  (Shift+Tab wraps start → end)
console.log(trapFocus(ring, 'name', false)); // => email
