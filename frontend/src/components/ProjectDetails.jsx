import { useEffect, useState } from "react";
import { ExternalLink, Trash2, X, Rocket, Server, Plus, Settings } from "lucide-react";
import { useDeploy } from "../hooks/useDeploy";
import { useCommunity } from "../hooks/useCommunity";
import { toast } from "react-toastify";

const ProjectDetails = ({
  project,
  onOpen,
  deleteProject,
  onClose
}) => {
  const { deploys, deploy, loadDeploys, deploynet } = useDeploy();
  const { addProjectToCommunity, communities, loadCommunities } = useCommunity();
  const [addedCommunity, setAddedCommunity] = useState(project.community);
  const isInCommunity = addedCommunity !== null;

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadDeploys();
    loadCommunities();
  }, [project]);

  const handleAdd = async (communityId) => {
    try {
      await addProjectToCommunity(project._id, communityId);
      setAddedCommunity(communityId);
      toast.success("Added to community 🚀");
      setShowDropdown(false);
    } catch (err) {
      toast.error(err.message || "Already added or error");
    }
  };

  return (
    <div className="flex flex-col h-full text-[#f0f0f0] relative bg-[#1a1a1a]">
      {/* HEADER */}
      <div className="ide-header justify-between bg-[#161616]">
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-[#a855f7]" />
          <span>Properties</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#666] hover:text-[#e53e3e] transition-colors p-1"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* TITLE INFO */}
        <div>
          <h2 className="text-xl font-bold mb-1 truncate" title={project.name}>{project.name}</h2>
          <p className="text-[10px] uppercase tracking-widest text-[#666]">
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* 🚀 DEPLOY */}
        <div className="bg-[#111111] p-4 rounded-md border border-[#2d2d2d]">
          <h3 className="text-xs uppercase font-bold text-[#888] tracking-widest mb-3">Deploy Status</h3>

          <div className="flex gap-2 mb-4">
            <button onClick={deploy} className="btn-ide btn-ide-primary flex-1 py-1.5">
              <Rocket size={14} /> Quick Deploy
            </button>
            <button onClick={deploynet} className="btn-ide bg-[#6366f1] hover:bg-[#4f46e5] text-white border-none flex-1 py-1.5">
              <Server size={14} /> Netlify
            </button>
          </div>

          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
            {Array.isArray(deploys) && deploys.length > 0 ? deploys.map((d) => (
              <div key={d._id} className="text-xs bg-[#1a1a1a] border border-[#2d2d2d] p-2 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#d1d1d1]">{d.type}</span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${d.status === 'success' ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-[#e53e3e]/10 text-[#e53e3e]'}`}>
                    {d.status}
                  </span>
                </div>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline truncate block"
                >
                  {d.url}
                </a>
              </div>
            )) : (
              <p className="text-xs text-[#666] italic">No deployments found.</p>
            )}
          </div>
        </div>

        {/* ➕ ADD TO COMMUNITY */}
        <div className="bg-[#111111] p-4 rounded-md border border-[#2d2d2d]">
          <h3 className="text-xs uppercase font-bold text-[#888] tracking-widest mb-3">Community Hub</h3>
          {isInCommunity ? (
            <div className="bg-[#1a1a1a] p-2.5 rounded border border-[#2d2d2d]">
              <p className="text-[10px] text-[#666] uppercase mb-1">Shared In</p>
              <p className="text-sm text-[#4ade80] font-medium truncate">
                {project.communityName || "Already Added"}
              </p>
            </div>
          ) : (
            <div className="relative">
              <button
                className="btn-ide btn-ide-secondary w-full py-2 flex items-center justify-center gap-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Plus size={14} /> Share to Community
              </button>

              {showDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333] rounded-md shadow-2xl z-50 max-h-48 overflow-y-auto">
                  {communities.length > 0 ? communities.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => handleAdd(c._id)}
                      className="p-2.5 text-xs hover:bg-[#e53e3e]/10 hover:text-[#e53e3e] cursor-pointer transition-colors border-b border-[#2d2d2d] last:border-0 truncate"
                    >
                      {c.name}
                    </div>
                  )) : (
                    <div className="p-3 text-xs text-[#888] italic text-center">No communities available</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1"></div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2 pt-4 border-t border-[#2d2d2d]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(project._id);
            }}
            className="btn-ide btn-ide-secondary w-full py-2 flex items-center justify-center gap-2"
          >
            <ExternalLink size={14} /> Open in IDE
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              if(confirm("Are you sure you want to permanently delete this project?")) {
                deleteProject(project._id);
                onClose();
              }
            }}
            className="btn-ide w-full py-2 flex items-center justify-center gap-2 text-[#e53e3e] bg-[#e53e3e]/10 hover:bg-[#e53e3e] hover:text-white transition-colors border border-transparent"
          >
            <Trash2 size={14} /> Delete Project
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;