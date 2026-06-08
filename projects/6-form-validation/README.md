# Project 6 — Form Validation

The most common real-world JavaScript task there is. Almost every app has a form —
sign up, log in, checkout, settings — and every one needs to **validate input
before trusting it**. This project builds a signup form that checks each field
*as you type*, shows clear per-field errors, and only enables the button once
everything is valid.

## What it does
- Five fields: full name, email, password, confirm-password, and age
- Validates each field live (on input and on blur), with a helpful message under it
- Colours each field green (valid) or red (invalid)
- Keeps the **Create account** button disabled until the whole form is valid
- On submit, shows a success message and resets the form

## Lessons you'll apply
- **23 DOM** — selecting inputs and their error `<span>`s, toggling classes
- **24 Events** — `input`, `blur`, and the form's `submit` event (with `preventDefault`)
- **26 Regular Expressions** — a real email pattern, and `/\d/` for "has a number"
- **21 Error Handling** — each rule *returns* its error message, kept next to the check
- **07 Conditionals** — the validation rules themselves (`if` / ternary / early return)

## How to run
Open `index.html` in your browser. It loads `app.js` (the starter). Switch to the
finished version by changing the last line:
`<script src="app.js">` → `<script src="solution.js">`

## Build it step by step
1. **Write the rules.** Each `validators[field]` takes the value and returns an
   error string, or `''` when valid. Keeping the message *with* the check (rather
   than scattered `if`s) makes the form easy to extend.
2. **`validateField(key)`** — run the rule, write the message into `#${key}-error`
   with `textContent`, and toggle the input's `valid` / `invalid` class. Return
   whether it passed.
3. **`refreshFormState()`** — the form is valid only if **every** field passes;
   set `submitBtn.disabled` to match.
4. **Live validation** — add `input` + `blur` listeners on each field that mark it
   "touched", validate it, and refresh the button. (Re-check `confirm` whenever
   `password` changes.)
5. **Submit** — `preventDefault()`, mark all fields touched, validate everything,
   and either show the success message + reset, or let the errors appear.

## Why "touched"?
If you validated everything on load, the user would see five red "required!"
errors before typing a single character — hostile. Tracking which fields have been
**touched** means errors only appear once the user has actually interacted with a
field. This is exactly how real form libraries (Formik, React Hook Form) behave.

## Make it your own
- **A password-strength meter** — weak / medium / strong as the user types.
- **Show/hide password** toggle (a small 👁 button that flips `type` between
  `password` and `text`).
- **Async check** — pretend to check "is this email taken?" with a delayed
  Promise (lesson 19/20), showing a spinner while it runs.
- **Debounce** the email check so it doesn't fire on every keystroke (lesson 29).
- Add a **"passwords must match" live indicator** that updates as you type either box.

## Concepts this cements
- **Never trust input** — validate on the client for UX, but remember a real app
  must *also* validate on the server (a user can bypass your JS entirely — lesson 39).
- **Derive UI from state** — the button's enabled/disabled state is computed from
  the fields, never set by hand in five different places. One source of truth.
- **Keep the rule and its message together** — returning the error from the
  validator scales far better than a wall of `if`s sprinkled through the handler.
