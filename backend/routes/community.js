const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
const Community = require("../models/Community");
const Project = require("../models/Project");
const router = express.Router();

console.log("community routes m aagya");
router.post("/create",requireAuth,async(req,res) => {
    console.log("hellooo");
    const { name } = req.body || {};
    console.log(name);
    if(!name){
        return res.status(400).json({ message: "Name is required "});
    }
    const commnunity = new Community({
        name,
        owner: req.user._id,
        members: [req.user._id],
    });
    await commnunity.save();
    res.json(commnunity);
});

router.post("/join/:id", requireAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        message: "Community not found",
      });
    }

    // already joined check
    if (community.members.some(m => m.toString() === req.user._id.toString())) {
      return res.json({
        message: "Already joined",
      });
    }

    community.members.push(req.user._id);
    await community.save();

    res.json({
      message: "Joined successfully",
      community,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/my",requireAuth,async(req,res) => {
    const communites = await Community.find({
        members: req.user._id,
    });
    res.json(communites);
});

router.get("/projects/:id", requireAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("projects"); 
    if (!community) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(community.projects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", requireAuth, async (req, res) => {
  const communities = await Community.find({
    members: { $ne: req.user._id },
  });

  res.json(communities);
});
router.get("/members/:id",requireAuth,async(req,res)=> {
    const members = await Community.findById(req.params.id).populate("members","name email");

    res.json(members.members);
})
router.post("/add-project", requireAuth, async (req, res) => {
  try {
    const { projectId, communityId } = req.body;

    const project = await Project.findById(projectId);
    const community = await Community.findById(communityId);

    if (!project || !community) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔥 owner check
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 🔥 MAIN RULE (IMPORTANT)
    if (project.community) {
      return res.json({
        message: "Project already belongs to a community",
      });
    }

    // 🔥 assign community
    project.community = communityId;
    await project.save();

    // 🔥 add project to community
    if (!community.projects.some(p => p.toString() === projectId.toString())) {
      community.projects.push(projectId);
      await community.save();
    }

    res.json({
      message: "Project added to community",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;