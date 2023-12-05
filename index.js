const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Server on Port ${PORT}`));

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let socketsconected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  socketsconected.add(socket.id);
  io.emit("clients-total", socketsconected.size);

  socket.on("disconnect", () => {
    socketsconected.delete(socket.id);
    io.emit("clients-total", socketsconected.size);
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
