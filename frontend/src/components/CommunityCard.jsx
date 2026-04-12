import { ExternalLink } from "lucide-react";

export const CommunityCard = ({ community, onOpen }) => {
  return (
    <div
      className="bg-[#1e293b] border border-[#334155] rounded-xl p-5
      hover:bg-[#273449] hover:scale-[1.02] transition cursor-pointer"
    >
      <h2 className="text-lg font-semibold">
        {community.name}
      </h2>

      <p className="text-sm text-gray-400 mt-2">
        {new Date(community.createdAt).toDateString()}
      </p>

      <button
        onClick={() => onOpen(community._id)}
        className="mt-4 flex items-center gap-2 text-indigo-400"
      >
        <ExternalLink size={16} />
        Explore
      </button>
    </div>
  );
};