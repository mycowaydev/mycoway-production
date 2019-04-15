
const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	admin_user_id: String,
	salt_value: String,
	hash_password: String,
	otp_flag: String,
	expiry_flag: String,
	expiry_date: { type: Number, default: config.getCurrentTimestamp() },
	created_by: String,
	created_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_by: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});
module.exports = mongoose.model('AdminPass', schema, config.DB['TBL_ADMIN_PASS']);
