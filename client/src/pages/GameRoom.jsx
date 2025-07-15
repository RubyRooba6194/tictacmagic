import React, { useState, useEffect } from "react";
import Board from "../components/Board";
import ChatBox from "../components/ChatBox";
import WinnerBanner from "../components/WinnerBanner";
import ErrorBoundary from "../components/ErrorBoundary";
import useSocket from "../hooks/useSocket";
import { checkWinner } from "../utils/helper";

const GameRoom = () => {
  const roomId = "room1";
  const socket = useSocket(roomId);

  const [board, setBoard] = useState(Array(9).fill(null));
  const [moveTracker, setMoveTracker] = useState(Array(9).fill(null));
  const [messages, setMessages] = useState([]);
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (!board[index] && !winner) {
      const newBoard = [...board];
      const newTracker = [...moveTracker];
      const mark = isXTurn ? "X" : "O";

      newBoard[index] = mark;
      newTracker[index] = "user";

      setBoard(newBoard);
      setMoveTracker(newTracker);
      setIsXTurn(!isXTurn);

      socket.emit("playerMove", {
        roomId,
        move: newBoard,
        tracker: newTracker,
      });

      const result = checkWinner(newBoard);
      if (result) {
        setWinner(result);
        const winSound = new Audio("/assets/win.mp3");
        winSound.play();
        socket.emit("sendMessage", {
          roomId,
          message: `${result} wins the game!`,
        });
      }
    }
  };

  const sendMessage = (msg) => {
    if (msg.trim() !== "") {
      socket.emit("sendMessage", { roomId, message: msg });
      setMessages((prev) => [...prev, `You: ${msg}`]);
    }
  };

  const resetGame = () => {
    const empty = Array(9).fill(null);
    setBoard(empty);
    setMoveTracker(empty);
    setIsXTurn(true);
    setWinner(null);

    socket.emit("playerMove", {
      roomId,
      move: empty,
      tracker: empty,
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("updateGame", ({ move, tracker }) => {
      setBoard(move);
      setMoveTracker(tracker);
      const result = checkWinner(move);
      if (result) setWinner(result);
    });

    socket.on("receiveMessage", (msg) => {
      const chatSound = new Audio("/assets/chat.mp3");
      chatSound.play();
      setMessages((prev) => [...prev, `AI/User: ${msg}`]);
    });
  }, [socket]);

  return (
    <div className="flex flex-col items-center gap-4 py-6 relative">
      <div className="text-center mb-2">
        <h1 className="text-4xl font-extrabold text-purple-600 tracking-wide">
          ✨ TicTacMagic ✨
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Cast your moves in this enchanted grid! 🧙‍♂️ First to align three
          symbols wins the round.
        </p>
      </div>
      <h2 className="text-xl font-semibold text-gray-800">
        {winner ? `${winner} Wins! 🎉` : `Turn: ${isXTurn ? "X" : "O"}`}
      </h2>

      <ErrorBoundary>
        <Board board={board} tracker={moveTracker} onClick={handleClick} />
      </ErrorBoundary>

      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
      >
        Restart Game
      </button>

      <ChatBox messages={messages} sendMessage={sendMessage} />

      {winner && <WinnerBanner winner={winner} onReset={resetGame} />}
    </div>
  );
};

export default GameRoom;
