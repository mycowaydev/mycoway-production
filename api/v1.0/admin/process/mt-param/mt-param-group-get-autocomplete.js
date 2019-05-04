"use strict";
const config = require('../../../../../config');
const MtParam = require('../../../model/mt-param');

module.exports = function (req, res) {
	let error = [];
	getMTParamGroup(req, res, error);
}

function getMTParamGroup(req, res, error) {
	MtParam.distinct("group").exec(function (err, result) {
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