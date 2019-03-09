
const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	healthy_tips_id: String,
	title: String,
	description: String,
	image: String,
	updated_on: Number,
	updated_date: Date,
	created_on: { type: Number, default: config.getCurrentTimestamp() },
	created_date: { type: Date, default: new Date().toISOString() }
});
schema.pre('save', function(next) {
	this.healthy_tips_id = config.getUniqueHashId(String(this._id));
	next();
});
module.exports = mongoose.model('HealthyTips', schema, config.DB['TBL_HEALTHY_TIPS']);
