import { useNavigate } from "react-router-dom";
import { useCommunity } from "../hooks/useCommunity";
import { useEffect, useState } from "react";
import CommunityGrid from "../components/CommunityGrid";
import Navbar from "../components/Navbar";
import CommunityExplore from "./CommunityExplore";

const MyCommunity = () => {
  const navigate = useNavigate();

  const {
    loadCommunities,
    communities,
    createCommunity
  } = useCommunity();

  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    loadCommunities();
  }, []);

  // 🔥 FILTER
  const filteredCommunities = Array.isArray(communities)
  ? communities.filter((c) => {
      if (activeTab === "created") return c.type === "created";
      if (activeTab === "other") return c.type === "other";
      return true;
    })
  : [];

  // 🔥 OPEN PAGE
  const handleOpen = (id) => {
    <CommunityExplore 
    id={id}
    />
    navigate(`/community/explore/${id}`);
  };

  // 🔥 CREATE COMMUNITY
  const handleCreate = async () => {
    if (!name.trim()) return;
    await createCommunity(name);
    setShowModal(false);
    setName("");
    loadCommunities();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white flex flex-col">

      {/* 🔥 NAVBAR */}
      <Navbar />

      <div className="flex flex-1">

        {/* 🔥 LEFT SIDEBAR */}
        <div className="w-[220px] bg-[#020617] border-r border-[#334155] p-4">

          <h2 className="text-lg font-semibold mb-4">Community</h2>

          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-indigo-500 py-2 rounded-lg hover:bg-indigo-600"
          >
            + Create
          </button>

        </div>

        {/* 🔥 MAIN CONTENT */}
        <div className="flex-1 p-6">

          <h1 className="text-2xl font-semibold mb-5">🌐 Communities</h1>

          {/* 🔥 TABS */}
          <div className="flex gap-3 mb-6">
            {["all", "created", "other"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 rounded-lg capitalize
                ${activeTab === tab
                    ? "bg-indigo-500"
                    : "bg-[#1e293b] hover:bg-[#273449]"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 🔥 GRID */}
          <CommunityGrid
            communities={filteredCommunities}
            onOpen={handleOpen}
          />

        </div>
      </div>

      {/* 🔥 CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-[#111827] p-6 rounded-xl w-[350px]">

            <h2 className="text-lg mb-4">Create Community</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter community name..."
              className="w-full p-2 rounded bg-[#1e293b] border border-[#334155]"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="bg-indigo-500 px-4 py-1 rounded"
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