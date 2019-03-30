
"use strict";

const config = require('../../../config');

const AppParam = require('../model/app-param');

module.exports = function(req, res) {

	res.contentType('application/json');

	config.setLocalizeFromReq(req);

	let error = [];

	let params = [
		'key',
	];
	if (!config.isParamsExist(req, params)) {
		error.push(config.getErrorResponse('101Z002', req));
		let resp = config.getResponse(res, 300, error, {}, null);
		config.logApiCall(req, res, resp);
		return;
	}

	let key = req.body['key'];

	if (config.isEmpty(key)) {
		error.push(config.getErrorResponse('101A008', req));
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminGetAppParamInfo();
	}

	function adminGetAppParamInfo() {
		AppParam.findOne({ 'key': key }, function(err, result) {
			if (err) {
				error.push(config.getErrorResponse('101Z012', req));
				let resp = config.getResponse(res, 500, error, {}, err);
				config.logApiCall(req, res, resp);
				return;
			}
			let resp = config.getResponse(res, 100, error, { 'app_param_info': config.getAppParamInfo(result) });
			config.logApiCall(req, res, resp);
			return;
		});
	}

};
