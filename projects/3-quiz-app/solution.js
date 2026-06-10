/* =============================================================================
 * QUIZ APP — SOLUTION
 * =============================================================================
 * Complete, working version. Compare with your app.js after trying.
 *
 * Lessons used: 09 Functions · 13 array methods · 15 destructuring · 23 DOM · 24 Events
 * ========================================================================== */

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

// ── Shuffle so the quiz isn't memorizable (Fisher–Yates, lesson 13/15) ───────
// Returns a NEW array in random order — we never mutate the source QUESTIONS.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]; // swap (destructuring, lesson 15)
  }
  return a;
}

// Build a fresh randomized round: questions shuffled, and each question's options
// shuffled too — with `answer` recomputed so it still points at the correct option.
function buildQuiz() {
  return shuffle(QUESTIONS).map((q) => {
    const correct = q.options[q.answer];        // remember the right TEXT first
    const options = shuffle(q.options);          // then scramble the order
    return { ...q, options, answer: options.indexOf(correct) };
  });
}

let quiz = buildQuiz(); // the active, randomized round (rebuilt on Play again)

const quizEl = document.querySelector('#quiz');
const progressEl = document.querySelector('#progress');
const questionEl = document.querySelector('#question');
const optionsEl = document.querySelector('#options');
const nextBtn = document.querySelector('#next');
const resultsEl = document.querySelector('#results');
const scoreEl = document.querySelector('#score');
const restartBtn = document.querySelector('#restart');

// ── State: the app is always defined by these two values ─────────────────────
let current = 0;
let score = 0;

// ── renderQuestion: draw the current question from state ──────────────────────
function renderQuestion() {
  const q = quiz[current];

  progressEl.textContent = `Question ${current + 1} of ${quiz.length}`;
  questionEl.textContent = q.question;

  // Build a button per option (lesson 13/23)
  optionsEl.innerHTML = '';
  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.dataset.index = index;              // remember which option this is
    btn.addEventListener('click', () => selectAnswer(index));
    optionsEl.appendChild(btn);
  });

  nextBtn.disabled = true;                  // can't advance until they answer
}

// ── selectAnswer: reveal feedback and score ──────────────────────────────────
function selectAnswer(index) {
  const q = quiz[current];
  const buttons = optionsEl.querySelectorAll('button');

  // Lock all options so the answer can't be changed
  buttons.forEach((btn) => {
    btn.disabled = true;
    const i = Number(btn.dataset.index);
    if (i === q.answer) btn.classList.add('correct');     // always show the right one
    if (i === index && index !== q.answer) btn.classList.add('wrong'); // their wrong pick
  });

  if (index === q.answer) score++;

  nextBtn.disabled = false;                 // now they can go Next
}

// ── Next: advance or show results ────────────────────────────────────────────
nextBtn.addEventListener('click', () => {
  current++;
  if (current < quiz.length) {
    renderQuestion();
  } else {
    renderResults();
  }
});

// ── renderResults: swap to the results screen ────────────────────────────────
function renderResults() {
  quizEl.classList.add('hidden');
  resultsEl.classList.remove('hidden');
  scoreEl.textContent = `You scored ${score} / ${quiz.length}`;
}

// ── Play again: reset state and restart ──────────────────────────────────────
restartBtn.addEventListener('click', () => {
  current = 0;
  score = 0;
  quiz = buildQuiz();                        // reshuffle for a fresh round
  resultsEl.classList.add('hidden');
  quizEl.classList.remove('hidden');
  renderQuestion();
});

// ── Start ────────────────────────────────────────────────────────────────────
renderQuestion();
