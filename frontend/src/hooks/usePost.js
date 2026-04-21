// hooks/usePost.js
import { useState } from "react";

export const usePost = () => {
  const [posts, setPosts] = useState([]);

  const loadPosts = async (communityId) => {
  try {
    const res = await fetch(
      `http://localhost:5001/api/post/${communityId}`,
      { credentials: "include" }
    );

    const data = await res.json();

    setPosts(Array.isArray(data) ? data : []); // 🔥 FIX
  } catch (err) {
    console.log(err);
    setPosts([]);
  }
};

  const createPost = async (communityId, body) => {
    const res = await fetch(`http://localhost:5001/api/post/create/${communityId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json(); 

  setPosts(prev => [data, ...prev]);
    loadPosts(communityId);
 
  };
  const commentPost = async (postId, text, communityId) => {
  await fetch(`http://localhost:5001/api/post/comment/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text }),
  });

  loadPosts(communityId); // 🔥 important
};

  const likePost = async (id, communityId) => {
  await fetch(`http://localhost:5001/api/post/like/${id}`, {
    method: "POST",
    credentials: "include",
  });

  loadPosts(communityId); // 🔥 refresh
};
  

  return {
    posts,
    loadPosts,
    createPost,
    likePost,
    commentPost

    
  };
};