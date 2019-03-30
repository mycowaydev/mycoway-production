
"use strict";

const config = require('../../../config');

const MtParam = require('../model/mt-param');

module.exports = function(req, res) {

	res.contentType('application/json');

	config.setLocalizeFromReq(req);

	let error = [];

	let params = [
		'group',
		'code',
	];
	if (!config.isParamsExist(req, params)) {
		error.push(config.getErrorResponse('', 302));
		let resp = config.getResponse(res, 300, error, {}, null);
		config.logApiCall(req, res, resp);
		return;
	}

	let group = req.body['group'];
	let code = req.body['code'];

	if (config.isEmpty(group)) {
		error.push(config.getErrorResponse(config.API['ADMIN_GET_MT_PARAM_INFO'], 201));
	}
	if (config.isEmpty(code)) {
		error.push(config.getErrorResponse(config.API['ADMIN_GET_MT_PARAM_INFO'], 202));
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminGetMtParamInfo();
	}

	function adminGetMtParamInfo() {
		MtParam.findOne({ 'group': group ,'code': code}, function(err, result) {
			if (err) {
				error.push(config.getErrorResponse('', 501));
				let resp = config.getResponse(res, 500, error, {}, err);
				config.logApiCall(req, res, resp);
				return;
			}
			let resp = config.getResponse(res, 100, error, { 'mt_param_info': config.getMtParamInfo(result) });
			config.logApiCall(req, res, resp);
			return;
		});
	}

};
