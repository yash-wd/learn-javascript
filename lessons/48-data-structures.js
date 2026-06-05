/* =============================================================================
 * 48 · DATA STRUCTURES — the containers behind every program
 * =============================================================================
 * Run:  node lessons/48-data-structures.js
 *
 * WHAT YOU'LL LEARN
 *   The classic computer-science data structures, built in plain JS:
 *   • Stack (LIFO) and Queue (FIFO)
 *   • Linked list
 *   • Hash map (how Map/objects work under the hood)
 *   • Binary tree + binary search tree
 *   • Graph (adjacency list)
 *
 * WHY THIS MATTERS
 *   Arrays and objects (lessons 12–16) cover 90% of daily work. But knowing
 *   these structures — when each is fast, and WHY — is the difference between
 *   O(n) and O(1) code, and it's the backbone of every coding interview.
 *   Pair this with lesson 49 (algorithms) and lesson 41 (Big-O).
 * ========================================================================== */

// ── 1. STACK (LIFO — Last In, First Out) ─────────────────────────────────────
// Think a stack of plates: you add and remove from the TOP. Used for: undo,
// browser back, call stack, balancing brackets, depth-first traversal.
class Stack {
  #items = [];
  push(value) { this.#items.push(value); return this; } // add to top
  pop() { return this.#items.pop(); }                    // remove from top
  peek() { return this.#items.at(-1); }                  // look, don't remove
  get size() { return this.#items.length; }
  get isEmpty() { return this.#items.length === 0; }
}
const undo = new Stack();
undo.push('type A').push('type B').push('type C');
console.log('stack peek:', undo.peek()); // => type C
console.log('stack pop :', undo.pop());  // => type C  (last in, first out)
console.log('stack pop :', undo.pop());  // => type B

// Classic use: are the brackets balanced? "([])" ✅   "([)]" ❌
function balanced(str) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of str) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false; // mismatch
    }
  }
  return stack.length === 0; // nothing left unclosed
}
console.log('balanced ([]):', balanced('([])')); // => true
console.log('balanced ([):', balanced('([)]'));  // => false


// ── 2. QUEUE (FIFO — First In, First Out) ────────────────────────────────────
// Think a line at a shop: first to arrive is first served. Used for: task
// queues, print spoolers, breadth-first traversal, rate limiting.
// NOTE: array.shift() is O(n) (it re-indexes). For big queues use two stacks or
// a ring buffer. We use shift() here for clarity.
class Queue {
  #items = [];
  enqueue(value) { this.#items.push(value); return this; } // add to back
  dequeue() { return this.#items.shift(); }                // remove from front
  peek() { return this.#items[0]; }
  get size() { return this.#items.length; }
}
const line = new Queue();
line.enqueue('Ana').enqueue('Bob').enqueue('Cy');
console.log('queue dequeue:', line.dequeue()); // => Ana  (first in, first out)
console.log('queue peek   :', line.peek());    // => Bob


// ── 3. LINKED LIST ───────────────────────────────────────────────────────────
// A chain of nodes; each node holds a value + a pointer to the NEXT node.
// Strength: O(1) insert/remove at the front (no re-indexing like arrays).
// Weakness: O(n) to reach the middle (no random access). Great teaching tool.
class LinkedList {
  #head = null;
  #size = 0;
  prepend(value) {                       // add to front — O(1)
    this.#head = { value, next: this.#head };
    this.#size++;
    return this;
  }
  append(value) {                        // add to end — O(n)
    const node = { value, next: null };
    if (!this.#head) { this.#head = node; }
    else {
      let cur = this.#head;
      while (cur.next) cur = cur.next;   // walk to the last node
      cur.next = node;
    }
    this.#size++;
    return this;
  }
  toArray() {                            // walk the chain into an array
    const out = [];
    for (let cur = this.#head; cur; cur = cur.next) out.push(cur.value);
    return out;
  }
  get size() { return this.#size; }
}
const list = new LinkedList();
list.append('b').append('c').prepend('a');
console.log('linked list:', list.toArray()); // => [ 'a', 'b', 'c' ]


// ── 4. HASH MAP (how Map / objects work under the hood) ──────────────────────
// A hash map turns a KEY into an array index via a hash function, giving ~O(1)
// lookup. Collisions (two keys → same bucket) are handled by "chaining": each
// bucket holds a list of [key, value] pairs. (In real code, just use `Map`.)
class HashMap {
  #buckets = Array.from({ length: 8 }, () => []);
  #hash(key) {                           // turn a string into a bucket index
    let h = 0;
    for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) % this.#buckets.length;
    return h;
  }
  set(key, value) {
    const bucket = this.#buckets[this.#hash(key)];
    const pair = bucket.find((p) => p[0] === key);
    if (pair) pair[1] = value;           // update existing
    else bucket.push([key, value]);      // or add new (collision → same bucket)
    return this;
  }
  get(key) {
    const bucket = this.#buckets[this.#hash(key)];
    return bucket.find((p) => p[0] === key)?.[1];
  }
}
const ages = new HashMap();
ages.set('Ana', 30).set('Bob', 25);
console.log('hashmap get Ana:', ages.get('Ana')); // => 30
console.log('hashmap get Zz :', ages.get('Zz'));  // => undefined


// ── 5. BINARY SEARCH TREE (BST) ──────────────────────────────────────────────
// A tree where every node has up to two children, and for each node:
//   left subtree < node < right subtree.
// That ordering makes search/insert O(log n) on a balanced tree — like binary
// search (lesson 49) but in a structure you can keep adding to.
class BST {
  #root = null;
  insert(value) {
    this.#root = this.#insert(this.#root, value);
    return this;
  }
  #insert(node, value) {
    if (!node) return { value, left: null, right: null };
    if (value < node.value) node.left = this.#insert(node.left, value);
    else if (value > node.value) node.right = this.#insert(node.right, value);
    return node;                          // duplicates ignored
  }
  has(value) {
    let node = this.#root;
    while (node) {
      if (value === node.value) return true;
      node = value < node.value ? node.left : node.right; // go one way only
    }
    return false;
  }
  inOrder() {                            // in-order walk → SORTED values
    const out = [];
    (function walk(node) {
      if (!node) return;
      walk(node.left); out.push(node.value); walk(node.right);
    })(this.#root);
    return out;
  }
}
const tree = new BST();
[8, 3, 10, 1, 6, 14].forEach((n) => tree.insert(n));
console.log('BST sorted   :', tree.inOrder()); // => [ 1, 3, 6, 8, 10, 14 ]
console.log('BST has 6    :', tree.has(6));     // => true
console.log('BST has 7    :', tree.has(7));     // => false


// ── 6. GRAPH (adjacency list) ────────────────────────────────────────────────
// A set of nodes ("vertices") connected by edges. The adjacency-list form maps
// each node → an array of its neighbours. Models networks: friends, roads,
// dependencies, the web. (Traversal — BFS/DFS — is in lesson 49.)
class Graph {
  #adj = new Map();
  addNode(node) {
    if (!this.#adj.has(node)) this.#adj.set(node, []);
    return this;
  }
  addEdge(a, b) {                        // undirected: link both ways
    this.addNode(a).addNode(b);
    this.#adj.get(a).push(b);
    this.#adj.get(b).push(a);
    return this;
  }
  neighbours(node) { return this.#adj.get(node) ?? []; }
  get nodes() { return [...this.#adj.keys()]; }
}
const social = new Graph();
social.addEdge('Ana', 'Bob').addEdge('Ana', 'Cy').addEdge('Bob', 'Dee');
console.log("graph Ana's friends:", social.neighbours('Ana')); // => [ 'Bob', 'Cy' ]


/* WHICH STRUCTURE, WHEN? -----------------------------------------------------
 *   Stack ......... undo, parsing, depth-first work, the call stack
 *   Queue ......... scheduling, buffering, breadth-first work
 *   Linked list ... O(1) front insert/remove; teaching pointers
 *   Hash map ...... O(1) key→value lookup (you'll usually just use Map)
 *   BST ........... kept-sorted data with O(log n) search/insert (balanced)
 *   Graph ......... relationships/networks; pair with BFS/DFS (lesson 49)
 *
 * Big-O recap (lesson 41): array index = O(1), array search = O(n),
 *   Set/Map lookup = O(1), balanced BST search = O(log n).
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Add a `reverse()` method to LinkedList that flips the chain in place.
 *   2. Use your Stack to reverse the characters of a string.
 *   3. Add `min()`/`max()` to the BST (hint: go all the way left / right).
 *   4. Add a directed-edge option to Graph (link only a → b, not both ways).
 * ------------------------------------------------------------------------- */
