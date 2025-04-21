const player = document.querySelector('.player');
const gameContainer = document.querySelector('.game-container');
const startButton = document.getElementById('start-button');
const gameOverScreen = document.getElementById('game-over-screen');
const lanes = ["10%", "25%", "40%", "55%", "70%"]; // 5レーン
let currentLane = 2; // 初期位置は中央
let gameInterval = null;

function movePlayer(direction) {
  if (direction === 'left' && currentLane > 0) {
    currentLane--;
  } else if (direction === 'right' && currentLane < lanes.length - 1) {
    currentLane++;
  }
  player.style.left = lanes[currentLane];
}

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  const laneIndex = Math.floor(Math.random() * lanes.length);
  obstacle.style.left = lanes[laneIndex];
  obstacle.style.top = '0px';
  gameContainer.appendChild(obstacle);

  let obstacleTop = 0;
  const fallSpeed = 4;

  const fallInterval = setInterval(() => {
    obstacleTop += fallSpeed;
    obstacle.style.top = obstacleTop + 'px';

    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    // 衝突判定
    if (
      obstacleRect.bottom > playerRect.top &&
      obstacleRect.left < playerRect.right &&
      obstacleRect.right > playerRect.left &&
      obstacleRect.top < playerRect.bottom
    ) {
      clearInterval(fallInterval);
      gameOver();
    }

    // 画面外に出たら削除
    if (obstacleTop > window.innerHeight) {
      clearInterval(fallInterval);
      obstacle.remove();
    }
  }, 20);
}

function startGame() {
  startButton.classList.add('hidden');
  player.classList.remove('hidden');
  currentLane = 2;
  player.style.left = lanes[currentLane];
  gameInterval = setInterval(createObstacle, 1500);
}

function gameOver() {
  clearInterval(gameInterval);
  gameOverScreen.classList.remove('hidden');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') movePlayer('left');
  if (e.key === 'ArrowRight') movePlayer('right');
});

startButton.addEventListener('click', startGame);
