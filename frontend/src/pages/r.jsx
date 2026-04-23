import { useNavigate, useParams } from 'react-router-dom';
import { useFiles } from '../context/FileContext';
import FileManager from '../components/FileManager';
import Editorr from '../components/Editor';
import PreviewPanel from '../components/PreviewPanel';
import { useProject } from '../hooks/useProject';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Zap, Folder, Terminal, Monitor, Sparkles, ExternalLink, Play } from 'lucide-react';

const Builder = () => {
  const [prompt, setPrompt] = useState('');
  const [publicc,setpublic] = useState(false);

  const {
    files,
    setActiveFile,
    activeFile,
    renameFile,
    createFile,
    deleteFile,
    setFiles,
    runFiles,
    setRunFiles,
    currentProject,
    handleSave
  } = useFiles();

  const navigate = useNavigate();
  const { handleGenerate, loadProject, loading } = useProject();
  const { projectId } = useParams();

  useEffect(() => {
    const lastId = localStorage.getItem("lastProjectId");
    if (projectId) {
      loadProject(projectId);
      localStorage.setItem("lastProjectId", projectId);
    } else if (!currentProject && lastId && lastId !== "undefined") {
      loadProject(lastId);
    }
  }, [projectId]);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave(prompt,publicc);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [files, currentProject, prompt]);

  return (
    <div className="h-screen w-full flex flex-col bg-[#111111] text-[#f0f0f0] overflow-hidden">
      {/* 🔥 TOP NAVBAR */}
      <Navbar prompt={prompt} 
      publicc={publicc}
      setpublic={setpublic}
      />

      {/* 🔥 MAIN IDE CONTENT */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT COLUMN: AI Assistant & Project Explorer */}
        <div className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">
          
          {/* AI Assistant Panel */}
          <div className="ide-panel flex flex-col h-[300px] lg:h-[35%] lg:min-h-[250px]">
            <div className="ide-header justify-between">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#a855f7]" />
                <span>AI Assistant</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1e1e1e] border border-[#333] text-[10px] text-[#4ade80]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></div>
                READY
              </div>
            </div>
            <div className="p-3 flex-1 flex flex-col relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Message AI assistant to generate code..."
                className="flex-1 bg-[#111111] border border-[#2d2d2d] rounded-md p-3 pb-14 text-sm text-[#f0f0f0] resize-none outline-none focus:border-[#444] transition-colors custom-scrollbar"
              />
              <div className="absolute bottom-5 right-5">
                <button
                  onClick={() => handleGenerate(prompt)}
                  disabled={loading || !prompt.trim()}
                  className="bg-[#e53e3e] hover:bg-[#c53030] text-white px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Project Explorer Panel */}
          <div className="ide-panel flex-1 flex flex-col overflow-hidden h-[300px] lg:h-auto">
            <div className="ide-header justify-between">
              <div className="flex items-center gap-2">
                <Folder size={14} className="text-[#e53e3e]" />
                <span>Project Explorer</span>
              </div>
              <div className="flex gap-2">
                <button className="text-[#666] hover:text-[#f0f0f0]" onClick={() => createFile()}>+</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
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
        </div>

        {/* MIDDLE COLUMN: Editor */}
        <div className="flex-1 flex flex-col min-w-0 ide-panel min-h-[400px] lg:min-h-0">
          <div className="ide-header bg-[#161616] flex items-center gap-2 border-b-0 h-[40px] px-0">
            {/* Editor Tabs */}
            <div className="flex h-full max-w-[60%] sm:max-w-[75%] overflow-hidden">
              {activeFile && (
                <div className="h-full px-4 flex items-center gap-2 bg-[#1a1a1a] border-t-2 border-[#e53e3e] border-r border-[#2d2d2d] text-white truncate">
                  <Terminal size={14} className="text-[#888] shrink-0" />
                  <span className="font-mono lowercase truncate text-xs sm:text-sm">{activeFile}</span>
                  <span className="text-[#666] ml-2 cursor-pointer hover:text-white shrink-0">×</span>
                </div>
              )}
            </div>
            <div className="flex-1"></div>
            <div className="px-3 flex gap-2 shrink-0">
              <button 
                className="btn-ide btn-ide-secondary text-xs h-7 px-2 sm:px-3 flex items-center gap-1.5"
                onClick={() => setRunFiles(files)}
              >
                <Play size={12} /> Build
              </button>
            </div>
          </div>
          <div className="flex-1 bg-[#1a1a1a] border-t border-[#2d2d2d]">
            <Editorr
              files={files}
              activeFile={activeFile}
              setFiles={setFiles}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Preview */}
        <div className="w-full lg:w-[450px] flex flex-col shrink-0 ide-panel h-[400px] lg:h-auto">
          <div className="ide-header justify-between">
            <div className="flex items-center gap-2">
              <Monitor size={14} className="text-[#4ade80]" />
              <span>App Preview</span>
            </div>
            <button className="text-[#666] hover:text-white flex items-center gap-1 text-[10px]">
              <ExternalLink size={10} /> Expand
            </button>
          </div>
          {/* URL Bar Mock */}
          <div className="bg-[#1a1a1a] p-2 border-b border-[#2d2d2d]">
            <div className="bg-[#111111] rounded-md px-3 py-1.5 flex items-center justify-between text-xs font-mono text-[#888]">
              <div className="flex items-center gap-2 truncate">
                <span>🔒</span> localhost:3000
              </div>
              <span className="text-[#4ade80] shrink-0 ml-2">✓</span>
            </div>
          </div>
          <div className="flex-1 bg-white overflow-hidden relative">
            <div className="absolute inset-0">
              <PreviewPanel files={runFiles} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Builder;