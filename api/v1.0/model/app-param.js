
const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	key: String,
	value: String,
	remarks: String,
	opr: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});
// schema.pre('save', function(next) {
// 	this.key = config.getUniqueHashId(String(this._id));
// 	next();
// });
module.exports = mongoose.model('AppParam', schema, config.DB['TBL_APPPARAM']);
