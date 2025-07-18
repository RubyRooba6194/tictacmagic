

// // src/pages/GameRoom.jsx
// import React, { useState, useEffect, useRef } from "react";
// import Board from "../components/Board";
// import ChatBox from "../components/ChatBox";
// import WinnerBanner from "../components/WinnerBanner";
// import ErrorBoundary from "../components/ErrorBoundary";
// import useSocket from "../hooks/useSocket";
// import { getGameStatusMessage, formatGameStats } from "../utils/helper";

// // Import your sound files
// import clickSound from "../assets/click.mp3";
// import chatSound from "../assets/chat.mp3";
// import winSound from "../assets/win.mp3";
// import loseSound from "../assets/lose.mp3";
// import drawSound from "../assets/draw.mp3";

// const GameRoom = () => {
//   const [gameState, setGameState] = useState({
//     board: Array(9).fill(""),
//     currentTurn: "X",
//     winner: null,
//     gameHistory: [],
//     chat: [],
//     disabled: false,
//     playerSymbol: "X",
//     aiSymbol: "O",
//   });

//   const socket = useSocket("default");

//   // Use useRef for previous state, to access its current value without triggering re-renders
//   // and ensuring it's always up-to-date within effects.
//   const previousGameStateRef = useRef(gameState);

//   const clickAudio = useRef(new Audio(clickSound));
//   const chatAudio = useRef(new Audio(chatSound));
//   const winAudio = useRef(new Audio(winSound));
//   const loseAudioRef = useRef(new Audio(loseSound));
//   const drawAudioRef = useRef(new Audio(drawSound));

//   useEffect(() => {
//     // This effect runs on every render where gameState updates
//     // Keep previousGameStateRef updated with the latest gameState
//     previousGameStateRef.current = gameState;
//   }, [gameState]);


//   useEffect(() => {
//     // A ref to track if the component is mounted.
//     // This is the standard way to prevent "setState on unmounted component" errors.
//     const isMounted = useRef(true);

//     if (!socket) return;

//     // Define all event handlers
//     const handleGameUpdate = (data) => {
//       // Access the previous state directly from the ref within the event handler
//       const prevGameState = previousGameStateRef.current;

//       const currentBoard = data.board;
//       const prevBoard = prevGameState.board;

//       if (prevBoard && currentBoard && JSON.stringify(prevBoard) !== JSON.stringify(currentBoard)) {
//         const moveMade = prevBoard.some((cell, i) => cell === "" && currentBoard[i] !== "");
//         if (moveMade) {
//           clickAudio.current.play().catch(e => console.error("Error playing click sound:", e));
//         }
//       }

//       if (data.winner && data.winner !== prevGameState.winner) {
//         if (data.winner === prevGameState.playerSymbol) { // Use prevGameState here for comparison
//           winAudio.current.play().catch(e => console.error("Error playing win sound:", e));
//         } else if (data.winner === prevGameState.aiSymbol) { // Use prevGameState here
//           loseAudioRef.current.play().catch(e => console.error("Error playing lose sound:", e));
//         } else if (data.winner === "Draw") {
//           drawAudioRef.current.play().catch(e => console.error("Error playing draw sound:", e));
//         }
//       }

//       // Only update state if the component is still mounted
//       if (isMounted.current) {
//         setGameState((prevState) => ({
//           ...prevState,
//           board: data.board || Array(9).fill(""),
//           currentTurn: data.currentTurn || "X",
//           winner: data.winner || null,
//           disabled: data.disabled || false,
//         }));
//       }
//     };

//     const handleChatUpdate = (chatData) => {
//       const prevGameState = previousGameStateRef.current; // Get latest state
//       const prevChatLength = prevGameState.chat.length;

//       if (chatData.length > prevChatLength) {
//         const lastNewMessage = chatData[chatData.length - 1];
//         if (lastNewMessage && lastNewMessage.sender !== 'user') {
//           chatAudio.current.play().catch(e => console.error("Error playing chat sound:", e));
//         }
//       }
//       if (isMounted.current) {
//         setGameState((prevState) => ({
//           ...prevState,
//           chat: chatData || [],
//         }));
//       }
//     };

//     const handleGameHistoryUpdate = (history) => {
//       if (isMounted.current) {
//         setGameState((prevState) => ({
//           ...prevState,
//           gameHistory: history || [],
//         }));
//       }
//     };

//     const handleSocketError = (error) => {
//       console.error("Socket error:", error.message);
//       // Optionally update state to show an error message in UI
//       // if (isMounted.current) {
//       //   setGameState(prevState => ({ ...prevState, error: error.message }));
//       // }
//     };

//     // Attach listeners
//     socket.on("gameUpdate", handleGameUpdate);
//     socket.on("chatUpdate", handleChatUpdate);
//     socket.on("gameHistoryUpdate", handleGameHistoryUpdate);
//     socket.on("error", handleSocketError);

//     // --- Cleanup Function ---
//     return () => {
//       console.log('Cleaning up socket listeners for GameRoom component unmount.');
//       // Set isMounted to false when the component unmounts
//       isMounted.current = false;
//       // Remove all listeners to prevent memory leaks and setState on unmounted components
//       socket.off("gameUpdate", handleGameUpdate);
//       socket.off("chatUpdate", handleChatUpdate);
//       socket.off("gameHistoryUpdate", handleGameHistoryUpdate);
//       socket.off("error", handleSocketError);
//     };
//   }, [socket]); // Dependency array: only re-run if socket instance changes

//   const handleCellClick = (index) => {
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
//       symbol: gameState.playerSymbol,
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

//   const stats = formatGameStats({ gameHistory: gameState.gameHistory });
//   const gameStatusMessage = getGameStatusMessage(
//     gameState.winner,
//     gameState.currentTurn,
//     gameState.disabled && gameState.currentTurn === gameState.playerSymbol
//   );

//   return (
//     <ErrorBoundary>
//       <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-2xl p-8 max-w-5xl w-full">
//           {" "}
//           {/* Increased max-w-xl to max-w-5xl for more space */}
//           <h1 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent drop-shadow-lg">
//             ✨ TicTacMagic ✨
//           </h1>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
//             {" "}
//             {/* Use grid for side-by-side, increased gap */}
//             {/* Left Section: Game Board & Status */}
//             <div className="flex flex-col items-center space-y-6 lg:order-1">
//               {" "}
//               {/* lg:order-1 to keep it first on large screens */}
//               <div className="text-center">
//                 <p className="text-xl font-semibold text-gray-800 mb-2">
//                   {gameStatusMessage}
//                 </p>
//                 {stats && (
//                   <div className="text-md text-gray-600 font-medium bg-gray-50 p-2 rounded-lg inline-block shadow-sm">
//                     <span>
//                       Wins:{" "}
//                       <span className="text-green-600 font-bold">
//                         {stats.userWins}
//                       </span>
//                     </span>
//                     <span className="mx-3">|</span>
//                     <span>
//                       Losses:{" "}
//                       <span className="text-red-600 font-bold">
//                         {stats.aiWins}
//                       </span>
//                     </span>
//                     <span className="mx-3">|</span>
//                     <span>
//                       Draws:{" "}
//                       <span className="text-blue-600 font-bold">
//                         {stats.draws}
//                       </span>
//                     </span>
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
//                 className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-300"
//               >
//                 New Game
//               </button>
//             </div>
//             {/* Right Section: Chat Box */}
//             <div className="flex flex-col lg:order-2 h-full">
//               {" "}
//               {/* lg:order-2 to keep it second on large screens */}
//               <ChatBox
//                 messages={gameState.chat}
//                 sendMessage={handleSendMessage}
//                 disabled={gameState.disabled}
//               />
//             </div>
//           </div>
//           {/* Winner Banner (Overlay, adjusted positioning) */}
//           {gameState.winner && (
//             <WinnerBanner winner={gameState.winner} onReset={handleResetGame} />
//           )}
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default GameRoom;

import React, { useState, useEffect, useRef } from "react";
import Board from "../components/Board";
import ChatBox from "../components/ChatBox";
import WinnerBanner from "../components/WinnerBanner";
import ErrorBoundary from "../components/ErrorBoundary";
import useSocket from "../hooks/useSocket";
import { getGameStatusMessage, formatGameStats } from "../utils/helper";

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

  const previousGameStateRef = useRef(gameState);
  const isMounted = useRef(true); // ✅ Moved outside useEffect

  const clickAudio = useRef(new Audio(clickSound));
  const chatAudio = useRef(new Audio(chatSound));
  const winAudio = useRef(new Audio(winSound));
  const loseAudioRef = useRef(new Audio(loseSound));
  const drawAudioRef = useRef(new Audio(drawSound));

  useEffect(() => {
    previousGameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (!socket) return;

    const handleGameUpdate = (data) => {
      const prevGameState = previousGameStateRef.current;
      const currentBoard = data.board;
      const prevBoard = prevGameState.board;

      if (
        prevBoard &&
        currentBoard &&
        JSON.stringify(prevBoard) !== JSON.stringify(currentBoard)
      ) {
        const moveMade = prevBoard.some(
          (cell, i) => cell === "" && currentBoard[i] !== ""
        );
        if (moveMade) {
          clickAudio.current
            .play()
            .catch((e) => console.error("Error playing click sound:", e));
        }
      }

      if (data.winner && data.winner !== prevGameState.winner) {
        if (data.winner === prevGameState.playerSymbol) {
          winAudio.current
            .play()
            .catch((e) => console.error("Error playing win sound:", e));
        } else if (data.winner === prevGameState.aiSymbol) {
          loseAudioRef.current
            .play()
            .catch((e) => console.error("Error playing lose sound:", e));
        } else if (data.winner === "Draw") {
          drawAudioRef.current
            .play()
            .catch((e) => console.error("Error playing draw sound:", e));
        }
      }

      if (isMounted.current) {
        setGameState((prevState) => ({
          ...prevState,
          board: data.board || Array(9).fill(""),
          currentTurn: data.currentTurn || "X",
          winner: data.winner || null,
          disabled: data.disabled || false,
        }));
      }
    };

    const handleChatUpdate = (chatData) => {
      const prevGameState = previousGameStateRef.current;
      const prevChatLength = prevGameState.chat.length;

      if (chatData.length > prevChatLength) {
        const lastNewMessage = chatData[chatData.length - 1];
        if (lastNewMessage && lastNewMessage.sender !== "user") {
          chatAudio.current
            .play()
            .catch((e) => console.error("Error playing chat sound:", e));
        }
      }

      if (isMounted.current) {
        setGameState((prevState) => ({
          ...prevState,
          chat: chatData || [],
        }));
      }
    };

    const handleGameHistoryUpdate = (history) => {
      if (isMounted.current) {
        setGameState((prevState) => ({
          ...prevState,
          gameHistory: history || [],
        }));
      }
    };

    const handleSocketError = (error) => {
      console.error("Socket error:", error.message);
    };

    socket.on("gameUpdate", handleGameUpdate);
    socket.on("chatUpdate", handleChatUpdate);
    socket.on("gameHistoryUpdate", handleGameHistoryUpdate);
    socket.on("error", handleSocketError);

    return () => {
      console.log(
        "Cleaning up socket listeners for GameRoom component unmount."
      );
      isMounted.current = false;
      socket.off("gameUpdate", handleGameUpdate);
      socket.off("chatUpdate", handleChatUpdate);
      socket.off("gameHistoryUpdate", handleGameHistoryUpdate);
      socket.off("error", handleSocketError);
    };
  }, [socket]);

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
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-5xl w-full">
          <h1 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent drop-shadow-lg">
            ✨ TicTacMagic ✨
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col items-center space-y-6 lg:order-1">
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  {gameStatusMessage}
                </p>
                {stats && (
                  <div className="text-md text-gray-600 font-medium bg-gray-50 p-2 rounded-lg inline-block shadow-sm">
                    <span>
                      Wins:{" "}
                      <span className="text-green-600 font-bold">
                        {stats.userWins}
                      </span>
                    </span>
                    <span className="mx-3">|</span>
                    <span>
                      Losses:{" "}
                      <span className="text-red-600 font-bold">
                        {stats.aiWins}
                      </span>
                    </span>
                    <span className="mx-3">|</span>
                    <span>
                      Draws:{" "}
                      <span className="text-blue-600 font-bold">
                        {stats.draws}
                      </span>
                    </span>
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
            <div className="flex flex-col lg:order-2 h-full">
              <ChatBox
                messages={gameState.chat}
                sendMessage={handleSendMessage}
                disabled={gameState.disabled}
              />
            </div>
          </div>
          {gameState.winner && (
            <WinnerBanner winner={gameState.winner} onReset={handleResetGame} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default GameRoom;
