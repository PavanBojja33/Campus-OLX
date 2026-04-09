const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const Message = require("./models/message");
const Chat = require("./models/Chat");
const jwt = require("jsonwebtoken");
const Item = require("./models/Item");

// node --dns-result-order=ipv4first server.js

const dns = require("node:dns");
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://campus-olx-web.vercel.app",
];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo Error:", err));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/chats", require("./routes/chatRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

app.get("/", (req, res) => {
  res.send("Campus OLX is running");
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user to their personal room for notifications
  socket.on("registerUser", (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log("User registered for notifications:", userId);
    }
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log("Joined chat:", chatId);
  });

  socket.on("sendMessage", async ({ chatId, content, token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const senderId = decoded.id;

      const newMessage = await Message.create({
        chatId: chatId,
        sender: senderId,
        content,
      });

      // Update the chat's latest message
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { latestMessage: newMessage._id },
        { new: true }
      );

      const populatedMsg = await newMessage.populate("sender", "name");

      // Emit to the chat room (for users currently viewing this chat)
      io.to(chatId).emit("receiveMessage", populatedMsg);

      // Notify other users in this chat who may not be viewing it
      if (chat && chat.users) {
        chat.users.forEach((userId) => {
          if (userId.toString() !== senderId) {
            io.to(`user_${userId}`).emit("newMessageNotification", {
              chatId,
              message: populatedMsg,
            });
          }
        });
      }
    } catch (err) {
      console.log("Socket error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
