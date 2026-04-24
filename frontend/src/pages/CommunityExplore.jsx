import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCommunity } from "../hooks/useCommunity";
import { useUser } from "../context/UserProvider";
import { usePost } from "../hooks/usePost";
import { CommunityMembers } from "../components/CommunityMembers";
import { CommunityProject } from "../components/CommunityProject";
import PostFeed from "../components/PostFeed";
import CreatePost from "../components/CreatePost";
import UserProfile from "../components/userProfle";
import { MessageSquare, FolderGit2, Users, Layout, Trash2 } from "lucide-react";

const CommunityExplore = () => {
  const { id } = useParams();
  const { user } = useUser();
  const { 
    getCommunityProjects, 
    communityProjects, 
    communitymembers, 
    removeProject, 
    getCommunityMembers 
  } = useCommunity();
  const { posts, loadPosts, createPost, likePost, commentPost } = usePost();

  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "project"
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    getCommunityProjects(id);
    getCommunityMembers(id);
  }, [id]);

  const currentUserRole = communitymembers?.find(m => m.user._id.toString() === user?._id?.toString())?.role;

  return (
    <div className="h-full flex flex-col bg-[#111111] overflow-hidden text-[#f0f0f0]">
      {/* Top Header */}
      <div className="flex items-center px-6 py-4 border-b border-[#2d2d2d] bg-[#1a1a1a] shrink-0">
        <Layout size={20} className="text-[#a855f7] mr-3" />
        <div>
          <h1 className="text-lg font-semibold leading-tight">Community Hub</h1>
          <p className="text-xs text-[#888]">Collaborate, discuss, and build together</p>
        </div>
        <div className="h-8 w-8 ml-auto rounded-full bg-[#222] border border-[#444] relative shrink-0">
          <UserProfile/>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT NAV PANEL */}
        <div className="w-full md:w-[240px] h-[200px] md:h-auto shrink-0 border-b md:border-b-0 md:border-r border-[#2d2d2d] bg-[#1a1a1a] flex flex-col overflow-y-auto">
          
          {/* Discussions Tab */}
          <div className="p-4">
            <h3 className="text-[10px] uppercase tracking-widest text-[#666] font-semibold mb-2">Main</h3>
            <button 
              onClick={() => {
                setActiveTab("feed");
                setSelectedProjectId(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium
                ${activeTab === "feed" 
                  ? "bg-[#e53e3e]/10 text-[#e53e3e]" 
                  : "text-[#888] hover:bg-[#252525] hover:text-[#d1d1d1]"
                }`}
            >
              <MessageSquare size={16} />
              Discussions & Feed
            </button>
          </div>

          <div className="px-4 pb-2">
            <h3 className="text-[10px] uppercase tracking-widest text-[#666] font-semibold mb-2">Projects</h3>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
            {Array.isArray(communityProjects) && communityProjects.length > 0 ? (
              communityProjects.map((cp) => (
                <div 
                  key={cp._id}
                  onClick={() => {
                    setSelectedProjectId(cp._id);
                    setActiveTab("project");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors text-sm font-medium border border-transparent group
                    ${activeTab === "project" && selectedProjectId === cp._id
                      ? "bg-[#252525] text-white border-[#444]" 
                      : "text-[#888] hover:bg-[#252525] hover:text-[#d1d1d1]"
                    }`}
                >
                  <div className="flex items-center gap-3 truncate pr-2">
                    <FolderGit2 size={16} className={activeTab === "project" && selectedProjectId === cp._id ? "text-[#e53e3e]" : "text-[#666]"} />
                    <span className="truncate">{cp.name}</span>
                  </div>

                  <button
                    className="text-[#666] hover:text-[#e53e3e] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1"
                    title="Remove Project"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Remove this project from community?")) {
                        removeProject(id, cp._id);
                        if (selectedProjectId === cp._id) setActiveTab("feed");
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#555] px-3">No projects shared yet.</p>
            )}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 bg-[#111111] overflow-hidden flex flex-col relative">
          
          {activeTab === "feed" ? (
            <div className="flex flex-col lg:flex-row h-full w-full p-4 lg:p-6 gap-4 lg:gap-6 overflow-y-auto lg:overflow-hidden min-h-0">
              
              {/* Left Column: Create Post & Feed */}
              <div className="flex-1 flex flex-col min-h-0 gap-4 lg:gap-6 max-w-3xl mx-auto w-full">
                <div className="ide-panel p-4 bg-[#1a1a1a] shrink-0">
                  <CreatePost communityId={id} createPost={createPost} />
                </div>
                
                <div className="ide-panel bg-[#1a1a1a] flex-1 flex flex-col min-h-0 p-4">
                  <div className="flex items-center gap-2 mb-4 border-b border-[#2d2d2d] pb-2 shrink-0">
                    <MessageSquare size={16} className="text-[#a855f7]" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#888]">Community Feed</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[300px]">
                    <PostFeed 
                      communityId={id} 
                      posts={posts} 
                      loadPosts={loadPosts} 
                      likePost={likePost} 
                      commentPost={commentPost} 
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Members */}
              <div className="w-full lg:w-[350px] h-[300px] lg:h-auto shrink-0 ide-panel bg-[#1a1a1a] p-4 flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-4 border-b border-[#2d2d2d] pb-2 shrink-0">
                  <Users size={16} className="text-[#e53e3e]" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-[#888]">Members</h2>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <CommunityMembers id={id} />
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 overflow-hidden h-full">
              {selectedProjectId && (
                <CommunityProject
                  communityId={id}
                  projectId={selectedProjectId}
                />
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CommunityExplore;