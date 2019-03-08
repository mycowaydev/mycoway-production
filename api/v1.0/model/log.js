
const mongoose = require('mongoose');
const schema = mongoose.Schema({
	wsid: String,
	ip_address: String,
	status_code: Number,
	url_endpoint: String,
	request: String,
	response: String,
	files: String,
	created_on: Number,
	created_date: Date
});
module.exports = mongoose.model('Log', schema, 'tbl_log');
