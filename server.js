// server.js
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const fs = require('fs');
const path = require('path');
const multer = require('multer');

app.use(express.static("public"));

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer for file uploads
const upload = multer();

// Endpoint to upload GIF (no compression, just store)
app.post('/upload-gif', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'no file' });

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.gif`;
    const filepath = path.join(uploadsDir, filename);
    
    fs.writeFileSync(filepath, req.file.buffer);
    
    const publicPath = '/uploads/' + filename;
    res.json({ path: publicPath });
  } catch (err) {
    console.error('upload-gif error', err);
    res.status(500).json({ error: 'upload failed' });
  }
});

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    io.emit("message", msg); // envoie à tout le monde
  });
});

http.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
