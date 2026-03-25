import React, { useEffect, useState } from "react";
import FileManager from "../components/FileManager";
import Editorr from "../components/Editor";
import PreviewPanel from "../components/PreviewPanel";
import { downloadProject } from "../utils/downloadProject";
import { runProjectInNewTab } from "../utils/runProject";
import Sidebar from "../components/Sidebar";

const Builder = () => {
  
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeFile, setActiveFile] = useState("index.html");
  const [runFiles, setRunFiles] = useState({});
  const [showPreview,setshowPreview] = useState(true);
  const [autoRun,setAutoRun] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showSidebar,setShowSidebar] = useState(false);
  const [currentProject,setcurrentProject] = useState(null);
  const [unsaved,setunsaved] = useState(false);

  const createFile = (name) => {
  if (!name) return;
  if (files[name]) {
    alert("File exists");
    return;
  }
  setFiles({
    ...files,
    [name]: ""
  });
  setActiveFile(name);
};
  const deleteFile = (name) => {
    const newFiles = { ...files };
    delete newFiles[name];
    setFiles(newFiles);
    const keys = Object.keys(newFiles);
    if(keys.length > 0){
      setActiveFile(keys[0]);
    }
  };
  const renameFile = (oldName,newName) => {
    if(!newName)return;
    const newFiles = {...files};
    newFiles[newName] = newFiles[oldName];
    delete newFiles[oldName];
    setFiles(newFiles);
    if(activeFile == oldName){
      setActiveFile(newName);
    }
  }
  useEffect(()=>{
    if(autoRun){
      setRunFiles(files);
    }
  },[files,autoRun]);

  useEffect(()=>{
    if (!currentProject) return;
    if (!files) return;
    if (Object.keys(files).length === 0) return;
    const timer = setTimeout(()=>{
      handleSave();
      console.log("files changes after 5 sec");
    },5000);
    return () => clearTimeout(timer);
  },[files]);

  useEffect(() => {

  if (!files) return;
  if (Object.keys(files).length === 0) return;

  setunsaved(true);

}, [files]);

  
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
      setcurrentProject(null);
      setunsaved(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProject = async (id) => {

  const res = await fetch(
    "http://localhost:5001/api/project/" + id
  );

  const data = await res.json();
  setFiles(data.files);
  setRunFiles(data.files);
  setunsaved(false);
  setcurrentProject({
    id: data._id,
    name: data.name
  });

  localStorage.setItem(
    "lastProjectId",
    data._id
  );


};


useEffect(()=>{
  const lastId = localStorage.getItem("lastProjectId");
  if(lastId){
    loadProject(lastId);
  }
},[]);

const getProjects = async() => {
  const res = await fetch("http://localhost:5001/api/project");

  const data = await res.json();
  setProjects(data);
}

  const handleSave = async () => {
  try {
    if (!files) return;
    if (Object.keys(files).length === 0) return;
    const url = currentProject ? "http://localhost:5001/api/project/update/"+ currentProject.id : "http://localhost:5001/api/project/save";

    

    const meth = currentProject ? "PUT" : "POST";
    const res = await fetch(
      url,
      {
        method: meth,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",   // IMPORTANT
        body: JSON.stringify({
          name: currentProject ? currentProject.name : "New AI Project ",
          files: files,
        }),
      }
    );
    
      
    const data = await res.json();
    setunsaved(false);
  } catch (err) {
    console.log(err);
  }
};
const deleteProject = async(id) => {
  await fetch(
    "http://localhost:5001/api/project/delete/"+ id,
    {
      method: "DELETE"
    }
  );
  getProjects();
  if (
    currentProject &&
    currentProject.id === id
  ) {
    setFiles({});
    setcurrentProject(null);
    localStorage.removeItem(
    "lastProjectId"
    )
  }
}
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
         AI Builder -

  {currentProject
    ? currentProject.name
    : "No Project"}

  {unsaved && "*"}
      </div>
      <div className="flex">
        <button onClick={() => setShowSidebar(!showSidebar)}>☰</button>
        <Sidebar 
        showSidebar={showSidebar}
        projects={projects}
        getProjects={getProjects}
        loadProject={loadProject}
        deleteProject={deleteProject}
        />
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
          createFile={createFile}
          deleteFile={deleteFile}
          renameFile={renameFile}
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