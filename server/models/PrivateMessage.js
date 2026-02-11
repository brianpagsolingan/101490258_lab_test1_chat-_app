const mongoose = require('mongoose');

const PriveateMessageSchema = new mongoose.Schema({
    from_user: {type: String, required: true},
    to_user: {type: String, required: true},
    message: {type: String, required: true},
    date_sent: {type: String, default: () => Date.now().toLocaleString()}
});
module.exports = mongoose.model('PrivateMessage', PriveateMessageSchema);