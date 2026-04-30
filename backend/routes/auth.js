const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
require("dotenv").config();


const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "admin@aivibe.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
  username: process.env.ADMIN_USERNAME || "Admin",
};

// ================= SIGNgUP =================

router.post("/signup", async (req, res,next) => {
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
    req.login(user, (err) => { // 🔥 CHANGED
      if (err) return next(err);

      return res.json({
        message: "Signup success",
        user: {
          username: user.username,
          email: user.email,
        },
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res,next) => {
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
    req.login(user, (err) => { // 🔥 CHANGED
      if (err) return next(err);

      return res.json({
        message: "Login success",
        user: {
          username: user.username,
          email: user.email,
        },
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= LOGOUT =================
router.post("/logout", (req, res) => {
  req.logout((err) => { 
    if (err) return res.status(500).json({ error: "Logout error" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logout success" });
    });
  });
});

// ================= CURRENT USER =================

router.get("/me", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not login" });
  }
  const user = { ...req.user._doc };
  delete user.password;
  res.json({ user });
});

router.get("/google",(req,res,next)=>{
  const redirect = req.query.redirect || "/ai";
  req.session.redirectAfterLogin = redirect;
  next();
},
  passport.authenticate("google", { scope: ["profile", "email"], })
);
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://vibe-craft-six.vercel.app/error"
  }),
  (req, res) => {
    const redirect = req.session.redirectAfterLogin || "/ai";
    req.session.redirectAfterLogin = null;  
    res.redirect(`https://vibe-craft-six.vercel.app${redirect}`);
  }
);
module.exports = router;