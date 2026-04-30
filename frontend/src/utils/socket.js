import { io } from "socket.io-client";

const socket = io(
 "https://vibecraft-zodr.onrender.com",
 {
   withCredentials:true
 }
);

export default socket;