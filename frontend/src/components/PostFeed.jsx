// components/PostFeed.jsx
import { useEffect, useState } from "react";
import { usePost } from "../hooks/usePost";

const PostFeed = ({ communityId }) => {
  const { posts, loadPosts, likePost, commentPost } = usePost();
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    loadPosts(communityId);
  }, [communityId]);

  return (
    <div className="space-y-4">

      {Array.isArray(posts) && posts.map((p) => (
        <div key={p._id} className="bg-[#111827] p-4 rounded-xl shadow">

          {/* 🔥 HEADER */}
          <div className="flex items-center gap-3">

            {/* AVATAR */}
            <img
              src={p.author?.avatar}
              className="w-10 h-10 rounded-full"
            />

            {/* NAME + TIME */}
            <div>
              <p className="text-sm font-semibold">
                {p.author?.username}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(p.createdAt).toLocaleString()}
              </p>
            </div>

          </div>

          {/* 🔥 TITLE */}
          <h2 className="text-lg font-semibold mt-3">
            {p.title}
          </h2>

          {/* 🔥 DESCRIPTION */}
          <p className="mt-2 text-gray-300">
            {p.content}
          </p>

          {/* 🔥 ACTIONS */}
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => likePost(p._id)}
              className="text-indigo-400"
            >
              ❤️ {p.likes.length}
            </button>
          </div>

          {/* 🔥 COMMENTS */}
          <div className="mt-4 space-y-3">

            {p.comments.map((c, i) => (
              <div key={i} className="flex gap-2">

                {/* COMMENT AVATAR */}
                <img
                  src={c.user?.avatar}
                  className="w-8 h-8 rounded-full"
                />

                <div className="bg-[#1e293b] p-2 rounded-lg flex-1">

                  <p className="text-xs text-indigo-400">
                    {c.user?.username}
                  </p>

                  <p className="text-sm">
                    {c.text}
                  </p>

                </div>

              </div>
            ))}

            {/* 🔥 ADD COMMENT */}
            <div className="flex gap-2 mt-2">

              <input
                value={commentText[p._id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [p._id]: e.target.value,
                  })
                }
                placeholder="Write comment..."
                className="flex-1 p-2 bg-[#020617] rounded outline-none"
              />

              <button
                onClick={() => {
                  commentPost(p._id, commentText[p._id]);
                  setCommentText({
                    ...commentText,
                    [p._id]: "",
                  });
                }}
                className="bg-indigo-500 px-3 rounded"
              >
                Send
              </button>

            </div>

          </div>

        </div>
      ))}

    </div>
  );
};

export default PostFeed;