
const config = require('./../../../config');
const mongoose = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const schema = mongoose.Schema({
	group: String,
	code: String,
	value: String,
	order_no: Number,
	status: String,
	remarks: String,
	created_by: String,
	created_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_by: String,
	opr_date: { type: Number, default: config.getCurrentTimestamp() },
	opr_func: String
});

schema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('MtParam', schema, config.DB['TBL_MTPARAM']);
