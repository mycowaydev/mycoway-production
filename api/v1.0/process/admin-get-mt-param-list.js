
"use strict";

const config = require('../../../config');

const MtParam = require('../model/mt-param');

module.exports = function (req, res) {

	let error = [];

	let data = {
		group: req.body['group'] ? req.body['group'] : '',
		code: req.body['code'] ? req.body['code'] : '',
		value: req.body['value'] ? req.body['value'] : '',
		order_no: req.body['order_no'] ? req.body['order_no'] : '',
		active: req.body['active'] ? req.body['active'] : '',
		remarks: req.body['remarks'] ? req.body['remarks'] : '',
		opr_date: {
			fdate: req.body['fdate'] ? req.body['fdate'] : '',
			tdate: req.body['tdate'] ? req.body['tdate'] : '',
		}
	};

	// Get filters string
	let filters = config.getFilter(data);

	// Get sort criteria
	let orderFields = { 1: "group", 2: "code", 3: "value", 4: "order_no", 5: "remarks", 6: "opr_date" }
	let sort = config.getSort(req.body.order, orderFields);

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminGetMtParamList(filters);
	}

	function adminGetMtParamList(filters) {

		let query = filters.$and.length > 0 ? filters : {};
		var recordsTotal = 0;
		var recordsFiltered = 0;

		MtParam.countDocuments({}, function (err, c) {
			recordsTotal = c;
			MtParam.countDocuments(query, function (err, c) {
				recordsFiltered = c;
				MtParam.aggregate([
					{
						$project: {
							'_id': 0,
						},
					},
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
							results[i] = config.getMtParamInfo(results[i]);
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

};
