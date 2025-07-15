import React from "react";

const WinnerBanner = ({ winner, onReset }) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center animate-bounce">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">
          🎉 {winner} Wins! 🎉
        </h2>
        <img
          src="/assets/winner-banner.png"
          alt="Winner Banner"
          className="w-40 mx-auto mb-4"
        />
        <button
          onClick={onReset}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinnerBanner;
