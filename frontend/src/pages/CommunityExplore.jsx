import { useState } from "react";
import { CommSidebar } from "../components/CommSidebar";
import { CommunityMembers } from "../components/CommunityMembers";
import { useParams } from "react-router-dom";
import { CommunityProject } from "../components/CommunityProject";
import PostFeed from "../components/PostFeed";
import CreatePost from "../components/CreatePost";

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

    {activeView === "Community" && (
  <div className="flex h-[calc(100vh-60px)] gap-4 p-4">

    {/* LEFT → CREATE POST */}
    <div className="w-[250px] bg-[#020617] p-3 rounded-lg">
      <CreatePost communityId={id} />
    </div>

    {/* CENTER → POSTS */}
    <div className="flex-1 overflow-y-auto">
      <PostFeed communityId={id} />
    </div>

    {/* RIGHT → MEMBERS */}
    <div className="w-[250px] bg-[#020617] p-3 rounded-lg">
      <CommunityMembers id={id} />
    </div>

  </div>
)}
    {activeView === "CommunityProject" && 
    <CommunityProject
      communityId={id}
      projectId={selectedProject}
    />}
    </div>
  );
};

export default CommunityExplore;