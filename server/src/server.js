require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const registerSocketHandlers = require("./sockets/socketHandler");
const getAllowedOrigins = require("./config/origins");

const PORT = process.env.PORT || 5000;
const allowedOrigins = getAllowedOrigins();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: allowedOrigins },
});

registerSocketHandlers(io);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
