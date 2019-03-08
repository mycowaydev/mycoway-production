
const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	admin_user_id: String,
	admin_username: String,
	admin_password: String,
	profile_img: String,
	invalid_attempts: Number,
	updated_on: Number,
	updated_date: Date,
	created_on: Number,
	created_date: Date
});
module.exports = mongoose.model('Admin', schema, config.DB['TBL_ADMIN']);
