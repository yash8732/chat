const mongoose = require("mongoose");
const messageSchema = require("./message");

const roomSchema = new mongoose.Schema({
    users :{
        type : [mongoose.Schema.Types.ObjectId],
        ref : "users"
    },
    messages :[messageSchema]
}, {timestamps: true});

const room = mongoose.model("room", roomSchema);

module.exports = room