/* PRACTICE · 06 Numbers & Math — reference solution ─────────────────────── */

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

export function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false; // found a divisor → not prime
  }
  return true;
}

export function roundTo(n, dp) {
  const factor = 10 ** dp;
  return Math.round(n * factor) / factor;
}
