import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Users } from "lucide-react";

export default function ChatBox({ users, messages, sendChat, currentUser }) {
  const [chat, setChat] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!chat.trim()) return;
    sendChat(chat);
    setChat("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* HEADER */}
      <div className="h-10 border-b border-red-500/10 flex items-center justify-between px-4 shrink-0 bg-black/40">
        <div className="flex items-center">
          <MessageSquare className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Team Chat</span>
        </div>
        <div className="flex items-center text-xs text-slate-400 font-medium">
          <Users className="w-3.5 h-3.5 mr-1 text-emerald-500" />
          {users.length} Online
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm">
            <MessageSquare className="w-8 h-8 opacity-20 mb-2 text-red-500" />
            No messages yet.
          </div>
        ) : (
          messages.map((m, i) => {
            // Depending on how backend populates, m.sender might be an object or string
            const senderId = typeof m.sender === 'object' && m.sender !== null ? m.sender._id : m.sender;
            const currentUserId = currentUser?._id || currentUser?.id;
            const isMe = senderId === currentUserId;

            return (
              <div key={i} className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}>
                <span className={`text-[10px] text-slate-400 font-medium mb-0.5 ${isMe ? 'mr-1' : 'ml-1'}`}>
                  {isMe ? "You" : (m.senderName || "User")}
                </span>
                <div 
                  className={`px-3 py-2 text-sm text-white w-fit max-w-[90%] shadow-sm ${
                    isMe 
                      ? 'bg-red-600 rounded-xl rounded-tr-sm shadow-red-900/20' 
                      : 'bg-white/10 border border-white/5 rounded-xl rounded-tl-sm'
                  }`}
                >
                  {m.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 bg-black/40 border-t border-red-500/10 shrink-0 flex items-center gap-2">
        <input
          className="flex-1 bg-black/60 border border-red-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-red-500/50 transition-colors"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="p-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}