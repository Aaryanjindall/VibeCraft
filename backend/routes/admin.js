const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Community = require('../models/Community');
const { requireAdmin } = require('../middleware/auth');
require('dotenv').config();

// Hardcoded admin credentials (override via env if needed)
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

// Admin overview endpoint
router.get('/overview', requireAdmin, async (req, res) => {
  try {
    const [userCount, postCount, communityCount, latestPosts, communityStats] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Community.countDocuments(),
      Post.find().sort({ createdAt: -1 }).limit(5).populate('author', 'username email'),
      User.aggregate([
        { $project: { joinedCount: { $size: { $ifNull: ['$joinedCommunities', []] } } } },
        { $group: { _id: null, totalJoined: { $sum: '$joinedCount' }, avgPerUser: { $avg: '$joinedCount' } } }
      ])
    ]);

    const communitiesWithMembers = await Community.find()
      .populate('members', 'username email')
      .select('projectId projectName members')
      .limit(10);

    res.json({
      userCount,
      postCount,
      communityCount,
      latestPosts,
      communityStats: {
        totalMemberships: communityStats[0]?.totalJoined || 0,
        avgCommunitiesPerUser: Math.round(communityStats[0]?.avgPerUser || 0),
        communitiesWithMembers: communitiesWithMembers.map(c => ({
          projectId: c.projectId,
          projectName: c.projectName,
          memberCount: c.members.length
        }))
      }
    });
  } catch (err) {
    console.error('Error building admin overview:', err);
    res.status(500).json({ error: 'Failed to load admin overview' });
  }
});

// Admin - manage users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users for admin:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

router.delete('/users/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    await Post.deleteMany({ author: userId });
    res.json({ message: 'User and related posts deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Admin - manage posts
router.get('/posts', requireAdmin, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts for admin:', err);
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

router.delete('/posts/:postId', requireAdmin, async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
