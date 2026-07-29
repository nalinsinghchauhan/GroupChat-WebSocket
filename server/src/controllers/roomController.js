const Room = require("../models/Room");
const Message = require("../models/Message");

exports.listRooms = async (req, res) => {
  const rooms = await Room.find({ isPrivate: false }).select("name createdBy createdAt");
  res.json(rooms);
};

exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Room name is required" });

    const existing = await Room.findOne({ name });
    if (existing) return res.status(409).json({ message: "Room already exists" });

    const room = await Room.create({
      name,
      createdBy: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: "Failed to create room", error: err.message });
  }
};

exports.getRoomHistory = async (req, res) => {
  const { roomId } = req.params;
  const messages = await Message.find({ roomId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json(messages.reverse());
};
