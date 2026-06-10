/* =============================================================================
 * SOLUTIONS · 50 · ALGORITHMS
 * =============================================================================
 * Run:  node lessons/solutions/50-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/50-algorithms.js.
 * Attempt each one first — struggling with it is where the learning happens.
 * ========================================================================== */

// ── 1. isPalindrome(str) with the two-pointer technique ──────────────────────
// Walk one pointer from the front, one from the back; they must always match.
// O(n) time, O(1) extra space (no reversed copy needed).
function isPalindrome(str) {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, ''); // ignore case/punctuation
  let lo = 0, hi = s.length - 1;
  while (lo < hi) {
    if (s[lo] !== s[hi]) return false; // mismatch → not a palindrome
    lo++; hi--;                        // move both pointers inward
  }
  return true;
}
console.log('1. "racecar"        ->', isPalindrome('racecar'));            // => true
console.log('1. "A man a plan…"  ->', isPalindrome('A man, a plan, a canal: Panama')); // => true
console.log('1. "hello"          ->', isPalindrome('hello'));             // => false


// ── 2. insertionSort, compared to mergeSort ──────────────────────────────────
// Insertion sort: grow a sorted region at the front, inserting each new item
// into its correct slot (like sorting a hand of cards). O(n²), but simple and
// fast on small/nearly-sorted data.
function insertionSort(arr) {
  const a = [...arr]; // don't mutate the caller's array
  for (let i = 1; i < a.length; i++) {
    const current = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > current) { // shift bigger items right
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = current;                // drop current into the gap
  }
  return a;
}
// mergeSort (from the lesson) for comparison:
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}
function merge(left, right) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return out.concat(left.slice(i), right.slice(j));
}
const data = [5, 2, 9, 1, 5, 6, 3];
const ins = insertionSort(data);
const mer = mergeSort(data);
console.log('2. insertionSort:', ins);                       // => [1,2,3,5,5,6,9]
console.log('2. mergeSort    :', mer);                       // => [1,2,3,5,5,6,9]
console.log('2. same result? ', JSON.stringify(ins) === JSON.stringify(mer)); // => true


// ── 3. BFS shortest path (list of nodes) between two graph nodes ─────────────
// BFS explores level by level, so the FIRST time it reaches the target it has
// used the fewest edges. Track each node's "came from" to rebuild the path.
const graph = {
  A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F'],
  D: ['B'], E: ['B', 'F'], F: ['C', 'E'],
};
function shortestPath(graph, start, goal) {
  if (start === goal) return [start];
  const visited = new Set([start]);
  const queue = [start];
  const cameFrom = { [start]: null }; // node → the node we reached it from
  while (queue.length) {
    const node = queue.shift();
    for (const next of graph[node]) {
      if (visited.has(next)) continue;
      visited.add(next);
      cameFrom[next] = node;
      if (next === goal) {            // found it → walk cameFrom back to start
        const path = [next];
        while (cameFrom[path[0]] !== null) path.unshift(cameFrom[path[0]]);
        return path;
      }
      queue.push(next);
    }
  }
  return null; // unreachable
}
console.log('3. shortest A→F:', shortestPath(graph, 'A', 'F')); // => [ 'A', 'C', 'F' ]
console.log('3. shortest D→F:', shortestPath(graph, 'D', 'F')); // => [ 'D', 'B', 'E', 'F' ]


// ── 4. Climbing stairs (1 or 2 steps at a time) with memoized recursion ──────
// To reach step n you arrived from step n-1 (one step) or n-2 (two steps), so
// ways(n) = ways(n-1) + ways(n-2) — it's Fibonacci! Memoize to make it O(n).
function climbStairs(n, memo = new Map()) {
  if (n <= 2) return n;                    // 1 step → 1 way, 2 steps → 2 ways
  if (memo.has(n)) return memo.get(n);
  const ways = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);
  memo.set(n, ways);
  return ways;
}
console.log('4. climbStairs(5) :', climbStairs(5));  // => 8
console.log('4. climbStairs(10):', climbStairs(10)); // => 89
