// Element references
const startScreen = document.getElementById("start-screen");
const quizContainer = document.getElementById("quiz-container");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const usernameInput = document.getElementById("username");
const greeting = document.getElementById("greeting");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const finalScore = document.getElementById("final-score");
const timeDisplay = document.getElementById("time");

let currentQuestionIndex = 0;
let score = 0;
let username = "";
let timeLeft = 20;
let timer;
let quizStarted = false;

// Questions
const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "HyperText Markup Language", correct: true },
      { text: "Home Tool Markup Language", correct: false },
      { text: "Hyperlinks and Text Markup Language", correct: false },
      { text: "Hyper Tool Multi Language", correct: false },
    ],
  },
  {
    question: "Which language is used for styling web pages?",
    answers: [
      { text: "HTML", correct: false },
      { text: "CSS", correct: true },
      { text: "Python", correct: false },
      { text: "Java", correct: false },
    ],
  },
  {
    question: "Which is used for web app logic?",
    answers: [
      { text: "CSS", correct: false },
      { text: "HTML", correct: false },
      { text: "JavaScript", correct: true },
      { text: "Bootstrap", correct: false },
    ],
  },
  {
    question: "What does CSS stand for?",
    answers: [
      { text: "Creative Style Sheets", correct: false },
      { text: "Cascading Style Sheets", correct: true },
      { text: "Computer Style Sheets", correct: false },
      { text: "Colorful Style Sheets", correct: false },
    ],
  },
];

// --- Start Quiz ---
startBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (username === "") {
    alert("Please enter your name!");
    return;
  }
  startScreen.style.display = "none";
  quizContainer.style.display = "block";
  //greeting.innerText = 'Hi ${username}, lets begin!';
  quizStarted = true;
  startQuiz();
});

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    button.addEventListener("click", () => selectAnswer(button, answer));
  });

  startTimer();
}

function resetState() {
  nextBtn.style.display = "none";
  clearInterval(timer);
  timeLeft = 15;
  timeDisplay.innerText = timeLeft;
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      disableButtons();
      nextBtn.style.display = "block";
    }
  }, 1000);
}

function selectAnswer(button, answer) {
  clearInterval(timer);
  if (answer.correct) score++;

  Array.from(answerButtons.children).forEach((btn) => {
    const isCorrect = questions[currentQuestionIndex].answers.find(
      (a) => a.text === btn.innerText
    ).correct;
    btn.classList.add(isCorrect ? "correct" : "incorrect");
    btn.disabled = true;
  });

  nextBtn.style.display = "block";
}

function disableButtons() {
  Array.from(answerButtons.children).forEach((btn) => (btn.disabled = true));
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  clearInterval(timer);
  quizContainer.style.display = "none";
  resultScreen.style.display = "block";
  finalScore.innerText = '${Username}, you scored ${score} out of ${questions.length}!' ;
  quizStarted = false;
}

// Restart quiz
restartBtn.addEventListener("click", () => {
  resultScreen.style.display = "none";
  startScreen.style.display = "block";
  usernameInput.value = "";
  quizStarted = false;
});

// --- Detect tab switch or page leave ---
window.addEventListener("beforeunload", (event) => {
  if (quizStarted) {
    event.preventDefault();
    event.returnValue = "";
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && quizStarted && quizContainer.style.display === "block") {
    endQuizDueToLeaving();
  }
});

function endQuizDueToLeaving() {
  clearInterval(timer);
  quizContainer.style.display = "none";
  resultScreen.style.display = "block";
  finalScore.innerText = '${Usernames}, quiz closed because you left or switched tabs.';
  quizStarted = false;
}