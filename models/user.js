const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstName: { type: String, required: true, },
	lastName: { type: String, required: true, },
	username: { type: String, required: true, },
	password: { type: String, required: true, },
	type: { type: String, enum: ['normal', 'member', 'admin'], default: 'normal', },
});

UserSchema
.virtual('fullName')
.get(function () {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', UserSchema);

