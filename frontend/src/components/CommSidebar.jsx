import { useEffect, useState } from "react";
import { useCommunity } from "../hooks/useCommunity";
import { CommunityProject } from "./CommunityProject";
import { useUser } from "../context/UserProvider";

export const CommSidebar = ({ communityId,sidebarOpen,setSidebarOpen,setActiveView,setSelectedProject,activeView }) => {
  const { getCommunityProjects, communityProjects,communitymembers,removeProject,getCommunityMembers } = useCommunity();
  useEffect(() => {
    if (sidebarOpen) {
      getCommunityProjects(communityId);
      getCommunityMembers(communityId);
    }
  }, [sidebarOpen, communityId]);

  const {user} = useUser();
  const currentUserRole = communitymembers.find(m => m.user._id.toString() === user._id.toString())?.role;

  if (!sidebarOpen) return null;
 
  return (
    <div className="fixed right-0 top-0 w-[280px] h-full bg-[#111827] text-white p-4 border-l border-[#334155]">
      <h3 className="text-center text-lg mb-4">Projects</h3>
      <div className="space-y-3">
        {Array.isArray(communityProjects) &&
  communityProjects.map((cp) => (
    <div
      key={cp._id}
      className="bg-[#1e293b] p-3 rounded-lg hover:bg-[#273449] cursor-pointer"
    >
      {cp.name}

      {/* OPEN COMMUNITY */}
      <button
        className="block mt-2 text-blue-400"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedProject(cp._id);
          setActiveView("Community");
          setSidebarOpen(false);
        }}
      >
        Open Community
      </button>

      {/* OPEN PROJECT */}
      <button
        className="block mt-2 text-blue-400"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedProject(cp._id);
          setActiveView("CommunityProject");
          setSidebarOpen(false);
        }}
      >
        Open Project
      </button>

      {/* 🔥 REMOVE BUTTON (ONLY OWNER) */}
      {currentUserRole === "owner" && (
        <button
          className="block mt-2 text-red-400 hover:text-red-300"
          onClick={(e) => {
            e.stopPropagation();

            if (!confirm("Remove this project from community?")) return;

            removeProject(communityId, cp._id);
          }}
        >
          ❌ Remove from Community
        </button>
      )}
    </div>
  ))}
      </div>
      

    </div>
    
  );
};