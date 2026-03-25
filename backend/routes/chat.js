const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/Chat');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// GET chat history by projectId
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
    const limit = parseInt(req.query.limit) || 100;
    
    const query = projectId ? { projectId } : {};
    const messages = await ChatMessage.find(query)
      .populate('sender', 'username email')
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    
    // Reverse to show oldest first
    res.json(messages.reverse());
  } catch (err) {
    console.error('Error fetching chat messages:', err);
    res.status(500).json({ error: 'Server error fetching chat messages' });
  }
});

// POST a new chat message
router.post('/', requireAuth, async (req, res) => {
  try {
    const { message, projectId } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const chatMessage = new ChatMessage({
      message: message.trim(),
      sender: req.session.userId,
      projectId: projectId
    });

    await chatMessage.save();
    const populatedMessage = await ChatMessage.findById(chatMessage._id)
      .populate('sender', 'username email');

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error('Error creating chat message:', err);
    res.status(500).json({ error: 'Server error creating chat message' });
  }
});

module.exports = router;
