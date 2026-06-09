/* =============================================================================
 * SOLUTIONS · 40 · DESIGN PATTERNS — reusable solutions with shared names
 * =============================================================================
 * Run:  node lessons/solutions/40-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/40-design-patterns.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Build a Logger module with private log history and a public add()/last(). ──
// Module pattern: a closure keeps `history` private; only add/last/size escape.
const Logger = (() => {
  const history = [];
  return {
    add(msg) {
      history.push(msg);
      return msg;
    },
    last() {
      return history.at(-1);
    },
    get size() {
      return history.length;
    },
  };
})();
Logger.add('app started');
Logger.add('user logged in');
console.log('1.', Logger.last(), '·', Logger.size); // => 1. user logged in · 2

// ── 2. Add a 'logout' event to the EventBus and subscribe two listeners. ─────
function createEventBus() {
  const handlers = {};
  return {
    on(event, fn) {
      (handlers[event] ??= []).push(fn);
    },
    emit(event, ...args) {
      (handlers[event] ?? []).forEach((fn) => fn(...args));
    },
  };
}
const bus = createEventBus();
bus.on('logout', (user) => console.log('2.', `${user}: session cleared`));
bus.on('logout', (user) => console.log('2.', `${user}: redirected to /login`));
bus.emit('logout', 'ada'); // both listeners fire

// ── 3. Add a 'discount' strategy set (none/student/senior) chosen at runtime. ──
const discounts = {
  none: (price) => price,
  student: (price) => price * 0.9,
  senior: (price) => price * 0.8,
};
function priceFor(price, kind) {
  return (discounts[kind] ?? discounts.none)(price); // pick the strategy by name
}
console.log('3.', priceFor(100, 'student'), priceFor(100, 'senior'), priceFor(100, 'vip'));
// => 3. 90 80 100   (unknown 'vip' falls back to 'none')

// ── 4. Write a withTiming(fn) DECORATOR that logs how long fn took (lesson 41). ──
function withTiming(fn) {
  return (...args) => {
    const start = Date.now();
    const result = fn(...args);
    console.log('4.', `${fn.name || 'fn'} took ${Date.now() - start}ms`);
    return result;
  };
}
const sumTo = withTiming(function sumTo(n) {
  let s = 0;
  for (let i = 0; i < n; i++) s += i;
  return s;
});
console.log('4.', 'result:', sumTo(1_000_000)); // => 4. result: 499999500000

// ── 5. Add a 'delete line' command to the History demo and test undo on it. ──
// Command pattern: each command knows how to execute AND undo itself.
function createEditor() {
  const lines = [];
  const history = [];
  return {
    run(command) {
      command.execute(lines);
      history.push(command);
    },
    undo() {
      history.pop()?.undo(lines);
    },
    get lines() {
      return [...lines];
    },
  };
}
const addLine = (text) => ({
  execute: (lines) => lines.push(text),
  undo: (lines) => lines.pop(),
});
const deleteLine = (index) => {
  let removed;
  return {
    execute: (lines) => {
      [removed] = lines.splice(index, 1); // remember what we removed
    },
    undo: (lines) => lines.splice(index, 0, removed), // put it back
  };
};
const editor = createEditor();
editor.run(addLine('first'));
editor.run(addLine('second'));
editor.run(deleteLine(0)); // removes 'first'
console.log('5.', editor.lines); // => 5. [ 'second' ]
editor.undo(); // undo the delete
console.log('5.', editor.lines); // => 5. [ 'first', 'second' ]

// ── 6. Refactor createOrderService to inject a THIRD dependency (an emailer). ──
// Dependency injection: pass collaborators in, so they're swappable & testable.
function createOrderService({ repo, payment, emailer }) {
  return {
    placeOrder(order) {
      payment.charge(order.total);
      repo.save(order);
      emailer.send(order.email, `Order ${order.id} confirmed`); // the new dependency
      return `order ${order.id} placed`;
    },
  };
}
const service = createOrderService({
  repo: { save: (o) => console.log('6.', 'saved order', o.id) },
  payment: { charge: (amount) => console.log('6.', 'charged $' + amount) },
  emailer: { send: (to, msg) => console.log('6.', `emailed ${to}: "${msg}"`) },
});
console.log('6.', service.placeOrder({ id: 'A1', total: 50, email: 'a@b.com' }));
