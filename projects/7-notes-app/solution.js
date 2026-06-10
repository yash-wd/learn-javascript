/* =============================================================================
 * NOTES APP — SOLUTION
 * =============================================================================
 * Complete, working version. Compare with your app.js after trying.
 *
 * Lessons used: 14 Objects · 20 Async/Await · 25 Fetch · 21 Errors · 23 DOM · 24 Events
 *
 * The headline skill is OPTIMISTIC UI: update the screen instantly, fire the
 * request in the background, and ROLL BACK if it fails. The app stays snappy
 * because the user never waits on the network for feedback.
 * ========================================================================== */

// jsonplaceholder is a free MOCK API: it accepts POST/PUT/DELETE and replies
// realistically, but doesn't truly persist — a reload shows the original notes.
const API = 'https://jsonplaceholder.typicode.com/posts';

const form = document.querySelector('#note-form');
const input = document.querySelector('#note-input');
const statusEl = document.querySelector('#status');
const listEl = document.querySelector('#note-list');

// Each note: { id, serverId, text, pending }. `id` is OUR own stable id (so
// re-renders and local edits/deletes always target the right note); `serverId`
// is what the API calls it (used in PUT/DELETE URLs).
let notes = [];

const uid = () => crypto.randomUUID();

function flashError(message) {
  statusEl.textContent = `⚠️ ${message}`;
  statusEl.classList.add('error');
  setTimeout(() => {
    statusEl.textContent = '';
    statusEl.classList.remove('error');
  }, 2500);
}

// ── Render one note safely (textContent, never innerHTML — see lesson 39) ────
function noteEl(note) {
  const li = document.createElement('li');
  li.className = note.pending ? 'note pending' : 'note';

  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = note.text; // user input → textContent keeps it XSS-safe

  const saving = document.createElement('span');
  saving.className = 'saving';
  saving.textContent = 'saving…';

  const edit = document.createElement('button');
  edit.textContent = '✎';
  edit.title = 'Edit';
  edit.disabled = note.pending; // can't edit while a request is in flight
  edit.addEventListener('click', () => editNote(note.id));

  const del = document.createElement('button');
  del.textContent = '✕';
  del.title = 'Delete';
  del.disabled = note.pending;
  del.addEventListener('click', () => deleteNote(note.id));

  li.append(text, saving, edit, del);
  return li;
}

function render() {
  listEl.replaceChildren(...notes.map(noteEl));
}

// ── Initial load (GET) ───────────────────────────────────────────────────────
async function load() {
  statusEl.textContent = 'Loading…';
  try {
    const res = await fetch(`${API}?_limit=5`);
    if (!res.ok) throw new Error('Could not load notes');
    const data = await res.json();
    notes = data.map((p) => ({ id: uid(), serverId: p.id, text: p.title, pending: false }));
    statusEl.textContent = '';
    render();
  } catch (err) {
    flashError(err.message);
  }
}

// ── Add (POST) — OPTIMISTIC ──────────────────────────────────────────────────
async function addNote(text) {
  const note = { id: uid(), serverId: null, text, pending: true };
  notes = [note, ...notes]; // 1) show it immediately, before the request
  render();

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text }),
    });
    if (!res.ok) throw new Error('save failed');
    const saved = await res.json(); // the mock returns the new record (with an id)
    // 2) confirm it: record the server id and drop the "pending" flag
    notes = notes.map((n) =>
      n.id === note.id ? { ...n, serverId: saved.id, pending: false } : n
    );
    render();
  } catch {
    // 3) it failed → roll back: remove the note we optimistically added
    notes = notes.filter((n) => n.id !== note.id);
    render();
    flashError('Could not save the note — removed it.');
  }
}

// ── Edit (PUT) — OPTIMISTIC ───────────────────────────────────────────────────
async function editNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  const next = prompt('Edit note:', note.text);
  if (next === null) return; // cancelled
  const trimmed = next.trim();
  if (trimmed === '' || trimmed === note.text) return;

  const previous = note.text; // remember for rollback
  notes = notes.map((n) => (n.id === id ? { ...n, text: trimmed, pending: true } : n));
  render();

  try {
    const res = await fetch(`${API}/${note.serverId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: trimmed }),
    });
    if (!res.ok) throw new Error('update failed');
    notes = notes.map((n) => (n.id === id ? { ...n, pending: false } : n));
    render();
  } catch {
    notes = notes.map((n) =>
      n.id === id ? { ...n, text: previous, pending: false } : n
    );
    render();
    flashError('Could not save the edit — reverted it.');
  }
}

// ── Delete (DELETE) — OPTIMISTIC ─────────────────────────────────────────────
async function deleteNote(id) {
  const snapshot = notes; // keep a copy so we can restore on failure
  const note = notes.find((n) => n.id === id);
  notes = notes.filter((n) => n.id !== id); // remove it from the screen now
  render();

  // A note that was never saved (serverId still null) has nothing to delete.
  if (!note || note.serverId == null) return;

  try {
    const res = await fetch(`${API}/${note.serverId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('delete failed');
  } catch {
    notes = snapshot; // roll back: put the note back
    render();
    flashError('Could not delete the note — restored it.');
  }
}

// ── Wire up the form ─────────────────────────────────────────────────────────
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addNote(text);
  input.value = '';
});

load();
