/* =============================================================================
 * TO-DO APP — SOLUTION
 * =============================================================================
 * A complete, working version. Compare it with your app.js AFTER you've tried.
 * Read the comments — they explain the "why", not just the "what".
 *
 * Lessons used: 23 DOM · 24 Events · 13 Array methods · 33 Storage
 * ========================================================================== */

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const filters = document.querySelector('#filters');
const countEl = document.querySelector('#count');

const STORAGE_KEY = 'todos';

// ── State: load saved todos, or start empty (lesson 33) ──────────────────────
// We wrap JSON.parse in try/catch so corrupted storage can't crash the app.
function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
let todos = load(); // [{ id, text, done }]
let currentFilter = 'all';

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// ── render(): draw the whole list from the `todos` array ─────────────────────
// The render pattern: state changes → call render() → UI matches state.
function render() {
  list.innerHTML = ''; // clear, then rebuild

  // Choose which todos to show (lesson 13 .filter)
  const visible = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.done;
    if (currentFilter === 'done') return todo.done;
    return true; // 'all'
  });

  for (const todo of visible) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;          // remember which todo this row is
    if (todo.done) li.classList.add('done');

    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = todo.text;     // textContent (not innerHTML) is XSS-safe

    const del = document.createElement('button');
    del.className = 'delete';
    del.textContent = '✕';
    del.setAttribute('aria-label', 'Delete task');

    li.append(span, del);
    list.appendChild(li);
  }

  // Update the "tasks left" counter (count of not-done items)
  const remaining = todos.filter((t) => !t.done).length;
  countEl.textContent = remaining;
}

// ── addTodo: create a todo, persist, redraw ──────────────────────────────────
function addTodo(text) {
  todos.push({ id: Date.now(), text, done: false });
  save();
  render();
}

// ── Form submit (lesson 24) ──────────────────────────────────────────────────
form.addEventListener('submit', (event) => {
  event.preventDefault();             // stop the page from reloading
  const text = input.value.trim();
  if (!text) return;                  // ignore empty input
  addTodo(text);
  input.value = '';                   // clear the box for the next task
  input.focus();
});

// ── List clicks: delegation handles BOTH delete and toggle ───────────────────
// One listener on the <ul> covers every <li> — even ones added later.
list.addEventListener('click', (event) => {
  const li = event.target.closest('li');
  if (!li) return;
  const id = Number(li.dataset.id);

  if (event.target.classList.contains('delete')) {
    // Delete: keep every todo EXCEPT this one (non-mutating filter)
    todos = todos.filter((t) => t.id !== id);
  } else {
    // Toggle done: flip the matching todo's `done`
    const todo = todos.find((t) => t.id === id);
    if (todo) todo.done = !todo.done;
  }
  save();
  render();
});

// ── Filter buttons ───────────────────────────────────────────────────────────
filters.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-filter]');
  if (!btn) return;
  currentFilter = btn.dataset.filter;

  // Move the "active" highlight to the clicked button
  filters.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');

  render();
});

// ── Start ────────────────────────────────────────────────────────────────────
render();
