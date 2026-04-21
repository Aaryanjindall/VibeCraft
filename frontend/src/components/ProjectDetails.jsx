import { useEffect, useState } from "react";
import { ExternalLink, Trash2, X } from "lucide-react";
import { useDeploy } from "../hooks/useDeploy";
import { useCommunity } from "../hooks/useCommunity";
import { toast } from "react-toastify";

const ProjectDetails = ({
  project,
  onOpen,
  deleteProject,   // 🔥 parent se pass kar
  onClose          // 🔥 sidebar close
}) => {

  const { deploys, deploy, loadDeploys, deploynet } = useDeploy();
  const { addProjectToCommunity, communities, loadCommunities } = useCommunity();
  const [addedCommunity, setAddedCommunity] = useState(project.community);
  const isInCommunity = addedCommunity !== null;

  const [showDropdown, setShowDropdown] = useState(false);

  // 🔥 load data
  useEffect(() => {
    loadDeploys();
    loadCommunities();
  }, [project]);

  // 🔥 ADD TO COMMUNITY
 const handleAdd = async (communityId) => {
  try {
    await addProjectToCommunity(project._id, communityId);

    // 🔥 instant UI update
    setAddedCommunity(communityId);

    toast.success("Added to community 🚀");
    setShowDropdown(false);

  } catch (err) {
    toast.error(err.message || "Already added or error");
  }
};

  return (
    <div className="relative h-full">

      {/* 🔥 CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        <X size={18} />
      </button>

      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
      <p className="text-gray-400 text-sm mb-5">
        {new Date(project.createdAt).toDateString()}
      </p>

      <div className="space-y-4">

        {/* 🚀 DEPLOY */}
        <div>
          <h3 className="mb-2">Deploy Status</h3>

          <div className="flex gap-2 mb-3">
            <button onClick={deploy} className="bg-blue-500 px-3 py-1 rounded">
              Quick Deploy
            </button>

            <button onClick={deploynet} className="bg-purple-500 px-3 py-1 rounded">
              Netlify
            </button>
          </div>

          {Array.isArray(deploys) &&
            deploys.map((d) => (
              <div key={d._id} className="text-sm mb-2">
                <p>{d.type} - {d.status}</p>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400"
                >
                  {d.url}
                </a>
              </div>
            ))}
        </div>

        {/* ➕ ADD TO COMMUNITY */}
        {isInCommunity ? (
  <div className="bg-[#1e293b] p-3 rounded-lg">
    <p className="text-sm text-gray-400">Community</p>
    <p className="text-white font-medium">
      {project.communityName || "Already added"}
    </p>
  </div>
) : (
  <div className="relative">
    <button
      className="w-full bg-green-500 py-2 rounded-lg"
      onClick={() => setShowDropdown(!showDropdown)}
    >
      + Add to Community
    </button>

    {showDropdown && (
      <div className="absolute left-0 right-0 mt-2 bg-[#1e293b] border border-[#334155] rounded-lg z-50 max-h-60 overflow-y-auto">
        {communities.map((c) => (
          <div
            key={c._id}
            onClick={() => handleAdd(c._id)}
            className="p-2 hover:bg-[#334155] cursor-pointer"
          >
            {c.name}
          </div>
        ))}
      </div>
    )}
  </div>
)}

        {/* ✏️ OPEN */}
        <div>
          <h3>Edit Project</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(project._id);
            }}
            className="text-indigo-400 hover:text-indigo-300"
          >
            <ExternalLink size={16} /> Open
          </button>
        </div>

        {/* 🗑 DELETE */}
        <div>
          <h3>Delete Project</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteProject(project._id);
              onClose(); // 🔥 sidebar close after delete
            }}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;