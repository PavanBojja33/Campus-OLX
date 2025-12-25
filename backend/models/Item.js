const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,      
    semester: String,
    department: String,
    images: [String],      
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ["active", "sold", "removed"],
        default: "active"
    }

},{timestamps : true});

module.exports=mongoose.model('Item',itemSchema);