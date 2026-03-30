const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
const Community = require("../models/Community");
const Project = require("../models/Project");
const router = express.Router();


router.post("/create",requireAuth,async(req,res) => {
    const { name } = req.body || {};
    if(!name){
        return res.status(400).json({ message: "Name is required "});
    }
    const commnunity = new Community({
        name,
        owner: req.session.userId,
        members: [req.session.userId],
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
        communtiy.members.push(req.session.userId);
        await communtiy.save();
    }

    res.json({
        message: "Joined"
    });
});

router.get("/my",requireAuth,async(req,res) => {
    const communites = await Community.find({
        members: req.session.userId,
    });

    res.json(communites);
});

router.get("/projects/:id", requireAuth, async (req, res) => {

  const projects = await Project.find({
    community: req.params.id,
  });

  res.json(projects);

});


module.exports = router;