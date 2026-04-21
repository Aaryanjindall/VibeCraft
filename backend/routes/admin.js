const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Community = require('../models/Community');
const { requireAdmin, requireAuth } = require('../middleware/auth');
const Project = require('../models/Project');
require('dotenv').config();

const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@aivibe.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  username: process.env.ADMIN_USERNAME || 'Admin'
};

// Admin login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  req.session.isAdmin = true;
  req.session.adminEmail = email;
  req.session.role = 'admin';

  res.json({
    message: 'Admin authenticated',
    user: {
      username: ADMIN_CREDENTIALS.username,
      email: ADMIN_CREDENTIALS.email,
      role: 'admin'
    }
  });
});

router.get("/dashboard", requireAdmin, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const projects = await Project.countDocuments();
    const communities = await Community.countDocuments();
    const posts = await Post.countDocuments();

    res.json({ users, projects, communities, posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Dashboard error" });
  }
});


// get all users
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Users error" });
  }
});

router.get("/user/:id", requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // 🔥 SOLO PROJECTS
    const soloProjects = await Project.find({
      owner: userId,
      community: null,
    });

    // 🔥 COMMUNITIES (user member hai)
    const communities = await Community.find({
      "members.user": userId,
    }).populate("projects");

    // 🔥 POSTS
    const posts = await Post.find({
      author: userId,
    }).populate("community", "name");

    res.json({
      soloProjects,
      communities,
      posts,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "User detail error" });
  }
});
// delete user
router.delete("/user/:id", requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete user error" });
  }
});

// delete project
router.delete("/project/:id", requireAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete project error" });
  }
});

// delete community
router.delete("/community/:id", requireAdmin, async (req, res) => {
  try {
    await Community.findByIdAndDelete(req.params.id);
    res.json({ message: "Community deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete community error" });
  }
});

module.exports = router;
