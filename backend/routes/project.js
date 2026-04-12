const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { requireAuth } = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
const Deploy = require("../models/Deploy");

// import { route } from "./posts";
const crypto = require("crypto");

router.post('/save',requireAuth, async (req, res) => {
  try {
    console.log("yhan tak aagya");
    
    const { name, files } = req.body;

    const userId = req.user._id ;
    console.log(userId);

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

router.put("/update/:id",requireAuth,async(req,res)=> {
  try{
    console.log("yhan aage oye");
    const { name , files} = req.body;
    console.log(req.user._id)
    const project = await Project.findByIdAndUpdate(
      {_id: req.params.id,
        owner: req.user._id,},

      {
        name,
        files,
      },
      {new : true}
    );
    console.log("updated");
    res.json(project);
  }
  catch(err){
    res.status(500).json({
      message: "error",
    });
  }
});

router.delete("/delete/:id",requireAuth,async(req,res)=>{
  console.log("delete m aagye oyee")
  try{
    console.log(req.user._id)
    const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });
    res.json({
      message: "deleted"
    });
    console.log("delete hogya oye!!")
  }
  catch (err) {
    res.status(500).json({
      message: "error"
    });
  }
});

router.get("/:id",requireAuth,async(req,res) =>{
  try{
    console.log(req.user._id)
    const project = await Project.findById({
      _id: req.params.id,
      owner: req.user._id,
    }
      
    );

    if(!project){
      return res.status(404).json({
        message: "Project not found"
      });




    }
    if(
      !project.isPublic && (!req.user._id || project.owner.toString() !== req.user._id)
    ){
      return res.status(403).json({
        error: "Private",
      });
    }
    res.json(project);
  }
  catch(err){
    res.status(500).json({
      message: "error"
    });
  }
});

router.get("/",requireAuth, async (req, res) => {
  try {
    console.log(req.user._id)
    const projects = await Project.find({
      owner: req.user._id,
    });
    res.json(projects);
  } catch (err) {

    res.status(500).json({
      message: "error"
    });

  }

});

router.put("/toggle/:id",requireAuth,async(req,res) => {
  console.log("hellooo")
  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });
  if (!project) {
    console.log("not foundd");
  return res.status(404).json({
    error: "Project not found",
  });
}
  project.isPublic = !project.isPublic;
  console.log(project.isPublic);
  
  await project.save();
  console.log("done");
  res.json(project);
})

router.put("/add-to-community/:id", requireAuth , async(req,res) => {
  const { communityId } = req.body;
  const project = await Project.findById(req.params.id);
  const community = await Project.findById(communityId);
  if(!community.members.includes(req.user._id)){
    return res.status(403).json({
      error: "Not a member",
    });
  }
  project.community = communityId;
  await project.save();
  res.json({
    message: "Added to community"
  });

});

router.put(
  "/remove-from-community/:id",
  requireAuth,
  async (req, res) => {

    const project = await Project.findById(req.params.id);

    project.community = null;

    await project.save();

    res.json({ message: "Removed" });

  }
);

module.exports = router;


