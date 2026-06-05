/* =============================================================================
 * ROUTE FINDER — STARTER
 * =============================================================================
 * Fill in the TODOs. README has the full walkthrough. Solution in solution.js.
 *
 * Lessons used: 48 Graph · 49 BFS shortest path · 16 Map/Set · 23 DOM · 24 Events
 * ========================================================================== */

// ── The network (data model): each pair is a two-way connection ──────────────
const EDGES = [
  ['Central', 'North'],
  ['Central', 'East'],
  ['Central', 'West'],
  ['Central', 'South'],
  ['North', 'Airport'],
  ['East', 'Harbor'],
  ['Harbor', 'Airport'],
  ['West', 'Museum'],
  ['Museum', 'South'],
  ['South', 'Stadium'],
];

// ── Graph (from lesson 48 — given to you) ────────────────────────────────────
class Graph {
  #adj = new Map();
  addNode(node) {
    if (!this.#adj.has(node)) this.#adj.set(node, []);
    return this;
  }
  addEdge(a, b) {
    // undirected: both stations list each other as neighbours
    this.addNode(a).addNode(b);
    this.#adj.get(a).push(b);
    this.#adj.get(b).push(a);
    return this;
  }
  neighbours(node) { return this.#adj.get(node) ?? []; }
  get nodes() { return [...this.#adj.keys()].sort(); }
}

// ── Elements ─────────────────────────────────────────────────────────────────
const startSel = document.querySelector('#start');
const goalSel = document.querySelector('#goal');
const swapBtn = document.querySelector('#swap');
const findBtn = document.querySelector('#find');
const resultEl = document.querySelector('#result');
const mapEl = document.querySelector('#map');

// ── 1. Build the graph from EDGES ─────────────────────────────────────────────
const network = new Graph();
// TODO 1: loop over EDGES and call network.addEdge(a, b) for each pair.


// ── 2. Fill the two dropdowns with every station ─────────────────────────────
function populateSelects() {
  // TODO 2:
  //   - for each station in network.nodes, add an <option> to BOTH selects.
  //     (hint: new Option(text, value), or create <option> elements — lesson 23)
  //   - default the "To" dropdown to a DIFFERENT station than "From"
  //     e.g. goalSel.selectedIndex = network.nodes.length - 1;
}

// ── 3. BFS shortest path (the algorithm — lesson 49) ─────────────────────────
function bfsShortestPath(graph, start, goal) {
  // TODO 3: return an array of stations from start → goal (fewest hops), or null.
  //   - if start === goal → return [start]
  //   - use a queue (array), a visited Set, and a cameFrom map (node → previous)
  //   - BFS: shift from the queue, look at each neighbour; the FIRST time you
  //     reach `goal`, rebuild the path by walking cameFrom backwards.
  //   - return null if the queue empties without finding goal.
  return null;
}

// ── 4. Show the route (or an error) ──────────────────────────────────────────
function renderRoute(path, start, goal) {
  // TODO 4:
  //   - if !path → show an .error message ("No route from X to Y")
  //   - else build a .route box: a .stop span per station, with .arrow "→"
  //     between them, plus a .summary line: "N stops" (path.length - 1 hops).
  //   - put the HTML into resultEl.
}

// ── 5. Draw the network map (so the graph is visible) ────────────────────────
function renderNetworkMap() {
  // TODO 5: for each station, add an <li> showing the station name and its
  //         neighbours joined by ", " (use network.neighbours(station)).
}

// ── Wire up the buttons ──────────────────────────────────────────────────────
findBtn.addEventListener('click', () => {
  const start = startSel.value;
  const goal = goalSel.value;
  const path = bfsShortestPath(network, start, goal);
  renderRoute(path, start, goal);
});

swapBtn.addEventListener('click', () => {
  // TODO 6: swap the two dropdown values, then re-run a "Find route" click.
});

// ── Start ────────────────────────────────────────────────────────────────────
populateSelects();
renderNetworkMap();
