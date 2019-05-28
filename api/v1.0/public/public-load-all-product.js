
"use strict";
const config = require('../../../config');
const ProductMaster = require('../model/product-master');

module.exports = function (req, res) {
	let data = getParam(req);
	let error = validateParam(req, data);

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		getProductList(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};

	data.productType = req.body['productType'] || '';

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (!config.isParamsExist(req, ['productType'])) {
		error.push(config.getErrorResponse('101Z002', req));
	}
	if (config.isEmpty(data.productType)) {
		error.push(config.getErrorResponse('101A008', req));
	}

	return error;
}

function getQuery(data) {
	let query = { 'type': data.productType, 'status': 'A', 'publish_date': { $lt: config.getCurrentTimestamp() }, 'unpublish_date': { $gt: config.getCurrentTimestamp() } };
	return query;
}

function getField() {
	let field = { _id: true, name: true, image: true };
	return field;
}

function getProductList(req, res, error, data) {
	ProductMaster.find(getQuery(data), getField(), function (err, result) {
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