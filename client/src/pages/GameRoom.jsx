// // import React, { useState, useEffect } from "react";
// // import Board from "../components/Board";
// // import ChatBox from "../components/ChatBox";
// // import WinnerBanner from "../components/WinnerBanner";
// // import ErrorBoundary from "../components/ErrorBoundary";
// // import useSocket from "../hooks/useSocket";
// // import { checkWinner } from "../utils/helper";

// // const GameRoom = () => {
// //   const roomId = "room1";
// //   const socket = useSocket(roomId);

// //   const [board, setBoard] = useState(Array(9).fill(null));
// //   const [moveTracker, setMoveTracker] = useState(Array(9).fill(null));
// //   const [messages, setMessages] = useState([]);
// //   const [isXTurn, setIsXTurn] = useState(true);
// //   const [winner, setWinner] = useState(null);

// //   const handleClick = (index) => {
// //     if (!board[index] && !winner) {
// //       const newBoard = [...board];
// //       const newTracker = [...moveTracker];
// //       const mark = isXTurn ? "X" : "O";

// //       newBoard[index] = mark;
// //       newTracker[index] = "user";

// //       setBoard(newBoard);
// //       setMoveTracker(newTracker);
// //       setIsXTurn(!isXTurn);

// //       socket.emit("playerMove", {
// //         roomId,
// //         move: newBoard,
// //         tracker: newTracker,
// //       });

// //       const result = checkWinner(newBoard);
// //       if (result) {
// //         setWinner(result);
// //         const winSound = new Audio("/assets/win.mp3");
// //         winSound.play();
// //         socket.emit("sendMessage", {
// //           roomId,
// //           message: `${result} wins the game!`,
// //         });
// //       }
// //     }
// //   };

// //   const sendMessage = (msg) => {
// //     if (msg.trim() !== "") {
// //       socket.emit("sendMessage", { roomId, message: msg });
// //       setMessages((prev) => [...prev, `You: ${msg}`]);
// //     }
// //   };

// //   const resetGame = () => {
// //     const empty = Array(9).fill(null);
// //     setBoard(empty);
// //     setMoveTracker(empty);
// //     setIsXTurn(true);
// //     setWinner(null);

// //     socket.emit("playerMove", {
// //       roomId,
// //       move: empty,
// //       tracker: empty,
// //     });
// //   };

// //   useEffect(() => {
// //     if (!socket) return;

// //     socket.on("updateGame", ({ move, tracker }) => {
// //       setBoard(move);
// //       setMoveTracker(tracker);
// //       const result = checkWinner(move);
// //       if (result) setWinner(result);
// //     });

// //     socket.on("receiveMessage", (msg) => {
// //       const chatSound = new Audio("/assets/chat.mp3");
// //       chatSound.play();
// //       setMessages((prev) => [...prev, `AI/User: ${msg}`]);
// //     });
// //   }, [socket]);

// //   return (
// //     <div className="flex flex-col items-center gap-4 py-6 relative">
// //       <div className="text-center mb-2">
// //         <h1 className="text-4xl font-extrabold text-purple-600 tracking-wide">
// //           ✨ TicTacMagic ✨
// //         </h1>
// //         <p className="text-sm text-gray-600 mt-1">
// //           Cast your moves in this enchanted grid! 🧙‍♂️ First to align three
// //           symbols wins the round.
// //         </p>
// //       </div>
// //       <h2 className="text-xl font-semibold text-gray-800">
// //         {winner ? `${winner} Wins! 🎉` : `Turn: ${isXTurn ? "X" : "O"}`}
// //       </h2>

// //       <ErrorBoundary>
// //         <Board board={board} tracker={moveTracker} onClick={handleClick} />
// //       </ErrorBoundary>

// //       <button
// //         onClick={resetGame}
// //         className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
// //       >
// //         Restart Game
// //       </button>

// //       <ChatBox messages={messages} sendMessage={sendMessage} />

// //       {winner && <WinnerBanner winner={winner} onReset={resetGame} />}
// //     </div>
// //   );
// // };

// // export default GameRoom;


// import React, { useState, useEffect } from "react";
// import Board from "../components/Board";
// import ChatBox from "../components/ChatBox";
// import WinnerBanner from "../components/WinnerBanner";
// import ErrorBoundary from "../components/ErrorBoundary";
// import useSocket from "../hooks/useSocket";
// import { getGameStatusMessage, formatGameStats } from "../utils/helper"; // Import helper functions

// const GameRoom = () => {
//   // Initialize board state with default empty array
//   const [gameState, setGameState] = useState({
//     board: Array(9).fill(""), // Default empty board consistent with ""
//     currentTurn: "X",
//     winner: null,
//     gameHistory: [], // Initialize as an empty array as per schema
//     chat: [],
//     disabled: false,
//     playerSymbol: "X", // Added for clarity, though currently fixed to X
//     aiSymbol: "O", // Added for clarity, though currently fixed to O
//   });

//   // Pass a fixed roomId 'default' to useSocket
//   const socket = useSocket("default");

//   useEffect(() => {
//     if (!socket) return;

//     // Listen for game updates
//     socket.on("gameUpdate", (data) => {
//       setGameState((prevState) => ({
//         ...prevState,
//         board: data.board || Array(9).fill(""),
//         currentTurn: data.currentTurn || "X",
//         winner: data.winner || null,
//         disabled: data.disabled || false,
//       }));
//     });

//     // Listen for chat updates
//     socket.on("chatUpdate", (chatData) => {
//       setGameState((prevState) => ({
//         ...prevState,
//         chat: chatData || [],
//       }));
//     });

//     // Listen for game history updates
//     socket.on("gameHistoryUpdate", (history) => {
//       setGameState((prevState) => ({
//         ...prevState,
//         gameHistory: history || [],
//       }));
//     });

//     // Listen for errors
//     socket.on("error", (error) => {
//       console.error("Socket error:", error.message);
//       // Optionally display error to user
//     });

//     // Initialize game on component mount
//     // The joinGame event is now handled within the useSocket hook
//     // and sends the roomId. No need to re-emit it here.

//     return () => {
//       socket.off("gameUpdate");
//       socket.off("chatUpdate");
//       socket.off("gameHistoryUpdate");
//       socket.off("error");
//     };
//   }, [socket]);

//   const handleCellClick = (index) => {
//     // Ensure it's player's turn ('X') and board is not disabled
//     if (
//       !socket ||
//       gameState.currentTurn !== gameState.playerSymbol ||
//       gameState.disabled ||
//       gameState.board[index] !== "" ||
//       gameState.winner
//     ) {
//       return;
//     }

//     socket.emit("makeMove", {
//       roomId: "default",
//       position: index,
//       symbol: gameState.playerSymbol, // Use playerSymbol for move
//     });
//   };

//   const handleSendMessage = (message) => {
//     if (!socket || !message.trim()) return;

//     socket.emit("sendMessage", {
//       roomId: "default",
//       message: message.trim(),
//     });
//   };

//   const handleResetGame = () => {
//     if (!socket) return;

//     socket.emit("resetGame", { roomId: "default" });
//   };

//   // Format game stats using the helper function
//   const stats = formatGameStats({ gameHistory: gameState.gameHistory });
//   const gameStatusMessage = getGameStatusMessage(
//     gameState.winner,
//     gameState.currentTurn,
//     gameState.disabled && gameState.currentTurn === gameState.playerSymbol
//   );

//   return (
//     <ErrorBoundary>
//       <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full">
//           <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//             TicTacMagic
//           </h1>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Game Board Section */}
//             <div className="flex flex-col items-center space-y-6">
//               <div className="text-center">
//                 <p className="text-lg text-gray-600 mb-2">
//                   {gameStatusMessage}
//                 </p>
//                 {stats && (
//                   <div className="text-sm text-gray-500">
//                     <span>Wins: {stats.userWins}</span>
//                     <span className="mx-2">|</span>
//                     <span>Losses: {stats.aiWins}</span>
//                     <span className="mx-2">|</span>
//                     <span>Draws: {stats.draws}</span>
//                   </div>
//                 )}
//               </div>

//               <Board
//                 board={gameState.board}
//                 onClick={handleCellClick}
//                 disabled={gameState.disabled}
//               />

//               <button
//                 onClick={handleResetGame}
//                 className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 New Game
//               </button>
//             </div>

//             {/* Chat Section */}
//             <div className="flex flex-col">
//               <ChatBox
//                 messages={gameState.chat}
//                 sendMessage={handleSendMessage} // Changed prop name to sendMessage
//                 disabled={gameState.disabled}
//               />
//             </div>
//           </div>

//           {/* Winner Banner */}
//           {gameState.winner && (
//             <WinnerBanner
//               winner={gameState.winner}
//               onReset={handleResetGame} // Corrected prop name to onReset
//             />
//           )}
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default GameRoom;



// src/pages/GameRoom.jsx
import React, { useState, useEffect, useRef } from "react";
import Board from "../components/Board";
import ChatBox from "../components/ChatBox";
import WinnerBanner from "../components/WinnerBanner";
import ErrorBoundary from "../components/ErrorBoundary";
import useSocket from "../hooks/useSocket";
import { getGameStatusMessage, formatGameStats } from "../utils/helper";

// Import your sound files
import clickSound from "../assets/click.mp3";
import chatSound from "../assets/chat.mp3";
import winSound from "../assets/win.mp3";
import loseSound from "../assets/lose.mp3";
import drawSound from "../assets/draw.mp3";

const GameRoom = () => {
  const [gameState, setGameState] = useState({
    board: Array(9).fill(""),
    currentTurn: "X",
    winner: null,
    gameHistory: [],
    chat: [],
    disabled: false,
    playerSymbol: "X",
    aiSymbol: "O",
  });

  const socket = useSocket("default");

  const clickAudio = useRef(new Audio(clickSound));
  const chatAudio = useRef(new Audio(chatSound));
  const winAudio = useRef(new Audio(winSound));
  const loseAudioRef = useRef(new Audio(loseSound));
  const drawAudioRef = useRef(new Audio(drawSound));

  useEffect(() => {
    if (!socket) return;

    let previousGameState = gameState;

    socket.on("gameUpdate", (data) => {
      const currentBoard = data.board;
      const prevBoard = previousGameState.board;

      if (prevBoard && currentBoard && JSON.stringify(prevBoard) !== JSON.stringify(currentBoard)) {
        const moveMade = prevBoard.some((cell, i) => cell === "" && currentBoard[i] !== "");
        if (moveMade) {
          clickAudio.current.play().catch(e => console.error("Error playing click sound:", e));
        }
      }

      if (data.winner && data.winner !== previousGameState.winner) {
        if (data.winner === gameState.playerSymbol) {
          winAudio.current.play().catch(e => console.error("Error playing win sound:", e));
        } else if (data.winner === gameState.aiSymbol) {
          loseAudioRef.current.play().catch(e => console.error("Error playing lose sound:", e));
        } else if (data.winner === "Draw") {
          drawAudioRef.current.play().catch(e => console.error("Error playing draw sound:", e));
        }
      }

      setGameState((prevState) => {
        previousGameState = prevState;
        return {
          ...prevState,
          board: data.board || Array(9).fill(""),
          currentTurn: data.currentTurn || "X",
          winner: data.winner || null,
          disabled: data.disabled || false,
        };
      });
    });

    socket.on("chatUpdate", (chatData) => {
      const prevChatLength = previousGameState.chat.length;
      if (chatData.length > prevChatLength) {
        const lastNewMessage = chatData[chatData.length - 1];
        if (lastNewMessage && lastNewMessage.sender !== 'user') {
            chatAudio.current.play().catch(e => console.error("Error playing chat sound:", e));
        }
      }

      setGameState((prevState) => {
        previousGameState = prevState;
        return {
          ...prevState,
          chat: chatData || [],
        };
      });
    });

    socket.on("gameHistoryUpdate", (history) => {
      setGameState((prevState) => {
        previousGameState = prevState;
        return {
          ...prevState,
          gameHistory: history || [],
        };
      });
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error.message);
    });

    return () => {
      socket.off("gameUpdate");
      socket.off("chatUpdate");
      socket.off("gameHistoryUpdate");
      socket.off("error");
    };
  }, [socket, gameState.playerSymbol, gameState.aiSymbol]);

  const handleCellClick = (index) => {
    if (
      !socket ||
      gameState.currentTurn !== gameState.playerSymbol ||
      gameState.disabled ||
      gameState.board[index] !== "" ||
      gameState.winner
    ) {
      return;
    }

    socket.emit("makeMove", {
      roomId: "default",
      position: index,
      symbol: gameState.playerSymbol,
    });
  };

  const handleSendMessage = (message) => {
    if (!socket || !message.trim()) return;

    socket.emit("sendMessage", {
      roomId: "default",
      message: message.trim(),
    });
  };

  const handleResetGame = () => {
    if (!socket) return;
    socket.emit("resetGame", { roomId: "default" });
  };

  const stats = formatGameStats({ gameHistory: gameState.gameHistory });
  const gameStatusMessage = getGameStatusMessage(
    gameState.winner,
    gameState.currentTurn,
    gameState.disabled && gameState.currentTurn === gameState.playerSymbol
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-5xl w-full"> {/* Increased max-w-xl to max-w-5xl for more space */}
          <h1 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent drop-shadow-lg">
            ✨ TicTacMagic ✨
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"> {/* Use grid for side-by-side, increased gap */}
            {/* Left Section: Game Board & Status */}
            <div className="flex flex-col items-center space-y-6 lg:order-1"> {/* lg:order-1 to keep it first on large screens */}
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  {gameStatusMessage}
                </p>
                {stats && (
                  <div className="text-md text-gray-600 font-medium bg-gray-50 p-2 rounded-lg inline-block shadow-sm">
                    <span>Wins: <span className="text-green-600 font-bold">{stats.userWins}</span></span>
                    <span className="mx-3">|</span>
                    <span>Losses: <span className="text-red-600 font-bold">{stats.aiWins}</span></span>
                    <span className="mx-3">|</span>
                    <span>Draws: <span className="text-blue-600 font-bold">{stats.draws}</span></span>
                  </div>
                )}
              </div>

              <Board
                board={gameState.board}
                onClick={handleCellClick}
                disabled={gameState.disabled}
              />

              <button
                onClick={handleResetGame}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                New Game
              </button>
            </div>

            {/* Right Section: Chat Box */}
            <div className="flex flex-col lg:order-2 h-full"> {/* lg:order-2 to keep it second on large screens */}
              <ChatBox
                messages={gameState.chat}
                sendMessage={handleSendMessage}
                disabled={gameState.disabled}
              />
            </div>
          </div>

          {/* Winner Banner (Overlay, adjusted positioning) */}
          {gameState.winner && (
            <WinnerBanner
              winner={gameState.winner}
              onReset={handleResetGame}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default GameRoom;