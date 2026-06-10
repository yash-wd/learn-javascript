/* =============================================================================
 * FORM VALIDATION — STARTER
 * =============================================================================
 * Fill in the TODOs. README has the full walkthrough. Solution in solution.js.
 *
 * Lessons used: 24 DOM · 25 Events · 27 Regular Expressions · 22 Error Handling · 07 Conditionals
 * ========================================================================== */

// ── Elements ─────────────────────────────────────────────────────────────────
const form = document.querySelector('#signup-form');
const submitBtn = document.querySelector('#submit');
const successEl = document.querySelector('#success');

const fields = {
  name: document.querySelector('#name'),
  email: document.querySelector('#email'),
  password: document.querySelector('#password'),
  confirm: document.querySelector('#confirm'),
  age: document.querySelector('#age'),
};

// Track which fields the user has touched, so we don't show "required" errors
// on fields they haven't reached yet.
const touched = new Set();

// ── The rules ─────────────────────────────────────────────────────────────────
// Each validator takes the field's value and returns an ERROR STRING, or '' when
// the value is valid. (Returning the message keeps the rule and its error text
// in one place — see lesson 22 on error handling.)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  name(value) {
    // TODO 1: return a message if the trimmed name is shorter than 2 chars,
    //         otherwise return '' (valid).
  },
  email(value) {
    // TODO 2: return a message unless the trimmed value matches EMAIL_RE
    //         (lesson 27 — regular expressions).
  },
  password(value) {
    // TODO 3: require at least 8 characters AND at least one digit (/\d/).
    //         Return a helpful message for whichever rule fails first.
  },
  confirm(value) {
    // TODO 4: return a message unless value equals fields.password.value
    //         (and isn't empty).
  },
  age(value) {
    // TODO 5: turn the value into a Number; require an age between 13 and 120.
  },
};

// ── Validate ONE field: run its rule, show/clear its error, colour the input ───
function validateField(key) {
  // TODO 6:
  //   - const msg = validators[key](fields[key].value)
  //   - only SHOW the error if the field has been touched (touched.has(key))
  //   - set the `${key}-error` element's textContent to msg
  //   - toggle the input's 'invalid' (msg !== '') and 'valid' (msg === '') classes
  //   - set the input's aria-invalid attribute to match (accessibility)
  //   - return whether it was valid (msg === '')
}

// ── Is the WHOLE form valid? Enable/disable the button to match ───────────────
function refreshFormState() {
  // TODO 7:
  //   - const allValid = every key in `fields` passes validateField(key)
  //   - submitBtn.disabled = !allValid
}

// ── Live validation: validate each field as the user types and on blur ────────
// TODO 8: for each key in `fields`, add 'input' and 'blur' listeners that:
//   - add the key to `touched`
//   - call validateField(key)  (also re-check 'confirm' when 'password' changes)
//   - call refreshFormState()

// ── Submit ────────────────────────────────────────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // TODO 9:
  //   - mark every field touched, then validate them all
  //   - if all valid: show successEl (remove 'hidden'), form.reset(), clear state
  //   - otherwise: re-run refreshFormState() so the errors appear
});

// start with the button disabled until the form is valid
refreshFormState();
