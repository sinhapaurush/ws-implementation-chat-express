import express from "express";
import { Server } from "socket.io";
import http from "http";

const PORT = 3000;

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
let userCounter = 1;
// type Message = {
//   name?: string;
//   message: string;
//   fromSelf: boolean;
// };

io.on("connection", (socket) => {
  console.log(`${socket.id} Connected`);
  const thisUserId = userCounter;
  socket.broadcast.emit("message", {
    name: ``,
    message: `User ${thisUserId} Joined`,
    fromSelf: false,
    center: true,
  });
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", {
      name: `user ${thisUserId}`,
      message: msg.message,
      fromSelf: false,
    });
    console.log("SENT MESSAGE", msg);
  });
  userCounter++;
  socket.on("disconnect", () => {
    console.log(`${socket.id} Disconnected`);
  });
});

httpServer.listen(PORT, () => {
  console.log("Server is Running");
  console.log(`http://localhost:${PORT}`);
});
