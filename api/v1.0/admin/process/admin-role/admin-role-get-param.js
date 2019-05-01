"use strict";
const config = require('../../../../../config');
const AdminRole = require('../../../model/admin-role');

module.exports = function (req, res) {
	let error = [];
	adminGetMTParamGroup(req, res, error);
}

function adminGetMTParamGroup(req, res, error) {
	AdminRole.find().sort({ order_no: 1 }).exec(function (err, result) {
		if (err) {
			error.push(config.getErrorResponse('101Z012', req));
			let resp = config.getResponse(res, 500, error, {}, err);
			config.logApiCall(req, res, resp);
			console.log(err)
			return;
		}
		let resp = config.getResponse(res, 100, error, result);
		config.logApiCall(req, res, resp);
		return;
	});
}