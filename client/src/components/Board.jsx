import React from "react";

const clickSound = new Audio("/assets/click.mp3");

const handleCellClick = (index) => {
  clickSound.play();
  onClick(index);
};


const Board = ({ board, onClick }) => (
  <div className="grid grid-cols-3 gap-2 w-64">
    {board.map((cell, i) => (
      <button
        key={i}
        className="h-20 w-20 bg-white text-2xl font-bold rounded shadow hover:bg-blue-100"
        onClick={() => onClick(i)}
      >
        {cell}
      </button>
    ))}
  </div>
);

export default Board;
