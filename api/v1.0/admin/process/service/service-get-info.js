
"use strict";

const config = require('../../../../../config');

const Service = require('../../../model/service');

module.exports = function (req, res) {
	let error = [];
	let id = req.body['id'];

	if (!config.isParamsExist(req, ['id'])) {
		error.push(config.getErrorResponse('101Z002', req));
		let resp = config.getResponse(res, 300, error, {}, null);
		config.logApiCall(req, res, resp);
		return;
	}

	if (config.isEmpty(id)) {
		error.push(config.getErrorResponse('101A008', req));
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminGetServiceInfo(req, res, error, id);
	}
}

function adminGetServiceInfo(req, res, error, id) {
	Service.findOne({ '_id': id }, function (err, result) {
		if (err) {
			error.push(config.getErrorResponse('101Z012', req));
			let resp = config.getResponse(res, 500, error, {}, err);
			config.logApiCall(req, res, resp);
			return;
		}
		let resp = config.getResponse(res, 100, error, result);
		config.logApiCall(req, res, resp);
		return;
	});
}