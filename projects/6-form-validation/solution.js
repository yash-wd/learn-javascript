/* =============================================================================
 * FORM VALIDATION — SOLUTION
 * =============================================================================
 * Complete, working version. Compare with your app.js after trying.
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
// Each validator returns an ERROR STRING, or '' when the value is valid.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  name(value) {
    return value.trim().length >= 2 ? '' : 'Please enter your full name.';
  },
  email(value) {
    return EMAIL_RE.test(value.trim()) ? '' : 'Enter a valid email address.';
  },
  password(value) {
    if (value.length < 8) return 'At least 8 characters.';
    if (!/\d/.test(value)) return 'Add at least one number.';
    return '';
  },
  confirm(value) {
    if (!value) return 'Please confirm your password.';
    return value === fields.password.value ? '' : 'Passwords do not match.';
  },
  age(value) {
    const n = Number(value);
    if (value.trim() === '' || Number.isNaN(n)) return 'Enter your age.';
    if (n < 13) return 'You must be at least 13.';
    if (n > 120) return 'Please enter a real age.';
    return '';
  },
};

// ── Validate ONE field: run its rule, show/clear its error, colour the input ───
function validateField(key) {
  const input = fields[key];
  const msg = validators[key](input.value);
  const errorEl = document.querySelector('#' + key + '-error');

  // only surface the error once the user has interacted with this field
  if (touched.has(key)) {
    errorEl.textContent = msg; // textContent, never innerHTML — no injection
    input.classList.toggle('invalid', msg !== '');
    input.classList.toggle('valid', msg === '' && input.value !== '');
    // a11y: tell screen readers this field is invalid (paired with the
    // aria-describedby="…-error" on the input, so the message is announced).
    input.setAttribute('aria-invalid', msg !== '' ? 'true' : 'false');
  }
  return msg === '';
}

// ── Is the WHOLE form valid? Enable/disable the button to match ───────────────
function refreshFormState() {
  const allValid = Object.keys(fields).every((key) => validateField(key));
  submitBtn.disabled = !allValid;
}

// ── Live validation: validate each field as the user types and on blur ────────
Object.keys(fields).forEach((key) => {
  fields[key].addEventListener('input', () => {
    touched.add(key);
    validateField(key);
    if (key === 'password') validateField('confirm'); // keep confirm in sync
    refreshFormState();
  });
  fields[key].addEventListener('blur', () => {
    touched.add(key);
    validateField(key);
    refreshFormState();
  });
});

// ── Submit ────────────────────────────────────────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault(); // never let the browser do a real submit here

  // mark everything touched so any remaining errors become visible
  Object.keys(fields).forEach((key) => touched.add(key));
  const allValid = Object.keys(fields).every((key) => validateField(key));

  if (!allValid) {
    refreshFormState();
    return;
  }

  successEl.classList.remove('hidden');
  form.reset();
  touched.clear();
  Object.values(fields).forEach((i) => {
    i.classList.remove('valid', 'invalid');
    i.removeAttribute('aria-invalid');
  });
  submitBtn.disabled = true;
});

// start with the button disabled until the form is valid
refreshFormState();
