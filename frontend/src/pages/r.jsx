import { useNavigate, useParams } from 'react-router-dom'
import { useFiles } from '../context/FileContext'
import FileManager from '../components/FileManager'
import Editorr from '../components/Editor'
import PreviewPanel from '../components/PreviewPanel'
import { useProject } from '../hooks/useProject'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

const Builder = () => {
  const [prompt, setPrompt] = useState('')

  const {
    files,
    setActiveFile,
    activeFile,
    renameFile,
    createFile,
    deleteFile,
    setFiles,
    runFiles,
    currentProject,
    handleSave
  } = useFiles()

  const navigate = useNavigate()
  const { handleGenerate,loadProject } = useProject()
  const{projectId} = useParams();
  useEffect(() => { const lastId = localStorage.getItem("lastProjectId"); if (projectId) { loadProject(projectId); localStorage.setItem("lastProjectId", projectId); } else if (lastId && lastId !== "undefined") { loadProject(lastId); } },[projectId]);
  
  
  useEffect(()=>{
    const handleKey = (e) => {
      if((e.ctrlKey || e.metaKey) && e.key === "s"){
        e.preventDefault();
        handleSave(prompt);
      }
    };
    window.addEventListener(
      "keydown",
      handleKey
    );
  
    return () => 
      window.removeEventListener(
        "keydown",
        handleKey
      );
  
  },[files,currentProject]);

  return (
    <div className="h-screen flex flex-col bg-[#0b1120] text-white">

      {/* 🔥 NAVBAR */}
      <Navbar />

      {/* 🔥 MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">

        {/* 🔥 SIDEBAR (Prompt + File Manager) */}
        <div className="w-[260px] bg-[#020617] border-r border-[#1e293b] flex flex-col">

          {/* PROMPT */}
          <div className="h-[40%] p-3">
            <div className="h-full bg-[#0f172a] border border-[#1e293b] rounded-xl p-3 flex flex-col justify-between">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="✨ Describe what you want..."
                className="bg-transparent outline-none text-sm"
              />
              <button
                onClick={() => handleGenerate(prompt)}
                className="bg-indigo-500 hover:bg-indigo-600 text-sm px-3 py-1 rounded-lg"
              >
                Generate
              </button>
            </div>
          </div>

          {/* FILE MANAGER */}
          <div className="h-[60%] border-t border-[#1e293b] overflow-auto">
            <FileManager
              files={files}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              createFile={createFile}
              deleteFile={deleteFile}
              renameFile={renameFile}
            />
          </div>
        </div>

        {/* 🔥 EDITOR */}
        <div className="flex-1 bg-[#0b1120]">
          <Editorr
            files={files}
            activeFile={activeFile}
            setFiles={setFiles}
          />
        </div>

        <div className="w-[35%] bg-[#020617] border-l border-[#1e293b]">
          <PreviewPanel files={runFiles} />
        </div>

      </div>

      {/* 🔥 BOTTOM PROMPT BAR */}
      <div className="h-[60px] bg-[#020617] border-t border-[#1e293b] flex items-center px-4 gap-3">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="✨ Describe what you want to build..."
          className="flex-1 bg-[#0f172a] border border-[#1e293b] rounded-lg px-3 py-2 outline-none"
        />

        <button
          onClick={() => handleGenerate(prompt)}
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg"
        >
          Generate
        </button>
      </div>

    </div>
  )
}

export default Builder