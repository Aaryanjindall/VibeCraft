import { useEffect, useState } from "react";
import { useProject } from "../hooks/useProject";
import ProjectsGrid from "../components/ProjectsGrid";
import ProjectDetails from "../components/ProjectDetails";
import Navbar from "../components/Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { useFiles } from "../context/FileContext";

const MyProject = () => {
  const { Projects, getProjects,loadProject } = useProject();

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const {setCurrentProject} = useFiles();

  useEffect(() => {
    getProjects();
  }, []);
  const Navigate = useNavigate();
  const handleOpen = async (id) => {
    await loadProject(id);
    Navigate("/ai"); // redirect
  };

  // 🔥 FILTER LOGIC
  const filteredProjects = Projects.filter((p) => {
    if (activeTab === "created") return p.isFork === false;
    if (activeTab === "forked") return p.isFork === true;
    return true;
  });


  return (
    <div className="h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white flex flex-col">

      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        {/* LEFT CONTENT */}
        <div className="flex-1 p-6 overflow-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-semibold">⚡ My Projects</h1>

            <input
              placeholder="Search..."
              className="bg-[#1e293b] px-3 py-1 rounded-lg border border-[#334155]"
            />
          </div>

          {/* 🔥 TABS */}
          <div className="flex gap-3 mb-6">
            {["all", "created", "forked"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 rounded-lg capitalize 
                ${activeTab === tab
                  ? "bg-indigo-500"
                  : "bg-[#1e293b] hover:bg-[#273449]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* GRID */}
          <ProjectsGrid
            projects={filteredProjects}
            onSelect={(project) => {
    setSelectedProject(project);
    setCurrentProject({
      id: project._id,
      name: project.name
    });
  }}
            onOpen={handleOpen}
          />
        </div>

        {/* 🔥 RIGHT DETAILS (IN PAGE) */}
        {selectedProject && (
          <div className="w-[420px] bg-[#111827] border-l border-[#334155] p-6 transition-all">

            <ProjectDetails project={selectedProject} 
            onOpen={handleOpen} 
            />

          </div>
        )}

      </div>
    </div>
  );
};

export default MyProject;