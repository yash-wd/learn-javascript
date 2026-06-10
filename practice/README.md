# Practice — write code, get instant ✅/❌

The lessons let you *read and run*. This folder lets you **prove you learned it**.
Each set is a few small functions with a stub to fill in and a test suite that
checks your work the moment you run it — the same `node:test` runner you meet in
lesson 39.

## How it works
Every exercise set is three files:

| File | What it is |
| --- | --- |
| `NN-topic.mjs` | **your workspace** — function stubs with `// TODO` |
| `NN-topic.solution.mjs` | the reference answers (peek only after you try) |
| `NN-topic.test.mjs` | the tests that grade it |

By default the tests run against the **solution** (so the repo's CI stays green).
To grade **your own** file, set `PRACTICE=mine`:

```bash
# check the reference solution (always passes)
node --test practice/43-polyfills.test.mjs

# check YOUR work in 43-polyfills.mjs
PRACTICE=mine node --test practice/43-polyfills.test.mjs

# run every practice test at once
node --test practice/*.test.mjs
```

Red ❌ tells you exactly which case failed; green ✅ means move on.

## The sets (one per level)
| Level | Set | You implement |
| --- | --- | --- |
| 1 · Foundation | [`06-numbers`](06-numbers.mjs) | `clamp`, `isPrime`, `roundTo` |
| 2 · Core | [`13-array-methods`](13-array-methods.mjs) | `sumOfEvens`, `groupBy`, `countWords` |
| 3 · Intermediate | [`20-async`](20-async.mjs) | `delay`, `retry` |
| 4 · Advanced | [`31-functional`](31-functional.mjs) | `compose`, `pipe`, `curry` |
| 5 · Expert | [`43-polyfills`](43-polyfills.mjs) | `myMap`, `myFilter`, `myReduce`, `myBind` |
| ⭐ Capstone | [`assessment`](assessment.mjs) | `fizzbuzz`, `dedupe`, `mapSeries`, `memoize`, `binarySearch` |

> This is a starter set spanning all five levels — the pattern is meant to be
> copied. To add a set for any other lesson, drop in the same three files and the
> runner picks it up automatically (`practice/*.test.mjs`).
