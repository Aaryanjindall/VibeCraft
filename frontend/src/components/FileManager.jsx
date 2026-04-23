import { FileText, FileCode2, FileJson, Trash2, Edit2, FilePlus, FolderPlus } from "lucide-react";

const FileManager = ({
  files = {},
  activeFile,
  setActiveFile,
  createFile,
  deleteFile,
  renameFile
}) => {

  const handleNewFile = () => {
    const name = prompt("Enter new file name (e.g., App.jsx):");
    if (name) createFile(name);
  };

  const handleDelete = (name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteFile(name);
    }
  };

  const handleRename = (name) => {
    const newName = prompt("Enter new name:", name);
    if (newName && newName !== name) renameFile(name, newName);
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith('.jsx') || filename.endsWith('.js')) return <FileCode2 size={14} className="text-[#f59e0b]" />;
    if (filename.endsWith('.json')) return <FileJson size={14} className="text-[#10b981]" />;
    if (filename.endsWith('.css')) return <FileCode2 size={14} className="text-[#3b82f6]" />;
    return <FileText size={14} className="text-[#888]" />;
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] text-[#f0f0f0]">
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2d2d2d] bg-[#161616]">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#666]">Workspace</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleNewFile}
            className="p-1 text-[#888] hover:text-[#f0f0f0] transition-colors rounded"
            title="New File"
          >
            <FilePlus size={14} />
          </button>
        </div>
      </div>

      {/* FILE LIST */}
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {Object.keys(files).length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-[#666] italic">
            Workspace is empty. <br/> Create a file to begin.
          </div>
        ) : (
          <div className="space-y-[1px]">
            {Object.keys(files).map((name) => {
              const isActive = activeFile === name;
              return (
                <div
                  key={name}
                  className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors border-l-2
                  ${isActive
                      ? "bg-[#252525] border-[#e53e3e] text-white"
                      : "border-transparent hover:bg-[#252525] text-[#d1d1d1]"
                    }`}
                  onClick={() => setActiveFile(name)}
                >
                  {/* FILE NAME */}
                  <div className="flex items-center gap-2 overflow-hidden">
                    {getFileIcon(name)}
                    <span className="text-xs font-mono truncate">{name}</span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(name);
                      }}
                      className="p-1 text-[#666] hover:text-[#f0f0f0] rounded transition-colors"
                      title="Rename"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(name);
                      }}
                      className="p-1 text-[#666] hover:text-[#e53e3e] rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;