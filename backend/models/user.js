const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    department: String,
    verificationToken: String,
    verified: {
        type: Boolean,
        default: false
    }
},{timestamps : true});

module.exports=mongoose.model("user",userSchema);