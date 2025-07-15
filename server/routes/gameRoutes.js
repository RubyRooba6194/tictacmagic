const express = require("express");
const router = express.Router();
const { getGame, resetGame } = require("../controllers/gameController");

router.get("/:roomId", getGame);
router.post("/:roomId/reset", resetGame);

module.exports = router;
