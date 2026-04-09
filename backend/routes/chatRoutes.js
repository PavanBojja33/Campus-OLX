const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const protect = require("../middleware/authMiddleware");

// GET /api/chats — get all chats for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user;

    const chats = await Chat.find({ users: userId })
      .populate("users", "name avatarUrl department")
      .populate("item", "title images price")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name" },
      })
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
});

// POST /api/chats — create or find existing chat for an item between buyer and seller
router.post("/", protect, async (req, res) => {
  try {
    const { itemId, sellerId } = req.body;
    const buyerId = req.user;

    if (!itemId || !sellerId) {
      return res.status(400).json({ message: "itemId and sellerId are required" });
    }

    // Don't allow chatting with yourself
    if (buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    // Check if a chat already exists for this item between these two users
    let chat = await Chat.findOne({
      item: itemId,
      users: { $all: [buyerId, sellerId] },
    });

    if (!chat) {
      chat = await Chat.create({
        item: itemId,
        users: [buyerId, sellerId],
      });
    }

    // Populate for response
    chat = await chat.populate("users", "name avatarUrl department");
    chat = await chat.populate("item", "title images price");

    res.status(200).json(chat);
  } catch (err) {
    console.error("Create chat error:", err);
    res.status(500).json({ message: "Failed to create chat" });
  }
});

module.exports = router;
