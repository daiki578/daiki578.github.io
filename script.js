const mario = document.getElementById("mario");
const obstacle = document.getElementById("obstacle");
const gameOverText = document.getElementById("game-over");

// ジャンプ操作
document.addEventListener("keydown", () => {
  if (!mario.classList.contains("jump")) {
    mario.classList.add("jump");

    setTimeout(() => {
      mario.classList.remove("jump");
    }, 500);
  }
});

// 衝突判定（ゲーム開始後500msから判定スタート）
setTimeout(() => {
  let checkCollision = setInterval(() => {
    const marioBottom = parseInt(window.getComputedStyle(mario).getPropertyValue("bottom"));
    const obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue("right"));

    if (obstacleRight > 550 && obstacleRight < 590 && marioBottom < 40) {
      obstacle.style.animation = "none";
      gameOverText.classList.remove("hidden");
      clearInterval(checkCollision);
    }
  }, 10);
}, 500);
