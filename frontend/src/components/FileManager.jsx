const FileManager = ({
  files = {},
  activeFile,
  setActiveFile,
  createFile,
  deleteFile,
  renameFile
}) => {

  const handleNewFile = () => {
    const name = prompt("File name");
    if (name) createFile(name);
  };

  const handleDelete = (name) => {
    if (window.confirm("Delete file?")) {
      deleteFile(name);
    }
  };

  const handleRename = (name) => {
    const newName = prompt("New name", name);
    if (newName) renameFile(name, newName);
  };

  return (
    <div className="h-full flex flex-col bg-[#020617] text-white">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e293b]">
        <span className="text-sm font-semibold text-gray-300">Files</span>

        <button
          onClick={handleNewFile}
          className="text-xs bg-indigo-500 px-2 py-1 rounded hover:bg-indigo-600"
        >
          + New
        </button>
      </div>

      {/* 🔥 FILE LIST */}
      <div className="flex-1 overflow-auto p-2 space-y-1">

        {Object.keys(files).length === 0 && (
          <p className="text-gray-500 text-xs px-2">No files</p>
        )}

        {Object.keys(files).map((name) => {

          const isActive = activeFile === name;

          return (
            <div
              key={name}
              className={`group flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition
              ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-[#1e293b] text-gray-300"
              }`}
              onClick={() => setActiveFile(name)}
            >

              {/* FILE NAME */}
              <span className="truncate">{name}</span>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRename(name);
                  }}
                  className="text-xs hover:text-yellow-400"
                >
                  ✏️
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(name);
                  }}
                  className="text-xs hover:text-red-400"
                >
                  ❌
                </button>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default FileManager;