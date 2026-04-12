import { Trash2, ExternalLink, MoreHorizontal } from "lucide-react";
import { useProject } from "../hooks/useProject";
const emojis = ["🚀", "🔥", "💡", "⚡", "🎯"];
const ProjectCard = ({ project, onOpen, onDelete ,onSelect }) => {
    const randomEmoji = emojis[project._id % emojis.length];
    const{deleteProject} = useProject();
    
  return (
    <div 
    onClick={()=> onSelect(project)}
    className="bg-[#1e293b] border border-[#334155] rounded-xl p-5
      hover:bg-[#273449] hover:scale-[1.02] transition duration-200
      cursor-pointer shadow-md hover:shadow-indigo-500/20">

      {/* TOP */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{project.name}</h2>
        <span className="text-xl">{randomEmoji}</span>
      </div>

        {/* THREE DOTS */}
        

      {/* DATE */}
      <p className="text-sm text-gray-400 mt-2">
        {new Date(project.createdAt).toDateString()}
      </p>

      {/* BOTTOM ACTIONS */}
      <div className="flex justify-between items-center mt-5">
        <span className="bg-indigo-500/20 px-2 py-1 rounded">
          {project.type}
        </span>

        {/* OPEN BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(project._id)}}
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          <ExternalLink size={16} />
          Open
        </button>

        {/* DELETE BUTTON */}
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
          <span>•••</span>
      </div>
    </div>
  );
};

export default ProjectCard;