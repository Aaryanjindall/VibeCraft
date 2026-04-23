import { useEffect, useState } from "react";
import { useProject } from "../hooks/useProject";
import ProjectsGrid from "../components/ProjectsGrid";
import ProjectDetails from "../components/ProjectDetails";
import { Navigate, useNavigate } from "react-router-dom";
import { useFiles } from "../context/FileContext";
import { Folder, Search, FileCode2, GitFork, LayoutGrid } from "lucide-react";

const MyProject = () => {
  const { Projects, getProjects, loadProject, deleteProject } = useProject();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const { setCurrentProject } = useFiles();
  const [search, setSearch] = useState("");
  
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
    if (activeTab === "created" && p.isFork === true) return false;
    if (activeTab === "forked" && p.isFork === false) return false;
    if (search.trim() !== "") {
      return p.name.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-[#111111] text-[#f0f0f0] p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 mb-4 sm:mb-6 border-b border-[#2d2d2d] pb-4 gap-4 sm:gap-0">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Folder size={20} className="text-[#a855f7]" />
          My Projects
        </h1>
        
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="input-ide w-full pl-9 py-1.5"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0 gap-4 md:gap-6 overflow-hidden">
        {/* LEFT NAV PANEL */}
        <div className="w-full md:w-[200px] shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0 hide-scrollbar">
          {[
            { id: "all", label: "All Projects", icon: <LayoutGrid size={16} /> },
            { id: "created", label: "Created", icon: <FileCode2 size={16} /> },
            { id: "forked", label: "Forked", icon: <GitFork size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2
              ${activeTab === tab.id
                  ? "bg-[#1a1a1a] text-white border border-[#2d2d2d]"
                  : "text-[#888] hover:bg-[#161616] hover:text-[#d1d1d1] border border-transparent"
                }`}
            >
              <div className={activeTab === tab.id ? "text-[#a855f7]" : ""}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN GRID AREA */}
        <div className="flex-1 overflow-y-auto pr-2 pb-8">
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
            deleteProject={deleteProject}
          />
        </div>

        {/* 🔥 RIGHT DETAILS PANEL */}
        {selectedProject && (
          <div className="w-full md:w-[320px] shrink-0 ide-panel border-[#2d2d2d] bg-[#1a1a1a] flex flex-col h-[400px] md:h-full overflow-hidden shadow-2xl transition-all duration-300">
            <ProjectDetails
              project={selectedProject}
              onOpen={handleOpen}
              deleteProject={deleteProject}
              onClose={() => setSelectedProject(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProject;