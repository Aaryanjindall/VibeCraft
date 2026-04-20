import { ExternalLink,DeleteIcon,Delete, LucideDelete, Trash2 } from "lucide-react";
import { useUser } from "../context/UserProvider";

export const CommunityCard = ({
  community,
  onOpen,
  joinCommunity,
  type,
  deleteCommunity
}) => {
  const { user } = useUser();

  const isOwner =
    community.owner?.toString() === user?._id?.toString();

  return (
    <div
      onClick={() => type !== "Explore New" && onOpen(community._id)}
      className="bg-[#1e293b] border border-[#334155] rounded-xl p-5
      hover:bg-[#273449] hover:scale-[1.02] transition cursor-pointer relative"
    >
      {/* 🔥 Title */}
      <h2 className="text-lg font-semibold">
        {community.name}
      </h2>

      {/* 🔥 Owner badge */}
      {isOwner && (
        <span className="absolute top-3 right-3 text-xs bg-indigo-500 px-2 py-1 rounded">
          Owner
        </span>
      )}

      {/* 🔥 Date */}
      <p className="text-sm text-gray-400 mt-2">
        {new Date(community.createdAt).toDateString()}
      </p>

      {/* 🔥 Members count */}
      <p className="text-xs text-gray-500 mt-1">
        Members: {community.members?.length || 0}
      </p>

      {/* 🔥 Action button */}
      {type === "Explore New" ? (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 important
            joinCommunity(community._id);
          }}
          className="mt-4 w-full bg-indigo-500 py-2 rounded-lg hover:bg-indigo-600"
        >
          Join
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 important
            onOpen(community._id);
          }}
          className="mt-4 flex items-center gap-2 text-indigo-400"
        >
          <ExternalLink size={16} />
          Explore
        </button>
      )}
      {isOwner && (
        <button onClick={(e)=> {e.stopPropagation(); 
          deleteCommunity(community._id)
        }
        }><Trash2 size={16} /></button>
      )}
    </div>
  );
};