// export const checkWinner = (board) => {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
//   for (let [a, b, c] of lines) {
//     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//       return board[a];
//     }
//   }
//   return null;
// };


// utils/helper.js
export const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
  ];

  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  // Check for draw
  if (board.every(cell => cell !== "")) { // Changed from null to ""
    return 'Draw';
  }

  return null;
};

export const formatGameStats = (history) => {
  if (!history || !Array.isArray(history.gameHistory)) return { // Ensure it's an array
    totalGames: 0,
    userWins: 0,
    aiWins: 0,
    draws: 0,
    winRate: 0,
  };

  const totalGames = history.gameHistory.length;
  const userWins = history.gameHistory.filter(g => g.winner === 'X').length;
  const aiWins = history.gameHistory.filter(g => g.winner === 'O').length;
  const draws = history.gameHistory.filter(g => g.winner === 'Draw').length; // Ensure 'Draw' is capitalized

  return {
    totalGames,
    userWins,
    aiWins,
    draws,
    winRate: totalGames > 0 ? ((userWins / totalGames) * 100).toFixed(1) : 0
  };
};

export const getGameStatusMessage = (winner, currentTurn, isDisabled) => {
  if (winner) {
    if (winner === 'Draw') return "It's a Draw! 🤝";
    return `${winner} Wins! 🎉`;
  }

  if (currentTurn === 'X') {
    return isDisabled ? "AI is thinking... 🤔" : "Your turn (X) 🎯";
  } else {
    return "AI's turn (O) 🤖";
  }
};