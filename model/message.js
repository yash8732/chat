const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default : false
    }
});

module.exports = messageSchema;