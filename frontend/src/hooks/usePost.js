// hooks/usePost.js
import { useState } from "react";

export const usePost = () => {
  const [posts, setPosts] = useState([]);

  const loadPosts = async (communityId) => {
  try {
    const res = await fetch(
      `https://vibecraft-sxyx.onrender.com/api/post/${communityId}`,
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
    // 🔥 Optimistic Update
    const tempPost = {
       _id: "temp_" + Date.now(),
       title: body.title,
       content: body.content,
       author: { username: "You (sending...)", avatar: "" },
       createdAt: new Date().toISOString(),
       likes: [],
       comments: []
    };
    setPosts(prev => [tempPost, ...prev]);

    try {
      const res = await fetch(`https://vibecraft-sxyx.onrender.com/api/post/create/${communityId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json(); 
      
      // Replace temp with real data
      setPosts(prev => prev.map(p => p._id === tempPost._id ? data : p));
      loadPosts(communityId);
    } catch (err) {
      // Revert if failed
      setPosts(prev => prev.filter(p => p._id !== tempPost._id));
    }
  };
  const commentPost = async (postId, text, communityId) => {
    try {
      // 🔥 Optimistic Update
      const newComment = { text, user: { username: "You", avatar: "" } };
      setPosts(prev => prev.map(p => 
        p._id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p
      ));

      const res = await fetch(`https://vibecraft-sxyx.onrender.com/api/post/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to post comment");
      
      loadPosts(communityId); // 🔥 refresh properly after saving
    } catch (err) {
      toast.error(err.message);
      loadPosts(communityId); // rollback
    }
  };

  const likePost = async (id, communityId) => {
    try {
      // 🔥 Optimistic Update
      setPosts(prev => prev.map(p => 
        p._id === id ? { 
          ...p, 
          likes: p.likes?.includes("temp_id") 
            ? p.likes.filter(l => l !== "temp_id") 
            : [...(p.likes || []), "temp_id"] 
        } : p
      ));

      const res = await fetch(`https://vibecraft-sxyx.onrender.com/api/post/like/${id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to like post");

      loadPosts(communityId); // 🔥 refresh
    } catch (err) {
      toast.error(err.message);
      loadPosts(communityId);
    }
  };
  

  return {
    posts,
    loadPosts,
    createPost,
    likePost,
    commentPost

    
  };
};