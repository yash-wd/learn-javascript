/* PRACTICE · 30 Functional Programming — reference solution ─────────────── */

export function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

export function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

export function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
