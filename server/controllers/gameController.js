const Game = require("../models/Game");

exports.getGame = async (req, res) => {
  const { roomId } = req.params;
  const game = await Game.findOne({ roomId });
  res.json(game || {});
};

exports.resetGame = async (req, res) => {
  const { roomId } = req.params;
  await Game.findOneAndUpdate(
    { roomId },
    { board: Array(9).fill(null), tracker: Array(9).fill(null), winner: null },
    { upsert: true }
  );
  res.json({ message: "Game reset" });
};
