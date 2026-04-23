import { useEffect, useState } from "react";
import { useCommunity } from "../hooks/useCommunity";
import { Crown, Shield, User, MoreVertical, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export const CommunityMembers = ({ id }) => {
  const {
    getCommunityMembers,
    communitymembers,
    removeMember,
    assignRole
  } = useCommunity();

  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (id) {
      getCommunityMembers(id);
    }
  }, [id]);

  // 🔥 ROLE BADGE
  const getRoleBadge = (role) => {
    if (role === "owner") {
      return (
        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#e53e3e] bg-[#e53e3e]/10 px-2 py-0.5 rounded-sm">
          <Crown size={10} /> Owner
        </span>
      );
    }
    if (role === "admin") {
      return (
        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#a855f7] bg-[#a855f7]/10 px-2 py-0.5 rounded-sm">
          <Shield size={10} /> Admin
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#888] bg-[#252525] px-2 py-0.5 rounded-sm">
        <User size={10} /> Member
      </span>
    );
  };

  return (
    <div className="h-full bg-transparent flex flex-col">
      {/* MEMBERS LIST */}
      <div className="space-y-2">
        {Array.isArray(communitymembers) && communitymembers.length > 0 ? (
          communitymembers.map((cm) => (
            <div key={cm.user._id} className="relative group">
              {/* 🔥 MEMBER CARD */}
              <div
                onClick={() =>
                  setSelectedMember(selectedMember === cm.user._id ? null : cm.user._id)
                }
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors border
                ${
                  selectedMember === cm.user._id
                    ? "bg-[#252525] border-[#444]"
                    : "bg-[#111111] hover:bg-[#1a1a1a] border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#252525] border border-[#333] flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={cm.user.avatar || `https://ui-avatars.com/api/?name=${cm.user.username || 'U'}&background=252525&color=f0f0f0`} 
                      alt="avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-[#f0f0f0] truncate">
                      {cm.user.username}
                    </p>
                    <p className="text-[10px] text-[#666] truncate">
                      {cm.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getRoleBadge(cm.role)}
                  <button className="text-[#666] hover:text-white p-1">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>

              {/* 🔽 DROPDOWN MENU */}
              {selectedMember === cm.user._id && (
                <div className="mt-1 ml-4 p-2 bg-[#161616] rounded-md border border-[#2d2d2d] shadow-xl space-y-1 z-10 relative">
                  
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2 px-2">Manage User</div>
                  
                  {/* ROLE CHANGE */}
                  {cm.role !== "owner" && (
                    <div className="flex items-center gap-2 px-2 pb-2 mb-2 border-b border-[#2d2d2d]">
                      <button
                        className="flex-1 flex justify-center items-center gap-1 bg-[#252525] hover:bg-[#333] border border-[#333] py-1 rounded text-xs transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          assignRole(id, cm.user._id, "admin");
                        }}
                      >
                        <ArrowUp size={12} className="text-[#a855f7]" /> Admin
                      </button>

                      <button
                        className="flex-1 flex justify-center items-center gap-1 bg-[#252525] hover:bg-[#333] border border-[#333] py-1 rounded text-xs transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          assignRole(id, cm.user._id, "member");
                        }}
                      >
                        <ArrowDown size={12} className="text-[#888]" /> Member
                      </button>
                    </div>
                  )}

                  {/* REMOVE */}
                  <button
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#e53e3e] hover:bg-[#e53e3e]/10 rounded transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove ${cm.user.username} from the community?`)) {
                        removeMember(cm.user._id, id);
                      }
                    }}
                  >
                    <Trash2 size={14} /> Remove Member
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-[#666] italic">No members found.</p>
        )}
      </div>
    </div>
  );
};