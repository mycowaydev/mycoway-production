
"use strict";
const config = require('../../../../../config');
const Product = require('../../../model/product-master');

module.exports = function (req, res) {

	let data = getParam(req);
	let error = validateParam(req, data);

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		getProductInfo(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};
	data.id = req.body['id'] || '';

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (!config.isParamsExist(req, ['id'])) {
		error.push(config.getErrorResponse('101Z002', req));
	}
	if (config.isEmpty(data.id)) {
		error.push(config.getErrorResponse('101A008', req));
	}

	return error;
}

function getQuery(data) {
	let query = { '_id': data.id };
	return query;
}

function getProductInfo(req, res, error, data) {
	Product.findOne(getQuery(data), function (err, result) {
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