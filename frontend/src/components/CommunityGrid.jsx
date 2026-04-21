import { useUser } from "../context/UserProvider";
import { useCommunity } from "../hooks/useCommunity";
import { CommunityCard } from "./CommunityCard";

const CommunityGrid = ({ communities, type, joinCommunity, onOpen,deleteCommunity }) => {
  const { user } = useUser();

  // 🛑 safety check
  if (!user) return null;

  // 🔥 Explore tab → simple grid
  if (type === "Explore New") {
    return (
      <div className="grid grid-cols-3 gap-5">
        {communities.map((c) => (
          <CommunityCard
            key={c._id}
            community={c}
            type={type}
            joinCommunity={joinCommunity}
            onOpen={onOpen}
           
          />
        ))}
      </div>
    );
  }

  // 🔥 My Communities → split
  const created = communities.filter(
    (c) => c.owner?.toString() === user._id?.toString()
  );

  const joined = communities.filter(
    (c) => c.owner?.toString() !== user._id?.toString()
  );

  return (
    <div className="space-y-8">

      {/* 🔥 CREATED */}
      <div>
        <h2 className="text-lg mb-3 font-semibold">
          Created by You
        </h2>

        <div className="grid grid-cols-3 gap-5">
          {created.map((c) => (
            <CommunityCard
              key={c._id}
              community={c}
              type={type}
              joinCommunity={joinCommunity}
              onOpen={onOpen}
              deleteCommunity={deleteCommunity}
            />
          ))}
        </div>

        {created.length === 0 && (
          <p className="text-gray-400">No communities created</p>
        )}
      </div>

      {/* 🔥 JOINED */}
      <div>
        <h2 className="text-lg mb-3 font-semibold">
          Joined
        </h2>

        <div className="grid grid-cols-3 gap-5">
          {joined.map((c) => (
            <CommunityCard
              key={c._id}
              community={c}
              type={type}
              joinCommunity={joinCommunity}
              onOpen={onOpen}
            />
          ))}
        </div>

        {joined.length === 0 && (
          <p className="text-gray-400">No joined communities</p>
        )}
      </div>

    </div>
  );
};

export default CommunityGrid;