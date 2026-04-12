import { useState } from "react";
import { CommSidebar } from "../components/CommSidebar";
import { CommunityMembers } from "../components/CommunityMembers";

const CommunityExplore = ({ id }) => {
  const [communitysidebar, setcommunitysidebar] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <div className="h-screen bg-[#0f172a] text-white">

      {/* TOP BUTTON */}
      <div className="p-4">
        <button
          onClick={() => setcommunitysidebar(!communitysidebar)}
          className="bg-indigo-500 px-3 py-1 rounded"
        >
          Select Project
        </button>
      </div>

      {/* SIDEBAR */}
      <CommSidebar
        id={id}
        communitysidebar={communitysidebar}
        onSelect={(project) => {
          setSelectedProject(project);
          setcommunitysidebar(false); // close after select
        }}
      />

      {/* MAIN CONTENT */}
      {selectedProject ? (
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
      )}
    </div>
  );
};

export default CommunityExplore;