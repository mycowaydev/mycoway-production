
"use strict";
const config = require('../../../../../config');
const Review = require('../../../model/review');

module.exports = function (req, res) {
	let error = [];
	let data = getParam(req);
	let filters = config.getFilter(data);
	let sort = config.getSort(req.body.order, getSortFields());

	getReviewList(req, res, error, filters, sort);
}

function getParam(req) {
	var data = {};
	data.status = req.body['status'] || '';
	data.rate = req.body['rate'] || '';

	return data;
}

function getSortFields() {
	return { 1: "review_date" };
}

function getReviewList(req, res, error, filters, sort) {
	let query = filters.$and.length > 0 ? filters : {};
	var recordsTotal = 0;
	var recordsFiltered = 0;

	Review.countDocuments({}, function (err, c) {
		recordsTotal = c;
		Review.countDocuments(query, function (err, c) {
			recordsFiltered = c;
			Review.aggregate([
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
