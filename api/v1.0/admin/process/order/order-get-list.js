
"use strict";
const config = require('../../../../../config');
const Order = require('../../../model/order');

module.exports = function (req, res) {
	let error = [];
	let data = getParam(req);
	let filters = config.getFilter(data);
	let sort = config.getSort(req.body.order, getSortFields());

	console.log("req.body['order_date_from'] :: " + req.body['order_date']);
	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		getOrderList(req, res, error, filters, sort);
	}
}

function getParam(req) {
	var data = {};
	data.id = req.body['id'] || '';
	data.email = req.body['email'] || '';
	data.phone_no = req.body['phone_no'] || '';
	data.status = req.body['status'] || '';
	data.order_date = {
		fdate: req.body['order_date_from'] || '',
		tdate: req.body['order_date_to'] || '',
	}

	return data;
}

function getSortFields() {
	return { 1: "id", 2: "email", 3: "phone_no", 4: "status", 5: "order_date" };
}

function getOrderList(req, res, error, filters, sort) {
	let query = filters.$and.length > 0 ? filters : {};
	var recordsTotal = 0;
	var recordsFiltered = 0;

	Order.countDocuments({}, function (err, c) {
		recordsTotal = c;
		Order.countDocuments(query, function (err, c) {
			recordsFiltered = c;
			Order.aggregate([
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