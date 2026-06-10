/* PRACTICE · 20 Async / Await — reference solution ──────────────────────── */

export function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function retry(fn, attempts) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn(); // await works whether fn is sync or async
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}
