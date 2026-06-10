# Project 4 — Route Finder

The computer-science capstone. No internet needed — this is about turning two
**CS-core lessons into a real, visual app**: model a transit network as a
**graph** (lesson 49) and find the fewest-stops route with **BFS** (lesson 50).

## What it does
- Pick a **From** and **To** station from two dropdowns
- Click **Find route** → shows the shortest path as `A → B → C` with a stop count
- A **swap** (⇅) button flips start/destination and re-routes instantly
- Handles "no route" and "same station" cleanly
- Renders the whole **network map** so you can see the graph it's searching

## Lessons you'll apply
- **48 Data Structures** — the `Graph` (adjacency list via `Map`) holds the network
- **49 Algorithms** — `bfsShortestPath` does the actual work (BFS + path rebuild)
- **16 Sets & Maps** — `visited` Set, `cameFrom` map
- **13 Array methods / 15 destructuring** — render the path, swap values
- **23 DOM / 24 Events** — dropdowns, buttons, rendering

## How to run
Open `index.html`. It loads `app.js` (starter). Switch to `solution.js` to see
the finished version:
`<script src="app.js">` → `<script src="solution.js">`

## The data model (given to you in the starter)
```js
const EDGES = [
  ['Central', 'North'],
  ['Central', 'East'],
  // ...each pair is a TWO-WAY connection
];
```
The `Graph` class (from lesson 49) is also provided — you focus on wiring it up
and writing the search.

## Build it step by step
1. **Build the graph** — loop `EDGES`, call `network.addEdge(a, b)` for each.
2. **populateSelects()** — add an `<option>` for every `network.nodes` station to
   both dropdowns; default "To" to a different station than "From".
3. **bfsShortestPath(graph, start, goal)** — the heart of it:
   - `start === goal` → return `[start]`
   - keep a `queue`, a `visited` Set, and a `cameFrom` map
   - BFS: `shift()` a node, visit each unvisited neighbour, record `cameFrom`
   - the **first** time you reach `goal`, rebuild the path by walking `cameFrom`
     backwards — BFS guarantees it's the shortest (fewest hops)
   - return `null` if the queue empties first
4. **renderRoute(path, …)** — no path → an `.error`; else stops joined by `→`
   plus a "N stops" summary.
5. **renderNetworkMap()** — list each station and its neighbours.
6. **swap button** — swap the two dropdown values, then find the route again.

## Why BFS (and not DFS)?
BFS explores the graph **level by level** — all 1-hop neighbours, then all
2-hop, and so on. So the moment it touches the destination, it has used the
fewest possible edges. DFS (lesson 50) dives deep and would find *a* path, but
not necessarily the **shortest** one. That's the whole reason BFS is the
go-to for shortest paths in unweighted graphs.

## Make it your own
- **Weighted edges** (distance/time per link) → upgrade BFS to **Dijkstra's**
  algorithm with a priority queue (uses the heap idea from lesson 49).
- Let users **add/remove stations or connections** at runtime and re-route.
- **Highlight the route** on the network map (bold the stations in the path).
- Show **all stations reachable within N hops** of a station (BFS with a depth).
- Persist the user's last From/To to **localStorage** (lesson 34).
- Render the network as an actual **SVG graph** instead of a list.

## Concepts this cements
- **Graphs model relationships** — transit maps, social networks, dependencies,
  the web. The adjacency list (`Map<node, neighbours[]>`) is the workhorse form.
- **BFS = shortest path** in an unweighted graph, and the `cameFrom` trick to
  rebuild the route is a pattern you'll reuse for mazes, word ladders, and
  game AI. This is the exact shape of countless interview problems.
