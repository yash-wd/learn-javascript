# Project 3 — Quiz App

The capstone. No internet needed — this is all about **managing state**: showing
one question at a time, tracking the score, and reacting to user choices.

## What it does
- Shows one multiple-choice question at a time, with a progress indicator
- Click an answer → highlights correct (green) / wrong (red), then enables Next
- Tracks your score across all questions
- Shows a final results screen with your score and a "Play again" button

## Lessons you'll apply
- **14 Objects / 12 Arrays** — questions modelled as an array of objects
- **13 Array methods** — rendering options, checking answers
- **09 Functions** — small functions that each do one job
- **24 DOM / 25 Events** — rendering and handling clicks

## How to run
Open `index.html`. It loads `app.js` (starter). Switch to `solution.js` to see
the finished version.

## The data model (given to you in the starter)
```js
const QUESTIONS = [
  {
    question: 'Which keyword declares a constant?',
    options: ['var', 'let', 'const', 'static'],
    answer: 2, // index into options (const)
  },
  // ...more
];
```

## Build it step by step
0. **Shuffle (Fisher–Yates)** — build a randomized round so the quiz isn't
   memorizable: shuffle the questions, and shuffle each question's options while
   recomputing `answer` to still point at the correct one. Render from this
   `quiz` array, and reshuffle on "Play again".
1. **State** — track `current` (which question index) and `score`.
2. **renderQuestion()** — show the current question text, the progress
   ("Question 2 of 5"), and a button for each option (lesson 13 `.map`/loop).
3. **selectAnswer(index)** — compare to the correct answer:
   - mark the clicked button correct/wrong, reveal the correct one
   - update the score if right
   - disable further clicking and enable the **Next** button
4. **Next button** — advance `current`; if there are more questions,
   `renderQuestion()`, else `renderResults()`.
5. **renderResults()** — show "You scored X / N" and a Play-again button that
   resets state and starts over.

## Make it your own
- Add a **timer** per question (lesson 35 `setInterval`); auto-advance at 0.
- Save the **high score** to `localStorage` (lesson 34).
- Add categories/difficulty, or load questions from a quiz API (lesson 26).

## Concepts this cements
- **State machine thinking**: the app is always in one clear state (showing a
  question, showing feedback, or showing results). Each user action moves it to
  the next state. Naming your state and rendering from it is how all real UIs
  stay manageable as they grow.
