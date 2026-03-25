import React, { useEffect, useState } from "react";
import FileManager from "../components/FileManager";
import Editorr from "../components/Editor";
import PreviewPanel from "../components/PreviewPanel";
import { downloadProject } from "../utils/downloadProject";
import { runProjectInNewTab } from "../utils/runProject";
const Builder = () => {
  
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeFile, setActiveFile] = useState("index.html");
  const [runFiles, setRunFiles] = useState({});
  const [showPreview,setshowPreview] = useState(true);
  const [autoRun,setAutoRun] = useState(false);

  useEffect(()=>{
    if(autoRun){
      setRunFiles(files);
    }
  },[files,autoRun]);
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5001/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ prompt }),
        }
      );
      const data = await res.json();
      setFiles(data.files);
      setRunFiles(data.files);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
  try {
    const res = await fetch(
      "http://localhost:5001/api/project/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",   // IMPORTANT
        body: JSON.stringify({
          name: "My Project",
          files: runFiles,
        }),
      }
    );

    const data = await res.json();

    console.log(data);
    alert("Completed");

  } catch (err) {
    console.log(err);
  }
};
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        color: "white",
      }}
    >
      {/* top bar */}
      <div
        style={{
          height: "60px",
          background: "#111827",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          fontWeight: "bold",
        }}
      >
        AI Builder
      </div>
      {/* prompt */}
      <div
  style={{
    padding: "10px",
    background: "#1f2937",
    display: "flex",
    gap: "10px",
  }}
>
  <textarea
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    style={{ flex: 1, height: "60px" }}
  />
  <button onClick={handleGenerate}>
    Generate
  </button>
  <button
    onClick={() => setRunFiles(files)}
  >
    Run
  </button>
  <button onClick={() => downloadProject(runFiles)}>
    Download
  </button>
  <button
  onClick={() => setshowPreview(!showPreview)}
>
  Toggle Preview
</button>

<button onClick={() => setAutoRun(!autoRun)}>{autoRun ? "Auto ON" : "Auto OFF"}</button>

</div>

<button
  onClick={() => runProjectInNewTab(runFiles)}
>
  Open Tab
</button>

<button onClick={handleSave}>
  Save
</button>


      {/* main builder area */}

      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >

        {/* file manager */}

        <FileManager
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
        />


        {/* editor */}

        <div style={{ flex: 1, 
          display: "flex",
          overflow: "hidden"
        }}>

          <Editorr
            files={files}
            activeFile={activeFile}
            setFiles={setFiles}
          />

        </div>


        {/* preview */}

        <div style={{ flex: 1 , marginTop: "20px" }}>

          {/* <PreviewPanel files={runFiles} /> */}
          {showPreview && (<PreviewPanel files={runFiles}/>)}

        </div>

      </div>

    </div>

  );

};

export default Builder;