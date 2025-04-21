let score = 0;
let timeLeft = 10;
let timer;

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const clickButton = document.getElementById("clickButton");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

clickButton.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = score;
});

startButton.addEventListener("click", () => {
  score = 0;
  timeLeft = 10;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  clickButton.disabled = false;
  startButton.disabled = true;
  restartButton.style.display = "none";

  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      clickButton.disabled = true;
      restartButton.style.display = "inline-block";
    }
  }, 1000);
});

restartButton.addEventListener("click", () => {
  startButton.disabled = false;
  restartButton.style.display = "none";
  scoreDisplay.textContent = "0";
  timeDisplay.textContent = "10";
});
