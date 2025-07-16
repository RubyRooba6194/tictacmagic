
// import React from "react";

// const Board = ({ board = Array(9).fill(""), onClick, disabled = false }) => {
//   // Early return if board is not properly initialized
//   if (!board || board.length !== 9) {
//     return (
//       <div className="grid grid-cols-3 gap-2 w-64 p-4 bg-gray-50 rounded-lg shadow-lg">
//         <div className="text-center col-span-3 text-gray-500">
//           Loading game board...
//         </div>
//       </div>
//     );
//   }

//   const getCellStyle = (cell, index) => {
//     let baseStyle =
//       "h-20 w-20 text-2xl font-bold rounded shadow transition-all duration-200 ";

//     if (cell === "X") {
//       baseStyle += "bg-blue-100 text-blue-600 border-2 border-blue-300";
//     } else if (cell === "O") {
//       baseStyle += "bg-red-100 text-red-600 border-2 border-red-300";
//     } else {
//       baseStyle += "bg-white hover:bg-purple-50 border-2 border-gray-200";
//     }

//     if (disabled || cell) {
//       baseStyle += " cursor-not-allowed";
//     } else {
//       baseStyle += " cursor-pointer hover:shadow-md";
//     }

//     return baseStyle;
//   };

//   const handleCellClick = (index) => {
//     if (disabled || board[index]) return;
//     onClick(index);
//   };

//   return (
//     <div className="grid grid-cols-3 gap-2 w-64 p-4 bg-gray-50 rounded-lg shadow-lg">
//       {board.map((cell, i) => (
//         <button
//           key={i}
//           className={getCellStyle(cell, i)}
//           onClick={() => handleCellClick(i)}
//           disabled={disabled || cell}
//         >
//           {cell}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default Board;


// src/components/Board.jsx (Conceptual update)
// ... (imports)

const Board = ({ board, onClick, disabled }) => {
  return (
    <div
      className="grid grid-cols-3 gap-2 bg-gray-200 p-4 rounded-lg shadow-inner" // Overall board styling
      style={{ width: '300px', height: '300px' }} // Fixed size for consistency
    >
      {board.map((cell, i) => (
        <button
          key={i}
          className={`
            w-full h-full flex items-center justify-center text-5xl font-bold rounded-md
            bg-white text-gray-800 transition-all duration-200
            ${cell === 'X' ? 'text-purple-600' : cell === 'O' ? 'text-pink-600' : 'text-gray-400'}
            ${!cell && !disabled ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed'}
            ${cell ? 'opacity-80' : ''}
          `}
          onClick={() => onClick(i)}
          disabled={disabled || !!cell} // Disable if game is over or cell is filled
        >
          {cell}
        </button>
      ))}
    </div>
  );
};

export default Board;