import { useEffect } from "react";
import { useCommunity } from "../hooks/useCommunity";

export const CommSidebar = ({ id, communitysidebar, onSelect }) => {
  const { getCommunityProjects, communityProjects } = useCommunity();

  useEffect(() => {
    if (communitysidebar) {
      getCommunityProjects(id);
    }
  }, [communitysidebar, id]);

  if (!communitysidebar) return null;

  return (
    <div className="fixed right-0 top-0 w-[280px] h-full bg-[#111827] text-white p-4 border-l border-[#334155]">

      <h3 className="text-center text-lg mb-4">Projects</h3>

      <div className="space-y-3">
        {Array.isArray(communityProjects) &&
          communityProjects.map((cp) => (
            <div
              key={cp._id}
              className="bg-[#1e293b] p-3 rounded-lg hover:bg-[#273449] cursor-pointer"
              onClick={() => onSelect(cp)}
            >
              {cp.name}
            </div>
          ))}
      </div>

    </div>
  );
};