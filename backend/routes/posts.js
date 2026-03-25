const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { requireAuth } = require('../middleware/auth');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
                            .populate('author', 'username email')
                            .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
});

// POST a new post
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const post = new Post({
      title,
      content,
      author: req.session.userId
    });
    
    await post.save();
    
    const populatedPost = await Post.findById(post._id).populate('author', 'username email');
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Server error creating post' });
  }
});

// GET a single post by ID
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
                           .populate('author', 'username email')
                           .populate('comments.author', 'username email');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error('Error fetching single post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new comment on a post
router.post('/:postId/comments', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const newComment = {
      text,
      author: req.session.userId
    };
    
    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(req.params.postId)
                                    .populate('author', 'username email')
                                    .populate('comments.author', 'username email');

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Server error adding comment' });
  }
});

module.exports = router;
