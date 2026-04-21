// Post.js
const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: String, 
    content: String,

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    comments: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);