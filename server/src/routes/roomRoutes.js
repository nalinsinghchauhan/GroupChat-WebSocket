const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  listRooms,
  createRoom,
  getRoomHistory,
} = require("../controllers/roomController");

const router = express.Router();

router.get("/", protect, listRooms);
router.post("/", protect, createRoom);
router.get("/:roomId/messages", protect, getRoomHistory);

module.exports = router;
