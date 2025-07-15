const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  roomId: String,
  board: [String],
  tracker: [String],
  winner: String,
  chat: [String], // 🗨️ Add this to store messages
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Game", gameSchema);
