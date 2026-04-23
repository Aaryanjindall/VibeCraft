import { ExternalLink, Code2, Clock } from "lucide-react";

const Publiccard = ({ project, onOpen }) => {
  return (
    <div 
      className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl p-5
        hover:bg-[#1e1e1e] hover:border-[#444] transition-colors
        cursor-pointer flex flex-col justify-between h-[180px] group"
    >
      {/* TOP */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded bg-[#252525] border border-[#333] flex items-center justify-center shrink-0">
            <Code2 size={16} className="text-[#a855f7]" />
          </div>
          <h2 className="text-base font-semibold text-[#f0f0f0] truncate" title={project.name}>
            {project.name}
          </h2>
        </div>

        {/* DATE & INFO */}
        <div className="flex items-center gap-4 mt-4 text-xs text-[#666] font-medium tracking-wide uppercase">
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <span className="bg-[#252525] px-2 py-0.5 rounded border border-[#333] text-[#4ade80]">
            Public
          </span>
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#2d2d2d] border-opacity-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(project._id);
          }}
          className="btn-ide btn-ide-secondary w-full py-1.5 flex items-center justify-center gap-2"
        >
          <ExternalLink size={14} />
          View Project
        </button>
      </div>
    </div>
  );
};

export default Publiccard;