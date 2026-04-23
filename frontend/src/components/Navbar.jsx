import { useNavigate } from "react-router-dom";
import { useFiles } from "../context/FileContext";
import { downloadProject, runProjectInNewTab } from "../utils/fileUtils";
import UserProfile from "./userProfle";
import { useDeploy } from "../hooks/useDeploy";
import { Search, Play, Download, Rocket, ExternalLink, Save, Trash2, Home, Box } from "lucide-react";
import { useState } from "react";

const Navbar = ({ prompt,publicc,setpublic }) => {
  const navigate = useNavigate();
  const { files, setRunFiles, runFiles, handleSave, setUnsaved, setCurrentProject, setFiles, autoRun, setAutoRun } = useFiles();
  
  const { deploy } = useDeploy();
  // console.log(publicc);

  return (
    <div className="h-[52px] bg-[#1a1a1a] border-b border-[#2d2d2d] flex items-center justify-between px-4 shrink-0">
      {/* LEFT: Breadcrumbs / Workspace */}
      <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium text-[#b0b0b0]">
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-[#252525] rounded-md border border-[#333]">
          <Box size={16} />
          <span className="hidden sm:inline">WORKSPACE</span>
        </div>
        <button onClick={() => navigate("/")} className="hover:text-white transition-colors">
          <Home size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3 bg-[#252525] px-4 py-1.5 rounded-full border border-[#333] shadow-inner">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#b0b0b0]">
          {publicc ? "Public" : "Private"}
        </span>
        <div
          onClick={() => setpublic(!publicc)}
          className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out
          ${publicc ? "bg-[#a855f7]" : "bg-[#444]"}`}
        >
          <div
            className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out
            ${publicc ? "translate-x-5" : "translate-x-0"}`}
          />
        </div>
      </div>      {/* RIGHT: Actions & Profile */}
      <div className="flex items-center gap-3">
        <button className="btn-ide btn-ide-ghost" onClick={() => handleSave(prompt,publicc)}>
          <Save size={14} /> <span className="hidden lg:inline">Save</span>
        </button>
        <button 
          className={`btn-ide flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${autoRun ? 'bg-[#e53e3e] hover:bg-[#c53030] text-white border-transparent' : 'btn-ide-secondary'}`}
          onClick={() => setAutoRun(!autoRun)}
        >
          <Play size={14} className={autoRun ? 'text-white' : ''} /> 
          <span className="hidden lg:inline">AutoRun {autoRun ? 'ON' : 'OFF'}</span>
        </button>
        <button className="btn-ide btn-ide-primary bg-[#e53e3e] hover:bg-[#c53030] border-none" onClick={() => deploy()}>
          <Rocket size={14} /> <span className="hidden lg:inline">Deploy</span>
        </button>

        {/* Dropdown Menu or Extra actions */}
        <div className="h-6 w-[1px] bg-[#333] mx-1"></div>

        <button className="btn-ide btn-ide-ghost px-2" onClick={() => downloadProject(runFiles)} title="Download">
          <Download size={16} />
        </button>
        <button className="btn-ide btn-ide-ghost px-2" onClick={() => runProjectInNewTab(runFiles)} title="Preview in New Tab">
          <ExternalLink size={16} />
        </button>
        <button className="btn-ide btn-ide-ghost px-2 text-[#e53e3e] hover:bg-[#e53e3e]/10 hover:text-[#e53e3e]" onClick={() => {
          setFiles({});
          setRunFiles({});
          setCurrentProject(null);
          setUnsaved(false);
          localStorage.removeItem("lastProjectId");
          navigate("/app");
        }} title="Clear Project">
          <Trash2 size={16} />
        </button>

        <div className="w-8 h-8 ml-2 rounded-full border border-[#444] bg-[#222] relative">
          <UserProfile />
        </div>
      </div>
    </div>
  );
}

export default Navbar;