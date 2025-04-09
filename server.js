const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);

// --- Allow frontend (update with your deployed frontend URL) ---
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://your-frontend-on-render.com"],
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Optional for serving static assets if needed

// --- Store users per socket ---
const onlineUsers = {}; // { socket.id: { username, room } }

io.on("connection", (socket) => {
  console.log(`✅ A user connected: ${socket.id}`);

  socket.on("userJoined", ({ username, room }) => {
    socket.username = username;
    socket.room = room;
    socket.join(room);

    onlineUsers[socket.id] = { username, room };

    updateUsersInRoom(room);
    console.log(`👤 ${username} joined room: ${room}`);
  });

  socket.on("joinRoom", (newRoom) => {
    const { username, room: oldRoom } = onlineUsers[socket.id] || {};
    if (oldRoom) socket.leave(oldRoom);
    socket.join(newRoom);
    socket.room = newRoom;

    if (username) {
      onlineUsers[socket.id] = { username, room: newRoom };
      updateUsersInRoom(newRoom);
      updateUsersInRoom(oldRoom);
    }
  });

  socket.on("sendMessage", ({ username, message, room, fileUrl }) => {
    io.to(room).emit("receiveMessage", { username, message, room, fileUrl });
  });

  socket.on("typing", ({ username, room }) => {
    socket.to(room).emit("userTyping", username);
  });

  socket.on("disconnect", () => {
    const { username, room } = onlineUsers[socket.id] || {};
    delete onlineUsers[socket.id];
    updateUsersInRoom(room);
    console.log(`❌ ${username} disconnected`);
  });

  function updateUsersInRoom(room) {
    const usersInRoom = Object.values(onlineUsers)
      .filter((user) => user.room === room)
      .map((user) => user.username);

    io.to(room).emit("updateUsers", usersInRoom);
  }
});

// --- Deploy setup (optional, for serving frontend if needed) ---
app.get("/", (req, res) => {
  res.send("Mindful Chat Server is running 🧠");
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
