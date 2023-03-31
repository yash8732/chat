const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        unique : true,
        required : true,
    },
    rooms : {
        type :[mongoose.Schema.Types.ObjectId],
        ref : "rooms"
    }
}, {timestamps: true});

const user = mongoose.model("user", userSchema);

module.exports = user