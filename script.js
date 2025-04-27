// イベント将棋 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ゲーム状態の変数
    let board = [];
    let selectedPiece = null;
    let validMoves = [];
    let currentPlayer = 1; // 1: 先手（下側）, 2: 後手（上側）
    let turnCount = 1;
    let capturedPieces = {
        1: [], // プレイヤー1の持ち駒
        2: []  // プレイヤー2の持ち駒
    };
    
    // アクティブなイベント
    let activeEvents = {
        fog: { active: false, remainingTurns: 0, affectedPlayer: null },
        blizzard: { active: false, remainingTurns: 0 },
        sandstorm: { active: false, type: null, affectedColumns: [] }
    };
    
    // HTMLエレメント
    const boardElement = document.getElementById('shogi-board');
    const player1CapturedElement = document.getElementById('player1-captured');
    const player2CapturedElement = document.getElementById('player2-captured');
    const turnNumberElement = document.getElementById('turn-number');
    const currentPlayerElement = document.getElementById('current-player');
    const eventNameElement = document.getElementById('event-name');
    const eventDescriptionElement = document.getElementById('event-description');
    const resetButton = document.getElementById('reset-game');
    const undoButton = document.getElementById('undo-move');
    
    // 駒の種類と漢字表記
    const pieceTypes = {
        king: { player1: '玉', player2: '王' },
        rook: { player1: '飛', player2: '飛' },
        bishop: { player1: '角', player2: '角' },
        gold: { player1: '金', player2: '金' },
        silver: { player1: '銀', player2: '銀' },
        knight: { player1: '桂', player2: '桂' },
        lance: { player1: '香', player2: '香' },
        pawn: { player1: '歩', player2: '歩' },
        // 成り駒
        promotedRook: { player1: '龍', player2: '龍' },
        promotedBishop: { player1: '馬', player2: '馬' },
        promotedSilver: { player1: '全', player2: '全' },
        promotedKnight: { player1: '圭', player2: '圭' },
        promotedLance: { player1: '杏', player2: '杏' },
        promotedPawn: { player1: 'と', player2: 'と' }
    };
    
    // 駒の動き方のルール
    const moveRules = {
        king: [
            { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 0 }, { x: 1, y: 0 },
            { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
        ],
        rook: [
            { x: 0, y: -1, range: 8 }, { x: -1, y: 0, range: 8 },
            { x: 1, y: 0, range: 8 }, { x: 0, y: 1, range: 8 }
        ],
        bishop: [
            { x: -1, y: -1, range: 8 }, { x: 1, y: -1, range: 8 },
            { x: -1, y: 1, range: 8 }, { x: 1, y: 1, range: 8 }
        ],
        gold: [
            { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }
        ],
        silver: [
            { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 1 }, { x: 1, y: 1 }
        ],
        knight: [
            { x: -1, y: -2 }, { x: 1, y: -2 }
        ],
        lance: [
            { x: 0, y: -1, range: 8 }
        ],
        pawn: [
            { x: 0, y: -1 }
        ],
        promotedRook: [
            { x: 0, y: -1, range: 8 }, { x: -1, y: 0, range: 8 },
            { x: 1, y: 0, range: 8 }, { x: 0, y: 1, range: 8 },
            { x: -1, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 1 }, { x: 1, y: 1 }
        ],
        promotedBishop: [
            { x: -1, y: -1, range: 8 }, { x: 1, y: -1, range: 8 },
            { x: -1, y: 1, range: 8 }, { x: 1, y: 1, range: 8 },
            { x: 0, y: -1 }, { x: -1, y: 0 },
            { x: 1, y: 0 }, { x: 0, y: 1 }
        ],
        promotedSilver: [
            { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }
        ],
        promotedKnight: [
            { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }
        ],
        promotedLance: [
            { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }
        ],
        promotedPawn: [
            { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }
        ]
    };
    
    // ゲームの初期化
    function initGame() {
        createBoard();
        setupInitialPieces();
        updateBoardUI();
        updateTurnDisplay();
        
        // イベントリスナーの設定
        resetButton.addEventListener('click', resetGame);
        undoButton.addEventListener('click', undoMove);
    }
    
    // 将棋盤の作成
    function createBoard() {
        boardElement.innerHTML = '';
        board = [];
        
        for (let y = 0; y < 9; y++) {
            const row = [];
            for (let x = 0; x < 9; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.addEventListener('click', () => handleCellClick(x, y));
                boardElement.appendChild(cell);
                row.push({
                    x: x,
                    y: y,
                    piece: null
                });
            }
            board.push(row);
        }
    }
    
    // 初期配置の設定
    function setupInitialPieces() {
        // プレイヤー2の駒（上側）
        board[0][0].piece = { type: 'lance', player: 2, promoted: false };
        board[0][1].piece = { type: 'knight', player: 2, promoted: false };
        board[0][2].piece = { type: 'silver', player: 2, promoted: false };
        board[0][3].piece = { type: 'gold', player: 2, promoted: false };
        board[0][4].piece = { type: 'king', player: 2, promoted: false };
        board[0][5].piece = { type: 'gold', player: 2, promoted: false };
        board[0][6].piece = { type: 'silver', player: 2, promoted: false };
        board[0][7].piece = { type: 'knight', player: 2, promoted: false };
        board[0][8].piece = { type: 'lance', player: 2, promoted: false };
        board[1][1].piece = { type: 'rook', player: 2, promoted: false };
        board[1][7].piece = { type: 'bishop', player: 2, promoted: false };
        for (let x = 0; x < 9; x++) {
            board[2][x].piece = { type: 'pawn', player: 2, promoted: false };
        }
        
        // プレイヤー1の駒（下側）
        board[8][0].piece = { type: 'lance', player: 1, promoted: false };
        board[8][1].piece = { type: 'knight', player: 1, promoted: false };
        board[8][2].piece = { type: 'silver', player: 1, promoted: false };
        board[8][3].piece = { type: 'gold', player: 1, promoted: false };
        board[8][4].piece = { type: 'king', player: 1, promoted: false };
        board[8][5].piece = { type: 'gold', player: 1, promoted: false };
        board[8][6].piece = { type: 'silver', player: 1, promoted: false };
        board[8][7].piece = { type: 'knight', player: 1, promoted: false };
        board[8][8].piece = { type: 'lance', player: 1, promoted: false };
        board[7][1].piece = { type: 'bishop', player: 1, promoted: false };
        board[7][7].piece = { type: 'rook', player: 1, promoted: false };
        for (let x = 0; x < 9; x++) {
            board[6][x].piece = { type: 'pawn', player: 1, promoted: false };
        }
    }
    
    // 盤面の更新
    function updateBoardUI() {
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = boardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                cell.innerHTML = '';
                cell.classList.remove('selected', 'valid-move', 'fog-effect', 'blizzard-effect', 'sandstorm-effect');
                
                // 砂嵐効果の適用
                if (activeEvents.sandstorm.active && activeEvents.sandstorm.affectedColumns.includes(x)) {
                    cell.classList.add('sandstorm-effect');
                }
                
                const pieceData = board[y][x].piece;
                if (pieceData) {
                    // 駒の表示
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece player${pieceData.player}-piece`;
                    
                    let pieceType = pieceData.type;
                    if (pieceData.promoted) {
                        pieceType = 'promoted' + pieceType.charAt(0).toUpperCase() + pieceType.slice(1);
                    }
                    
                    pieceElement.textContent = pieceTypes[pieceType][`player${pieceData.player}`];
                    cell.appendChild(pieceElement);
                    
                    // 吹雪効果の適用
                    if (activeEvents.blizzard.active) {
                        cell.classList.add('blizzard-effect');
                    }
                }
                
                // 選択状態とマスの色の更新
                if (selectedPiece && selectedPiece.x === x && selectedPiece.y === y) {
                    cell.classList.add('selected');
                }
                
                if (validMoves.some(move => move.x === x && move.y === y)) {
                    cell.classList.add('valid-move');
                }
                
                // 霧効果の適用
                if (activeEvents.fog.active && activeEvents.fog.affectedPlayer === currentPlayer) {
                    const kingPosition = findKing(currentPlayer);
                    const distance = Math.max(Math.abs(x - kingPosition.x), Math.abs(y - kingPosition.y));
                    
                    if (distance > 1) {
                        cell.classList.add('fog-effect');
                    }
                }
            }
        }
        
        // 持ち駒の更新
        updateCapturedPieces();
    }
    
    // 持ち駒の表示更新
    function updateCapturedPieces() {
        player1CapturedElement.innerHTML = '';
        player2CapturedElement.innerHTML = '';
        
        for (const piece of capturedPieces[1]) {
            const capturedPiece = document.createElement('div');
            capturedPiece.className = 'captured-piece';
            capturedPiece.textContent = pieceTypes[piece.type][`player${piece.originalPlayer}`];
            capturedPiece.addEventListener('click', () => handleCapturedPieceClick(piece, 1));
            player1CapturedElement.appendChild(capturedPiece);
        }
        
        for (const piece of capturedPieces[2]) {
            const capturedPiece = document.createElement('div');
            capturedPiece.className = 'captured-piece';
            capturedPiece.textContent = pieceTypes[piece.type][`player${piece.originalPlayer}`];
            capturedPiece.addEventListener('click', () => handleCapturedPieceClick(piece, 2));
            player2CapturedElement.appendChild(capturedPiece);
        }
    }
    
    // セルのクリックハンドラ
    function handleCellClick(x, y) {
        const clickedCell = board[y][x];
        
        // 既に駒を選択していて、有効な移動先をクリックした場合
        if (selectedPiece && validMoves.some(move => move.x === x && move.y === y)) {
            movePiece(selectedPiece, { x, y });
            selectedPiece = null;
            validMoves = [];
            endTurn();
            return;
        }
        
        // 選択解除
        if (selectedPiece && selectedPiece.x === x && selectedPiece.y === y) {
            selectedPiece = null;
            validMoves = [];
            updateBoardUI();
            return;
        }
        
        // 新しい駒を選択
        if (clickedCell.piece && clickedCell.piece.player === currentPlayer) {
            selectedPiece = { x, y, ...clickedCell.piece };
            validMoves = calculateValidMoves(selectedPiece);
            updateBoardUI();
        }
    }
    
    // 持ち駒クリックハンドラ
    function handleCapturedPieceClick(piece, player) {
        if (player !== currentPlayer) return;
        
        // 配置可能なマスを計算
        validMoves = calculateDropPositions(piece.type);
        selectedPiece = { captured: true, ...piece };
        updateBoardUI();
    }
    
    // 駒の移動
    function movePiece(piece, destination) {
        const destCell = board[destination.y][destination.x];
        
        // 移動先に相手の駒があれば持ち駒にする
        if (destCell.piece) {
            const capturedPiece = { 
                type: destCell.piece.type,
                player: currentPlayer,
                originalPlayer: destCell.piece.player,
                promoted: false
            };
            
            // 成り駒は元に戻す
            if (destCell.piece.promoted) {
                capturedPiece.type = destCell.piece.type.replace('promoted', '').toLowerCase();
            }
            
            capturedPieces[currentPlayer].push(capturedPiece);
        }
        
        if (piece.captured) {
            // 持ち駒を盤面に配置
            destCell.piece = {
                type: piece.type,
                player: currentPlayer,
                promoted: false
            };
            
            // 持ち駒リストから削除
            const index = capturedPieces[currentPlayer].findIndex(p => p === piece);
            if (index !== -1) {
                capturedPieces[currentPlayer].splice(index, 1);
            }
        } else {
            // 盤上の駒を移動
            destCell.piece = {
                type: piece.type,
                player: piece.player,
                promoted: piece.promoted
            };
            
            // 元の位置から駒を削除
            board[piece.y][piece.x].piece = null;
            
            // 成りの確認
            checkPromotion(destCell.piece, destination);
        }
    }
    
    // 駒が成れるかチェック
    function checkPromotion(piece, position) {
        const { y } = position;
        const promotionZone = piece.player === 1 ? y <= 2 : y >= 6;
        
        if (promotionZone && ['pawn', 'lance', 'knight', 'silver', 'rook', 'bishop'].includes(piece.type) && !piece.promoted) {
            // 自動的に成る条件（歩、香車、桂馬が進めなくなる場合）
            const mustPromote = (
                (piece.type === 'pawn' && (piece.player === 1 ? y === 0 : y === 8)) ||
                (piece.type === 'lance' && (piece.player === 1 ? y === 0 : y === 8)) ||
                (piece.type === 'knight' && (piece.player === 1 ? y <= 1 : y >= 7))
            );
            
            if (mustPromote) {
                piece.promoted = true;
            } else {
                // 通常は選択肢として提供（今回は簡略化のため自動成りにする）
                if (confirm('駒を成りますか？')) {
                    piece.promoted = true;
                }
            }
        }
    }
    
    // 有効な移動先を計算
    function calculateValidMoves(piece) {
        const moves = [];
        
        if (piece.captured) {
            // 持ち駒の場合は空いているマスすべてが配置可能（二歩制限などは省略）
            for (let y = 0; y < 9; y++) {
                for (let x = 0; x < 9; x++) {
                    if (!board[y][x].piece) {
                        // 歩、香車、桂馬の配置制限
                        if (
                            (piece.type === 'pawn' && (piece.player === 1 ? y === 0 : y === 8)) ||
                            (piece.type === 'lance' && (piece.player === 1 ? y === 0 : y === 8)) ||
                            (piece.type === 'knight' && (piece.player === 1 ? y <= 1 : y >= 7))
                        ) {
                            continue;
                        }
                        moves.push({ x, y });
                    }
                }
            }
            return moves;
        }
        
        let pieceType = piece.type;
        if (piece.promoted) {
            pieceType = 'promoted' + pieceType.charAt(0).toUpperCase() + pieceType.slice(1);
        }
        
        let movementRules = moveRules[pieceType];
        
        // 吹雪効果がある場合、移動範囲を制限
        const maxRange = activeEvents.blizzard.active ? 1 : undefined;
        
        for (const rule of movementRules) {
            const range = rule.range ? (maxRange || rule.range) : 1;
            let dx = rule.x;
            let dy = rule.y;
            
            // プレイヤー2（上側）の場合は方向を反転
            if (piece.player === 2) {
                dy = -dy;
            }
            
            for (let i = 1; i <= range; i++) {
                const newX = piece.x + (dx * i);
                const newY = piece.y + (dy * i);
                
                // 盤外チェック
                if (newX < 0 || newX >= 9 || newY < 0 || newY >= 9) {
                    break;
                }
                
                const targetCell = board[newY][newX];
                
                if (!targetCell.piece) {
                    // 空きマス
                    moves.push({ x: newX, y: newY });
                } else if (targetCell.piece.player !== piece.player) {
                    // 相手の駒
                    moves.push({ x: newX, y: newY });
                    break;
                } else {
                    // 自分の駒
                    break;
                }
            }
        }
        
        return moves;
    }
    
    // 持ち駒の配置可能位置を計算
    function calculateDropPositions(pieceType) {
        const positions = [];
        
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (!board[y][x].piece) {
                    // 歩、香車、桂馬の配置制限
                    if (
                        (pieceType === 'pawn' && (currentPlayer === 1 ? y === 0 : y === 8)) ||
                        (pieceType === 'lance' && (currentPlayer === 1 ? y === 0 : y === 8)) ||
                        (pieceType === 'knight' && (currentPlayer === 1 ? y <= 1 : y >= 7))
                    ) {
                        continue;
                    }
                    
                    // 二歩のチェック（簡略化のため省略）
                    
                    positions.push({ x, y });
                }
            }
        }
        
        return positions;
    }
    
    // 王の位置を探す
    function findKing(player) {
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = board[y][x].piece;
                if (piece && piece.type === 'king' && piece.player === player) {
                    return { x, y };
                }
            }
        }
        return null;
    }
    
    // ターン終了処理
    function endTurn() {
        // イベント効果の減少
        updateEventEffects();
        
        // プレイヤーの切り替え
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        turnCount++;
        
        // 3ターンごとにイベント発生
        if (turnCount % 3 === 0) {
            triggerRandomEvent();
        }
        
        updateTurnDisplay();
        updateBoardUI();
    }
    
    // イベント効果の更新
    function updateEventEffects() {
        // 霧効果
        if (activeEvents.fog.active) {
            activeEvents.fog.remainingTurns--;
            if (activeEvents.fog.remainingTurns <= 0) {
                activeEvents.fog.active = false;
                updateEventDisplay('霧が晴れました', '通常の視界に戻りました');
            }
        }
        
        // 吹雪効果
        if (activeEvents.blizzard.active) {
            activeEvents.blizzard.remainingTurns--;
            if (activeEvents.blizzard.remainingTurns <= 0) {
                activeEvents.blizzard.active = false;
                updateEventDisplay('吹雪が止みました', 'コマが通常通り動けるようになりました');
            }
        }
        
        // 砂嵐効果は1ターンのみなので、毎ターン終了時にリセット
        if (activeEvents.sandstorm.active) {
            activeEvents.sandstorm.active = false;
            activeEvents.sandstorm.affectedColumns = [];
        }
    }
    
    // ランダムイベントの発生
    function triggerRandomEvent() {
        const events = ['fog', 'smallSandstorm', 'mediumSandstorm', 'largeSandstorm', 'blizzard'];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        
        switch (randomEvent) {
            case 'fog':
                // 霧イベント
                activeEvents.fog.active = true;
                activeEvents.fog.remainingTurns = 3;
                activeEvents.fog.affectedPlayer = currentPlayer;
                updateEventDisplay('霧発生', '自分のコマの周囲一コマしか見えません（3ターン）');
                break;
                
            case 'smallSandstorm':
                // 砂嵐（小）
                triggerSandstorm(1, '砂嵐(小)');
                break;
            
            case 'mediumSandstorm':
                // 砂嵐（中）
                triggerSandstorm(2, '砂嵐(中)');
                break;
                
            case 'largeSandstorm':
                // 砂嵐（大）
                triggerSandstorm(3, '砂嵐(大)');
                break;
                
            case 'blizzard':
                // 吹雪
                activeEvents.blizzard.active = true;
                activeEvents.blizzard.remainingTurns = 3;
                updateEventDisplay('吹雪発生', 'コマが周囲一コマまでしか動けません（3ターン）');
                break;
        }
    }
    
    // 砂嵐イベントの処理
    function triggerSandstorm(size, name) {
        activeEvents.sandstorm.active = true;
        activeEvents.sandstorm.type = name;
        
        const king1Pos = findKing(1);
        const king2Pos = findKing(2);
        const kingColumns = [king1Pos.x, king2Pos.x];
        
        // 王のいる列を除いた有効な列を取得
        const validColumns = Array.from({ length: 9 }, (_, i) => i).filter(col => !kingColumns.includes(col));
        
        if (validColumns.length < size) {
            // 有効な列が足りない場合は何もしない
            updateEventDisplay('砂嵐失敗', '砂嵐を発生させる場所がありません');
            return;
        }
        
        // ランダムに開始列を選択
        const startIndex = Math.floor(Math.random() * (validColumns.length - size + 1));
        const affectedColumns = validColumns.slice(startIndex, startIndex + size);
        
        activeEvents.sandstorm.affectedColumns = affectedColumns;
        
        // 砂嵐の影響を受けたコマを相手の持ち駒にする
        for (const col of affectedColumns) {
            for (let y = 0; y < 9; y++) {
                const piece = board[y][col].piece;
                if (piece) {
                    const capturedPiece = {
                        type: piece.type,
                        player: piece.player === 1 ? 2 : 1,
                        originalPlayer: piece.player,
                        promoted: false
                    };
                    
                    // 成り駒は元に戻す
                    if (piece.promoted) {
                        capturedPiece.type = piece.type.replace('promoted', '').toLowerCase();
                    }
                    
                    capturedPieces[piece.player === 1 ? 2 : 1].push(capturedPiece);
                    board[y][col].piece = null;
                }
            }
        }
        
        updateEventDisplay(name + '発生', `${affectedColumns.map(col => col + 1).join(',')}列目のコマが相手の持ち駒になりました`);
    }
    
    // ターン表示の更新
    function updateTurnDisplay() {
        turnNumberElement.textContent = turnCount;
        currentPlayerElement.textContent = currentPlayer;
    }
    
    // イベント表示の更新
    function updateEventDisplay(name, description) {
        eventNameElement.textContent = name;
        eventDescriptionElement.textContent = description;
    }
    
    // ゲームのリセット
    function resetGame() {
        selectedPiece = null;
        validMoves = [];
        currentPlayer = 1;
        turnCount = 1;
        capturedPieces = { 1: [], 2: [] };
        activeEvents = {
            fog: { active: false, remainingTurns: 0, affectedPlayer: null },
            blizzard: { active: false, remainingTurns: 0 },
            sandstorm: { active: false, type: null, affectedColumns: [] }
        };
        
        setupInitialPieces();
        updateBoardUI();
        updateTurnDisplay();
        updateEventDisplay('ゲーム開始', '3ターンごとにランダムイベントが発生します');
    }
    
    // 一手戻る機能（簡略化のため実装省略）
    function undoMove() {
       alert('この機能は実装されていません');
    }
    
    // 勝利条件のチェック（簡略化のため実装省略）
    function checkVictory() {
        // 王が取られているか確認
        const king1 = findKing(1);
        const king2 = findKing(2);
        
        if (!king1) {
            alert('プレイヤー2の勝利！');
            return true;
        }
        
        if (!king2) {
            alert('プレイヤー1の勝利！');
            return true;
        }
        
        return false;
    }
    
    // 初期化
    initGame();
});
