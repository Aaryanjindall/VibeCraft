// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const communitySchema = new Schema({
//   projectId: {
//     type: String,
//     required: true,
//     unique: true,
//     index: true
//   },
//   projectName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     default: ''
//   },
//   createdBy: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   members: [{
//     type: Schema.Types.ObjectId,
//     ref: 'User'
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Index for faster queries
// communitySchema.index({ projectId: 1 });
// communitySchema.index({ members: 1 });

// module.exports = mongoose.model('Community', communitySchema);


const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
      unique: true,
      trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Community", communitySchema
);