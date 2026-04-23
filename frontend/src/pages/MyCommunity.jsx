import { useNavigate } from "react-router-dom";
import { useCommunity } from "../hooks/useCommunity";
import { useEffect, useState } from "react";
import CommunityGrid from "../components/CommunityGrid";
import { Plus, Users, Globe } from "lucide-react";

const MyCommunity = () => {
  const navigate = useNavigate();
  const {
    loadCommunities,
    communities,
    joinCommunity,
    createCommunity,
    exploreCommunities,
    exploreCommunitiesFn,
    deleteCommunity
  } = useCommunity();

  const [activeTab, setActiveTab] = useState("My Communities");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [filter, setfilter] = useState([]);
 
  useEffect(() => {
    loadCommunities();
  }, []);

  useEffect(() => {
    if (activeTab === "My Communities") {
      setfilter(communities);
    } else {
      setfilter(exploreCommunities);
    }
  }, [activeTab, communities, exploreCommunities]);

  useEffect(() => {
    if (activeTab === "Explore New") {
      exploreCommunitiesFn();
    }
  }, [activeTab]);

  const handleOpen = (id) => {
    navigate(`/ai/community/explore/${id}`);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createCommunity(name);
    setShowModal(false);
    setName("");
    loadCommunities();
  };

  return (
    <div className="h-full flex flex-col bg-[#111111] text-[#f0f0f0] p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 mb-4 sm:mb-6 border-b border-[#2d2d2d] pb-4 gap-4 sm:gap-0">
        <h1 className="text-xl font-semibold text-[#f0f0f0] flex items-center gap-2">
          <Globe size={20} className="text-[#a855f7]" />
          Community Hub
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-ide btn-ide-primary bg-[#e53e3e] hover:bg-[#c53030] w-full sm:w-auto"
        >
          <Plus size={16} /> Create Community
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0 gap-4 md:gap-6 overflow-hidden">
        {/* Left Inner Navigation */}
        <div className="w-full md:w-[200px] shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0 hide-scrollbar">
          {["My Communities", "Explore New"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2
              ${activeTab === tab
                  ? "bg-[#1a1a1a] text-white border border-[#2d2d2d]"
                  : "text-[#888] hover:bg-[#161616] hover:text-[#d1d1d1] border border-transparent"
                }`}
            >
              <Users size={16} className={activeTab === tab ? "text-[#a855f7]" : ""} />
              {tab}
            </button>
          ))}
        </div>

        {/* Main Grid Area */}
        <div className="flex-1 overflow-y-auto pr-2 pb-8">
          <CommunityGrid
            communities={filter}
            type={activeTab}
            joinCommunity={joinCommunity}
            onOpen={handleOpen}
            deleteCommunity={deleteCommunity}
          />
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="ide-panel p-6 w-full max-w-[400px] mx-4 shadow-2xl border border-[#333]">
            <h2 className="text-lg font-semibold mb-4 text-white">Create New Community</h2>
            <div className="mb-6">
              <label className="block text-xs text-[#888] mb-2 uppercase tracking-wide">Community Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. NextJS Developers"
                className="input-ide w-full text-sm"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="btn-ide btn-ide-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="btn-ide btn-ide-primary"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCommunity;