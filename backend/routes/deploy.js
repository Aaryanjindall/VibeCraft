const express = require("express");
const router = express.Router();
const archiver = require("archiver");
// const FormData = require("from-data");
const stream = require("stream");
const { requireAuth } = require("../middleware/auth");
const Project = require("../models/Project");
const Deploy = require("../models/Deploy");
const crypto = require("crypto");



router.post("/internal/:id",requireAuth,async(req,res) => {
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
      type: "internal",
    });
    deploy.status = "success";
    deploy.url = "https://vibecraft-sxyx.onrender.com/api/deploy/d/"+ deploy.deployId;
    console.log(deploy.url)
    await deploy.save();
  }else{
    deploy.updatedAt = Date.now();
  deploy.url = "https://vibecraft-sxyx.onrender.com/api/deploy/d/" + deploy.deployId;
  deploy.status = "success";
  await deploy.save();
  }
    res.json({
      url: deploy.url,
      status: deploy.status,
    });


  }catch(err){
    res.status(500).json({ error: "Failed" });
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
router.post("/netlify/:id", requireAuth, async (req, res) => {
let deploy;
  try {
    console.log("part 1");

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }
    deploy = await Deploy.findOne({
      project: project._id,
      type: "netlify",
    });
    if(!deploy){
        deploy = new Deploy({
            project: project._id,
            type: "netlify",
            status: "deploying"
        });
    }
    else{
        deploy.status = "deploying"
    }
    await deploy.save();
    console.log("part 2");
    const files = project.files || {};
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    const chunks = [];

    archive.on("data", (chunk) => {
      chunks.push(chunk);
    });

    archive.on("error", (err) => {
      throw err;
    });

    // ⭐ FIX
    const zipPromise = new Promise((resolve, reject) => {
      archive.on("end", resolve);
      archive.on("error", reject);
    });

    console.log("part 3");
    for (const name in files) {
      if (!files[name]) continue;
      archive.append(files[name], { name });
    }
    archive.finalize();
    await zipPromise;
    console.log("part 4");
    const zipBuffer = Buffer.concat(chunks);
    console.log("part 5");
    let netlifyRes;

if (!deploy.siteId) {
  // ⭐ FIRST TIME → create site

  netlifyRes = await axios.post(
    "https://api.netlify.com/api/v1/sites",
    zipBuffer,
    {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
        "Content-Type": "application/zip",
      },
    }
  );

  deploy.siteId = netlifyRes.data.id; // ⭐ store id
  deploy.url = netlifyRes.data.url;

} else {
  // ⭐ REDEPLOY → same site

  netlifyRes = await axios.post(
    `https://api.netlify.com/api/v1/sites/${deploy.siteId}/deploys`,
    zipBuffer,
    {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
        "Content-Type": "application/zip",
      },
    }
  );
}
    console.log("part 6");
    deploy.status = "success";
    deploy.url = netlifyRes.data.url;
    await deploy.save();
    res.json({ 
        url: deploy.url,
        status: deploy.status,
     });
  } catch (err) {
    if(deploy){
        deploy.status = "failed";
        await deploy.save();
    }
    console.log(err.response?.data || err.message);
    res.status(500).json({
      error: "Deploy failed",
    });
  }
});

router.get("/history/:id",requireAuth, async(req,res) => {
    const deploys = await Deploy.find({
        project: req.params.id,
    }).sort({createdAt: -1});

    res.json(deploys);
})

module.exports = router;
