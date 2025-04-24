const board = document.getElementById('board');
const boardSize = 9;
let boardState = [];

function drawBoard() {
  board.innerHTML = '';
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = boardState[y][x];
      board.appendChild(cell);
    }
  }
}

function startGame() {
  boardState = [
    ['香','桂','銀','金','玉','金','銀','桂','香'],
    ['','飛','','','','','','角',''],
    ['歩','歩','歩','歩','歩','歩','歩','歩','歩'],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['歩','歩','歩','歩','歩','歩','歩','歩','歩'],
    ['','角','','','','','','飛',''],
    ['香','桂','銀','金','王','金','銀','桂','香']
  ];
  drawBoard();
}

// イベントリスナーでボタンと関数を紐付け
document.getElementById('startBtn').addEventListener('click', startGame);
