import React from "react";

const WinnerBanner = ({ winner, onReset }) => {
  // Changed prop name to onReset
  if (!winner) return null;

  let message = "";
  let imageSrc = "/assets/winner-banner.png"; // Default image
  let winnerColorClass = "text-purple-700";

  if (winner === "X") {
    message = "You Win! 🎉";
    imageSrc = "/assets/winner-banner.png"; // Or a specific image for user win
    winnerColorClass = "text-blue-600";
  } else if (winner === "O") {
    message = "AI Wins! 🤖";
    imageSrc = "/assets/loser-banner.png"; // Or a specific image for AI win
    winnerColorClass = "text-red-600";
  } else if (winner === "Draw") {
    message = "It's a Draw! 🤝";
    imageSrc = "/assets/draw-banner.png"; // Or a specific image for draw
    winnerColorClass = "text-gray-700";
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center animate-bounce">
        <h2 className={`text-3xl font-bold mb-4 ${winnerColorClass}`}>
          {message}
        </h2>
        <img src={imageSrc} alt="Winner Banner" className="w-40 mx-auto mb-4" />
        <button
          onClick={onReset} // Changed function call to onReset
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinnerBanner;
