// const express = require("express");
// const router = express.Router();
// const { getGame, resetGame } = require("../controllers/gameController");

// router.get("/:roomId", getGame);
// router.post("/:roomId/reset", resetGame);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getGame,
  resetGame,
  addChatMessage,
  getGameHistory,
} = require("../controllers/gameController");

router.get("/:roomId", getGame);
router.post("/:roomId/reset", resetGame);
router.post("/:roomId/chat", addChatMessage);
router.get("/:roomId/history", getGameHistory);

module.exports = router;