// components/CreatePost.jsx
import { useState } from "react";

const CreatePost = ({ communityId, createPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] border-b border-[#2d2d2d] pb-2 mb-4">Create Post</h3>

      <input
        placeholder="Post Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-ide w-full mb-3"
      />

      <textarea
        placeholder="What's on your mind? Discuss code, ask questions..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="input-ide w-full resize-none min-h-[100px]"
      />

      <button
        onClick={() => {
          createPost(communityId, { title, content });
          setTitle("");
          setContent("");
        }}
        className="btn-ide btn-ide-primary w-full mt-3"
      >
        Publish Post
      </button>
    </div>
  );
};

export default CreatePost;