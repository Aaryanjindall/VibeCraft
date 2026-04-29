const router = require("express").Router();
const Project=
require("../models/Project");
const {
 requireAuth
}=require("../middleware/auth");


function generateRoomId(){

const chars=
"ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

let room="";

for(
 let i=0;
 i<6;
 i++
){
 room += chars[
  Math.floor(
   Math.random()*
   chars.length
  )
 ]
}

return room;

}



//
// CREATE LIVE ROOM
//
router.post(
"/create-live",
requireAuth,
async(req,res)=>{

const roomCode=
generateRoomId();

const project=
await Project.create({

 name:"Untitled Live Project",

 owner:req.user._id,

 slug:
`live-${Date.now()}`,

 liveRoomCode:
 roomCode,

 files:{
  "index.html":`<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Live Collab Demo</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div class="container">\n    <h1>Welcome to Live Collab! 🚀</h1>\n    <p>Start editing the HTML, CSS, or JS to see changes in real-time.</p>\n    <button id="btn">Click Me!</button>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>`,
  "styles.css":`body {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  background: linear-gradient(135deg, #1e0000, #0a0000);\n  font-family: 'Inter', sans-serif;\n  color: white;\n}\n\n.container {\n  text-align: center;\n  background: rgba(255, 255, 255, 0.05);\n  padding: 2rem 3rem;\n  border-radius: 20px;\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n}\n\nh1 {\n  margin-top: 0;\n  color: #ef4444;\n}\n\nbutton {\n  margin-top: 1.5rem;\n  padding: 0.75rem 1.5rem;\n  background: #dc2626;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n\nbutton:hover {\n  background: #b91c1c;\n  transform: translateY(-2px);\n}`,
  "script.js":`const btn = document.getElementById('btn');\n\nbtn.addEventListener('click', () => {\n  btn.innerText = 'Clicked! 🎉';\n  btn.style.background = '#10b981';\n  \n  setTimeout(() => {\n    btn.innerText = 'Click Me!';\n    btn.style.background = '#dc2626';\n  }, 2000);\n});`
 }

});

res.json({
 projectId:
 project._id,
 roomCode
});

});



/* ==========================
ENABLE LIVE FOR OLD PROJECT
========================== */

router.post(
"/project/:projectId/enable-live",
requireAuth,
async(req,res)=>{

try{

const project=
await Project.findById(
req.params.projectId
);

if(!project){
return res.status(404)
.json({
error:"Project not found"
});
}


if(
String(project.owner)!==
String(req.user._id)
){
return res.status(403)
.json({
error:"Not owner"
});
}


if(
!project.liveRoomCode
){

let roomCode=
generateRoomCode();

while(
await Project.findOne({
 liveRoomCode:
 roomCode
})
){
roomCode=
generateRoomCode();
}

project.liveRoomCode=
roomCode;

await project.save();

}


res.json({
success:true,
projectId:
project._id,
roomCode:
project.liveRoomCode
});


}catch(err){

res.status(500)
.json({
error:
"Failed enabling live"
});

}
});

module.exports=router;
