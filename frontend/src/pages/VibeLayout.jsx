import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { useUser } from "../context/UserProvider";
import { LogOut, X, Mail, Shield } from "lucide-react";
import hacker from "../assets/hacker.png";

const VibeLayout = () => {
  const [usermodal, setusermodal] = useState(false);
  const { user, handleLogout } = useUser();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate("/");
  };

  return (
    <div className="flex bg-[#111111] h-screen text-[#f0f0f0] overflow-hidden relative">
      <Sidebar 
        setusermodal={setusermodal}
        usermodal={usermodal}
      />
      
      {/* 🔥 MAIN CONTENT - Full Height & Width */}
      <div className="sm:ml-[60px] sm:w-[calc(100%-60px)] w-full pb-[60px] sm:pb-0 h-screen relative flex flex-col">
        <Outlet />

        {/* 🌟 USER MODAL OVERLAY */}
        {usermodal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
              
              {/* Close button */}
              <button 
                onClick={() => setusermodal(false)}
                className="absolute top-4 right-4 text-[#888] hover:text-white transition-colors bg-[#252525] p-1.5 rounded-full hover:bg-[#333]"
              >
                <X size={16} />
              </button>

              {/* Cover Banner */}
              <div className="h-24 bg-gradient-to-r from-purple-600 to-indigo-600 w-full"></div>

              {/* Profile Info */}
              <div className="px-6 pb-6 relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-[#1a1a1a] bg-[#222] overflow-hidden -mt-12 mb-3 shadow-lg">
                  <img 
                    src={user?.avatar || hacker} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-1">{user?.username || "Guest User"}</h2>
                <div className="flex items-center gap-1.5 text-sm text-[#888] mb-4">
                  <Mail size={14} /> {user?.email || "No email provided"}
                </div>
                
                {user?.role && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#252525] border border-[#333] rounded-full text-xs font-semibold text-[#4ade80] uppercase tracking-wider mb-6">
                    <Shield size={12} /> {user.role}
                  </div>
                )}

                <div className="w-full h-[1px] bg-[#2d2d2d] mb-6"></div>

                <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 bg-[#e53e3e]/10 text-[#e53e3e] hover:bg-[#e53e3e] hover:text-white transition-colors border border-[#e53e3e]/20 py-3 rounded-lg font-semibold text-sm shadow-sm"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VibeLayout;