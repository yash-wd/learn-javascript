/* =============================================================================
 * ROUTE FINDER — SOLUTION
 * =============================================================================
 * Complete, working version. Compare with your app.js after trying.
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

// ── Graph (from lesson 48) ───────────────────────────────────────────────────
class Graph {
  #adj = new Map();
  addNode(node) {
    if (!this.#adj.has(node)) this.#adj.set(node, []);
    return this;
  }
  addEdge(a, b) {
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
for (const [a, b] of EDGES) network.addEdge(a, b);

// ── 2. Fill the two dropdowns with every station ─────────────────────────────
function populateSelects() {
  for (const station of network.nodes) {
    startSel.appendChild(new Option(station, station));
    goalSel.appendChild(new Option(station, station));
  }
  // Start at the first station, aim at the last → an interesting default route.
  startSel.selectedIndex = 0;
  goalSel.selectedIndex = network.nodes.length - 1;
}

// ── 3. BFS shortest path (the algorithm — lesson 49) ─────────────────────────
// BFS explores level by level, so the first time it reaches the goal it has
// used the fewest hops. cameFrom lets us rebuild the actual path afterwards.
function bfsShortestPath(graph, start, goal) {
  if (start === goal) return [start];

  const visited = new Set([start]);
  const queue = [start];
  const cameFrom = { [start]: null }; // node → the node we arrived from

  while (queue.length) {
    const node = queue.shift();        // FIFO: take from the front
    for (const next of graph.neighbours(node)) {
      if (visited.has(next)) continue;
      visited.add(next);
      cameFrom[next] = node;
      if (next === goal) {
        // Walk cameFrom backwards from goal to start, then reverse.
        const path = [next];
        while (cameFrom[path[0]] !== null) path.unshift(cameFrom[path[0]]);
        return path;
      }
      queue.push(next);
    }
  }
  return null; // goal unreachable
}

// ── 4. Show the route (or an error) ──────────────────────────────────────────
function renderRoute(path, start, goal) {
  if (!path) {
    resultEl.innerHTML = `<div class="error">No route from <b>${start}</b> to <b>${goal}</b>.</div>`;
    return;
  }

  // Build "A → B → C" with styled spans (lesson 13 map + join).
  const stops = path
    .map((station) => `<span class="stop">${station}</span>`)
    .join('<span class="arrow">→</span>');

  const hops = path.length - 1;
  // Safe to use innerHTML here: station names come from our own hardcoded GRAPH,
  // not user input. For user-supplied text, build nodes with textContent (lesson 39).
  resultEl.innerHTML = `
    <div class="route">
      ${stops}
      <div class="summary">${hops} stop${hops === 1 ? '' : 's'} · ${path.length} stations</div>
    </div>`;
}

// ── 5. Draw the network map (so the graph is visible) ────────────────────────
function renderNetworkMap() {
  mapEl.innerHTML = '';
  for (const station of network.nodes) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="station">${station}</span>
      <span class="links">↔ ${network.neighbours(station).join(', ')}</span>`;
    mapEl.appendChild(li);
  }
}

// ── Wire up the buttons ──────────────────────────────────────────────────────
function findRoute() {
  const start = startSel.value;
  const goal = goalSel.value;
  renderRoute(bfsShortestPath(network, start, goal), start, goal);
}

findBtn.addEventListener('click', findRoute);

swapBtn.addEventListener('click', () => {
  [startSel.value, goalSel.value] = [goalSel.value, startSel.value]; // swap (lesson 15)
  findRoute();
});

// ── Start ────────────────────────────────────────────────────────────────────
populateSelects();
renderNetworkMap();
findRoute(); // show the default route immediately
