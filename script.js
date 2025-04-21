document.addEventListener("DOMContentLoaded", () => {
  const mario = document.getElementById("mario");
  const obstacle = document.getElementById("obstacle");
  const gameOverText = document.getElementById("game-over");
  const startButton = document.getElementById("start-button");

  let gameRunning = false;
  let collisionCheck;

  document.addEventListener("keydown", () => {
    if (gameRunning && !mario.classList.contains("jump")) {
      mario.classList.add("jump");
      setTimeout(() => {
        mario.classList.remove("jump");
      }, 500);
    }
  });

  startButton.addEventListener("click", () => {
    // ゲーム状態を初期化
    obstacle.classList.remove("move");
    void obstacle.offsetWidth; // ← アニメーションリセットのためのハック
    obstacle.classList.add("move");
    obstacle.style.right = "-40px";

    gameOverText.classList.add("hidden");
    startButton.classList.add("hidden");
    gameRunning = true;

    // 衝突判定開始
    if (collisionCheck) clearInterval(collisionCheck);
    collisionCheck = setInterval(() => {
      const marioBottom = parseInt(window.getComputedStyle(mario).getPropertyValue("bottom"));
      const obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue("right"));

      if (obstacleRight > 550 && obstacleRight < 590 && marioBottom < 40) {
        obstacle.classList.remove("move");
        gameOverText.classList.remove("hidden");
        startButton.classList.remove("hidden");
        gameRunning = false;
        clearInterval(collisionCheck);
      }
    }, 10);
  });
});
