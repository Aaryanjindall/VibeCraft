import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider";
import { useCommunity } from "../hooks/useCommunity";
import FileManager from "./FileManager";
import Editorr from "./Editor";
import PreviewPanel from "./PreviewPanel";

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

  // 🔥 Load members
  useEffect(() => {
    if (communityId) {
      getCommunityMembers(communityId);
    }
  }, [communityId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-[#020617] text-white">

      {/* 🔵 LEFT: MEMBERS */}
      <div className="w-[220px] p-3 border-r border-[#334155] overflow-y-auto">
        <h3 className="mb-3">👥 Members</h3>

        {Array.isArray(communitymembers) &&
          communitymembers.map((cm) => (
            <div
              key={cm.user._id}
              className="bg-[#1e293b] p-2 rounded mb-2"
            >
              {cm.user.username} - {cm.role}
            </div>
          ))}
      </div>

      {/* 🟡 CENTER: EDITOR */}
      <div className="flex flex-col flex-1">

        {/* 🔥 TOP BAR */}
        <div className="flex justify-between p-2 border-b border-[#334155]">
          <button
            className="text-blue-400"
            onClick={() => forkCommunityProject(communityId, projectId)}
          >
            Fork
          </button>
          {(userRole === "owner" || userRole === "admin") && (
            <button
            className="text-green-400"
            onClick={() => saveProject(communityId, projectId, files)}
          >
            Contribute
          </button>
          )}
        </div>
        {/* 🔥 EDITOR AREA */}
        <div className="flex flex-1">
          {/* FILES */}
          <FileManager
            files={files}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
          />
          {/* CODE EDITOR */}
          <Editorr
            files={files}
            activeFile={activeFile}
            setFiles={setFiles}
          />
        </div>
      </div>
      {/* 🟢 RIGHT: PREVIEW */}
      <div className="w-[35%] border-l border-[#334155]">
        <PreviewPanel files={files} />
      </div>
    </div>
  );
};