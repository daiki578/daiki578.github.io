const player = document.querySelector('.player');
const gameContainer = document.querySelector('.game-container');
const lanes = ["20%", "50%", "80%"]; // 3レーン
let currentLane = 1; // 真ん中スタート

function movePlayer(direction) {
  if (direction === 'left' && currentLane > 0) {
    currentLane--;
  } else if (direction === 'right' && currentLane < lanes.length - 1) {
    currentLane++;
  }
  player.style.left = lanes[currentLane];
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') movePlayer('left');
  if (e.key === 'ArrowRight') movePlayer('right');
});

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  const laneIndex = Math.floor(Math.random() * lanes.length);
  obstacle.style.left = lanes[laneIndex];
  gameContainer.appendChild(obstacle);

  const fallInterval = setInterval(() => {
    const obstacleTop = obstacle.getBoundingClientRect().top;
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
      obstacleTop > window.innerHeight - 100 &&
      Math.abs(obstacleRect.left - playerRect.left) < 50
    ) {
      alert("ゲームオーバー！");
      location.reload();
    }

    if (obstacleTop > window.innerHeight) {
      clearInterval(fallInterval);
      obstacle.remove();
    }
  }, 50);
}

setInterval(createObstacle, 1500);
