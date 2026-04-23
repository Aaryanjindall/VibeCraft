import { useEffect, useState } from "react";
import { Heart, Send } from "lucide-react";

const PostFeed = ({ communityId, posts, loadPosts, likePost, commentPost }) => {
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    loadPosts(communityId);
  }, [communityId]);

  return (
    <div className="space-y-4">
      {Array.isArray(posts) && posts.length > 0 ? posts.map((p) => (
        <div key={p._id} className="bg-[#111111] p-5 rounded-lg border border-[#2d2d2d] hover:border-[#444] transition-colors">
          
          {/* 🔥 HEADER */}
          <div className="flex items-center gap-3 mb-3 border-b border-[#2d2d2d] pb-3">
            <img
              src={p.author?.avatar || `https://ui-avatars.com/api/?name=${p.author?.username || 'User'}&background=252525&color=f0f0f0`}
              className="w-10 h-10 rounded-md border border-[#333] object-cover"
              alt={p.author?.username}
            />
            <div>
              <p className="text-sm font-semibold text-[#f0f0f0]">
                {p.author?.username}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#666]">
                {new Date(p.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* 🔥 CONTENT */}
          <h2 className="text-base font-bold text-[#f0f0f0] mb-2">
            {p.title}
          </h2>
          <p className="text-sm text-[#d1d1d1] leading-relaxed mb-4 whitespace-pre-wrap">
            {p.content}
          </p>

          {/* 🔥 ACTIONS */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => likePost(p._id, communityId)}
              className="flex items-center gap-1.5 text-xs font-medium text-[#888] hover:text-[#e53e3e] transition-colors bg-[#1a1a1a] px-3 py-1.5 rounded-md border border-[#2d2d2d]"
            >
              <Heart size={14} className={p.likes?.length > 0 ? "fill-[#e53e3e] text-[#e53e3e]" : ""} /> 
              {p.likes?.length || 0} Likes
            </button>
          </div>

          {/* 🔥 COMMENTS */}
          <div className="bg-[#1a1a1a] rounded-md p-3 border border-[#2d2d2d]">
            {p.comments?.length > 0 ? (
              <div className="space-y-3 mb-4 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {p.comments.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <img
                      src={c.user?.avatar || `https://ui-avatars.com/api/?name=${c.user?.username || 'User'}&background=252525&color=f0f0f0`}
                      className="w-6 h-6 rounded-md object-cover"
                    />
                    <div className="flex-1 bg-[#111111] p-2.5 rounded border border-[#2d2d2d]">
                      <p className="text-[10px] font-bold text-[#a855f7] mb-1">
                        {c.user?.username}
                      </p>
                      <p className="text-xs text-[#d1d1d1]">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#666] mb-3">No comments yet. Start the discussion!</p>
            )}

            {/* 🔥 ADD COMMENT */}
            <div className="flex items-center gap-2 mt-2">
              <input
                value={commentText[p._id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [p._id]: e.target.value,
                  })
                }
                placeholder="Write a reply..."
                className="input-ide flex-1 py-1.5 text-xs"
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && commentText[p._id]?.trim()) {
                    commentPost(p._id, commentText[p._id], communityId);
                    setCommentText({ ...commentText, [p._id]: "" });
                  }
                }}
              />
              <button
                onClick={() => {
                  if (commentText[p._id]?.trim()) {
                    commentPost(p._id, commentText[p._id], communityId);
                    setCommentText({ ...commentText, [p._id]: "" });
                  }
                }}
                className="btn-ide btn-ide-primary px-3 py-1.5"
              >
                <Send size={14} />
              </button>
            </div>
          </div>

        </div>
      )) : (
        <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-[#2d2d2d] rounded-lg">
          <p className="text-[#888] text-sm">No posts yet. Be the first to start a discussion!</p>
        </div>
      )}
    </div>
  );
};

export default PostFeed;