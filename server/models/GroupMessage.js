const mongoose = require('mongoose');

const GroupMessageSchema = new mongoose.Schema({
    from_username: {type: String, required: true},
    room: {type: String, required: true},
    message: {type: String, required: true},
    date_sent: {type: String, default: () => Date.now().toLocaleString()}
});

module.exports = mongoose.model('GroupMessage', GroupMessageSchema);