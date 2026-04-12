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

router.post("/join/:id",requireAuth,async(req,res) => {
    const communtiy = await Community.findById(req.params.id);

    if(!communtiy){
        return res.json({
            error: "Not found"
        });
    }

    if(!communtiy.members.includes(req,session.userId)){
        communtiy.members.push(req.user._id);
        await communtiy.save();
    }

    res.json({
        message: "Joined"
    });
});

router.get("/my",requireAuth,async(req,res) => {
    const communites = await Community.find({
        members: req.user._id,
    });
    res.json(communites);
});

router.get("/projects/:id", requireAuth, async (req, res) => {
  const projects = await Project.find({
    community: req.params.id,
  });
  res.json(projects);
});

router.get("/members/:id",requireAuth,async(req,res)=> {
    const members = await Community.findById(req.params.id).populate("members","name email");

    res.json(members.members);
})


module.exports = router;