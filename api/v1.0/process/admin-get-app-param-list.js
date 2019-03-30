
"use strict";

const config = require('../../../config');

const AppParam = require('../model/app-param');

module.exports = function (req, res) {

	res.contentType('application/json');

	config.setLocalizeFromReq(req);
	let pageSize = config.GLOBAL['PAGE_SIZE'];
	console.log("req :: " + JSON.stringify(req.body));
	console.log("column :: " + JSON.stringify(req.body.order));
	let error = [];

	let data = {
		key: req.body['key'] ? req.body['key'] : '',
		value: req.body['value'] ? req.body['value'] : '',
		remarks: req.body['remarks'] ? req.body['remarks'] : '',
		opr_date: {
			fdate: req.body['fdate'] ? req.body['fdate'] : '',
			tdate: req.body['tdate'] ? req.body['tdate'] : '',
		}
	};

	// Get filters string
	let filters = config.getFilter(data);

	// Get sort criteria
	let orderFields = { 1: "key", 2: "value", 3: "remarks", 4: "opr_date" }
	let sort = config.getSort(req.body.order, orderFields);

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminGetAppParamList(filters);
	}

	function adminGetAppParamList(filters) {

		let query = filters.$and.length > 0 ? filters : {};
		var recordsTotal = 0;
		var recordsFiltered = 0;

		AppParam.count({}, function (err, c) {
			recordsTotal = c;
			AppParam.count(query, function (err, c) {
				recordsFiltered = c;
				AppParam.aggregate([
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
					//AppParam.find(query, 'key value remarks opr opr_date',{'skip': Number( req.body.start), 'limit': Number(req.body.length) }, function (err, results) {
					if (err) {
						error.push(config.getErrorResponse('', 501));
						let resp = config.getResponse(res, 500, error, {}, err);
						config.logApiCall(req, res, resp);
						return;
					}

					if (results && results.length > 0) {
						for (let i = 0; i < results.length; i++) {
							results[i] = config.getAppParamInfo(results[i]);
						}
					} else {
						results = [];
					}

					// var data = JSON.stringify({
					// 	"draw": req.body.draw,
					// 	"recordsFiltered": recordsFiltered,
					// 	"recordsTotal": recordsTotal,
					// 	"data": results
					// });
					//res.send(data);
					let resp = config.getResponseP(res, 100, error, req.body.draw, recordsFiltered, recordsTotal, results);
					config.logApiCall(req, res, resp);
					return;
				});

			});
		});
	}

};
