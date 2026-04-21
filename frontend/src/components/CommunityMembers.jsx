import { useEffect, useState } from "react";
import { useCommunity } from "../hooks/useCommunity";

export const CommunityMembers = ({ id }) => {
  const {
    getCommunityMembers,
    communitymembers,
    removeMember,
    assignRole
  } = useCommunity();

  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (id) {
      getCommunityMembers(id);
    }
  }, [id]);

  // 🔥 ROLE BADGE
  const getRoleBadge = (role) => {
    if (role === "owner") return "👑 Owner";
    if (role === "admin") return "⚙️ Admin";
    return "👤 Member";
  };

  return (
    <div className="bg-[#020617] p-4 h-full border-r border-[#334155] overflow-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">👥 Members</h3>
        <span className="text-sm text-gray-400">
          {communitymembers?.length || 0}
        </span>
      </div>

      {/* MEMBERS LIST */}
      <div className="space-y-3">
        {Array.isArray(communitymembers) &&
          communitymembers.map((cm) => (
            <div key={cm.user._id}>

              {/* 🔥 MEMBER CARD */}
              <div
                onClick={() =>
                  setSelectedMember(
                    selectedMember === cm.user._id ? null : cm.user._id
                  )
                }
                className={`p-3 rounded-lg cursor-pointer transition
                ${
                  selectedMember === cm.user._id
                    ? "bg-[#273449] border border-indigo-500"
                    : "bg-[#1e293b] hover:bg-[#273449]"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{cm.user.username}</p>
                    <p className="text-xs text-gray-400">
                      {cm.user.email}
                    </p>
                  </div>

                  {/* 🔥 BADGE */}
                  <span className="text-xs px-2 py-1 rounded bg-[#334155]">
                    {getRoleBadge(cm.role)}
                  </span>
                </div>
              </div>

              {/* 🔽 DROPDOWN */}
              {selectedMember === cm.user._id && (
                <div className="bg-[#111827] p-3 rounded-lg mt-2 ml-2 border border-[#334155] space-y-2">

                  {/* REMOVE */}
                  <button
                    className="w-full text-left text-red-400 hover:text-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMember(cm.user._id, id);
                    }}
                  >
                    ❌ Remove Member
                  </button>

                  {/* ROLE CHANGE */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Change Role
                    </p>

                    <div className="flex gap-2">
                      <button
                        className="bg-indigo-500 px-2 py-1 rounded text-xs hover:bg-indigo-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          assignRole(id, cm.user._id, "admin");
                        }}
                      >
                        Make Admin
                      </button>

                      <button
                        className="bg-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          assignRole(id, cm.user._id, "member");
                        }}
                      >
                        Make Member
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          ))}
      </div>

    </div>
  );
};