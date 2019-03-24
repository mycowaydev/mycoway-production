
const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	group: String,
	code: String,
	value: String,
	order_no: Number,
	active: String,
	remarks: String,
	opr: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});
// schema.pre('save', function(next) {
// 	this.key = config.getUniqueHashId(String(this._id));
// 	next();
// });
module.exports = mongoose.model('MtParam', schema, config.DB['TBL_MTPARAM']);
