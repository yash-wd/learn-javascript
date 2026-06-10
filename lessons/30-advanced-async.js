/* =============================================================================
 * 30 · ADVANCED ASYNC
 * =============================================================================
 * Run:  node lessons/30-advanced-async.js
 *
 * WHAT YOU'LL LEARN
 *   • Microtasks vs macrotasks (the real event-loop order)
 *   • async iteration: for await...of and async generators
 *   • AbortController — cancelling async work
 *   • debounce & throttle — controlling how often a function runs
 *   • retry with backoff, and concurrency limiting (a "pool")
 *
 * Builds on lessons 19–20. These are the patterns senior devs reach for.
 * ========================================================================== */

const delay = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));


// ── 1. Microtasks vs macrotasks (event-loop ordering) ────────────────────────
// After the current synchronous code finishes, the engine drains ALL
// microtasks (Promise callbacks) BEFORE the next macrotask (setTimeout).
console.log('A: sync');
setTimeout(() => console.log('D: setTimeout (macrotask)'), 0);
Promise.resolve().then(() => console.log('C: promise (microtask)'));
console.log('B: sync');
// Order: A, B, C, D  → promises always jump ahead of setTimeout.


// ── 2. Async generators + for await...of ─────────────────────────────────────
// A generator that yields PROMISES. for await...of awaits each one in turn.
async function* fetchPages() {
  for (let page = 1; page <= 3; page++) {
    const data = await delay(20, `page ${page} data`); // pretend network call
    yield data;
  }
}

async function readPages() {
  for await (const page of fetchPages()) {
    console.log('received:', page); // => received: page 1 data, ... 2, ... 3
  }
}


// ── 3. AbortController — cancel async work ───────────────────────────────────
// The standard way to cancel fetches, timers, or any awaitable.
function cancellableDelay(ms, signal) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new Error('aborted'));
    });
  });
}

async function abortDemo() {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 30); // cancel after 30ms
  try {
    await cancellableDelay(1000, controller.signal); // would take 1s
    console.log('completed'); // never reached
  } catch (err) {
    console.log('abort demo:', err.message); // => abort demo: aborted
  }
  // Real fetch supports this directly: fetch(url, { signal: controller.signal })
}


// ── 4. debounce — run only AFTER activity stops ──────────────────────────────
// "Wait until the user stops typing for 300ms, THEN search." Resets on each call.
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}


// ── 5. throttle — run at most ONCE per interval ──────────────────────────────
// "No matter how often this fires (scroll/resize), run at most once per 200ms."
function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
    // (a production throttle often also schedules a trailing call; omitted here)
  };
}
// debounce → "settle then act" (search box). throttle → "steady rate" (scroll).


// ── 6. Retry with backoff — a real-world async pattern ───────────────────────
async function withRetry(task, attempts = 3) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await task();
    } catch (err) {
      if (i === attempts) throw err;        // out of tries → give up
      await delay(10 * i);                   // wait longer each time (backoff)
      console.log(`retry ${i} after failure: ${err.message}`);
    }
  }
}


// ── 7. Concurrency limiting — a "pool" of N at a time ────────────────────────
// Promise.all (lesson 20) starts EVERYTHING at once. With 1,000 URLs that can
// overwhelm the server (or your rate limit). A pool runs at most `limit` tasks
// concurrently: as each finishes, the next starts. Keeps results in order.
async function mapLimit(items, limit, task) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;                 // claim the next index
      results[i] = await task(items[i], i);
    }
  }
  // start `limit` workers; they pull from the shared queue until it's empty
  const pool = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(pool);
  return results;
}


// ── 8. Run the demos ─────────────────────────────────────────────────────────
(async () => {
  await readPages();
  await abortDemo();

  let flaky = 0;
  const result = await withRetry(async () => {
    flaky++;
    if (flaky < 3) throw new Error(`fail #${flaky}`);
    return 'success on attempt 3';
  });
  console.log(result); // => success on attempt 3

  // concurrency demo: 6 tasks, only 2 run at a time → finishes in ~3 "waves".
  let active = 0, peak = 0;
  const out = await mapLimit([1, 2, 3, 4, 5, 6], 2, async (n) => {
    active++; peak = Math.max(peak, active);
    await delay(20);
    active--;
    return n * 10;
  });
  console.log('mapLimit result:', out);          // => [10,20,30,40,50,60] (in order)
  console.log('mapLimit peak concurrency:', peak); // => 2 (never more than the limit)

  // debounce demo: 5 rapid calls → fn runs once, with the LAST argument.
  const search = debounce((q) => console.log('searching for:', q), 50);
  ['a', 'ap', 'app', 'appl', 'apple'].forEach((q) => search(q));
  // => searching for: apple   (only once, after the burst settles)
})();


/* PRACTICE -------------------------------------------------------------------
 *   1. Predict the log order of a sync log, a setTimeout(0), and a Promise.then.
 *   2. Write an async generator that yields 1..n with a small delay each.
 *   3. Wrap a debounce around a function and call it rapidly — watch it fire once.
 *   4. Use mapLimit to "fetch" 10 fake URLs 3 at a time; log when each starts.
 * ------------------------------------------------------------------------- */
