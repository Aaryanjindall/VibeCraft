import { useState } from "react";
import { CommSidebar } from "../components/CommSidebar";
import { CommunityMembers } from "../components/CommunityMembers";
import { useParams } from "react-router-dom";
import { CommunityProject } from "../components/CommunityProject";

const CommunityExplore = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeView, setActiveView] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  return (
    <div className="h-screen bg-[#0f172a] text-white">

      {/* TOP BUTTON */}
      <div className="p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-indigo-500 px-3 py-1 rounded"
        >
          Select Project
        </button>
      </div>

      {/* SIDEBAR */}
      <CommSidebar
        communityId={id}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveView={setActiveView}
        setSelectedProject={setSelectedProject}
        activeView={activeView}
      />

      {/* MAIN CONTENT */}
      {/* {selectedProject ? (
        <div className="p-6">
          <h2 className="text-xl font-semibold">
            Project: {selectedProject.name}
          </h2>
          <CommunityMembers 
          id={id}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          Select a project to continue
        </div>
      )} */}

      {/* {selectedCommunityProject && (
      <CommunityProject
       communityId={id}
       projectId={selectedCommunityProject}
       />
    )} */}

    {activeView === "Community" && 
     <CommunityMembers 
      id={id}
    />}
    {activeView === "CommunityProject" && 
    <CommunityProject
      communityId={id}
      projectId={selectedProject}
    />}
    </div>
  );
};

export default CommunityExplore;