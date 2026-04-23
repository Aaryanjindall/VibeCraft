import { useEffect, useState } from "react";
import { useProject } from "../hooks/useProject";
import PublicProjectGrid from "../components/Publicprojectgrid";
import { Globe, Search, Code2 } from "lucide-react";

const Explore = () => {
  const { loadpublic, Publicprojects } = useProject();
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadpublic();
  }, []);

  const filteredProjects = Array.isArray(Publicprojects) ? Publicprojects.filter((p) => {
    if (search.trim() !== "") {
      return p.name.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  }) : [];

  return (
    <div className="h-full flex flex-col bg-[#111111] text-[#f0f0f0]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 mb-4 sm:mb-6 border-b border-[#2d2d2d] pb-4 px-4 sm:px-6 pt-4 sm:pt-6 bg-[#1a1a1a] gap-4 sm:gap-0">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2 text-[#f0f0f0]">
            <Globe size={20} className="text-[#a855f7]" />
            Explore Projects
          </h1>
          <p className="text-xs text-[#888] mt-1">Discover and fork public projects created by the community.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search public projects..."
            className="input-ide w-full pl-9 py-2 bg-[#111111] text-sm"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar">
        {filteredProjects.length > 0 ? (
          <PublicProjectGrid projects={filteredProjects} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#666] border border-dashed border-[#2d2d2d] rounded-xl p-10 bg-[#1a1a1a]">
            <Code2 size={32} className="mb-3 text-[#444]" />
            <p className="text-sm">No projects found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Explore;