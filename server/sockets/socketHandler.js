const Game = require("../models/Game");
const { getBestMove } = require("../utils/aiLogic");
const { checkWinner } = require("../utils/aiLogic"); // Import checkWinner from aiLogic

const handleSocketConnection = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinGame", async (data) => {
      try {
        const { roomId } = data;
        socket.join(roomId);

        let game = await Game.findOne({ roomId });

        if (!game) {
          game = new Game({
            roomId,
            board: Array(9).fill(""), // Consistent with empty string
            tracker: Array(9).fill(""), // Consistent with empty string
            winner: null,
            chat: [],
            gameHistory: [], // Initialize as empty array for new games
            currentTurn: "X",
            playerSymbol: "X",
            aiSymbol: "O",
          });
          await game.save();
        }

        // Ensure board is properly initialized with empty strings
        if (
          !game.board ||
          game.board.length !== 9 ||
          game.board.some((cell) => cell === null)
        ) {
          game.board = Array(9).fill("");
          game.tracker = Array(9).fill("");
          await game.save();
        }

        // Send initial game state
        socket.emit("gameUpdate", {
          board: game.board,
          currentTurn: game.currentTurn,
          winner: game.winner,
          // Disabled should be true if it's AI's turn or game is won/drawn
          disabled: game.currentTurn === game.aiSymbol || !!game.winner,
        });

        // Ensure chat messages have 'sender' as 'user' or 'ai'
        const formattedChat = game.chat.map((msg) => ({
          ...msg._doc,
          sender: msg.sender.toLowerCase(), // Ensure sender is lowercase for client
        }));
        socket.emit("chatUpdate", formattedChat);
        socket.emit("gameHistoryUpdate", game.gameHistory);

        console.log(`User joined game: ${roomId}`);
      } catch (error) {
        console.error("Error joining game:", error);
        socket.emit("error", { message: "Failed to join game" });
      }
    });

    socket.on("makeMove", async (data) => {
      try {
        const { roomId, position, symbol } = data;

        const game = await Game.findOne({ roomId });
        if (!game) {
          socket.emit("error", { message: "Game not found" });
          return;
        }

        // Validate move and turn
        if (
          game.board[position] !== "" || // Changed from null to ""
          game.winner ||
          game.currentTurn !== symbol
        ) {
          socket.emit("error", { message: "Invalid move" });
          return;
        }

        // Make player move
        game.board[position] = symbol;
        game.tracker[position] = symbol; // Keep tracker consistent
        game.currentTurn = game.aiSymbol;

        // Check for winner after player move
        let currentWinner = checkWinner(game.board);
        if (currentWinner) {
          game.winner = currentWinner;
          const moveCount = game.board.filter((cell) => cell !== "").length;
          game.gameHistory.push({
            winner: game.winner,
            completedAt: new Date(),
            moves: moveCount,
          });
        }

        await game.save();

        // Broadcast player move
        io.to(roomId).emit("gameUpdate", {
          board: game.board,
          currentTurn: game.currentTurn,
          winner: game.winner,
          disabled: true, // Disable board immediately after player move
        });

        io.to(roomId).emit("gameHistoryUpdate", game.gameHistory);

        // If game is not over, make AI move
        if (!game.winner && game.board.includes("")) {
          // Changed from null to ""
          setTimeout(async () => {
            const aiMove = getBestMove(
              game.board,
              game.aiSymbol,
              game.playerSymbol
            );
            if (aiMove !== -1) {
              game.board[aiMove] = game.aiSymbol;
              game.tracker[aiMove] = game.aiSymbol; // Keep tracker consistent
              game.currentTurn = game.playerSymbol;

              // Check for winner after AI move
              let aiWinner = checkWinner(game.board);
              if (aiWinner) {
                game.winner = aiWinner;
                const moveCount = game.board.filter(
                  (cell) => cell !== ""
                ).length;
                game.gameHistory.push({
                  winner: game.winner,
                  completedAt: new Date(),
                  moves: moveCount,
                });
              }

              await game.save();

              // Broadcast AI move
              io.to(roomId).emit("gameUpdate", {
                board: game.board,
                currentTurn: game.currentTurn,
                winner: game.winner,
                disabled: !!game.winner, // Disable if AI wins or draws
              });

              io.to(roomId).emit("gameHistoryUpdate", game.gameHistory);

              // Add AI chat response
              const aiResponse = generateAIResponse(
                game.board,
                aiMove,
                game.winner
              );
              game.chat.push({
                sender: "ai", // Consistent lowercase
                message: aiResponse,
                timestamp: new Date(),
              });
              await game.save();

              io.to(roomId).emit("chatUpdate", game.chat);
            }
          }, 1000);
        }
      } catch (error) {
        console.error("Error making move:", error);
        socket.emit("error", { message: "Failed to make move" });
      }
    });

    socket.on("resetGame", async (data) => {
      try {
        const { roomId } = data;

        const game = await Game.findOne({ roomId });
        if (!game) {
          socket.emit("error", { message: "Game not found" });
          return;
        }

        // If there was a winner/draw in the previous game, add to history before resetting
        if (game.winner) {
          const moveCount = game.board.filter((cell) => cell !== "").length;
          game.gameHistory.push({
            winner: game.winner,
            completedAt: new Date(),
            moves: moveCount,
          });
        }

        // Reset game state
        game.board = Array(9).fill(""); // Consistent empty string
        game.tracker = Array(9).fill(""); // Consistent empty string
        game.winner = null;
        game.currentTurn = "X";
        game.updatedAt = new Date();

        await game.save();

        // Broadcast reset
        io.to(roomId).emit("gameUpdate", {
          board: game.board,
          currentTurn: game.currentTurn,
          winner: game.winner,
          disabled: false,
        });

        // Add reset message to chat
        game.chat.push({
          sender: "system", // Consistent lowercase
          message: "Game reset! Let's play again!",
          timestamp: new Date(),
        });
        await game.save();

        io.to(roomId).emit("chatUpdate", game.chat);
        io.to(roomId).emit("gameHistoryUpdate", game.gameHistory); // Update history after reset

        console.log(`Game reset: ${roomId}`);
      } catch (error) {
        console.error("Error resetting game:", error);
        socket.emit("error", { message: "Failed to reset game" });
      }
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { roomId, message } = data;

        const game = await Game.findOne({ roomId });
        if (!game) {
          socket.emit("error", { message: "Game not found" });
          return;
        }

        // Add user message
        game.chat.push({
          sender: "user", // Consistent lowercase
          message,
          timestamp: new Date(),
        });

        await game.save();
        io.to(roomId).emit("chatUpdate", game.chat);

        // Generate AI response
        setTimeout(async () => {
          const aiResponse = generateChatResponse(message, game);
          game.chat.push({
            sender: "ai", // Consistent lowercase
            message: aiResponse,
            timestamp: new Date(),
          });

          await game.save();
          io.to(roomId).emit("chatUpdate", game.chat);
        }, 500);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

// Helper function to generate AI responses
const generateAIResponse = (board, move, winner) => {
  const responses = {
    opening: [
      "Nice move! Let me think...",
      "Interesting choice!",
      "I see what you're doing!",
    ],
    middle: [
      "This is getting exciting!",
      "You're good at this!",
      "Let me counter that!",
    ],
    winning: [
      "Good game! I got lucky this time.",
      "Victory is mine! Want to play again?",
      "Too easy! Just kidding, good game!",
    ],
    losing: [
      "Well played! You got me!",
      "Congratulations! You won fair and square!",
      "Darn, you're quite skilled!",
    ],
    draw: [
      "It's a tie! Great game!",
      "Nobody wins this time!",
      "A perfect stalemate!",
    ],
  };

  if (winner === "O")
    return responses.winning[
      Math.floor(Math.random() * responses.winning.length)
    ];
  if (winner === "X")
    return responses.losing[
      Math.floor(Math.random() * responses.losing.length)
    ];
  if (winner === "Draw")
    // Changed 'draw' to 'Draw' to match checkWinner output
    return responses.draw[Math.floor(Math.random() * responses.draw.length)];

  const filledCells = board.filter((cell) => cell !== "").length; // Changed from null to ""
  if (filledCells <= 3)
    return responses.opening[
      Math.floor(Math.random() * responses.opening.length)
    ];
  return responses.middle[Math.floor(Math.random() * responses.middle.length)];
};

// Helper function to generate chat responses
const generateChatResponse = (message, game) => {
  const responses = [
    "That's interesting! Let's keep playing!",
    "I enjoy our conversation! Your move!",
    "Thanks for chatting! Focus on the game now!",
    "You're fun to talk to! Let's see your next move!",
    "I'm here to play and chat! What's your strategy?",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

module.exports = handleSocketConnection;
