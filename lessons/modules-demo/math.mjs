// ---- ES MODULE: math.mjs ----
// A real, runnable module. Only what we `export` is visible to other files;
// everything else (like the `round` helper below) stays private to this file.

const round = (n) => Math.round(n * 100) / 100; // private — not exported

// Named exports — share many values by name:
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export function circleArea(r) {
  return round(PI * r * r); // uses the private helper
}

// Default export — the ONE main value of this file:
export default function multiply(a, b) {
  return a * b;
}
