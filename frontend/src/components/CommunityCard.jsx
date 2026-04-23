import { ExternalLink, Trash2, Users, Calendar, ArrowRight } from "lucide-react";
import { useUser } from "../context/UserProvider";

export const CommunityCard = ({
  community,
  onOpen,
  joinCommunity,
  type,
  deleteCommunity
}) => {
  const { user } = useUser();

  const isOwner = community.owner?.toString() === user?._id?.toString();

  return (
    <div
      onClick={() => type !== "Explore New" && onOpen(community._id)}
      className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-xl p-5 flex flex-col justify-between h-[180px]
      hover:border-[#444] hover:bg-[#1e1e1e] transition-colors cursor-pointer group relative"
    >
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-[#f0f0f0] truncate pr-4">
            {community.name}
          </h2>
          {isOwner && (
            <span className="shrink-0 bg-[#2d2d2d] text-[#a855f7] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">
              Owner
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-[#888]">
          <div className="flex items-center gap-1.5">
            <Users size={14} />
            <span>{community.members?.length || 0} Members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{new Date(community.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section - Action button */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#2d2d2d] border-opacity-50">
        {type === "Explore New" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              joinCommunity(community._id);
            }}
            className="flex items-center justify-center gap-2 w-full bg-[#e53e3e] hover:bg-[#c53030] text-white text-sm font-medium py-2 rounded-md transition-colors"
          >
            Join Community
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(community._id);
            }}
            className="flex items-center gap-2 text-sm font-medium text-[#888] group-hover:text-[#f0f0f0] transition-colors"
          >
            Explore <ArrowRight size={14} />
          </button>
        )}

        {isOwner && (
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              deleteCommunity(community._id);
            }}
            className="p-1.5 rounded-md text-[#666] hover:bg-[#e53e3e]/10 hover:text-[#e53e3e] transition-colors ml-2 shrink-0"
            title="Delete Community"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};