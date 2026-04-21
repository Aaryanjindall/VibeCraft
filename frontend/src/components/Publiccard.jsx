import { ExternalLink } from "lucide-react";

const Publiccard = ({ project, onOpen }) => {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5
      hover:bg-[#273449] hover:scale-[1.02] transition duration-200
      cursor-pointer shadow-md hover:shadow-indigo-500/20">

      {/* TITLE */}
      <h2 className="text-lg font-semibold">{project.name}</h2>

      {/* DATE */}
      <p className="text-sm text-gray-400 mt-2">
        {new Date(project.createdAt).toDateString()}
      </p>

      {/* ACTION */}
      <button
        onClick={() => onOpen(project._id)}
        className="mt-4 flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm"
      >
        <ExternalLink size={16} />
        Open
      </button>
    </div>
  );
};

export default Publiccard;