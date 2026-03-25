// routes/project.js

const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { requireAuth } = require("../middleware/auth");
const { default: mongoose } = require("mongoose");

router.post('/save',requireAuth, async (req, res) => {
  try {
    console.log("yhan tak aagya");

    const { name, files } = req.body;

    const userId = req.session.userId || new mongoose.Types.ObjectId();

    if (!userId) {
      return res.status(401).json({
        error: "Not logged in",
      });
    }

    if (!name || !files) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    const slug =
      name.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Date.now();

    const project = new Project({
      name,
      slug,
      owner: userId,
      files,
      members: [userId],
    });

    await project.save();
    console.log("saved");

    res.json({
      message: "Project saved",
      project,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Server error",
    });

  }
});

module.exports = router;