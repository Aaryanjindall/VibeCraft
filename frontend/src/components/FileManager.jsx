import { useState } from "react";

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
    if (name) {
      createFile(name);
    }
  };
  const handleDelete = (name) => {
    if (window.confirm("Delete file?")) {
      deleteFile(name);
    }
  };
  const handleRename = (name) => {
    const newName = prompt(
      "New name",
      name
    );
    if (newName) {
      renameFile(name, newName);
    }
  };
  return (
    <div
      style={{
        width: "200px",
        background: "#111",
        color: "white"
      }}
    >
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #333"
        }}
      >
        <button onClick={handleNewFile}>
          + File
        </button>
      </div>
      {Object.keys(files).map((name) => (
        <div
          key={name}
          style={{
            padding: "8px",
            background:
              activeFile === name
                ? "#333"
                : "transparent"
          }}
        >
          <div
            onClick={() =>
              setActiveFile(name)
            }
            style={{
              cursor: "pointer"
            }}
          >
            {name}
          </div>
          <div>
            <button
              onClick={() =>
                handleRename(name)
              }
            >
              R
            </button>
            <button
              onClick={() =>
                handleDelete(name)
              }
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileManager;