import { useEffect } from "react";
import { useCommunity } from "../hooks/useCommunity";

export const CommunityMembers = ({ id }) => {
  const { getCommunityMembers, communitymembers } = useCommunity();

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
            <div
              key={cm._id}
              className="bg-[#1e293b] p-2 rounded hover:bg-[#273449]"
            >
              {cm.name}
            </div>
          ))}
      </div>

    </div>
  );
};