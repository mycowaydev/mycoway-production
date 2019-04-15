
const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	admin_user_id: String,
	admin_username: String,
	role: String,
	email: String,
	phone_no: String,
	profile_img: String,
	level: String,
	group: String,
	superior: String,
	valid_until: { type: Number, default: config.getCurrentTimestamp() },
	invalid_attempts: Number,
	status: String,
	remarks: String,
	created_by: String,
	created_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_by: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});
module.exports = mongoose.model('Admin', schema, config.DB['TBL_ADMIN']);
