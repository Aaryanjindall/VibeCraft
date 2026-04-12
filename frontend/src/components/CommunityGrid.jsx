import { CommunityCard } from "./CommunityCard";

const CommunityGrid = ({ communities, onOpen }) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      {communities.map((c) => (
        <CommunityCard
          key={c._id}
          community={c}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
};

export default CommunityGrid;