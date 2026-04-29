import { useEffect, useState } from "react";
import socket from "../utils/socket";
import FileManager from "./FileManager";
import Editorr from "./Editor";
import PreviewPanel from "./PreviewPanel";
import ChatBox from "./Chat";
import { useUser } from "../context/UserProvider";
import UserProfile from "./userProfle";
import { Terminal, Users, Link as LinkIcon, MessageSquare, X, Wifi, WifiOff, Circle } from "lucide-react";

const DEMO_FILES = {
  "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Live Collab Demo</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to Live Collab! 🚀</h1>
    <p>Start editing the HTML, CSS, or JS to see changes in real-time.</p>
    <button id="btn">Click Me!</button>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
  "styles.css": `body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e0000, #0a0000);
  font-family: 'Inter', sans-serif;
  color: white;
}

.container {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem 3rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

h1 {
  margin-top: 0;
  color: #ef4444;
}

button {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background: #b91c1c;
  transform: translateY(-2px);
}`,
  "script.js": `const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
  btn.innerText = 'Clicked! 🎉';
  btn.style.background = '#10b981';
  
  setTimeout(() => {
    btn.innerText = 'Click Me!';
    btn.style.background = '#dc2626';
  }, 2000);
});`
};

export default function Collab({ projectId: initialProjectId }) {
  const [projectId, setProjectId] = useState(initialProjectId || "");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { user } = useUser();
  
  // Initialize with demo files
  const [files, setFiles] = useState(DEMO_FILES);
  const [activeFile, setActiveFile] = useState("index.html");

  /* =========================
  INVITE LINK
  ========================= */
  useEffect(() => {
    if (!projectId) return;
    setInviteLink(`${window.location.origin}/ai/live/${projectId}`);
  }, [projectId]);

  const copyInvite = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    alert("Invite Link Copied!");
  };

  /* =========================
  SOCKET EVENTS
  ========================= */
  useEffect(() => {
    // Check initial connection
    if (socket.connected) setIsConnected(true);

    const onConnect = () => {
      console.log("connected", socket.id);
      setIsConnected(true);
    };
    
    const onDisconnect = () => {
      console.log("disconnected");
      setIsConnected(false);
    };

    const onError = (msg) => {
      console.log(msg);
      alert(msg);
    };
    
    const onPresence = (onlineUsers) => setUsers(onlineUsers);
    
    const onSync = (payload) => {
      if (payload.projectId) setProjectId(payload.projectId);
      if (payload.ownerName) setOwnerName(payload.ownerName);
      if (payload.projectName) setProjectName(payload.projectName);
      if (payload.files && Object.keys(payload.files).length > 0) {
        setFiles(payload.files);
        if (!activeFile) {
          setActiveFile(Object.keys(payload.files)[0]);
        }
      }
    };
    
    const onCodeReceive = (updatedFiles) => setFiles(updatedFiles);
    const onChatHistory = (msgs) => setMessages(msgs);
    const onChatReceive = (msg) => setMessages((prev) => [...prev, msg]);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("socket:error", onError);
    socket.on("presence:update", onPresence);
    socket.on("project:syncCode", onSync);
    socket.on("project:receiveCode", onCodeReceive);
    socket.on("chat:history", onChatHistory);
    socket.on("chat:receive", onChatReceive);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("socket:error", onError);
      socket.off("presence:update", onPresence);
      socket.off("project:syncCode", onSync);
      socket.off("project:receiveCode", onCodeReceive);
      socket.off("chat:history", onChatHistory);
      socket.off("chat:receive", onChatReceive);
    };
  }, []);

  /* =========================
  CODE SYNC
  ========================= */
  const sendCode = (updatedFiles) => {
    if (!projectId) return;
    socket.emit("project:codeChange", { projectId, files: updatedFiles });
  };

  /* =========================
  CHAT
  ========================= */
  const sendChat = (message) => {
    if (!message.trim() || !projectId) return;
    socket.emit("chat:message", { projectId, message });
  };

  /* =========================
  FILES OPS
  ========================= */
  const createFile = (name) => {
    if (files[name]) return;
    setFiles({ ...files, [name]: "" });
    setActiveFile(name);
  };

  const deleteFile = (name) => {
    const copy = { ...files };
    delete copy[name];
    setFiles(copy);
    const remaining = Object.keys(copy);
    if (remaining.length) setActiveFile(remaining[0]);
  };

  const renameFile = (oldName, newName) => {
    if (files[newName]) return;
    const copy = { ...files };
    copy[newName] = copy[oldName];
    delete copy[oldName];
    setFiles(copy);
    setActiveFile(newName);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0000] text-slate-200 overflow-hidden font-sans">
      
      {/* CUSTOM NAVBAR */}
      <div className="h-[64px] bg-black/40 backdrop-blur-md border-b border-red-500/10 flex items-center justify-between px-6 shrink-0 relative z-10 w-full shadow-md shadow-red-900/5">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-display tracking-tight text-white">Live<span className="text-red-500">Collab</span></span>
          </div>
          <div className="h-5 w-px bg-white/10 ml-2"></div>
          <div className="flex flex-col ml-2">
            <span className="text-sm font-bold text-white tracking-wide">{projectName || "Live Project"}</span>
          </div>
          
          <div className="h-5 w-px bg-white/10 ml-2"></div>
          
          {/* Connection Status */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>

        {/* ACTIONS / RIGHT */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-lg ${showChat ? 'bg-red-600 text-white shadow-red-600/20' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300'}`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat ({users.length})
          </button>
          
          <div className="h-6 w-px bg-white/10 mx-1"></div>
          
          {/* PROFILE */}
          <div className="w-9 h-9 rounded-full border-2 border-red-500/30 overflow-visible ml-2 shadow-md relative z-50">
            <UserProfile />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden p-3 gap-3 relative">
        
        {/* LEFT SIDEBAR (Project Info + File Manager + Users) */}
        <div className="w-[280px] flex flex-col gap-3">
          
          {/* PROJECT INFO */}
          <div className="rounded-2xl bg-[#110505] border border-red-500/10 backdrop-blur-xl flex flex-col overflow-hidden relative shadow-lg p-4 shrink-0">
            <p className="text-xs text-slate-400 mb-3 flex items-center">
              <Users className="w-3.5 h-3.5 mr-1.5 text-red-500" /> Host: <span className="text-slate-200 ml-1 font-medium">{ownerName || "Loading..."}</span>
            </p>
            <button
              onClick={copyInvite}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-red-500/20"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Copy Room Link
            </button>
          </div>

          {/* ONLINE USERS */}
          <div className="rounded-2xl bg-[#110505] border border-red-500/10 backdrop-blur-xl flex flex-col overflow-hidden relative shadow-lg p-4 shrink-0">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-3 flex items-center">
              <Users className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Online ({users.length})
            </div>
            <div className="flex flex-col gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
              {users.map((u, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                  <span className="truncate">{u.name} {u.userId === user?._id && "(You)"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FILE MANAGER */}
          <div className="flex-1 rounded-2xl bg-[#110505] border border-red-500/10 backdrop-blur-xl flex flex-col overflow-hidden shadow-lg min-h-0">
            <div className="h-10 border-b border-red-500/10 flex items-center px-4 shrink-0 bg-black/40">
              <Terminal className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Explorer</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <FileManager
                files={files}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                createFile={createFile}
                deleteFile={deleteFile}
                renameFile={renameFile}
              />
            </div>
          </div>
        </div>

        {/* EDITOR (Slightly increased to 40% to slightly reduce preview) */}
        <div className="w-[45%] flex flex-col rounded-2xl bg-[#110505] border border-red-500/10 backdrop-blur-xl overflow-hidden shadow-lg">
          <div className="flex-1 bg-black">
            <Editorr
              files={files}
              activeFile={activeFile}
              setFiles={setFiles}
              isCollaborative={true}
              onCodeChange={sendCode}
            />
          </div>
        </div>

        {/* PREVIEW PANEL (Remaining width, slightly reduced) */}
        <div className="flex-1 rounded-2xl bg-[#110505] border border-red-500/10 backdrop-blur-xl overflow-hidden shadow-lg relative min-h-0">
          <PreviewPanel files={files} />

          {/* CHAT OVERLAY SIDEBAR */}
          {showChat && (
            <div 
              className="absolute top-0 right-0 h-full w-[350px] bg-black/90 backdrop-blur-3xl border-l border-red-500/20 shadow-2xl shadow-black flex flex-col"
            >
              <div className="flex justify-between items-center px-4 py-3 border-b border-red-500/20 bg-red-950/20">
                <span className="font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-red-500" /> Room Chat
                </span>
                <button 
                  onClick={() => setShowChat(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatBox users={users} messages={messages} sendChat={sendChat} currentUser={user} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}