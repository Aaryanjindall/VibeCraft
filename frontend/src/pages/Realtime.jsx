import { useState } from "react";
import socket from "../utils/socket";
import Collab from "../components/Collboration";
import { Users, Link as LinkIcon, ArrowRight, Loader2, Play } from "lucide-react";

const RealTime = () => {
  const [roomInput, setRoomInput] = useState("");
  const [projectId, setProjectId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Copied!");
  };

  const createRoom = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/rooms/create-live", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setProjectId(data.projectId);
      setRoomCode(data.roomCode);
      setRoomInput(data.roomCode);
      setInviteLink(`${window.location.origin}/ai/live/${data.roomCode}`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = () => {
    if (!roomInput.trim()) return;

    if (roomInput.length === 24) {
      setProjectId(roomInput);
      socket.emit("project:join", {
        projectId: roomInput,
      });
    } else {
      setRoomCode(roomInput);
      socket.emit("project:join", {
        roomCode: roomInput,
      });
    }
    setJoined(true);
  };

  if (joined) {
    return <Collab projectId={projectId} roomCode={roomCode} />;
  }

  return (
    <div className="flex-1 min-h-screen bg-[#030303] p-8 flex items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0a0000]/60 border border-red-500/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative z-10 shadow-red-900/5">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 flex items-center justify-center mb-4 shadow-lg shadow-red-500/10">
            <Users className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Live Collaboration</h1>
          <p className="text-slate-400 text-sm">Create a new live room or join an existing one to code together in real-time.</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={createRoom}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            {loading ? "Creating Room..." : "Create Live Room"}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-red-500/10"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-medium uppercase tracking-wider">OR JOIN EXISTING</span>
            <div className="flex-grow border-t border-red-500/10"></div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="Enter Room Code or Project ID"
                className="w-full bg-black/40 border border-red-500/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono text-sm"
              />
            </div>
            
            {roomCode && !joined && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="text-xs text-red-300 font-mono truncate">{inviteLink}</span>
                <button
                  onClick={copyInvite}
                  className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-colors"
                >
                  <LinkIcon className="w-3 h-3" />
                  Copy
                </button>
              </div>
            )}

            <button
              onClick={joinRoom}
              disabled={!roomInput.trim()}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Room
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTime;