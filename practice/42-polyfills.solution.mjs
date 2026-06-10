/* PRACTICE · 42 Polyfills — reference solution ──────────────────────────── */

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
  let acc = init;
  let start = 0;
  if (acc === undefined) {
    acc = arr[0]; // no seed → first element is the seed
    start = 1;
  }
  for (let i = start; i < arr.length; i++) acc = fn(acc, arr[i], i, arr);
  return acc;
}

export function myBind(fn, ctx, ...preset) {
  return function (...later) {
    return fn.apply(ctx, [...preset, ...later]);
  };
}
