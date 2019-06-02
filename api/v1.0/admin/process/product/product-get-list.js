
"use strict";
const config = require('../../../../../config');
const Product = require('../../../model/product-master');

module.exports = function (req, res) {
	let error = [];
	let data = getParam(req);
	let filters = config.getFilter(data);
	let sort = config.getSort(req.body.order, getSortFields());

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		getProductList(req, res, error, filters, sort);
	}
}

function getParam(req) {
	var data = {};
	data._id = req.body['id'] || '';
	data.name = req.body['name'] || '';
	data.product_type = req.body['product_type'] || '';
	data.status = req.body['status'] || '';

	let publish_date = req.body['publish_date'].split(' - ');
	let unpublish_date = req.body['unpublish_date'].split(' - ');

	data.publish_date = {
		fdate: publish_date[0] || '',
		tdate: publish_date[1] || '',
	};
	data.unpublish_date = {
		fdate: unpublish_date[0] || '',
		tdate: unpublish_date[1] || '',
	};
	return data;
}

function getSortFields() {
	return { 1: "_id", 2: "name", 3: "product_type", 4: "status", 5: "publish_date" };
}

function getProductList(req, res, error, filters, sort) {
	let query = filters.$and.length > 0 ? filters : {};
	var recordsTotal = 0;
	var recordsFiltered = 0;

	Product.countDocuments({}, function (err, c) {
		recordsTotal = c;
		Product.countDocuments(query, function (err, c) {
			recordsFiltered = c;
			Product.aggregate([
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
				if (results && results.length > 0) {
					for (let i = 0; i < results.length; i++) {
						results[i] = config.getProductInfo(results[i]);
					}
				} else {
					results = [];
				}

				let resp = config.getResponseP(res, 100, error, req.body.draw, recordsFiltered, recordsTotal, results);
				config.logApiCall(req, res, resp);
				return;
			});
		});
	});
}