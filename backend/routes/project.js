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

    const userId = req.session.userId ;
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
    console.log(req.session.userId)
    const project = await Project.findByIdAndUpdate(
      {_id: req.params.id,
        owner: req.session.userId,},

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
    console.log(req.session.userId)
    const project = await Project.findOne({
    _id: req.params.id,
    owner: req.session.userId,
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
    console.log(req.session.userId)
    const project = await Project.findById({
      _id: req.params.id,
      owner: req.session.userId,
    }
      
    );

    if(!project){
      return res.status(404).json({
        message: "Project not found"
      });
    }
    if(
      !project.isPublic && (!req.session.userId || project.owner.toString() !== req.session.userId)
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
    console.log(req.session.userId)
    const projects = await Project.find({
      owner: req.session.userId,
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
    owner: req.session.userId,
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


router.post("/deploy/internal/:id",requireAuth,async(req,res) => {
  try{
    const project = await Project.findById(
      req.params.id
    );

    if(!project){
      return res.status(404).json({
        error: "Project not found",
      });
    }
    let deploy = await Deploy.findOne({
      project: project._id
    });
    if(!deploy){
    const deployId = crypto.randomBytes(6).toString("hex");
    deploy = new Deploy({
      project : project._id,
      deployId,
    });
    await deploy.save();
  }
    res.json({
      url:
      "http://localhost:5001/api/project/d/"+deploy.deployId,
    });


  }catch(err){
    console.log(err);
  }
});
router.get("/d/:deployId", async (req, res) => {

  const deploy = await Deploy.findOne({
    deployId: req.params.deployId,
  }).populate("project");

  if (!deploy) {
    return res.send("Not found");
  }

  const files = deploy.project.files || {};
  console.log(files);
  const html = files["index.html"] || "";
  const css = files["styles.css"] || "";
  const js = files["script.js"] || "";

  const full = `
<!DOCTYPE html>
<html>
<head>

<style>
${css}
</style>

</head>

<body>

${html}

<script>
${js}
</script>

</body>
</html>
`;

  res.send(full);

});

module.exports = router;


