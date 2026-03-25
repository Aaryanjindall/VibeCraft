const express = require("express");
const router = express.Router();
const User = require("../models/User");
require("dotenv").config();

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "admin@aivibe.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
  username: process.env.ADMIN_USERNAME || "Admin",
};

// ================= SIGNgUP =================

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: "Email already used" });
    }
    const user = new User({ username, email, password });
    await user.save();
    // session store
    req.session.userId = user._id;
    res.json({
      message: "Signup success",
      user: { username, email },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid" });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({ error: "Invalid" });
    }  // session
    req.session.userId = user._id;
    res.json({
      message: "Login success",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// ================= LOGOUT =================
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logout success" });
  });
});

// ================= CURRENT USER =================

router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not login" });
  }
  const user = await User.findById(req.session.userId).select("-password");
  res.json({ user });
});

module.exports = router;