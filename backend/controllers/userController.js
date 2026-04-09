const User = require("../models/user");

// GET /api/user/profile (requires auth)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// PUT /api/user/profile (requires auth)
exports.updateProfile = async (req, res) => {
  try {
    const { name, department, bio, avatarUrl } = req.body;

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (department !== undefined) user.department = department;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();

    const sanitized = user.toObject();
    delete sanitized.password;

    res.json({ user: sanitized, message: "Profile updated" });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// GET /api/user/:id (public)
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name department bio avatarUrl createdAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("GET PUBLIC PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
