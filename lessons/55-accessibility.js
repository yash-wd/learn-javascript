/* =============================================================================
 * 55 · ACCESSIBILITY (a11y) — build for everyone, not just the mouse user
 * =============================================================================
 * Run:  node lessons/55-accessibility.js
 *
 * WHAT YOU'LL LEARN
 *   • Why SEMANTIC HTML is the foundation of accessibility (and free wins)
 *   • How a control's ACCESSIBLE NAME is computed (label > aria-label > text)
 *   • The cardinal rules of ARIA — and why "no ARIA beats bad ARIA"
 *   • Keyboard navigation & FOCUS MANAGEMENT (tabindex 0 / -1, never positive)
 *   • Color CONTRAST — the WCAG ratio, computed from scratch (AA = 4.5:1)
 *   • Live regions, reduced motion, accessible forms & modals
 *   • A runnable "a11y linter" that flags the most common bugs
 *
 * a11y isn't a feature you bolt on — it's a baseline. ~1 in 6 people have a
 * disability; keyboard, screen-reader and low-vision users all hit your UI.
 * It's also a legal requirement (ADA / EN 301 549) and a frequent interview
 * topic. The DOM/Events lessons (24, 25) showed you HOW to change the page;
 * this one shows you how to do it so EVERYONE can use it.
 *
 * The DOM itself lives in the browser, so here we make the *principles*
 * runnable: helpers that compute accessible names, contrast ratios, and audit a
 * small virtual element tree — the exact logic real a11y tools use.
 * ========================================================================== */

'use strict';

// ── 1. SEMANTIC HTML — the cheapest accessibility you'll ever get ────────────
// A real <button> is focusable, fires on Enter AND Space, announces as "button"
// to screen readers, and works with Windows High Contrast — all for free. A
// <div onclick> gives you NONE of that, and you'd have to re-add it by hand.
const semanticChoice = (intent) =>
  ({
    'click action': '<button>',
    navigation: '<a href>',
    'page section': '<section>/<nav>/<main>/<aside>',
    'text input': '<input>/<textarea> with a <label>',
    'list of items': '<ul>/<ol> + <li>',
  }[intent] || '<div> (last resort — re-implement semantics yourself)');

console.log(semanticChoice('click action')); // => <button>
console.log(semanticChoice('navigation')); // => <a href>
console.log(semanticChoice('mystery')); // => <div> (last resort — re-implement semantics yourself)

// ── 2. THE ACCESSIBLE NAME — what a screen reader actually announces ─────────
// Every interactive element needs an "accessible name". The browser computes it
// in priority order. Simplified, but this is the real precedence:
//   aria-labelledby  >  aria-label  >  associated <label>  >  text content  >  title
function accessibleName(el) {
  if (el.ariaLabelledbyText) return el.ariaLabelledbyText; // text of referenced node(s)
  if (el.ariaLabel) return el.ariaLabel;
  if (el.labelText) return el.labelText; // <label for> or wrapping <label>
  if (el.text) return el.text; // visible text content
  if (el.title) return el.title;
  return ''; // ⚠️ no name → screen reader says just "button", useless
}
console.log(accessibleName({ text: 'Save' })); // => Save
console.log(accessibleName({ ariaLabel: 'Close dialog', text: '×' })); // => Close dialog
console.log(accessibleName({ title: 'only a title' })); // => only a title
console.log(accessibleName({}) === ''); // => true   (a nameless control — a bug)

// ── 3. ARIA — the four rules, and "no ARIA is better than bad ARIA" ──────────
//   1) Prefer a native element with the semantics you need (Rule 1 of ARIA).
//   2) Don't change native semantics (don't put role="button" on a <button>).
//   3) All interactive ARIA controls must be keyboard operable.
//   4) Don't use role="presentation"/aria-hidden on a focusable element.
// When you DO build a custom widget, it needs role + state + keyboard handling.
function toggleButtonAttrs(pressed) {
  return { role: 'button', tabindex: 0, 'aria-pressed': String(pressed) };
}
console.log(toggleButtonAttrs(true)); // => { role: 'button', tabindex: 0, 'aria-pressed': 'true' }
// A screen reader now announces "<name>, toggle button, pressed". Flip
// aria-pressed on every click — state in the DOM, not just in a CSS class.

// ── 4. KEYBOARD NAVIGATION & FOCUS MANAGEMENT ────────────────────────────────
// Everything you can do with a mouse must work with a keyboard (Tab to move,
// Enter/Space to activate, Esc to dismiss). tabindex rules:
//   tabindex="0"   → in natural tab order (use for custom widgets)
//   tabindex="-1"  → focusable by script only (e.g. move focus to a dialog)
//   tabindex="2+"  → ❌ ANTI-PATTERN: hijacks order, impossible to maintain
const validTabindex = (t) => t === 0 || t === -1;
console.log(validTabindex(0)); // => true
console.log(validTabindex(3)); // => false
// Focus management: when you open a modal, move focus INTO it; when it closes,
// return focus to the element that opened it. Never let focus fall to <body>.

// ── 5. COLOR CONTRAST — the WCAG ratio, from scratch ─────────────────────────
// Low contrast is the #1 automated-audit failure. WCAG AA needs 4.5:1 for normal
// text (3:1 for large text / UI). The ratio is (L1+0.05)/(L2+0.05) where L is
// relative luminance. Here's the real formula — runnable, no library:
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
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  return Math.round(ratio * 100) / 100;
}
const meetsAA = (fg, bg) => contrastRatio(fg, bg) >= 4.5; // 4.5:1 = AA for NORMAL text; large text / UI need only 3:1
console.log(contrastRatio('#000000', '#ffffff')); // => 21
console.log(contrastRatio('#ffffff', '#ffffff')); // => 1
console.log(meetsAA('#000000', '#ffffff')); // => true
console.log(meetsAA('#aaaaaa', '#ffffff')); // => false   (too light — fails AA)

// ── 6. LIVE REGIONS, FORMS, MODALS & MOTION (the patterns) ───────────────────
//   • LIVE REGIONS: aria-live="polite" announces dynamic updates (a toast, a
//     "3 results found") without moving focus. Use "assertive" only for errors.
//   • FORMS: every field needs a <label> (not just a placeholder — placeholders
//     vanish on input and are low-contrast). Tie errors to the field with
//     aria-describedby and mark invalid fields aria-invalid="true".
//   • MODALS: role="dialog" aria-modal="true", focus trapped inside, Esc closes,
//     focus returns to the opener. (Or just use the native <dialog> element.)
//   • MOTION: respect prefers-reduced-motion — gate animations behind it.
function fieldAttrs({ id, invalid }) {
  const a = { id, 'aria-invalid': String(!!invalid) };
  if (invalid) a['aria-describedby'] = id + '-error'; // points at the error text
  return a;
}
console.log(fieldAttrs({ id: 'email', invalid: true }));
// => { id: 'email', 'aria-invalid': 'true', 'aria-describedby': 'email-error' }

// ── 7. A TINY a11y LINTER — the bugs you'll actually ship ────────────────────
// Audit a virtual element tree for the most common, highest-impact mistakes.
function auditA11y(nodes) {
  const issues = [];
  for (const n of nodes) {
    if (n.tag === 'img' && n.alt == null) issues.push(`<img> missing alt (src=${n.src})`);
    if (n.tag === 'button' && !accessibleName(n)) issues.push('<button> has no accessible name');
    if (n.tag === 'input' && !n.labelText && !n.ariaLabel) issues.push(`<input> "${n.name}" has no label`);
    if (typeof n.tabindex === 'number' && n.tabindex > 0) issues.push(`positive tabindex (${n.tabindex}) breaks tab order`);
    if (n.onClickDiv) issues.push('clickable <div> — use a <button> instead');
  }
  return issues;
}
const page = [
  { tag: 'img', src: 'logo.png', alt: 'Acme logo' }, // ok
  { tag: 'img', src: 'hero.jpg' }, // ❌ no alt
  { tag: 'button', ariaLabel: 'Menu' }, // ok
  { tag: 'button' }, // ❌ no name
  { tag: 'input', name: 'email', labelText: 'Email' }, // ok
  { tag: 'input', name: 'search' }, // ❌ no label
  { tag: 'a', text: 'Home', tabindex: 5 }, // ❌ positive tabindex
  { tag: 'div', onClickDiv: true }, // ❌ clickable div
];
console.log(auditA11y(page).length); // => 5
auditA11y(page).forEach((i) => console.log('•', i));
// => • <img> missing alt (src=hero.jpg)
// => • <button> has no accessible name
// => • <input> "search" has no label
// => • positive tabindex (5) breaks tab order
// => • clickable <div> — use a <button> instead

/* -----------------------------------------------------------------------------
 * WCAG IN ONE BREATH — the POUR principles
 *   Perceivable   (alt text, captions, contrast)
 *   Operable      (keyboard, no time traps, no seizure-inducing flashes)
 *   Understandable(clear labels, predictable behavior, helpful errors)
 *   Robust        (valid semantic HTML that assistive tech can parse)
 * Target WCAG 2.2 level AA — the common legal baseline.
 *
 * INTERVIEW CORNER
 *   Q: "div with a click handler vs a button?"
 *   A: <button> is focusable, keyboard-operable (Enter/Space), and announced as
 *      a button. A <div> needs tabindex=0, role=button, AND key handlers to match
 *      — so just use <button>.
 *   Q: "Is a placeholder a label?"  A: No. It disappears on input, is low
 *      contrast, and isn't reliably announced. Always use a real <label>.
 *   Q: "How do you make a modal accessible?"  A: role=dialog aria-modal=true,
 *      trap focus inside, Esc to close, return focus to the opener (or <dialog>).
 *
 * COMMON MISTAKES
 *   • Removing focus outlines (`outline: none`) with no visible replacement.
 *   • aria-label on a non-interactive/!named element, or duplicating visible text.
 *   • Using color ALONE to convey meaning (add an icon/text too).
 *   • Positive tabindex; aria-hidden on a focusable element.
 * ---------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Extend accessibleName so an empty/whitespace-only text falls through to
 *      the next source instead of being returned as a name.
 *   2. Write largeTextMeetsAA(fg, bg) using the 3:1 threshold (large text needs
 *      less contrast than the 4.5:1 for body text).
 *   3. Add a rule to auditA11y that flags an <a> with no href (a link that isn't
 *      a link — should be a <button>).
 *   4. Write trapFocus(focusables, current, shiftKey) that returns the next
 *      element to focus, wrapping at the ends (the core of a modal focus trap).
 * ------------------------------------------------------------------------- */
