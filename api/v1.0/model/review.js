const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	status: String,
	email_address: String,
	rate: Number,
	desc: String,
	review_date: { type: Number, default: config.getCurrentTimestamp() },
	remarks: String,
	opr_by: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});
module.exports = mongoose.model('Review', schema, config.DB['TBL_REVIEW']);
