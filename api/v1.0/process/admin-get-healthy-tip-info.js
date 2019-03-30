
"use strict";

const config = require('../../../config');

const HealthyTips = require('../model/healthy-tips');

module.exports = function(req, res) {

	res.contentType('application/json');

	config.setLocalizeFromReq(req);

	let error = [];

	let params = [
		'healthy_tips_id',
	];
	if (!config.isParamsExist(req, params)) {
		error.push(config.getErrorResponse('101Z002', req));
		let resp = config.getResponse(res, 300, error, {}, null);
		config.logApiCall(req, res, resp);
		return;
	}

	let healthyTipsId = req.body['healthy_tips_id'];

	if (config.isEmpty(healthyTipsId)) {
		error.push(config.getErrorResponse('101Z999', req));
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminGetHealthyTipInfo();
	}

	function adminGetHealthyTipInfo() {
		HealthyTips.findOne({ 'healthy_tips_id': healthyTipsId }, function(err, result) {
			if (err) {
				error.push(config.getErrorResponse('101Z012', req));
				let resp = config.getResponse(res, 500, error, {}, err);
				config.logApiCall(req, res, resp);
				return;
			}
			let resp = config.getResponse(res, 100, error, { 'healthy_tip_info': config.getHealthyTipsInfo(result) });
			config.logApiCall(req, res, resp);
			return;
		});
	}

};
