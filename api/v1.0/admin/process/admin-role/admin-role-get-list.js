
"use strict";
const config = require('../../../../../config');
const AdminRole = require('../../../model/admin-role');

module.exports = function (req, res) {
	let error = [];
	let data = getParam(req);
	let filters = config.getFilter(data);
	let sort = config.getSort(req.body.order, getSortFields());

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		getAdminRoleList(req, res, error, filters, sort);
	}
}

function getParam(req) {
	var data = {};
	data.name = req.body['name'] ? req.body['name'] : '';
	data.desc = req.body['desc'] ? req.body['desc'] : '';
	data.menu_id = req.body['menu_id'] ? req.body['menu_id'] : '';
	data.remarks = req.body['remarks'] ? req.body['remarks'] : '';

	return data;
}

function getSortFields() {
	return { 1: "name", 2: "desc", 3: "menu_id", 4: "remarks" };
}

function getAdminRoleList(req, res, error, filters, sort) {
	let query = filters.$and.length > 0 ? filters : {};
	var recordsTotal = 0;
	var recordsFiltered = 0;

	AdminRole.countDocuments({}, function (err, c) {
		recordsTotal = c;
		AdminRole.countDocuments(query, function (err, c) {
			recordsFiltered = c;
			AdminRole.aggregate([
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