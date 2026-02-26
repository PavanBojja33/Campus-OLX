const express = require('express')
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const Message = require("../models/message");

router.get("/:roomId",protect,async (req,res) => {
    const messages = await Message.find({ roomId : req.params.roomId})
                        .populate("sender" , "name")
                        .sort({createdAt : 1});
    
    res.json(messages);
});

module.exports = router;