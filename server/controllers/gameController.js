// const Game = require("../models/Game");

// exports.getGame = async (req, res) => {
//   const { roomId } = req.params;
//   const game = await Game.findOne({ roomId });
//   res.json(game || {});
// };

// exports.resetGame = async (req, res) => {
//   const { roomId } = req.params;
//   await Game.findOneAndUpdate(
//     { roomId },
//     { board: Array(9).fill(null), tracker: Array(9).fill(null), winner: null },
//     { upsert: true }
//   );
//   res.json({ message: "Game reset" });
// };

const Game = require("../models/Game");

exports.getGame = async (req, res) => {
  try {
    const { roomId } = req.params;
    let game = await Game.findOne({ roomId });

    // Create new game if it doesn't exist
    if (!game) {
      game = new Game({
        roomId,
        board: Array(9).fill(null),
        tracker: Array(9).fill(null),
        winner: null,
        chat: [],
        gameHistory: [],
        currentTurn: "X",
        playerSymbol: "X",
        aiSymbol: "O",
      });
      await game.save();
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetGame = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Get current game to save history
    const currentGame = await Game.findOne({ roomId });

    let gameHistory = currentGame ? currentGame.gameHistory : [];

    // If there was a winner, add to history
    if (currentGame && currentGame.winner) {
      const moveCount = currentGame.board.filter(
        (cell) => cell !== null
      ).length;
      gameHistory.push({
        winner: currentGame.winner,
        completedAt: new Date(),
        moves: moveCount,
      });
    }

    const updatedGame = await Game.findOneAndUpdate(
      { roomId },
      {
        board: Array(9).fill(null),
        tracker: Array(9).fill(null),
        winner: null,
        currentTurn: "X",
        gameHistory: gameHistory,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Game reset", game: updatedGame });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addChatMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { message, sender } = req.body;

    const game = await Game.findOneAndUpdate(
      { roomId },
      {
        $push: {
          chat: {
            message,
            sender,
            timestamp: new Date(),
          },
        },
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Chat message added", chat: game.chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGameHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const game = await Game.findOne({ roomId });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json({
      gameHistory: game.gameHistory,
      totalGames: game.gameHistory.length,
      userWins: game.gameHistory.filter((g) => g.winner === "X").length,
      aiWins: game.gameHistory.filter((g) => g.winner === "O").length,
      draws: game.gameHistory.filter((g) => g.winner === "Draw").length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};