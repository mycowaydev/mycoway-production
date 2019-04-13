
const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	title: String,
	type: String,
	parent_id: String,
	order_no: String,
	value: String,
	status: String,
	remarks: String,
	opr_by: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});
module.exports = mongoose.model('Menu', schema, config.DB['TBL_MENU']);