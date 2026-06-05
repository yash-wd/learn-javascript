/* =============================================================================
 * 21 · ERROR HANDLING
 * =============================================================================
 * Run:  node lessons/21-error-handling.js
 *
 * WHAT YOU'LL LEARN
 *   • try / catch / finally
 *   • throw and the Error object
 *   • Custom error classes
 *   • Handling errors in async code
 *   • Global "last resort" handlers (browser & Node)
 * ========================================================================== */

// ── 1. try / catch / finally ─────────────────────────────────────────────────
try {
  console.log('trying...');
  const data = JSON.parse('{ invalid json }'); // this throws
  console.log(data); // skipped
} catch (err) {
  console.log('caught:', err.message); // => caught: ... (parse error)
} finally {
  console.log('finally always runs (cleanup, closing files, etc.)');
}


// ── 2. Throwing your own errors ──────────────────────────────────────────────
// `throw` stops the function and jumps to the nearest catch.
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

try {
  console.log(divide(10, 2)); // => 5
  console.log(divide(10, 0)); // throws
} catch (err) {
  console.log('error:', err.message); // => error: Cannot divide by zero
}
// Always throw an Error OBJECT (not a string) — it carries a message + stack.


// ── 3. The Error object & built-in error types ───────────────────────────────
const err = new Error('something broke');
console.log(err.name);    // => Error
console.log(err.message); // => something broke
// err.stack contains the file/line trace (useful when debugging/logging).

// Built-in subtypes JS throws automatically:
//   TypeError      → wrong type (e.g. null.foo)
//   ReferenceError → using an undeclared variable
//   SyntaxError    → invalid code / bad JSON
//   RangeError     → value out of range (e.g. new Array(-1))
try {
  null.foo;
} catch (e) {
  console.log(e.name); // => TypeError
}


// ── 4. Custom error classes — meaningful, catchable error types ──────────────
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field; // attach extra context
  }
}

function createUser(name) {
  if (!name) {
    throw new ValidationError('Name is required', 'name');
  }
  return { name };
}

try {
  createUser('');
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(`[${err.field}] ${err.message}`); // => [name] Name is required
  } else {
    throw err; // not ours — re-throw so it isn't silently swallowed
  }
}


// ── 5. Errors in async code ──────────────────────────────────────────────────
async function fetchThing() {
  // In async functions, use plain try/catch around awaits:
  try {
    await Promise.reject(new Error('timeout'));
  } catch (err) {
    console.log('async caught:', err.message); // => async caught: timeout
  }
}
fetchThing();

// For raw promises, use .catch():
Promise.reject(new Error('boom')).catch((e) => console.log('promise caught:', e.message));


// ── 6. Global "last resort" handlers ─────────────────────────────────────────
// try/catch handles errors you EXPECT. But something always slips through — an
// unexpected throw, a promise with no .catch(). A global handler is your safety
// net: log it (to a monitoring service — lesson 47) so you find out in prod.
//
// IN THE BROWSER:
//   window.addEventListener('error', (e) => {
//     report({ msg: e.message, file: e.filename, line: e.lineno }); // log it
//   });
//   // A promise that rejects with nobody listening fires THIS instead:
//   window.addEventListener('unhandledrejection', (e) => {
//     report({ msg: 'unhandled rejection', reason: e.reason });
//     e.preventDefault(); // stops the default console error (optional)
//   });
//
// IN NODE (this part runs):
process.on('unhandledRejection', (reason) => {
  console.log('global: unhandled rejection ->', reason?.message ?? reason);
});
process.on('uncaughtException', (err) => {
  console.log('global: uncaught exception ->', err.message);
  // A truly uncaught error left the app in an UNKNOWN state. Best practice:
  // log, then exit and let a process manager restart you cleanly:
  //   process.exit(1);
});
// Trigger the rejection handler on purpose (no .catch on this one):
Promise.reject(new Error('nobody caught me'));
// ⚠️ Global handlers are a NET, not a strategy — handle errors locally where you
// can actually recover; let the global handler only LOG the ones that escape.


/* BEST PRACTICES -------------------------------------------------------------
 *   • Throw Error objects, not strings.
 *   • Only catch errors you can meaningfully handle; re-throw the rest.
 *   • Don't leave an empty catch {} — at minimum, log it.
 *   • Use custom error classes so callers can react to specific failures.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Write parseAge(str) that throws a RangeError if the age is negative.
 *   2. Create a NotFoundError class and throw it from a lookup function.
 *   3. Wrap a JSON.parse in try/catch and return a default object on failure.
 *   4. Add a process.on('unhandledRejection', ...) and trigger it with a
 *      Promise.reject that has no .catch — confirm your handler logs it.
 * ------------------------------------------------------------------------- */
