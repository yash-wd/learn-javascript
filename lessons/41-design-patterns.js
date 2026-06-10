/* =============================================================================
 * 41 · DESIGN PATTERNS — reusable solutions with shared names
 * =============================================================================
 * Run:  node lessons/41-design-patterns.js
 *
 * WHAT YOU'LL LEARN
 *   The classic patterns every team uses — knowing their NAMES lets you
 *   communicate designs in seconds ("let's make it an Observer").
 *
 *   • Module  • Singleton  • Factory  • Observer (Pub/Sub)  • Strategy
 *   • Decorator  • Facade  • Adapter  • Command  • Dependency Injection
 *   • A note on MVC / MVVM
 *
 * A pattern is just a well-known shape of code, not a library. Use them when
 * they fit — not everywhere.
 * ========================================================================== */

// ── 1. MODULE — group related code, hide the internals ───────────────────────
// Expose a small public API; keep everything else private (via closures).
const Counter = (() => {
  let count = 0;                 // private — unreachable from outside
  return {
    increment() { count++; return count; },
    reset() { count = 0; },
    get value() { return count; },
  };
})();
Counter.increment();
Counter.increment();
console.log(Counter.value); // => 2
// (Modern ES modules — lesson 23 — are the file-level version of this.)


// ── 2. SINGLETON — exactly ONE shared instance ───────────────────────────────
// Useful for things there should only be one of: a config, a cache, a DB pool.
const Settings = (() => {
  let instance;
  function create() { return { theme: 'dark', loadedAt: 'once' }; }
  return {
    get() {
      if (!instance) instance = create(); // created lazily, only the first time
      return instance;
    },
  };
})();
console.log(Settings.get() === Settings.get()); // => true (same object every time)


// ── 3. FACTORY — a function that builds objects for you ───────────────────────
// Centralizes creation logic so callers don't use `new` or know the details.
function createUser(role) {
  const base = { role, createdAt: 'now' };
  const perks = {
    admin: { canDelete: true, canEdit: true },
    editor: { canDelete: false, canEdit: true },
    viewer: { canDelete: false, canEdit: false },
  };
  return { ...base, ...(perks[role] ?? perks.viewer) };
}
console.log(createUser('admin'));  // => { role: 'admin', createdAt: 'now', canDelete: true, canEdit: true }
console.log(createUser('viewer')); // => { ..., canDelete: false, canEdit: false }


// ── 4. OBSERVER (Pub/Sub) — broadcast events to many listeners ───────────────
// Subscribers register callbacks; the subject notifies them all on change.
// This is how event systems, state stores, and reactive UIs work under the hood.
class EventBus {
  #listeners = {};
  on(event, fn) {
    (this.#listeners[event] ??= []).push(fn);
    return () => this.off(event, fn);     // return an unsubscribe function
  }
  off(event, fn) {
    this.#listeners[event] = (this.#listeners[event] ?? []).filter((f) => f !== fn);
  }
  emit(event, data) {
    (this.#listeners[event] ?? []).forEach((fn) => fn(data));
  }
}
const bus = new EventBus();
const unsub = bus.on('login', (user) => console.log('welcome', user));
bus.emit('login', 'Ana'); // => welcome Ana
unsub();                   // stop listening
bus.emit('login', 'Bob'); // (nothing — unsubscribed)


// ── 5. STRATEGY — swap an algorithm at runtime ───────────────────────────────
// Instead of a big if/else, store interchangeable behaviors and pick one.
const shipping = {
  standard: (w) => w * 1.0,
  express:  (w) => w * 2.5 + 5,
  pickup:   () => 0,
};
function quote(method, weight) {
  const strategy = shipping[method] ?? shipping.standard;
  return strategy(weight);
}
console.log(quote('express', 2)); // => 10
console.log(quote('pickup', 99));  // => 0


// ── 6. DECORATOR — wrap something to add behavior, same interface ─────────────
// Take a function/object and return an enhanced version WITHOUT editing the
// original. (You've already met decorators: memoize and debounce wrap a fn.)
function withLogging(fn) {
  return (...args) => {
    console.log(`calling with ${JSON.stringify(args)}`);
    const result = fn(...args);
    console.log(`→ returned ${result}`);
    return result;
  };
}
const add = (a, b) => a + b;
const loudAdd = withLogging(add); // same (a, b) interface, extra behavior
loudAdd(2, 3); // logs the call + result, still returns 5


// ── 7. FACADE — a simple front over a complicated subsystem ───────────────────
// Hide several messy steps behind ONE friendly method. (jQuery, axios, and most
// SDKs are facades over fetch/XHR/etc.)
const subsystemA = { connect: () => 'A ready' };
const subsystemB = { auth: () => 'B authed' };
const subsystemC = { load: () => 'C loaded' };
const app = {
  start() {                       // callers don't need to know the 3 steps
    return [subsystemA.connect(), subsystemB.auth(), subsystemC.load()].join(' | ');
  },
};
console.log('facade:', app.start()); // => A ready | B authed | C loaded


// ── 8. ADAPTER — make an incompatible interface fit ──────────────────────────
// Wrap an object so it matches the shape YOUR code expects (e.g. integrating a
// third-party API whose field names differ from yours).
const oldApiUser = { user_name: 'ana', years_old: 30 };       // their shape
function userAdapter(raw) {                                     // → your shape
  return { name: raw.user_name, age: raw.years_old };
}
console.log('adapter:', userAdapter(oldApiUser)); // => { name: 'ana', age: 30 }


// ── 9. COMMAND — wrap an action as an object (enables undo/redo, queues) ──────
// Each command knows how to do() and undo() itself. A history stack (lesson 49)
// then gives you undo for free — this is how editors implement Ctrl+Z.
class History {
  #done = [];
  run(command) { command.execute(); this.#done.push(command); }
  undo() { this.#done.pop()?.undo(); }
}
const doc = { text: '' };
const typeCmd = (s) => ({ execute: () => (doc.text += s), undo: () => (doc.text = doc.text.slice(0, -s.length)) });
const history = new History();
history.run(typeCmd('Hello'));
history.run(typeCmd(' World'));
console.log('command:', doc.text); // => Hello World
history.undo();
console.log('after undo:', doc.text); // => Hello


// ── 10. DEPENDENCY INJECTION — pass collaborators IN, don't hard-code them ────
// Instead of a function reaching for a global, give it what it needs as an
// argument. Result: easy to swap a real logger for a fake one in tests (lesson 39).
function createOrderService(logger, payments) {  // dependencies injected here
  return {
    checkout(amount) {
      payments.charge(amount);
      logger.log(`charged ${amount}`);
    },
  };
}
const fakeLogger = { log: (m) => console.log('DI log:', m) };
const fakePayments = { charge: (n) => {} };
createOrderService(fakeLogger, fakePayments).checkout(50); // => DI log: charged 50


/* ── 11. MVC / MVVM (architectural patterns) — the big picture ────────────────
 * Bigger than the above; they organize a WHOLE app, not one object:
 *   MVC  — Model (data/rules) · View (UI) · Controller (handles input, updates
 *          the model, picks the view). Classic server frameworks use this.
 *   MVVM — Model · View · ViewModel (exposes data the View binds to). The
 *          ViewModel + data-binding is what React/Vue/Angular popularized.
 * Takeaway: separate WHAT your app knows (model) from HOW it's shown (view) so
 * each can change independently. Frameworks give you this structure for free.
 */


/* WHEN TO REACH FOR EACH ------------------------------------------------------
 *   Module ..... hide internals, expose a clean API
 *   Singleton .. one shared resource (config/cache) — use sparingly
 *   Factory .... complex/conditional object creation
 *   Observer ... "when X happens, tell everyone who cares" (events, state)
 *   Strategy ... many interchangeable algorithms behind one call
 *   Decorator .. add behavior by wrapping, keep the same interface
 *   Facade ..... one simple method over a complex subsystem
 *   Adapter .... make a foreign interface fit your code
 *   Command .... actions as objects → undo/redo, queues, logging
 *   Dep. Inject  pass collaborators in → testable, swappable code
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Build a Logger module with private log history and a public add()/last().
 *   2. Add a 'logout' event to the EventBus and subscribe two listeners.
 *   3. Add a 'discount' strategy set (none/student/senior) chosen at runtime.
 *   4. Write a withTiming(fn) DECORATOR that logs how long fn took (lesson 42).
 *   5. Add a 'delete line' command to the History demo and test undo on it.
 *   6. Refactor createOrderService to inject a THIRD dependency (an emailer).
 * ------------------------------------------------------------------------- */
