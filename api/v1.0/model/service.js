const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	name: String,
	status: String,
	value: Number,
	unit: String,
	repeat: Boolean,
	remarks: String,
	created_by: String,
	created_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_by: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});
module.exports = mongoose.model('Service', schema, config.DB['TBL_SERVICE']);
