// const mongoose = require("mongoose");

// const gameSchema = new mongoose.Schema({
//   roomId: String,
//   board: [String],
//   tracker: [String],
//   winner: String,
//   chat: [String], // 🗨️ Add this to store messages
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Game", gameSchema);

const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  board: { type: [String], default: Array(9).fill(null) },
  tracker: { type: [String], default: Array(9).fill(null) },
  winner: { type: String, default: null },
  chat: [
    {
      message: String,
      sender: { type: String, enum: ["user", "ai"] },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  gameHistory: [
    {
      winner: String,
      completedAt: { type: Date, default: Date.now },
      moves: Number,
    },
  ],
  currentTurn: { type: String, enum: ["X", "O"], default: "X" },
  playerSymbol: { type: String, enum: ["X", "O"], default: "X" }, // User's symbol
  aiSymbol: { type: String, enum: ["X", "O"], default: "O" }, // AI's symbol
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

gameSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Game", gameSchema);