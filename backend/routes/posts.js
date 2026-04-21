// routes/post.js
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { requireAuth } = require("../middleware/auth");
const Community = require("../models/Community");

// 🔥 CREATE POST
router.post("/create/:communityId", requireAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { communityId } = req.params;

    const post = new Post({
  title,
  content,
  author: req.user._id,
  community: communityId,
});

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// 🔥 GET POSTS (community wise)
router.get("/:communityId", requireAuth, async (req, res) => {
  try {
    const posts = await Post.find({
      community: req.params.communityId,
    })
      .populate("author", "username avatar")
      .populate({
        path: "comments.user",
        select: "username avatar",
      })
      .sort({ createdAt: -1 });

    res.json(posts || []);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔥 LIKE
router.post("/like/:postId", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.postId);

  const alreadyLiked = post.likes.some(
  (id) => id.toString() === req.user._id.toString()
);
  if (alreadyLiked) {
    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
if (!post) {
  return res.status(404).json({ message: "Post not found" });
}
  res.json(post);
  
});



// 🔥 COMMENT
router.post("/comment/:postId", requireAuth, async (req, res) => {
  const { text } = req.body;

  const post = await Post.findById(req.params.postId);

  post.comments.push({
    user: req.user._id,
    text,
  });

  await post.save();
if (!post) {
  return res.status(404).json({ message: "Post not found" });
}
  res.json(post);
  
});

module.exports = router;