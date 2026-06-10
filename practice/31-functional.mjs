/* PRACTICE · 31 Functional Programming ──────────────────────────────────────
 * Fill in the bodies, then grade your work:
 *   PRACTICE=mine node --test practice/31-functional.test.mjs
 * ------------------------------------------------------------------------- */

// compose(...fns): combine functions RIGHT-to-left.
//   compose(f, g)(x) === f(g(x))
export function compose(...fns) {
  // TODO
}

// pipe(...fns): combine functions LEFT-to-right (the readable order).
//   pipe(f, g)(x) === g(f(x))
export function pipe(...fns) {
  // TODO
}

// curry(fn): return a curried version that collects args until it has enough
// (fn.length), then calls fn.  const add = (a,b,c)=>a+b+c; curry(add)(1)(2)(3)===6
export function curry(fn) {
  // TODO
}
