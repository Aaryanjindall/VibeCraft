import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider";
import { useCommunity } from "../hooks/useCommunity";
import FileManager from "./FileManager";
import Editorr from "./Editor";
import PreviewPanel from "./PreviewPanel";
import { Folder, Users, Terminal, Monitor, ExternalLink, GitFork, Save } from "lucide-react";

export const CommunityProject = ({ communityId, projectId }) => {
  const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const {
    forkCommunityProject,
    saveProject,
    communitymembers,
    getCommunityMembers
  } = useCommunity();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/project/" + projectId,
          { credentials: "include" }
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
  }, [projectId]);

  const userRole = communitymembers.find(m => m.user._id.toString() === user._id.toString())?.role;

  useEffect(() => {
    if (communityId) {
      getCommunityMembers(communityId);
    }
  }, [communityId]);

  if (loading) return (
    <div className="flex-1 h-full flex items-center justify-center bg-[#111111]">
      <div className="flex flex-col items-center gap-4 text-[#888]">
        <div className="w-8 h-8 rounded-full border-2 border-[#e53e3e] border-t-transparent animate-spin" />
        <span className="text-xs uppercase tracking-widest">Loading Project Environment...</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-y-auto lg:overflow-hidden bg-[#111111] text-[#f0f0f0]">
      
      {/* LEFT COLUMN: Actions & Explorer */}
      <div className="w-full lg:w-[280px] flex flex-col gap-4 shrink-0">
        
        {/* Actions & Members Panel */}
        <div className="ide-panel flex flex-col flex-1 min-h-[250px]">
          <div className="ide-header justify-between bg-[#161616]">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-[#a855f7]" />
              <span>Project Access</span>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3 border-b border-[#2d2d2d] bg-[#1a1a1a]">
            <button
              className="btn-ide btn-ide-primary w-full flex items-center justify-center gap-2"
              onClick={() => forkCommunityProject(communityId, projectId)}
            >
              <GitFork size={14} /> Fork Project
            </button>
            {(userRole === "owner" || userRole === "admin") && (
              <button
                className="btn-ide btn-ide-secondary w-full flex items-center justify-center gap-2"
                onClick={() => saveProject(communityId, projectId, files)}
              >
                <Save size={14} /> Contribute Changes
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto bg-[#1a1a1a] p-3 space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-[#666] tracking-widest mb-2 px-1">Contributors</h4>
            {Array.isArray(communitymembers) && communitymembers.map((cm) => (
              <div key={cm.user._id} className="flex items-center gap-2 text-xs px-1">
                <div className="w-4 h-4 rounded bg-[#252525] border border-[#333] flex items-center justify-center">
                  <span className="text-[8px]">{cm.user.username.charAt(0).toUpperCase()}</span>
                </div>
                <span className="truncate flex-1 text-[#d1d1d1]">{cm.user.username}</span>
                <span className="text-[10px] text-[#888]">{cm.role === 'owner' ? 'Owner' : cm.role === 'admin' ? 'Admin' : ''}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Explorer Panel */}
        <div className="ide-panel h-[40%] min-h-[200px] flex flex-col overflow-hidden shrink-0">
          <div className="ide-header bg-[#161616] flex items-center gap-2">
            <Folder size={14} className="text-[#e53e3e]" />
            <span>Files</span>
          </div>
          <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
            <FileManager
              files={files}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              createFile={() => {}} // Disabled in community view unless contributing logic allows
              deleteFile={() => {}}
              renameFile={() => {}}
            />
          </div>
        </div>
      </div>

      {/* MIDDLE COLUMN: Editor */}
      <div className="flex-1 flex flex-col min-w-0 ide-panel border-[#2d2d2d] min-h-[400px] lg:min-h-0">
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
            setFiles={setFiles}
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Preview */}
      <div className="w-full lg:w-[350px] flex flex-col shrink-0 ide-panel border-[#2d2d2d] h-[400px] lg:h-auto">
        <div className="ide-header justify-between bg-[#161616]">
          <div className="flex items-center gap-2">
            <Monitor size={14} className="text-[#4ade80]" />
            <span>Preview</span>
          </div>
          <button className="text-[#666] hover:text-white flex items-center gap-1 text-[10px]">
            <ExternalLink size={10} /> Expand
          </button>
        </div>
        <div className="bg-[#1a1a1a] p-2 border-b border-[#2d2d2d]">
          <div className="bg-[#111111] rounded-md px-3 py-1.5 flex items-center justify-between text-xs font-mono text-[#888]">
            <div className="flex items-center gap-2">
              <span>🔒</span> community-preview
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

    </div>
  );
};