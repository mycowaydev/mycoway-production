
"use strict";

const config = require('../../../../config');

const AppParam = require('../../model/app-param');

module.exports = function (req, res) {
	let error = [];
	let data = getParam(req);
	let filters = config.getFilter(data);
	let sort = config.getSort(req.body.order, getSortFields());

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminGetAppParamList(req, res, error, filters, sort);
	}
}

function getParam(req) {
	var data = {};

	data.key = req.body['key'] ? req.body['key'] : '';
	data.value = req.body['value'] ? req.body['value'] : '';
	data.status = req.body['status'] ? req.body['status'] : '';

	return data;
}

function getSortFields() {
	return { 1: "key", 2: "value" };
}

function adminGetAppParamList(req, res, error, filters, sort) {
	let query = filters.$and.length > 0 ? filters : {};
	var recordsTotal = 0;
	var recordsFiltered = 0;

	AppParam.countDocuments({}, function (err, c) {
		recordsTotal = c;
		AppParam.countDocuments(query, function (err, c) {
			recordsFiltered = c;
			AppParam.aggregate([
				{ $match: query },
				{ $sort: sort },
				{ $skip: Number(req.body.start) },
				{ $limit: Number(req.body.length) },
			], function (err, results) {
				if (err) {
					error.push(config.getErrorResponse('101Z012', req));
					let resp = config.getResponse(res, 500, error, {}, err);
					config.logApiCall(req, res, resp);
					return;
				}

				let resp = config.getResponseP(res, 100, error, req.body.draw, recordsFiltered, recordsTotal, results);
				config.logApiCall(req, res, resp);
				return;
			});
		});
	});
}