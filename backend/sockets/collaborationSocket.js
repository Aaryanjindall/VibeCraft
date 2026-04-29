const Project=require("../models/Project");
const ProjectMessage=
require("../models/ProjectMessage");

const roomUsers=new Map();

module.exports=(io)=>{

io.on(
"connection",
(socket)=>{

console.log(
"[CONNECTED]",
socket.id
);



/* =========================
   JOIN PROJECT LIVE
========================= */

socket.on(
"project:join",
async(payload)=>{
try{
const user=
socket.request.user;
if(!user){
 return socket.emit(
 "socket:error",
 "Unauthorized"
 );
}

let project=null;


/*
Join by project id
OR room code
*/
if(payload.projectId){

project=
await Project.findById(
 payload.projectId
);

}
else if(payload.roomCode.toUpperCase()
.trim()){

project=
await Project.findOne({
 liveRoomCode:
 payload.roomCode.toUpperCase()
.trim()
});

}
else{

return socket.emit(
"socket:error",
"Missing join data"
);

}


if(!project){
 return socket.emit(
 "socket:error",
 "Project not found"
 );
}


const roomKey=
String(project._id);
socket.projectId=
roomKey;

console.log(
"[JOIN PROJECT]",
project.name,
roomKey
);


/* actual socket room */
socket.join(
 roomKey
);

const pro = await Project.findById(project._id).populate("owner","username");


/* sync saved files */
socket.emit(
"project:syncCode",
{
 projectId:
 String(project._id),
 files:
 project.files,
 ownerName: pro?.owner?.username || "Unknown",
 projectName: project.name
}
);

console.log(pro?.owner?.username || "Unknown");



/* load old chat */
const messages=
await ProjectMessage
.find({
 project:project._id
})
.sort({
 createdAt:1
})
.limit(50);

socket.emit(
"chat:history",
messages
);



/* presence */
if(
!roomUsers.has(roomKey)
){
 roomUsers.set(
 roomKey,
 []
 );
}

const users=
roomUsers.get(
 roomKey
);


const exists=
users.some(
u=>
String(u.userId)===
String(user._id)
);


if(!exists){

users.push({
 socketId:
 socket.id,

 userId:
 user._id,

 name:
 user.username ||
 user.name
});

}


io.to(roomKey)
.emit(
"presence:update",
users
);


console.log(
"[ONLINE USERS]",
users.map(
u=>u.name
)
);


}catch(err){

console.error(
"[JOIN ERROR]",
err
);

}

});



/* =========================
   REALTIME CODE
========================= */

socket.on(
"project:codeChange",
async({files})=>{

try{

const roomKey=
socket.projectId;

if(
!roomKey ||
!files
) return;

console.log(
"[CODE CHANGE]",
roomKey
);

socket.to(roomKey)
.emit(
"project:receiveCode",
files
);

await Project.updateOne(
{
 _id:roomKey
},
{
 files,
 "collaboration.lastSyncedAt":
 new Date()
}
);

}catch(err){
console.error(
"[CODE ERROR]",
err
);
}

});



/* =========================
   CHAT
========================= */

socket.on(
"chat:message",
async(data)=>{

try{

const user=
socket.request.user;

if(!user) return;

if(
!data.message?.trim()
) return;

if(
data.message.length>500
) return;


const saved=
await ProjectMessage
.create({

 project:
 socket.projectId,

 sender:
 user._id,

 message:
 data.message.trim()

});


const populated=
await saved.populate(
"sender",
"username name"
);


io.to(
String(
socket.projectId
))
.emit(
"chat:receive",
{
 ...populated.toObject(),
 senderName:
 user.username||
 user.name
}
);


console.log(
"[CHAT]",
data.message
);


}catch(err){

console.error(
"[CHAT ERROR]",
err
);

}

});



/* =========================
LEAVE
========================= */

socket.on(
"project:leave",
({projectId})=>{

const roomKey=
socket.projectId;

if(
!roomUsers.has(roomKey)
) return;


const users=
roomUsers
.get(roomKey)
.filter(
u=>
u.socketId!==socket.id
);


if(
users.length===0
){
 roomUsers.delete(
 roomKey
);
}
else{
 roomUsers.set(
 roomKey,
 users
);
}


socket.leave(
roomKey
);


io.to(roomKey)
.emit(
"presence:update",
users
);

});



/* =========================
DISCONNECT
========================= */

socket.on(
"disconnect",
()=>{

console.log(
"[DISCONNECTED]",
socket.id
);

for(
let [roomKey,users]
of roomUsers
){

const updated=
users.filter(
u=>
u.socketId!==socket.id
);


if(
updated.length===0
){
 roomUsers.delete(
 roomKey
);

console.log(
"[ROOM EMPTY]",
roomKey
);

}
else{

roomUsers.set(
 roomKey,
 updated
);

}


io.to(roomKey)
.emit(
"presence:update",
updated
);

}

});



});
};