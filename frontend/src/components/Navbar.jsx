import { useFiles } from "../context/FileContext";
import { downloadProject, runProjectInNewTab } from "../utils/fileUtils";
import UserProfile from "./userProfle";


const Navbar = () => {
    const {files,setRunFiles,runFiles,handleSave,setunsaved,setcurrentProject,setFiles} = useFiles();
    return(
        <div className="h-[60px] bg-[#020617] border-b border-[#1e293b] flex items-center justify-between px-4">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">⚡ Vibe Builder</span>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <button className="btn" onClick={()=>setRunFiles(files)}>▶ Run</button>
        <button className="btn" onClick={() => downloadProject(runFiles)}>⬇</button>
        <button className="btn">🚀</button>
        <button className="btn" onClick={() => runProjectInNewTab(runFiles)}>🔗</button>
        <button className="btn" onClick={handleSave}>💾</button>
        <button onClick={() => {
  setFiles({});
  setRunFiles({});
  setcurrentProject(null);
  setunsaved(false);
  localStorage.removeItem("lastProjectId");
}}>Clear
</button>
      </div>

      {/* PROFILE */}
      <div className="w-10 h-10 rounded-full border border-cyan-400">
        <UserProfile />
      </div>
      
    </div>

    


        
)
}
export default Navbar;