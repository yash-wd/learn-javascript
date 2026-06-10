/* PRACTICE · 43 Polyfills (interview gold) ──────────────────────────────────
 * Re-implement the built-ins from scratch — no using the native versions.
 *   PRACTICE=mine node --test practice/43-polyfills.test.mjs
 * ------------------------------------------------------------------------- */

// myMap(arr, fn): like arr.map(fn) — new array of fn(item, i) for each item.
export function myMap(arr, fn) {
  // TODO (use a plain loop, not arr.map)
}

// myFilter(arr, fn): like arr.filter(fn) — keep items where fn(item, i) is truthy.
export function myFilter(arr, fn) {
  // TODO
}

// myReduce(arr, fn, init): like arr.reduce(fn, init) — fold to one value.
export function myReduce(arr, fn, init) {
  // TODO
}

// myBind(fn, ctx, ...preset): like fn.bind(ctx, ...preset) — return a new
// function with `this` fixed to ctx and `preset` args prepended.
export function myBind(fn, ctx, ...preset) {
  // TODO
}
