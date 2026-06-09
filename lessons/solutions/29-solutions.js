/* =============================================================================
 * SOLUTIONS · 29 · ADVANCED ASYNC
 * =============================================================================
 * Run:  node lessons/solutions/29-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/29-advanced-async.js.
 * Try each problem YOURSELF first — then compare.
 * (Parts run in sequence so the output stays readable.)
 * ========================================================================== */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  // ── 1. Predict the log order of sync, setTimeout(0), and Promise.then. ──────
  // Sync runs first. Then MICROtasks (Promise.then) drain. Only THEN does the
  // event loop reach MACROtasks (setTimeout). So the order is A → B → C.
  console.log('1.', 'A — sync');
  setTimeout(() => console.log('1.', 'C — setTimeout(0) macrotask'), 0);
  Promise.resolve().then(() => console.log('1.', 'B — promise.then microtask'));
  await delay(10); // let part 1's async logs flush before moving on

  // ── 2. Write an async generator that yields 1..n with a small delay each. ───
  async function* countTo(n) {
    for (let i = 1; i <= n; i++) {
      await delay(10);
      yield i;
    }
  }
  for await (const value of countTo(3)) console.log('2.', value); // => 2. 1 / 2. 2 / 2. 3

  // ── 3. Wrap a debounce around a function and call it rapidly — fire once. ───
  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);             // cancel the previous pending call
      timer = setTimeout(() => fn(...args), ms);
    };
  }
  const ping = debounce((x) => console.log('3.', 'fired once with', x), 20);
  ping(1);
  ping(2);
  ping(3); // only this last call survives the debounce window
  await delay(40); // => 3. fired once with 3

  // ── 4. Use mapLimit to "fetch" 10 fake URLs 3 at a time; log when each starts. ──
  async function mapLimit(items, limit, fn) {
    const results = [];
    let next = 0;
    const worker = async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i], i);
      }
    };
    await Promise.all(Array.from({ length: limit }, worker)); // `limit` runners
    return results;
  }
  const urls = Array.from({ length: 10 }, (_, i) => `url-${i}`);
  await mapLimit(urls, 3, async (url) => {
    console.log('4.', 'start', url); // at most 3 "start" lines before any finishes
    await delay(10);
    return url;
  });
}

main();
