const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Message = require("../models/message");
const Chat = require("../models/Chat");

// Send message via REST (fallback, socket is primary)
router.post("/", protect, async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const sender = req.user;

    if (!chatId || !content) {
      return res.status(400).json({ message: "chatId and content are required" });
    }

    const message = await Message.create({
      chatId,
      sender,
      content,
    });

    // Update chat's latest message
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    const populated = await message.populate("sender", "name");

    res.status(201).json(populated);
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
