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

    return (
  <div className="h-screen flex bg-[#020617] text-white">

    {/* 🔥 FILE SIDEBAR */}
    <div className="w-[220px] bg-[#020617] border-r border-[#1e293b] flex flex-col">

      <div className="h-[50px] flex items-center px-4 border-b border-[#1e293b] text-sm font-semibold">
        📂 Files
      </div>

      <div className="flex-1 overflow-auto p-2">
        {Object.keys(files).map((file) => (
          <div
            key={file}
            onClick={() => setActiveFile(file)}
            className={`px-3 py-2 rounded-md text-sm cursor-pointer transition
            ${
              activeFile === file
                ? "bg-indigo-500 text-white"
                : "hover:bg-[#1e293b] text-gray-300"
            }`}
          >
            {file}
          </div>
        ))}
      </div>
    </div>

    {/* 🔥 CODE SECTION */}
    <div className="flex-1 flex flex-col">

      {/* 🔹 HEADER */}
      <div className="h-[50px] flex items-center justify-between px-4 border-b border-[#1e293b] bg-[#020617]">

        <h2 className="text-sm text-gray-300">
          {activeFile || "No file selected"}
        </h2>

        <button
          onClick={() => handleForkClick(id)}
          className="bg-indigo-500 hover:bg-indigo-600 transition px-4 py-1.5 rounded-md text-sm"
        >
          Fork
        </button>
      </div>

      {/* 🔹 CODE VIEW */}
      <div className="flex-1 bg-[#020617] p-4 overflow-auto">

        <pre className="text-sm text-gray-300 whitespace-pre-wrap">
          <code>{files[activeFile] || "// No file selected"}</code>
        </pre>

      </div>
    </div>

    {/* 🔥 PREVIEW PANEL */}
    <div className="w-[40%] border-l border-[#1e293b] flex flex-col bg-black">

      <div className="h-[50px] flex items-center px-4 border-b border-[#1e293b] text-sm text-gray-400">
        🌐 Preview
      </div>

      <iframe
        title="preview"
        srcDoc={`
          ${files["index.html"] || ""}
          <style>${files["styles.css"] || ""}</style>
          <script>${files["script.js"] || ""}<\/script>
        `}
        className="flex-1 w-full"
      />
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
}
