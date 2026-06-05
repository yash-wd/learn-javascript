/* =============================================================================
 * 49 · ALGORITHMS — the problem-solving toolkit
 * =============================================================================
 * Run:  node lessons/49-algorithms.js
 *
 * WHAT YOU'LL LEARN
 *   The algorithm patterns that show up in real code AND every interview:
 *   • Searching: linear vs binary search
 *   • Sorting: bubble (to learn) vs merge & quick (to use)
 *   • Two-pointer & sliding-window techniques
 *   • Recursion & dynamic programming (memoization)
 *   • Graph traversal: BFS and DFS (uses lesson 48's structures)
 *
 * Read each one with its Big-O (lesson 41) in mind: the GOAL is rarely "make it
 * work" — it's "make it work without blowing up as the input grows."
 * ========================================================================== */

// ── 1. LINEAR SEARCH — O(n) ──────────────────────────────────────────────────
// Check items one by one. Works on ANY array. Slow on large data.
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;
  return -1; // not found
}
console.log('linear:', linearSearch([5, 3, 8, 1], 8)); // => 2


// ── 2. BINARY SEARCH — O(log n) ──────────────────────────────────────────────
// MUCH faster, but the array MUST be sorted. Halve the search range each step:
// look at the middle, then throw away the half that can't contain the target.
function binarySearch(sorted, target) {
  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) lo = mid + 1; // target is in the right half
    else hi = mid - 1;                       // target is in the left half
  }
  return -1;
}
console.log('binary:', binarySearch([1, 3, 5, 8, 13, 21], 13)); // => 4
// 1M items: linear ≈ 1,000,000 checks; binary ≈ 20. That's the power of O(log n).


// ── 3. BUBBLE SORT — O(n²) — learn it, don't ship it ─────────────────────────
// Repeatedly swap adjacent out-of-order pairs until sorted. Easy to understand,
// too slow for real data — but it teaches what sorting *is*.
function bubbleSort(arr) {
  const a = [...arr]; // copy — don't mutate the caller's array (lesson 12)
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]]; // swap
    }
  }
  return a;
}
console.log('bubble:', bubbleSort([5, 2, 9, 1, 5, 6])); // => [1, 2, 5, 5, 6, 9]


// ── 4. MERGE SORT — O(n log n) — a real "divide & conquer" sort ──────────────
// Split the array in half, sort each half (recursively), then MERGE the two
// sorted halves. Reliable O(n log n) — the kind of algorithm engines use.
function mergeSort(arr) {
  if (arr.length <= 1) return arr;                 // base case
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));       // sort left half
  const right = mergeSort(arr.slice(mid));         // sort right half
  return merge(left, right);
}
function merge(left, right) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {    // take the smaller front item
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j)); // drain whatever's left
}
console.log('merge :', mergeSort([5, 2, 9, 1, 5, 6])); // => [1, 2, 5, 5, 6, 9]
// (In practice: arr.toSorted() — lesson 37. These show HOW sorting works.)


// ── 5. QUICK SORT — O(n log n) average — pick a pivot, partition ─────────────
// Choose a "pivot", put smaller items left and larger right, recurse on each.
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const [pivot, ...rest] = arr;
  const smaller = rest.filter((n) => n < pivot);
  const larger = rest.filter((n) => n >= pivot);
  return [...quickSort(smaller), pivot, ...quickSort(larger)];
}
console.log('quick :', quickSort([5, 2, 9, 1, 5, 6])); // => [1, 2, 5, 5, 6, 9]


// ── 6. TWO-POINTER technique ─────────────────────────────────────────────────
// Walk two indices toward each other. Turns many O(n²) problems into O(n).
// Example: does a SORTED array contain two numbers that sum to a target?
function hasPairSum(sorted, target) {
  let lo = 0, hi = sorted.length - 1;
  while (lo < hi) {
    const sum = sorted[lo] + sorted[hi];
    if (sum === target) return [sorted[lo], sorted[hi]];
    if (sum < target) lo++;   // need a bigger sum → move left pointer up
    else hi--;                // need a smaller sum → move right pointer down
  }
  return null;
}
console.log('two-pointer:', hasPairSum([1, 3, 4, 7, 9], 11)); // => [4, 7]


// ── 7. SLIDING WINDOW ────────────────────────────────────────────────────────
// Keep a moving "window" over the data instead of recomputing from scratch.
// Example: max sum of any k consecutive numbers — O(n) instead of O(n*k).
function maxWindowSum(arr, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i]; // first window
  let best = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];              // slide: add new, drop oldest
    best = Math.max(best, windowSum);
  }
  return best;
}
console.log('sliding window:', maxWindowSum([2, 1, 5, 1, 3, 2], 3)); // => 9 (5+1+3)


// ── 8. DYNAMIC PROGRAMMING (memoization) ─────────────────────────────────────
// Naive recursive fibonacci is O(2ⁿ) — it recomputes the same values endlessly.
// DP = remember sub-results so each is computed ONCE. Drops it to O(n).
function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);             // already solved → reuse
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}
console.log('fib(40):', fib(40)); // => 102334155  (instant, thanks to memoization)


// ── 9. GRAPH TRAVERSAL — BFS & DFS ───────────────────────────────────────────
// Visit every node reachable from a start. BFS uses a QUEUE (lesson 48) and
// explores level by level (→ shortest path in unweighted graphs). DFS uses a
// STACK / recursion and dives deep first.
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'], E: ['B', 'F'], F: ['C', 'E'],
};

function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];          // FIFO
  const order = [];
  while (queue.length) {
    const node = queue.shift();   // take from the FRONT
    order.push(node);
    for (const next of graph[node]) {
      if (!visited.has(next)) { visited.add(next); queue.push(next); }
    }
  }
  return order;
}

function dfs(graph, start, visited = new Set(), order = []) {
  visited.add(start);
  order.push(start);
  for (const next of graph[start]) {
    if (!visited.has(next)) dfs(graph, next, visited, order); // dive deep first
  }
  return order;
}
console.log('BFS from A:', bfs(graph, 'A')); // => [ 'A', 'B', 'C', 'D', 'E', 'F' ]
console.log('DFS from A:', dfs(graph, 'A')); // => [ 'A', 'B', 'D', 'E', 'F', 'C' ]


/* COMPLEXITY CHEAT SHEET -----------------------------------------------------
 *   linear search ... O(n)        binary search ... O(log n)  (needs sorted)
 *   bubble sort ..... O(n²)       merge/quick ..... O(n log n)
 *   two-pointer ..... O(n)        sliding window .. O(n)
 *   naive fib ....... O(2ⁿ)       memoized fib .... O(n)
 *   BFS / DFS ....... O(V + E)    (vertices + edges)
 *
 * INTERVIEW PLAYBOOK:
 *   • Sorted input?  → think binary search / two-pointer.
 *   • "Subarray/substring of length k"? → sliding window.
 *   • Overlapping sub-problems? → memoize (DP).
 *   • Graph/tree/grid? → BFS (shortest path) or DFS (explore all).
 *   • Always state the Big-O of your solution out loud.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Write isPalindrome(str) with the two-pointer technique.
 *   2. Implement insertionSort and compare its output to mergeSort.
 *   3. Use BFS to find the SHORTEST path (list of nodes) between two graph nodes.
 *   4. Solve "climbing stairs" (1 or 2 steps at a time) with memoized recursion.
 * ------------------------------------------------------------------------- */
