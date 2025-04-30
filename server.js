const express = require("express");
const app = express();
const config = require("./app/config/config");
const server = require("http").createServer(app);
const router = express.Router();
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Conversation = require("./app/models/coversation.model");
const Message = require("./app/models/message.model");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDb = require("./app/config/connectDb");
connectDb();

// const corsOptions = {
// 	origin: "*",
// 	optionsSuccessStatus: 200,
// };

app.use(
	cors({
		origin: ["http://localhost:5173", "https://your-frontend-on-render.com"],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
const routesPath = path.join(__dirname, "app/routes");
const routeFiles = fs.readdirSync(routesPath);

routeFiles.forEach((routeFile) => {
	if (routeFile !== "server.js" && routeFile.endsWith(".js")) {
		const routeModule = require(path.join(routesPath, routeFile));
		routeModule(router);
	}
});

// --- Allow frontend (update with your deployed frontend URL) ---
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173", "https://your-frontend-on-render.com"],
		methods: ["GET", "POST"],
		credentials: true, // Allow cookies to be sent
	},
});

// --- Store users per socket ---
const onlineUsers = {}; // { socket.id: { username, room } }

io.on("connection", (socket) => {
	console.log(`✅ A user connected: ${socket.id}`);

	// Parse cookies manually for Socket.IO
	const cookies = cookieParser.JSONCookies(
		Object.fromEntries((socket.handshake.headers.cookie || "").split("; ").map((c) => c.split("=").map(decodeURIComponent)))
	);

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

	socket.on("sendMessage", async ({ username, message, room, fileUrl }) => {
		try {
			const token = cookies.authToken;
			const userId = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
				return decoded;
			});
			// Retrieve the user's anonymous username
			const user = await User.findById(_id);
			const anonymousUsername = user.anonymousUsername;
			// Find or create the single conversation
			let conversation = await Conversation.findOne();
			if (!conversation) {
				conversation = new Conversation({ title: "General Chat" });
				await conversation.save();
			}

			// Save the message to the database
			const newMessage = new Message({
				sender: userId,
				conversation: conversation._id,
				text: message,
				fileUrl,
			});
			await newMessage.save();
			conversation.messages.push(newMessage._id);
			await conversation.save();
			io.to(room).emit("receiveMessage", { senderId: userId, username: anonymousUsername, message, room, fileUrl });

			console.log(`💾 Message saved: ${message}`);
		} catch (error) {
			console.error("Error saving message:", error);
		}
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
app.get("/api/health", (req, res) => {
	res.send("Mindful Chat Server is running 🧠");
});

// --- Start server ---
server.listen(config.port, () => {
	console.log(`🚀 Server running on port ${config.port}`);
});
