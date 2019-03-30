
"use strict";

const config = require('../../../config');

const MtParam = require('../model/mt-param');

module.exports = function(req, res) {

	res.contentType('application/json');

	config.setLocalizeFromReq(req);

	let pageSize = config.GLOBAL['PAGE_SIZE'];
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
	let filters = {
		$and: []
	};
	for (let key in data) {
		if (typeof data[key] !== 'undefined' && typeof data[key]['fdate'] !== 'undefined') {
			if (data[key]['fdate'] || data[key]['tdate']) {
				let filter = {};
				filter[key] = {};
				if(data[key]['fdate']){
					filter[key]['$gte'] = new Date(data[key]['fdate']).getTime() / 1000;
				}
				if(data[key]['tdate']){
					filter[key]['$lte'] = new Date(data[key]['tdate']).getTime() / 1000;
				}
				filters['$and'].push(filter);
			}
		} else if (typeof data[key] === 'object' && data[key].length > 0) {
			let filter = {
				$or: []
			};
			for(let i in data[key]) {
				let or_filter = {};
				or_filter[key] = data[key][i];
				filter['$or'].push(or_filter);
			}
			filters['$and'].push(filter);
		} else {
			if (data[key]) {
				let filter = {};
				filter[key] = data[key];
				filters['$and'].push(filter);
			}
		}
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminGetMtParamList(filters);
	}

	function adminGetMtParamList(filters) {
		let query = filters.$and.length > 0 ? filters : {};
		MtParam.aggregate([
			{
				$project: {
					'_id': 0,
					'updated_on': 0,
					'updated_date': 0
				}
			},
			{ 
				$sort: {
					'created_on': -1
				}
			},
			{ 
				$skip: 5
			},
			{ 
				$limit: 5
			},
			{ $match: query },
		], function(err, result) {
			if (err) {
				error.push(config.getErrorResponse('101Z012', req));
				let resp = config.getResponse(res, 500, error, {}, err);
				config.logApiCall(req, res, resp);
				return;
			}
			if (result && result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					result[i] = config.getMtParamInfo(result[i]);
				}
			} else {
				result = [];
			}
			let resp = config.getResponse(res, 100, error, { 'mt_param_list': result });
			config.logApiCall(req, res, resp);
			return;
		});
	}

};
