/* PRACTICE · 13 Array Methods — reference solution ──────────────────────── */

export function sumOfEvens(nums) {
  return nums.filter((n) => n % 2 === 0).reduce((sum, n) => sum + n, 0);
}

export function groupBy(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    (groups[key] ??= []).push(item);
    return groups;
  }, {});
}

export function countWords(str) {
  return str
    .trim()
    .split(/\s+/)
    .reduce((counts, word) => {
      counts[word] = (counts[word] ?? 0) + 1;
      return counts;
    }, {});
}
