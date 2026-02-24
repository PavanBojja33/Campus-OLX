const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http")

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

app.get("/", (req, res) => {
  res.send("Campus OLX is running");
});

const io = new Server(server , {
  cors : {
    origin : allowedOrigins,
    methods : ['GET','POST'],
    credentials : true
  }
})

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.emit("welcome", "Welcome to campus-olx chat app");

  socket.on("sendMessage",(message) => {
    console.log("Message : ",message)

    io.emit("receiveMsg",message);
  })
  
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
