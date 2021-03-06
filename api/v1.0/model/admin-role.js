
const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	name: String,
	desc: String,
	menu_id: String,
	status: String,
	remarks: String,
	created_by: String,
	created_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_by: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});
module.exports = mongoose.model('AdminRole', schema, config.DB['TBL_ADMIN_ROLE']);
