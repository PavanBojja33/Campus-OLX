const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const protect = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user;

    // 👉 find all messages
    const messages = await Message.find();

    // 👉 filter chats where user is involved
    const chatsMap = {};

    messages.forEach((msg) => {
      if (msg.sender.toString() === userId || msg.chatId.includes(userId)) {
        chatsMap[msg.chatId] = msg; // latest message per chat
      }
    });

    const chats = Object.values(chatsMap).map((msg) => ({
      _id: msg.chatId,
      lastMessage: msg.content,
      updatedAt: msg.createdAt,
    }));

    res.json(chats);
  } catch (err) {
    console.error("Chat error:", err);
    res.json([]); // never crash
  }
});

module.exports = router;
