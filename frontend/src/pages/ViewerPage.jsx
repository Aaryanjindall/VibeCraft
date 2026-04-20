import { useParams } from "react-router-dom";
import Editorr from "../components/Editor";
import FileManager from "../components/FileManager";
import PreviewPanel from "../components/PreviewPanel";
import { useFiles } from "../context/FileContext"
import { useProject } from "../hooks/useProject";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider";
import AuthModal from "../components/AuthModal";


export const Viewerpage = () => {
    const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
const [pendingFork, setPendingFork] = useState(null);
const {user} = useUser();
    const {handleFork} = useProject()
    const {id} = useParams();
    useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/project/view/" + id
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
  }

  const handleAuthSuccess = () => {
  setShowAuth(false);

  if (pendingFork) {
    handleFork(pendingFork);
    setPendingFork(null);
  }
};

    return(
        <div className="h-screen flex bg-[#0f172a] text-white">

      {/* 🔥 FILES */}
      <div className="w-[220px] bg-[#020617] border-r border-[#334155] p-3">
        <h3 className="mb-3">📂 Files</h3>

        {Object.keys(files).map((file) => (
          <div
            key={file}
            onClick={() => setActiveFile(file)}
            className={`p-2 rounded cursor-pointer 
            ${activeFile === file ? "bg-[#1e293b]" : ""}`}
          >
            {file}
          </div>
        ))}
      </div>

      {/* 🔥 CODE */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="p-3 border-b border-[#334155] flex justify-between">
          <h2>{activeFile}</h2>

          <button
            onClick={()=>handleForkClick(id)}
            className="bg-indigo-500 px-4 py-1 rounded"
          >
            Fork
          </button>
        </div>

        {/* CODE VIEW */}
        <textarea
          value={files[activeFile] || ""}
          readOnly
          className="flex-1 bg-[#020617] p-4 outline-none"
        />
      </div>

      {/* 🔥 PREVIEW */}
      <div className="w-[40%] border-l border-[#334155] bg-black">
        <iframe
          title="preview"
          srcDoc={`
            ${files["index.html"] || ""}
            <style>${files["styles.css"] || ""}</style>
            <script>${files["script.js"] || ""}<\/script>
          `}
          className="w-full h-full"
        />
      </div>
      {showAuth && (
  <AuthModal
    onClose={() => setShowAuth(false)}
    onSuccess={handleAuthSuccess}
  />
)}

    </div>
    )
}
