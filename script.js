const board = document.getElementById('board');
const boardSize = 9;
let boardState = [];
let selectedPiece = null;
let selectedCoords = null;

function drawBoard() {
  board.innerHTML = '';
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = boardState[y][x];
      cell.dataset.x = x;
      cell.dataset.y = y;

      // クリックイベント
      cell.addEventListener('click', handleCellClick);

      // 駒選択時
      if (selectedCoords && selectedCoords.x === x && selectedCoords.y === y) {
        cell.classList.add('selected');
      }

      // 移動可能なマスをハイライト
      if (selectedPiece && isValidMove(selectedPiece, selectedCoords, { x, y })) {
        cell.classList.add('highlight');
      }

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

// 駒の選択
function handleCellClick(event) {
  const x = parseInt(event.target.dataset.x);
  const y = parseInt(event.target.dataset.y);
  
  // もし駒を選択している場合
  if (selectedCoords) {
    if (isValidMove(selectedPiece, selectedCoords, { x, y })) {
      // 移動処理
      boardState[y][x] = selectedPiece;
      boardState[selectedCoords.y][selectedCoords.x] = '';
      selectedCoords = null; // 移動後は選択を解除
      selectedPiece = null;
      drawBoard();
    } else {
      selectedCoords = null; // 移動不可なら選択解除
      selectedPiece = null;
      drawBoard();
    }
  } else {
    // 駒を選択
    selectedPiece = boardState[y][x];
    if (selectedPiece !== '') {
      selectedCoords = { x, y };
      drawBoard();
    }
  }
}

// 移動が有効かどうか（仮で歩だけ）
function isValidMove(piece, from, to) {
  if (piece === '歩') {
    // 簡易的な歩の移動処理（前に進む）
    if (from.x === to.x && to.y === from.y + 1) {
      return true;
    }
  }
  return false;
}

// ゲーム開始ボタンにイベントリスナー
document.getElementById('startBtn').addEventListener('click', startGame);
