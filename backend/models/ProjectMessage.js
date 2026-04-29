const mongoose = require("mongoose");
const projectMessageSchema = new mongoose.Schema(
    {
        project:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type:{
            type:String,
            enum:["text","system"],
            default:"text"
        }
    },
    {
        timestamps:true
    }
);

module.exports=mongoose.model("ProjectMessage",projectMessageSchema);