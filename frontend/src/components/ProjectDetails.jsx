import { useEffect, useState } from "react";
import { useDeploy } from "../hooks/useDeploy";
import { ExternalLink, Trash2 } from "lucide-react";
import { useProject } from "../hooks/useProject";
import { useCommunity } from "../hooks/useCommunity";

const ProjectDetails = ({ project,onOpen }) => {

  const {deploys,deploy,loadDeploys,deploynet} = useDeploy();
  const [showDropdown,setShowDropdown] = useState(false);
 useEffect(() => {
  loadDeploys();
  loadCommunities(); 
}, []);
  const {deleteProject} = useProject();
  const {addProjectToCommunity, communities, loadCommunities} = useCommunity();
  const handleAdd = async (communityId) => {
  setshowDropdown(false);
  await addProjectToCommunity(project._id, communityId);
  alert("Added to Community ");
};
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
      <p className="text-gray-400 text-sm mb-5">
        {new Date(project.createdAt).toDateString()}
      </p>
      <div className="space-y-3">

          <div>
            <h2>Deploy Status</h2>
            <div>
            <button onClick={deploy} >Quick Deploy</button>
            <button onClick={deploynet}>
              Deploy on netlify 
            </button>
            </div>
            <div>
            <h3>All Deploys</h3>
              <div>

              </div>
            </div>
              {Array.isArray(deploys) &&
        deploys.map((d) => (
          <div key={d._id}>
            <p>{d.type}</p>
            <p>{d.status}</p>

            <a href={d.url} target="_blank" rel="noreferrer">
              {d.url}
            </a>
          </div>
        ))}
          </div>
        <div className="relative">
        <button className="w-full bg-green-500 py-2 rounded-lg"
        onClick={() => setShowDropdown(!showDropdown)}>
          + Add to Community
        </button>
        {showDropdown && (
  <div className="absolute left-0 right-0 mt-2 bg-[#1e293b] border border-[#334155] rounded-lg z-50 max-h-60 overflow-y-auto">
  {communities.map((c) => (
    <div
      key={c._id}
      onClick={() => handleAdd(c._id)}
      className="p-2 hover:bg-[#334155] cursor-pointer rounded"
    >
      {c.name}
    </div>
  ))}
</div>
)}
</div>
        <div>
          <h3>Edit Project</h3>
          <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(project._id)}}
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          <ExternalLink size={16} />
          Open
        </button>
        </div>
        <div>
          <h3>Delete Project</h3>
            <button
          onClick={(e) => {
            e.stopPropagation();
            deleteProject(project._id);
          }}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          <Trash2 size={16} />
          Delete
        </button>
          
        </div>

      </div>
    </>
  );
};

export default ProjectDetails;