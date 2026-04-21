// components/CreatePost.jsx
import { useState } from "react";
import { usePost } from "../hooks/usePost";

const CreatePost = ({ communityId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createPost } = usePost();

  return (
    <div>
      <h3 className="mb-3 font-semibold">Create Post</h3>

      <input
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-2 bg-[#1e293b] rounded"
      />

      <textarea
        placeholder="Description..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 bg-[#1e293b] rounded"
      />

      <button
        onClick={() => {
          createPost(communityId, { title, content });
          setTitle("");
          setContent("");
        }}
        className="w-full mt-2 bg-indigo-500 py-1 rounded"
      >
        Post
      </button>
    </div>
  );
};

export default CreatePost;