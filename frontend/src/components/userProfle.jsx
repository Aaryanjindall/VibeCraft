import { useState, useRef, useEffect, useMemo } from "react"
import { useUser } from "../context/UserProvider";
import hacker from "../assets/hacker.png";
import { LogOut, Settings, User, Mail, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [open, setOpen] = useState(false);
    const { user, handleLogout } = useUser();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    
    const arr = [hacker];
    const rand = useMemo(() => Math.floor(Math.random() * arr.length), [arr.length]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onLogout = async () => {
        await handleLogout();
        navigate("/");
    }

  return (
    <div className="relative w-full h-full" ref={dropdownRef}>
      <img
        src={user?.avatar || arr[rand]}
        alt="profile"
        className="w-full h-full rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute right-0 top-12 w-64 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
          {/* Header Info */}
          <div className="p-4 border-b border-[#2d2d2d] bg-[#111111]">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || arr[rand]}
                alt="profile large"
                className="w-12 h-12 rounded-full border border-[#444] object-cover"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-[#f0f0f0] truncate">{user?.username || "Guest User"}</p>
                <p className="text-xs text-[#888] truncate flex items-center gap-1 mt-0.5">
                  <Mail size={10} /> {user?.email || "No email"}
                </p>
              </div>
            </div>
            {user?.role && (
                <div className="mt-3 flex items-center gap-1.5 px-2 py-1 bg-[#252525] rounded-md border border-[#333] text-[10px] text-[#4ade80] w-max uppercase tracking-wider font-semibold">
                  <Shield size={10} /> {user.role}
                </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#d1d1d1] hover:bg-[#252525] hover:text-white rounded-md transition-colors text-left">
              <User size={16} className="text-[#a855f7]" />
              Your Profile
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#d1d1d1] hover:bg-[#252525] hover:text-white rounded-md transition-colors text-left">
              <Settings size={16} className="text-[#888]" />
              Settings
            </button>
          </div>

          {/* Footer Action */}
          <div className="p-2 border-t border-[#2d2d2d] bg-[#111111]">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#e53e3e] hover:bg-[#e53e3e]/10 rounded-md transition-colors text-left font-medium"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;