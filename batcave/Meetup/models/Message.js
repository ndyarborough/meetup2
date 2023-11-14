const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    source: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    format: {
        type: String,
    },
    acknowledgment: {
        type: Boolean,
        default: false,
    },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
