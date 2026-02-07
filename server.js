// server.js
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    io.emit("message", msg); // envoie à tout le monde
  });
});

http.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
