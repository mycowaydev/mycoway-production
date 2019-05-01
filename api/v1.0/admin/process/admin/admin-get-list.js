
"use strict";
const config = require('../../../../../config');
const Admin = require('../../../model/admin');

module.exports = function (req, res) {
	let error = [];
	let data = getParam(req);
	let filters = config.getFilter(data);
	let sort = config.getSort(req.body.order, getSortFields());

	getAdminList(req, res, error, filters, sort);
}

function getParam(req) {
	let data = {};

	data.admin_user_id = req.body['adminUserID'] || '';
	data.admin_username = req.body['adminUserName'] || '';
	data.role = req.body['role'] || '';
	data.status = req.body['status'] || '';

	return data;
}

function getSortFields() {
	return { 1: "admin_user_id", 2: "admin_username", 3: "role", 4: "status" };
}

function getAdminList(req, res, error, filters, sort) {
	let query = filters.$and.length > 0 ? filters : {};
	let recordsTotal = 0;
	let recordsFiltered = 0;

	Admin.countDocuments({}, function (err, c) {
		recordsTotal = c;
		Admin.countDocuments(query, function (err, c) {
			recordsFiltered = c;
			Admin.aggregate([
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