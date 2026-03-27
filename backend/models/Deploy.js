const mongoose = require("mongoose");

const deploySchema = new mongoose.Schema({

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    deployId: String,
    type: {
        type:String,
    },
    url: String,
    status: {
        type: String,
        default: "deploying",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }

});

module.exports = mongoose.model("Deploy",deploySchema);