const mario = document.getElementById("mario");
const obstacle = document.getElementById("obstacle");
const gameOverText = document.getElementById("game-over");

document.addEventListener("keydown", () => {
  if (!mario.classList.contains("jump")) {
    mario.classList.add("jump");

    setTimeout(() => {
      mario.classList.remove("jump");
    }, 500);
  }
});

let checkCollision = setInterval(() => {
  const marioBottom = parseInt(window.getComputedStyle(mario).getPropertyValue("bottom"));
  const obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue("right"));

  // 50px〜90pxの間でぶつかると判定
  if (obstacleRight > 550 && obstacleRight < 590 && marioBottom < 40) {
    obstacle.style.animation = "none";
    gameOverText.classList.remove("hidden");
    clearInterval(checkCollision);
  }
}, 10);
