const express = require("express");
const { requireAuth, loadCommunity } = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
const Community = require("../models/Community");
const Project = require("../models/Project");
const { canAddProject, canRemoveMember, canDeleteCommunity, canEditProject, canRemoveProject } = require("../utils/permissions");
const router = express.Router();

console.log("community routes m aagya");
router.post("/create",requireAuth,async(req,res) => {
    console.log("hellooo");
    const { name } = req.body || {};
    console.log(name);
    if(!name){
        return res.status(400).json({ message: "Name is required "});
    }
    const community = new Community({
        name,
        owner: req.user._id,
        members: [
    {
      user: req.user._id,
      role: "owner"
    }
  ]
    });
    await community.save();
    res.json(community);
});
router.get("/all", requireAuth, async (req, res) => {
  const communities = await Community.find({
    "members.user": { $not: { $eq: req.user._id } },
  });

  res.json(communities);
  console.log(communities);
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
    if (community.members.some(m => m.user.toString() === req.user._id.toString())) {
      return res.json({
        message: "Already joined",
      });
    }

    community.members.push({
  user: req.user._id,
  role: "member"
});
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
        "members.user": req.user._id
    });
    res.json(communites);
    console.log(communites);
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

router.get("/members/:id",requireAuth,async(req,res)=> {
    const community = await Community.findById(req.params.id).populate("members.user","username email");
    res.json(community.members);
    console.log(community.members);
})

router.post("/:id/add-project", requireAuth,loadCommunity, async (req, res) => {
  try {
    const { projectId } = req.body;
    const community = req.community;

    const project = await Project.findById(projectId);

    if (!project ) {
      return res.status(404).json({ message: " Project Not found" });
    }

    if(!canAddProject(req.user._id,community)){
      return res.status(403).json({message: "Not Allowed"});
    }

   if (project.community) {
  return res.status(400).json({
    message: "Project already belongs to a community",
  });
}
    console.log(projectId);
    project.community = community._id;
    await project.save();
   
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

router.post("/:id/remove",requireAuth,loadCommunity,async(req,res)=> {
  try {
    const { targetUserId } = req.body;
    const community = req.community;

    // 🔥 permission check
    if (!canRemoveMember(req.user._id, community, targetUserId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 🔥 check if user exists in members
    const isMember = community.members.some(
      m => m.user.toString() === targetUserId.toString()
    );

    if (!isMember) {
      return res.status(404).json({ message: "User not in community" });
    }

    // 🔥 remove member
    community.members = community.members.filter(
      m => m.user.toString() !== targetUserId.toString()
    );

    await community.save();

    res.json({ message: "Member removed successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

router.post("/:id/assign-role",requireAuth,loadCommunity,async(req,res) => {
  try{
    console.log("assign role m aagya ");
    const { targetUserId,newRole } = req.body;
    const community = req.community;

    const validRoles = ["owner","admin","member"];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const actor = community.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    const target = community.members.find(
      m => m.user.toString() === targetUserId.toString()
    );
    if (!actor || !target) {
      return res.status(404).json({ message: "User not found in community" });
    }
    const actorRole = actor.role;
    const targetRole = target.role;
    if (targetRole === "owner") {
      return res.status(403).json({ message: "Cannot change owner role" });
    }
    if(actorRole === "owner"){
      target.role = newRole;
    }
    else if(actorRole === "admin"){
      if(targetRole !== "member"){
        return res.status(403).json({ message: "Admin can only change members"});
      }
      target.role = newRole;
    }

    else{
      return res.status(403).json({message: "Not allowed "});
    }

    await community.save();

    res.json({message: "Role Updated successfully"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message: "Server error"});
  };

})

router.delete("/:id", requireAuth, loadCommunity, async (req, res) => {
  try {
    const community = req.community;
    if (!canDeleteCommunity(req.user._id, community)) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await community.deleteOne();

    res.json({ message: "Community deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/:id/save-project", requireAuth, loadCommunity, async (req, res) => {
  try {
    const { projectId, files } = req.body;
    const community = req.community;

    // 🔹 project check
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 permission check (IMPORTANT)
    if (!canEditProject(req.user._id, community)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 🔥 ensure project belongs to this community
    if (!project.community || project.community.toString() !== community._id.toString()) {
      return res.status(400).json({ message: "Project not in this community" });
    }

    project.files = files;  

    await project.save();

    res.json({
      message: "Project saved successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/fork/:projectId",requireAuth,loadCommunity,async(req,res)=> {
  try{
    const orig = await Project.findById(req.params.projectId);
    const community = req.community;
    if(!orig){
      return res.status(404).json({message: "Not Found"});
    }
    
    if(!orig.community || orig.community.toString() !== community._id.toString()){
      return res.status(400).json({message : "Project not in this community"});
    } 

     const isMember = community.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: "Not a community member" });
    }

    const newProject = new Project({
      name: orig.name + " (fork)",
      slug: orig.name + "-fork-" + Date.now(),
      files: JSON.parse(JSON.stringify(orig.files)),
      owner: req.user._id,
      members: [req.user._id],
      isPublic: false,
      isFork: true,
      parentProject: orig._id,
      community: null, 
      promptHistory: [],
      deployHistory: []
    });

    await newProject.save();

    await Project.findByIdAndUpdate(orig._id,{
      $inc : { forkCount: 1},
    });

    res.json({
      message: "Fork created (personal project)",
      project: newProject,
    });

  }
  catch(err){
    console.log(err);
    res.status(500).json({message: "Server error "});
  }
})




router.post("/:id/remove-project", requireAuth, loadCommunity, async (req, res) => {
  try {
    const { projectId } = req.body;
    const community = req.community;
    console.log("yhan par huu bd");

    // 🔥 permission check
    if (!canRemoveProject(req.user._id, community)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 unlink project
    project.community = null;
    await project.save();

    // 🔥 remove from community.projects
    community.projects = community.projects.filter(
      (p) => p.toString() !== projectId.toString()
    );

    await community.save();

    res.json({ message: "Project removed from community" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
    console.log(err);
  }
});

module.exports = router;