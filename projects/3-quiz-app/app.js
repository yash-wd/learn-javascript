/* =============================================================================
 * QUIZ APP — STARTER
 * =============================================================================
 * Fill in the TODOs. README has the full walkthrough. Solution in solution.js.
 *
 * Lessons used: 09 Functions · 12–14 arrays/objects · 13 array methods · 23 DOM · 24 Events
 * ========================================================================== */

// ── The questions (data model) ───────────────────────────────────────────────
const QUESTIONS = [
  {
    question: 'Which keyword declares a value that cannot be reassigned?',
    options: ['var', 'let', 'const', 'static'],
    answer: 2,
  },
  {
    question: 'What does [1,2,3].map(x => x * 2) return?',
    options: ['[1,2,3]', '[2,4,6]', '6', '[1,4,9]'],
    answer: 1,
  },
  {
    question: 'typeof null returns…',
    options: ['"null"', '"undefined"', '"object"', '"none"'],
    answer: 2,
  },
  {
    question: 'Which method adds an item to the END of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    answer: 0,
  },
  {
    question: 'What keyword pauses inside an async function until a Promise settles?',
    options: ['pause', 'await', 'yield', 'stop'],
    answer: 1,
  },
];

// ── Elements ─────────────────────────────────────────────────────────────────
const quizEl = document.querySelector('#quiz');
const progressEl = document.querySelector('#progress');
const questionEl = document.querySelector('#question');
const optionsEl = document.querySelector('#options');
const nextBtn = document.querySelector('#next');
const resultsEl = document.querySelector('#results');
const scoreEl = document.querySelector('#score');
const restartBtn = document.querySelector('#restart');

// ── State ────────────────────────────────────────────────────────────────────
let current = 0; // index of the question being shown
let score = 0;

// ── Show the current question ────────────────────────────────────────────────
function renderQuestion() {
  // TODO 2:
  //   - const q = QUESTIONS[current]
  //   - progressEl: `Question ${current + 1} of ${QUESTIONS.length}`
  //   - questionEl: q.question
  //   - clear optionsEl, then for each option create a <button> with its text;
  //     give each button a way to know its index; on click → selectAnswer(index)
  //   - disable the Next button until an answer is chosen
}

// ── Handle an answer click ───────────────────────────────────────────────────
function selectAnswer(index) {
  // TODO 3:
  //   - const q = QUESTIONS[current]
  //   - get all option buttons; disable them all (no changing the answer)
  //   - add 'correct' class to the right one
  //   - if index !== q.answer → add 'wrong' to the clicked one
  //     else → score++
  //   - enable the Next button
}

// ── Next button: advance or finish ───────────────────────────────────────────
nextBtn.addEventListener('click', () => {
  // TODO 4:
  //   - current++
  //   - if current < QUESTIONS.length → renderQuestion()
  //     else → renderResults()
});

// ── Show the final results ───────────────────────────────────────────────────
function renderResults() {
  // TODO 5:
  //   - hide the quiz view, show the results view
  //   - scoreEl: `You scored ${score} / ${QUESTIONS.length}`
}

// ── Play again ───────────────────────────────────────────────────────────────
restartBtn.addEventListener('click', () => {
  // TODO 6: reset current & score, swap views back, renderQuestion()
});

// ── Start the quiz ───────────────────────────────────────────────────────────
renderQuestion();
