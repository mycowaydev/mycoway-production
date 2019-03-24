
"use strict";

const config = require('./../../config');

const AppParam = require('./model/app-param');

module.exports = function (req, res) {

	res.contentType('application/json');

	config.setLocalizeFromReq(req);

	let pageSize = config.GLOBAL['PAGE_SIZE'];
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
	let filters = {
		$and: []
	};
	for (let key in data) {
		if (typeof data[key] !== 'undefined' && typeof data[key]['fdate'] !== 'undefined') {
			if (data[key]['fdate'] || data[key]['tdate']) {
				let filter = {};
				filter[key] = {};
				if (data[key]['fdate']) {
					filter[key]['$gte'] = new Date(data[key]['fdate']).getTime() / 1000;
				}
				if (data[key]['tdate']) {
					filter[key]['$lte'] = new Date(data[key]['tdate']).getTime() / 1000;
				}
				filters['$and'].push(filter);
			}
		} else if (typeof data[key] === 'object' && data[key].length > 0) {
			let filter = {
				$or: []
			};
			for (let i in data[key]) {
				let or_filter = {};
				or_filter[key] = data[key][i];
				filter['$or'].push(or_filter);
			}
			filters['$and'].push(filter);
		} else {
			if (data[key]) {
				let filter = {};
				filter[key] = {};
				filter[key]['$regex'] = data[key];
				filter[key]['$options'] = '$i';
				filters['$and'].push(filter);
			}
		}
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminGetAppParamList(filters);
	}

	function adminGetAppParamList(filters) {
		let query = filters.$and.length > 0 ? filters : {};
		var pageNo = parseInt(req.body['page'] ? req.body['page'] : '')
		var size = parseInt(req.body['length'] ? req.body['length'] : '')

		if (!pageNo || !size) {
			error.push(config.getErrorResponse('', 302));
			let resp = config.getResponse(res, 200, error, {}, null);
			config.logApiCall(req, res, resp);
			return;
		}

		var aggregate = AppParam.aggregate();
		aggregate.project({
			'_id': 0,
		}).sort({
			'opr_date': -1
		}).match(query)

		var options = { page: pageNo, limit: size }

		AppParam.aggregatePaginate(aggregate, options, function (err, result, pageCount, count) {
			if (err) {
				error.push(config.getErrorResponse('', 501));
				let resp = config.getResponse(res, 500, error, {}, err);
				config.logApiCall(req, res, resp);
				return;
			}
			if (result && result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					result[i] = config.getAppParamInfo(result[i]);
				}
			} else {
				result = [];
			}
			let resp = config.getResponse(res, 100, error, { 'app_param_list': result, 'total_page': pageCount, 'total_record': count });
			config.logApiCall(req, res, resp);
			return;
		})
	}

};
