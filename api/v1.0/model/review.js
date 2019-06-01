const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	name: String,
	status: String,
	email_address: String,
	rate: String,
	desc: String,
	review_date: { type: Number, default: config.getCurrentTimestamp() },
	images: [String],
	remarks: String,
	opr_by: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});
module.exports = mongoose.model('Review', schema, config.DB['TBL_REVIEW']);
