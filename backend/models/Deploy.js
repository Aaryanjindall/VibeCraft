const mongoose = require("mongoose");

const deploySchema = new mongoose.Schema({

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    deployId: String,
});

module.exports = mongoose.model("Deploy",deploySchema);