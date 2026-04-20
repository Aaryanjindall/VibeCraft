const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    isFork: {
      type: Boolean,
      default: false
    },

    forkCount: {
      type: Number,
      default: 0
    },

    parentProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null
    },

    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    files: {
      type: Object,
      default: {},
    },

    promptHistory: [
      {
        prompt: {
          type: String,
          required: true,
          trim: true,
        },

        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    deployHistory: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },

        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);