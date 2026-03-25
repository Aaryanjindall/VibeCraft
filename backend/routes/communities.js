const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// GET all communities

router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = {};
    
    if (projectId) {
      query.projectId = projectId;
    }
    
    const communities = await Community.find(query)
      .populate('createdBy', 'username email')
      .populate('members', 'username email')
      .sort({ createdAt: -1 });
    res.json(communities);
  } catch (err) {
    console.error('Error fetching communities:', err);
    res.status(500).json({ error: 'Server error fetching communities' });
  }
});

// GET single community by projectId
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const community = await Community.findOne({ projectId })
      .populate('createdBy', 'username email')
      .populate('members', 'username email');
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found for this project ID' });
    }
    
    res.json(community);
  } catch (err) {
    console.error('Error fetching community:', err);
    res.status(500).json({ error: 'Server error fetching community' });
  }
});

// POST create a new community (auto-creates when project is published)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { projectId, projectName, description } = req.body;
    if (!projectId || !projectName) {
      return res.status(400).json({ error: 'Project ID and Project Name are required' });
    }

    // Check if community already exists for this projectId
    const existing = await Community.findOne({ projectId });
    if (existing) {
      return res.status(400).json({ error: 'Community already exists for this project' });
    }

    const community = new Community({
      projectId,
      projectName,
      description: description || '',
      createdBy: req.session.userId,
      members: [req.session.userId] // Creator automatically joins
    });

    await community.save();
    
    // Add to user's joined communities
    await User.findByIdAndUpdate(req.session.userId, {
      $addToSet: { joinedCommunities: community._id }
    });

    const populated = await Community.findById(community._id)
      .populate('createdBy', 'username email')
      .populate('members', 'username email');

    res.status(201).json(populated);
  } catch (err) {
    console.error('Error creating community:', err);
    res.status(500).json({ error: 'Server error creating community' });
  }
});

// POST join a community
router.post('/:projectId/join', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.session.userId;

    const community = await Community.findOne({ projectId });
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if user is already a member
    if (community.members.includes(userId)) {
      return res.status(400).json({ error: 'Already a member of this community' });
    }

    // Add user to members
    community.members.push(userId);
    await community.save();

    // Add community to user's joined communities
    await User.findByIdAndUpdate(userId, {
      $addToSet: { joinedCommunities: community._id }
    });

    const populated = await Community.findById(community._id)
      .populate('createdBy', 'username email')
      .populate('members', 'username email');

    res.json({ message: 'Successfully joined community', community: populated });
  } catch (err) {
    console.error('Error joining community:', err);
    res.status(500).json({ error: 'Server error joining community' });
  }
});

// POST leave a community
router.post('/:projectId/leave', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.session.userId;

    const community = await Community.findOne({ projectId });
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Remove user from members
    community.members = community.members.filter(
      memberId => memberId.toString() !== userId.toString()
    );
    await community.save();

    // Remove community from user's joined communities
    await User.findByIdAndUpdate(userId, {
      $pull: { joinedCommunities: community._id }
    });

    const populated = await Community.findById(community._id)
      .populate('createdBy', 'username email')
      .populate('members', 'username email');

    res.json({ message: 'Successfully left community', community: populated });
  } catch (err) {
    console.error('Error leaving community:', err);
    res.status(500).json({ error: 'Server error leaving community' });
  }
});

// GET user's joined communities
router.get('/user/my-communities', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .populate('joinedCommunities');
    
    res.json(user.joinedCommunities || []);
  } catch (err) {
    console.error('Error fetching user communities:', err);
    res.status(500).json({ error: 'Server error fetching user communities' });
  }
});

module.exports = router;
