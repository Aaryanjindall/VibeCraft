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

  return (
    <div className="bg-[#020617] p-4 h-full border-r border-[#334155]">

      <h3 className="text-lg mb-4">👥 Members</h3>

      <div className="space-y-2">
        {Array.isArray(communitymembers) &&
          communitymembers.map((cm) => (
            <div key={cm.user._id}>

              {/* MEMBER CARD */}
              <div
                onClick={() =>
                  setSelectedMember(
                    selectedMember === cm.user._id ? null : cm.user._id
                  )
                }
                className="bg-[#1e293b] p-2 rounded hover:bg-[#273449] cursor-pointer"
              >
                {cm.user.username} - {cm.role}
                <br />
                {cm.user.email}
              </div>

              {/* 🔽 DROPDOWN */}
              {selectedMember === cm.user._id && (
                <div className="bg-[#334155] p-2 rounded mt-1 ml-2">

                  <button
                    className="block text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMember(cm.user._id, id);
                    }}
                  >
                    Remove
                  </button>

                  <div className="mt-2">
                    <p>Assign Role:</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        assignRole(id, cm.user._id, "admin");
                      }}
                    >
                      Admin
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        assignRole(id, cm.user._id, "member");
                      }}
                    >
                      Member
                    </button>

                  </div>

                </div>
              )}

            </div>
          ))}
      </div>

    </div>
  );
};