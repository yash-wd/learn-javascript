/* =============================================================================
 * 25 · FETCH & APIs — talking to the internet
 * =============================================================================
 * Run:  node lessons/25-fetch-apis.js   (needs internet; Node 18+ has fetch)
 *
 * WHAT YOU'LL LEARN
 *   • HTTP fundamentals: methods, status codes, headers, REST
 *   • fetch() — making HTTP requests (GET and POST)
 *   • Working with JSON
 *   • Handling errors and HTTP status codes
 *   • This ties together Promises + async/await from lessons 19–20
 *
 * `fetch` is built into modern browsers AND Node 18+. It returns a Promise.
 * ========================================================================== */

/* ── 0. HTTP IN 60 SECONDS — what fetch is actually doing ─────────────────────
 * Every request is: a METHOD + a URL + HEADERS (+ an optional BODY). The server
 * replies with a STATUS CODE + headers + a body. Know these and APIs stop being
 * mysterious.
 *
 * METHODS (the "verb" — what you want to do):
 *   GET     read data (no body)            POST    create something (has a body)
 *   PUT     replace a whole resource       PATCH   update part of a resource
 *   DELETE  remove a resource
 *
 * STATUS CODES (grouped by first digit):
 *   2xx success   → 200 OK, 201 Created, 204 No Content
 *   3xx redirect  → 301 Moved, 304 Not Modified (cached)
 *   4xx YOUR fault → 400 Bad Request, 401 Unauthorized, 403 Forbidden,
 *                    404 Not Found, 429 Too Many Requests
 *   5xx SERVER fault → 500 Internal Error, 502/503 upstream/unavailable
 *
 * COMMON HEADERS:
 *   Content-Type: application/json   → what the body IS
 *   Accept: application/json         → what you WANT back
 *   Authorization: Bearer <token>    → who you are (lesson 39)
 *
 * REST = a convention for designing URLs around "resources" (nouns) + methods:
 *   GET    /users        list users        POST   /users        create a user
 *   GET    /users/42     read user 42      PATCH  /users/42     update user 42
 *   DELETE /users/42     delete user 42
 * The same idea powers almost every API you'll call.
 */


// ── 1. JSON — the data format of the web ─────────────────────────────────────
// APIs send/receive text in JSON format. Convert between JS and JSON like so:
const user = { name: 'Sam', age: 25, hobbies: ['code', 'chess'] };

const json = JSON.stringify(user);          // JS object → JSON string
console.log(json); // => {"name":"Sam","age":25,"hobbies":["code","chess"]}

const parsed = JSON.parse(json);            // JSON string → JS object
console.log(parsed.name); // => Sam

// Pretty-print with indentation (handy for logging/debugging):
console.log(JSON.stringify(user, null, 2));


// ── 1b. Building URLs with query strings (URLSearchParams) ───────────────────
// Many GET requests need a "?key=value&key=value" query string. Don't glue it
// by hand — URLSearchParams encodes spaces and special characters correctly.
const params = new URLSearchParams({ q: 'iced coffee', page: 2, sort: 'new' });
console.log(params.toString()); // => q=iced+coffee&page=2&sort=new

const searchUrl = `https://api.example.com/search?${params}`;
console.log(searchUrl); // => https://api.example.com/search?q=iced+coffee&page=2&sort=new
// You'd then:  await fetch(searchUrl)
// (URLSearchParams also PARSES query strings — see lesson 34.)


// ── 2. A GET request with async/await ────────────────────────────────────────
async function getPost(id) {
  // fetch returns a Response. .json() reads & parses the body (also a Promise).
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

  // ⚠️ fetch does NOT throw on 404/500 — you must check response.ok yourself.
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}


// ── 3. A POST request — sending data ─────────────────────────────────────────
async function createPost(post) {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post), // body must be a string
  });
  return response.json();
}


// ── 4. Fetching several things in parallel ───────────────────────────────────
async function getManyPosts(ids) {
  // Start all requests at once, then await them together (fast — see lesson 20).
  const requests = ids.map((id) => getPost(id));
  return Promise.all(requests);
}


// ── 4b. Timeouts: give fetch a deadline with AbortSignal (see lesson 29) ─────
// fetch has NO built-in timeout — a dead server could leave you hanging forever.
// AbortSignal.timeout(ms) auto-aborts the request after `ms`, rejecting with a
// TimeoutError you can catch. (Older code uses an AbortController + setTimeout.)
async function getPostWithTimeout(id, ms) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    signal: AbortSignal.timeout(ms), // cancel the request if it takes longer than ms
  });
  return res.json();
}


// ── 5. Run it (with proper error handling) ───────────────────────────────────
(async () => {
  try {
    const post = await getPost(1);
    console.log('GET post 1 title:', post.title);

    const created = await createPost({ title: 'Hello', body: 'World', userId: 1 });
    console.log('POST created id:', created.id); // => 101 (this fake API echoes back)

    const many = await getManyPosts([1, 2, 3]);
    console.log('parallel fetched titles:', many.map((p) => p.title.slice(0, 15)));

    // A 1ms deadline is sure to fire, so this demonstrates the timeout path:
    try {
      await getPostWithTimeout(1, 1);
    } catch (err) {
      console.log('timeout demo:', err.name); // => timeout demo: TimeoutError
    }
  } catch (err) {
    // Network failure (e.g. offline) OR a thrown HTTP error lands here.
    console.log('Request failed:', err.message);
    console.log('(If you are offline, that is expected — the code is correct.)');
  }
})();


/* THE PATTERN TO REMEMBER ----------------------------------------------------
 *   const res = await fetch(url, options);
 *   if (!res.ok) throw new Error(res.status);   // fetch won't throw for you
 *   const data = await res.json();              // parse the body
 *   ... wrap the whole thing in try/catch.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Fetch https://jsonplaceholder.typicode.com/users and log every name.
 *   2. Fetch a single todo and log whether it's completed.
 *   3. Add a check that logs a friendly message when response.ok is false
 *      (try a URL ending in /posts/99999999).
 *   4. Log response.status and response.headers.get('content-type') for a GET.
 *   5. Send a DELETE to /posts/1 and log the status code you get back.
 * ------------------------------------------------------------------------- */
