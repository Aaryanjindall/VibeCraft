import { useEffect, useState } from "react";
import { useCommunity } from "../hooks/useCommunity";
import { CommunityProject } from "./CommunityProject";

export const CommSidebar = ({ communityId,sidebarOpen,setSidebarOpen,setActiveView,setSelectedProject,activeView }) => {
  const { getCommunityProjects, communityProjects } = useCommunity();
  useEffect(() => {
    if (sidebarOpen) {
      getCommunityProjects(communityId);
    }
  }, [sidebarOpen, communityId]);
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
            </div>
          ))}
      </div>
      

    </div>
    
  );
};