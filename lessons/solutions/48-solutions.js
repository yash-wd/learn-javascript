/* =============================================================================
 * SOLUTIONS · 48 · DATA STRUCTURES
 * =============================================================================
 * Run:  node lessons/solutions/48-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/48-data-structures.js.
 * Try each problem YOURSELF first — then compare. There's always more than one
 * correct approach; these aim to be clear, not clever.
 * ========================================================================== */

// ── 1. LinkedList.reverse() — flip the chain in place ────────────────────────
// Walk the list, re-pointing each node's `next` to the node BEHIND it.
class LinkedList {
  #head = null;
  #size = 0;
  append(value) {
    const node = { value, next: null };
    if (!this.#head) this.#head = node;
    else { let cur = this.#head; while (cur.next) cur = cur.next; cur.next = node; }
    this.#size++;
    return this;
  }
  reverse() {
    let prev = null;
    let cur = this.#head;
    while (cur) {
      const next = cur.next; // remember where we were going
      cur.next = prev;       // flip the pointer backwards
      prev = cur;            // advance the trio forward
      cur = next;
    }
    this.#head = prev;       // old tail is the new head
    return this;
  }
  toArray() {
    const out = [];
    for (let cur = this.#head; cur; cur = cur.next) out.push(cur.value);
    return out;
  }
}
const list = new LinkedList();
list.append('a').append('b').append('c').append('d');
console.log('1. reversed list:', list.reverse().toArray()); // => [ 'd', 'c', 'b', 'a' ]


// ── 2. Reverse a string using a Stack (LIFO) ─────────────────────────────────
// Push every character, then pop them — they come out in reverse order.
function reverseString(str) {
  const stack = [];
  for (const ch of str) stack.push(ch); // last char ends up on top
  let out = '';
  while (stack.length) out += stack.pop(); // pop = take from the top
  return out;
}
console.log('2. reverseString:', reverseString('algorithms')); // => smhtirogla


// ── 3. BST with min() / max() ────────────────────────────────────────────────
// The smallest value is as far LEFT as you can go; the largest as far RIGHT.
class BST {
  #root = null;
  insert(value) { this.#root = this.#insert(this.#root, value); return this; }
  #insert(node, value) {
    if (!node) return { value, left: null, right: null };
    if (value < node.value) node.left = this.#insert(node.left, value);
    else if (value > node.value) node.right = this.#insert(node.right, value);
    return node;
  }
  min() {
    if (!this.#root) return undefined;
    let node = this.#root;
    while (node.left) node = node.left;  // keep going left
    return node.value;
  }
  max() {
    if (!this.#root) return undefined;
    let node = this.#root;
    while (node.right) node = node.right; // keep going right
    return node.value;
  }
}
const tree = new BST();
[8, 3, 10, 1, 6, 14, 4].forEach((n) => tree.insert(n));
console.log('3. BST min/max:', tree.min(), '/', tree.max()); // => 1 / 14


// ── 4. Graph with a directed-edge option ─────────────────────────────────────
// addEdge(a, b, directed): when directed, link only a → b (not b → a).
class Graph {
  #adj = new Map();
  addNode(node) { if (!this.#adj.has(node)) this.#adj.set(node, []); return this; }
  addEdge(a, b, directed = false) {
    this.addNode(a).addNode(b);
    this.#adj.get(a).push(b);                 // a → b always
    if (!directed) this.#adj.get(b).push(a);  // b → a only when undirected
    return this;
  }
  neighbours(node) { return this.#adj.get(node) ?? []; }
}
const g = new Graph();
g.addEdge('A', 'B');             // undirected: A↔B
g.addEdge('A', 'C', true);       // directed:   A→C only
console.log('4. A neighbours:', g.neighbours('A')); // => [ 'B', 'C' ]
console.log('4. B neighbours:', g.neighbours('B')); // => [ 'A' ]      (B knows A)
console.log('4. C neighbours:', g.neighbours('C')); // => [ ]          (C does NOT know A)
