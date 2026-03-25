import { useState } from "react";

const FileManager = ({ files, activeFile, setActiveFile }) => {

  return (

    <div style={{ width: "200px", background: "#111" }}>

      {Object.keys(files).map((name) => (

        <div
          key={name}
          onClick={() => setActiveFile(name)}
          style={{
            padding: "10px",
            cursor: "pointer",
            background:
              activeFile === name ? "#333" : "transparent",
            color: "white"
          }}
        >
          {name}
        </div>

      ))}

    </div>

  );

};

export default FileManager;