const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Message = require("../models/message");

// Send message
router.post("/", protect, async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const sender = req.user.id || req.user;

    const message = await Message.create({
      chat: chatId,
      sender,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get messages of a chat
router.get("/:chatId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

module.exports = router;
