document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form-api");
  const quizContainer = document.getElementById("quiz-container");
  const timerDisplay = document.createElement("div");
  timerDisplay.id = "timer-display";
  timerDisplay.style.position = "fixed";
  timerDisplay.style.top = "10px";
  timerDisplay.style.left = "10px";
  timerDisplay.style.backgroundColor = "#f4f4f4";
  timerDisplay.style.padding = "10px";
  timerDisplay.style.border = "1px solid #ccc";
  timerDisplay.style.borderRadius = "5px";
  timerDisplay.style.zIndex = "1000";
  timerDisplay.style.display = "none";
  document.body.appendChild(timerDisplay);

  const scoreHeader = document.getElementById("score-header");

  let timer;
  let timeLeft = 30;
  let userAnswers = [];
  let currentQuestionIndex = 0;
  let questions = [];

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    scoreHeader.style.display = "none";
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    const amount = document.getElementById("trivia_amount").value;
    const category = document.querySelector("[name='trivia_category']").value;
    const difficulty = document.querySelector(
      "[name='trivia_difficulty']"
    ).value;
    const type = document.querySelector("[name='trivia_type']").value;

    let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;

    if (category !== "any") {
      apiUrl += `&category=${category}`;
    }
    if (difficulty !== "any") {
      apiUrl += `&difficulty=${difficulty}`;
    }
    if (type !== "any") {
      apiUrl += `&type=${type}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.response_code === 0) {
          questions = data.results;
          quizContainer.style.display = "block";
          displayQuiz();
        } else {
          alert("Failed to fetch questions. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  });

  function displayQuiz() {
    quizContainer.innerHTML = "";
    userAnswers = [];
    currentQuestionIndex = 0;

    questions.forEach((question, index) => {
      const questionElement = document.createElement("div");
      questionElement.className = "question";
      questionElement.innerHTML = `<h3>Question ${index + 1}: ${
        question.question
      }</h3>`;

      const answers = [...question.incorrect_answers, question.correct_answer];
      answers.sort(() => Math.random() - 0.5);

      answers.forEach((answer) => {
        const answerButton = document.createElement("button");
        answerButton.className = "answer";
        answerButton.textContent = answer;
        answerButton.addEventListener("click", function () {
          userAnswers[index] = answer;
          highlightSelectedAnswer(answerButton);
        });
        questionElement.appendChild(answerButton);
      });

      quizContainer.appendChild(questionElement);
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit Quiz";
    submitButton.className = "btn btn-lg btn-primary btn-block";
    submitButton.addEventListener("click", calculateScore);
    quizContainer.appendChild(submitButton);

    startTimer(questions.length * 10);
    timerDisplay.style.display = "block";
  }

  function highlightSelectedAnswer(selectedButton) {
    const buttons = selectedButton.parentElement.querySelectorAll(".answer");
    buttons.forEach((button) => {
      button.style.backgroundColor = "#171920";
    });

    selectedButton.style.backgroundColor = "#363C51";
  }

  function calculateScore() {
    clearInterval(timer);
    let score = 0;

    questions.forEach((question, index) => {
      const questionElement =
        quizContainer.querySelectorAll(".question")[index];
      const answerButtons = questionElement.querySelectorAll(".answer");

      answerButtons.forEach((button) => {
        if (button.textContent === question.correct_answer) {
          button.style.backgroundColor = "#28a745";
        }
      });

      if (userAnswers[index] === question.correct_answer) {
        score++;
      } else {
        answerButtons.forEach((button) => {
          if (button.textContent === userAnswers[index]) {
            button.style.backgroundColor = "#dc3545";
          }
        });
      }
    });

    scoreHeader.textContent = `Final Score: ${score}/${questions.length}`;
    scoreHeader.style.display = "block";
    timerDisplay.style.display = "none";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startTimer(time) {
    timeLeft = time;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time Left: ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        calculateScore();
      }
    }, 1000);
  }
});
