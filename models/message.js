const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	title: { type: String, required: true, },
	body: { type: String, required: true, },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true, },
	timestamp: { type: Date, default: Date.now, },
});

module.exports = mongoose.model('Message', MessageSchema);
