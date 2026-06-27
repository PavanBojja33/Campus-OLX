const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
  name: { type: String },
  hashedPassword: { type: String },
  department: { type: String },
});

module.exports = mongoose.model("Otp", otpSchema);
