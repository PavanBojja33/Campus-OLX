const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Message = require("../models/message");
const mongoose = require("mongoose");

router.get("/", protect, async (req, res) => {
  try {

    const userId = req.user.id || req.user;   // ✅ SAFE FIX

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: objectUserId },
            { receiver: objectUserId }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$roomId",
          lastMessage: { $first: "$message" },
          updatedAt: { $first: "$createdAt" }
        }
      }
    ]);

    res.json(conversations);

  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;