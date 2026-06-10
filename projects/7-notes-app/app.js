/* =============================================================================
 * NOTES APP — STARTER
 * =============================================================================
 * Fill in the TODOs. The README has the full step-by-step.
 * Solution is in solution.js — try first!
 *
 * Lessons used: 14 Objects · 20 Async/Await · 26 Fetch · 22 Errors · 24 DOM · 25 Events
 * ========================================================================== */

// jsonplaceholder is a free MOCK API: it ACCEPTS POST/PUT/DELETE and replies
// realistically, but doesn't truly persist — a page reload shows the original
// notes again. That's fine: it's perfect for practising the request flow.
const API = 'https://jsonplaceholder.typicode.com/posts';

// ── Elements ─────────────────────────────────────────────────────────────────
const form = document.querySelector('#note-form');
const input = document.querySelector('#note-input');
const statusEl = document.querySelector('#status');
const listEl = document.querySelector('#note-list');

// ── State — the single source of truth we render from ────────────────────────
// Each note: { id (our own unique id), serverId (what the API calls it),
//              text, pending (true while a request is in flight) }
let notes = [];

const uid = () => crypto.randomUUID();

// Briefly show an error message, then clear it.
function flashError(message) {
  statusEl.textContent = `⚠️ ${message}`;
  statusEl.classList.add('error');
  setTimeout(() => {
    statusEl.textContent = '';
    statusEl.classList.remove('error');
  }, 2500);
}

// ── Render ───────────────────────────────────────────────────────────────────
function noteEl(note) {
  // TODO 1: build and return one <li class="note"> for `note`:
  //   - a <span class="text"> with note.text  (use textContent, NOT innerHTML!)
  //   - a <span class="saving">saving…</span>
  //   - an "edit" button and a "✕" delete button
  //   - add class "pending" to the <li> when note.pending is true
  //   - disable the edit/delete buttons while note.pending is true
  //   - wire the buttons to editNote(note.id) / deleteNote(note.id)
}

function render() {
  // TODO 2: replace the list's children with notes.map(noteEl)
  //   (hint: listEl.replaceChildren(...))
}

// ── Initial load (GET) ───────────────────────────────────────────────────────
async function load() {
  // TODO 3:
  //   - show "Loading…" in statusEl
  //   - fetch `${API}?_limit=5`; if !res.ok throw new Error('Could not load notes')
  //   - notes = data.map((p) => ({ id: uid(), serverId: p.id, text: p.title, pending: false }))
  //   - clear statusEl and render()
  //   - on error: flashError(err.message)
}

// ── Add (POST) — OPTIMISTIC ──────────────────────────────────────────────────
async function addNote(text) {
  // TODO 4:
  //   - make a note { id: uid(), serverId: null, text, pending: true }
  //   - put it at the TOP of `notes` and render() IMMEDIATELY (optimistic)
  //   - POST to API with body JSON.stringify({ title: text })
  //   - on success: set serverId from the response and pending = false, render()
  //   - on failure: REMOVE the note (roll back), render(), flashError(...)
}

// ── Edit (PUT) — OPTIMISTIC ───────────────────────────────────────────────────
async function editNote(id) {
  // TODO 5:
  //   - find the note; prompt() for new text (bail if empty/unchanged)
  //   - remember the old text, then update text + set pending = true, render()
  //   - PUT to `${API}/${note.serverId}` with body JSON.stringify({ title })
  //   - on success: pending = false, render()
  //   - on failure: restore the old text (roll back), render(), flashError(...)
}

// ── Delete (DELETE) — OPTIMISTIC ─────────────────────────────────────────────
async function deleteNote(id) {
  // TODO 6:
  //   - snapshot the current notes array
  //   - remove the note from `notes` and render() IMMEDIATELY (optimistic)
  //   - DELETE `${API}/${serverId}` (skip the request if serverId is null)
  //   - on failure: restore the snapshot (roll back), render(), flashError(...)
}

// ── Wire up the form ─────────────────────────────────────────────────────────
form.addEventListener('submit', (event) => {
  // TODO 7: preventDefault, read & trim the input, ignore if empty,
  //         call addNote(text), then clear the input.
});

load();
