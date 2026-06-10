/* PRACTICE · 43 Polyfills — reference solution ──────────────────────────── */

export function myMap(arr, fn) {
  const out = [];
  for (let i = 0; i < arr.length; i++) out.push(fn(arr[i], i, arr));
  return out;
}

export function myFilter(arr, fn) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i], i, arr)) out.push(arr[i]);
  }
  return out;
}

export function myReduce(arr, fn, init) {
  // Real reduce keys off ARITY, not `init === undefined`, so an explicit
  // `undefined` seed still counts as a seed (and the first element isn't skipped).
  const hasSeed = arguments.length >= 3;
  let acc = hasSeed ? init : arr[0];
  for (let i = hasSeed ? 0 : 1; i < arr.length; i++) acc = fn(acc, arr[i], i, arr);
  return acc;
}

export function myBind(fn, ctx, ...preset) {
  return function (...later) {
    return fn.apply(ctx, [...preset, ...later]);
  };
}
