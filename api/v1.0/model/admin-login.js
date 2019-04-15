
const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	admin_user_id: String,
	action: String,
	action_status: String,
	datetime: String,
	ip_address: String,
	browser: String,
	device: String,
	opr_by: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});
module.exports = mongoose.model('AdminLogin', schema, config.DB['TBL_ADMIN_LOGIN']);
