const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

// Verifies the JWT sent during the socket handshake before allowing any events
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error: no token"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // { id, username }
    next();
  } catch (err) {
    next(new Error("Authentication error: invalid token"));
  }
};

const registerSocketHandlers = (io) => {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.user.username}`);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      socket.currentRoom = roomId;
      socket.to(roomId).emit("user_joined", { username: socket.user.username });
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user_left", { username: socket.user.username });
    });

    socket.on("send_message", async ({ roomId, content }) => {
      if (!content?.trim()) return;

      try {
        const message = await Message.create({
          roomId,
          senderId: socket.user.id,
          senderUsername: socket.user.username,
          content: content.trim(),
        });

        io.to(roomId).emit("receive_message", {
          _id: message._id,
          roomId,
          senderUsername: socket.user.username,
          content: message.content,
          createdAt: message.createdAt,
        });
      } catch (err) {
        socket.emit("error_message", "Failed to send message");
      }
    });

    socket.on("typing", (roomId) => {
      socket.to(roomId).emit("typing", { username: socket.user.username });
    });

    socket.on("stop_typing", (roomId) => {
      socket.to(roomId).emit("stop_typing", { username: socket.user.username });
    });

    socket.on("disconnect", () => {
      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit("user_left", { username: socket.user.username });
      }
      console.log(`Socket disconnected: ${socket.user.username}`);
    });
  });
};

module.exports = registerSocketHandlers;
