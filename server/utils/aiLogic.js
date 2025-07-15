const checkWinner = (board) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  // Check for draw
  if (board.every((cell) => cell !== "")) {
    // Changed from null to ""
    return "Draw";
  }

  return null;
};

const minimax = (board, depth, isMaximizing, aiSymbol, playerSymbol) => {
  const winner = checkWinner(board);

  if (winner === aiSymbol) return 10 - depth;
  if (winner === playerSymbol) return depth - 10;
  if (winner === "Draw") return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        // Changed from null to ""
        board[i] = aiSymbol;
        const score = minimax(board, depth + 1, false, aiSymbol, playerSymbol);
        board[i] = ""; // Changed from null to ""
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        // Changed from null to ""
        board[i] = playerSymbol;
        const score = minimax(board, depth + 1, true, aiSymbol, playerSymbol);
        board[i] = ""; // Changed from null to ""
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const getBestMove = (board, aiSymbol = "O", playerSymbol = "X") => {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      // Changed from null to ""
      board[i] = aiSymbol;
      const score = minimax(board, 0, false, aiSymbol, playerSymbol);
      board[i] = ""; // Changed from null to ""

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

// Alternative easier AI that makes random moves (for testing)
const getRandomMove = (board) => {
  const availableMoves = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      // Changed from null to ""
      availableMoves.push(i);
    }
  }
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

module.exports = {
  checkWinner,
  getBestMove,
  getRandomMove,
};
