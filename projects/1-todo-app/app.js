/* =============================================================================
 * TO-DO APP — STARTER
 * =============================================================================
 * Fill in the TODOs below. Refer to the README for step-by-step guidance.
 * Stuck? The complete version is in solution.js — but try first!
 *
 * Lessons used: 24 DOM · 25 Events · 13 Array methods · 14 Objects · 34 Storage
 * ========================================================================== */

// ── Grab the elements we'll work with (lesson 24) ────────────────────────────
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const filters = document.querySelector('#filters');
const countEl = document.querySelector('#count');

const STORAGE_KEY = 'todos';

// ── State ────────────────────────────────────────────────────────────────────
// TODO 1: Load saved todos from localStorage, or start with an empty array.
//   Each todo looks like: { id: <number>, text: <string>, done: <boolean> }
let todos = []; // ← replace with the loaded value
let currentFilter = 'all'; // 'all' | 'active' | 'done'

// ── Save to localStorage (lesson 34) ─────────────────────────────────────────
function save() {
  // TODO 7: write `todos` to localStorage as a JSON string.
}

// ── Draw the UI from state (the "render pattern") ────────────────────────────
function render() {
  // TODO 2:
  //   a) Clear the list (list.innerHTML = '').
  //   b) Decide which todos to show based on currentFilter (lesson 13 .filter).
  //   c) For each todo, create an <li> with:
  //        - a <span class="text"> showing todo.text
  //        - a <button class="delete"> showing ✕
  //        - the class "done" when todo.done is true
  //        - a data-id attribute so we know which todo it is
  //      then append it to the list.
  //   d) Update countEl with how many todos are NOT done.
}

// ── Add a new todo ───────────────────────────────────────────────────────────
function addTodo(text) {
  // TODO 3: push a new todo object onto `todos`, then save() and render().
  //   Use a unique id, e.g. Date.now().
}

// ── Form submit: add the typed task (lesson 25) ──────────────────────────────
form.addEventListener('submit', (event) => {
  // TODO 4:
  //   - prevent the page reload
  //   - read & trim the input value; ignore if empty
  //   - call addTodo(...) and clear the input
});

// ── List clicks: delete or toggle (event delegation, lesson 25) ──────────────
list.addEventListener('click', (event) => {
  // TODO 5:
  //   - find the <li> that was clicked (event.target.closest('li')) and its id
  //   - if the delete button was clicked → remove that todo from the array
  //   - otherwise (clicked the row) → toggle that todo's `done`
  //   - then save() and render()
});

// ── Filter buttons ───────────────────────────────────────────────────────────
filters.addEventListener('click', (event) => {
  // TODO 6:
  //   - only react to clicks on a button with a data-filter
  //   - set currentFilter, update which button has the "active" class, render()
});

// ── Start the app ────────────────────────────────────────────────────────────
render();
