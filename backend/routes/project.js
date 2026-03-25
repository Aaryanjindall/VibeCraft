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

router.put("/update/:id",async(req,res)=> {
  try{
    console.log("yhan aage oye");
    const { name , files} = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
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

router.delete("/delete/:id",async(req,res)=>{
  console.log("delete m aagye oyee")
  try{
    const project = await Project.findByIdAndDelete(req.params.id);
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

router.get("/:id",async(req,res) =>{
  try{
    const project = await Project.findById(
      req.params.id
    );

    if(!project){
      return res.status(404).json({
        message: "Project not found"
      });
    }
    console.log(project.files);
    res.json(project);
  }
  catch(err){
    res.status(500).json({
      message: "error"
    });
  }
});

router.get("/", async (req, res) => {

  try {

    const projects = await Project.find();

    res.json(projects);

  } catch (err) {

    res.status(500).json({
      message: "error"
    });

  }

});

module.exports = router;


