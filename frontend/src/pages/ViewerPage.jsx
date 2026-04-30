import { useParams } from "react-router-dom";
import Editorr from "../components/Editor";
import FileManager from "../components/FileManager";
import PreviewPanel from "../components/PreviewPanel";
import { useFiles } from "../context/FileContext";
import { useProject } from "../hooks/useProject";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider";
import AuthModal from "../components/AuthModal";
import { Folder, Terminal, Monitor, GitFork, ExternalLink, Globe } from "lucide-react";

export const Viewerpage = () => {
  const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingFork, setPendingFork] = useState(null);
  
  const { user } = useUser();
  const { handleFork } = useProject();
  const { id } = useParams();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://vibecraft-sxyx.onrender.com/api/project/view/" + id
        );
        const data = await res.json();
        setFiles(data.files || {});
        const fileKeys = Object.keys(data.files || {});
        setActiveFile(fileKeys.length > 0 ? fileKeys[0] : "");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleForkClick = (id) => {
    if(!user){
      setPendingFork(id);
      setShowAuth(true);
      return;
    }
    handleFork(id);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (pendingFork) {
      handleFork(pendingFork);
      setPendingFork(null);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#111111]">
      <div className="flex flex-col items-center gap-4 text-[#888]">
        <div className="w-8 h-8 rounded-full border-2 border-[#e53e3e] border-t-transparent animate-spin" />
        <span className="text-xs uppercase tracking-widest">Loading Public Environment...</span>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#111111] text-[#f0f0f0] overflow-hidden p-4 gap-4">

      {/* LEFT COLUMN: Explorer & Actions */}
      <div className="w-[280px] shrink-0 flex flex-col gap-4 h-full">
        
        {/* Actions Panel */}
        <div className="ide-panel shrink-0 bg-[#1a1a1a]">
          <div className="ide-header bg-[#161616]">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-[#a855f7]" />
              <span>Public Project</span>
            </div>
          </div>
          <div className="p-4 border-b border-[#2d2d2d] flex flex-col gap-3">
            <p className="text-xs text-[#888] leading-relaxed mb-1">
              You are viewing a public project in read-only mode. Fork it to make changes.
            </p>
            <button
              onClick={() => handleForkClick(id)}
              className="btn-ide btn-ide-primary w-full flex items-center justify-center gap-2"
            >
              <GitFork size={14} /> Fork to Workspace
            </button>
          </div>
        </div>

        {/* Files Panel */}
        <div className="ide-panel flex-1 flex flex-col min-h-0 bg-[#1a1a1a]">
          <div className="ide-header bg-[#161616] flex items-center gap-2">
            <Folder size={14} className="text-[#e53e3e]" />
            <span>Explorer</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FileManager
              files={files}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              createFile={() => {}} // Read only
              deleteFile={() => {}} // Read only
              renameFile={() => {}} // Read only
            />
          </div>
        </div>
      </div>

      {/* MIDDLE COLUMN: Code Editor */}
      <div className="flex-1 flex flex-col min-w-0 ide-panel border-[#2d2d2d]">
        <div className="ide-header bg-[#161616] flex items-center gap-2 border-b-0 h-[40px] px-0">
          <div className="flex h-full">
            {activeFile && (
              <div className="h-full px-4 flex items-center gap-2 bg-[#1a1a1a] border-t-2 border-[#e53e3e] border-r border-[#2d2d2d] text-white">
                <Terminal size={14} className="text-[#888]" />
                <span className="font-mono lowercase text-xs">{activeFile}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 bg-[#1a1a1a] border-t border-[#2d2d2d]">
          <Editorr
            files={files}
            activeFile={activeFile}
            setFiles={() => {}} // Read only, don't allow actual state changes in viewer
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Preview */}
      <div className="w-[350px] shrink-0 flex flex-col ide-panel border-[#2d2d2d]">
        <div className="ide-header justify-between bg-[#161616]">
          <div className="flex items-center gap-2">
            <Monitor size={14} className="text-[#4ade80]" />
            <span>Live Preview</span>
          </div>
          <button className="text-[#666] hover:text-white flex items-center gap-1 text-[10px]">
            <ExternalLink size={10} /> Expand
          </button>
        </div>
        <div className="bg-[#1a1a1a] p-2 border-b border-[#2d2d2d]">
          <div className="bg-[#111111] rounded-md px-3 py-1.5 flex items-center justify-between text-xs font-mono text-[#888]">
            <div className="flex items-center gap-2">
              <span>🔒</span> public-viewer
            </div>
            <span className="text-[#4ade80]">✓</span>
          </div>
        </div>
        <div className="flex-1 bg-white overflow-hidden relative">
          <div className="absolute inset-0">
            <PreviewPanel files={files} />
          </div>
        </div>
      </div>

      {/* 🔥 AUTH MODAL */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

    </div>
  );
};
