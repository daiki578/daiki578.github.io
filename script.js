const board = document.getElementById('board');
const boardSize = 9;

// 初期配置（簡略化された駒：歩, 金, 銀, 桂, 香, 角, 飛, 王）
const initialBoard = [
  ['香','桂','銀','金','王','金','銀','桂','香'],
  ['','飛','','','','','','角',''],
  ['歩','歩','歩','歩','歩','歩','歩','歩','歩'],
  ['','','','','','','','',''],
  ['','','','','','','','',''],
  ['','','','','','','','',''],
  ['と','と','と','と','と','と','と','と','と'], // 後手の歩（と）
  ['','馬','','','','','','龍',''],
  ['香','桂','銀','金','玉','金','銀','桂','香']
];

function drawBoard() {
  board.innerHTML = '';
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = initialBoard[y][x];
      board.appendChild(cell);
    }
  }
}

drawBoard();
