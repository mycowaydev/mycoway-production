
"use strict";

const config = require('../../../config');
const async = require('async');
const cloudinary = require('cloudinary');

const MtParam = require('../model/mt-param');

module.exports = function (req, res) {

	cloudinary.config({
		cloud_name: config.CDN['NAME'],
		api_key: config.CDN['API_KEY'],
		api_secret: config.CDN['API_SECRET']
	});

	res.contentType('application/json');

	config.setLocalizeFromReq(req);

	let error = [];

	let group = req.body['group'];
	let code = req.body['code'];
	let value = req.body['value'];
	let order_no = req.body['order_no'];
	let active = req.body['active'];
	let remarks = req.body['remarks'];

	if (config.isEmpty(group)) {
		error.push(config.getErrorResponse(config.API['ADMIN_ADD_MT_PARAM'], 201));
	}
	if (config.isEmpty(code)) {
		error.push(config.getErrorResponse(config.API['ADMIN_ADD_MT_PARAM'], 202));
	}
	if (config.isEmpty(value)) {
		error.push(config.getErrorResponse(config.API['ADMIN_ADD_MT_PARAM'], 203));
	}
	if (config.isEmpty(order_no)) {
		error.push(config.getErrorResponse(config.API['ADMIN_ADD_MT_PARAM'], 204));
	}
	if (config.isEmpty(active)) {
		error.push(config.getErrorResponse(config.API['ADMIN_ADD_MT_PARAM'], 205));
	}

	if (error && error.length > 0) {
		console.log("error again here :: " + error);
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminAddMtParam();
	}

	function adminAddMtParam() {
		async.series(
			[
				function (callback) {
					return callback(null);
				},
				function (callback) {
					let insertData = {
						'group': group,
						'code': code,
						'value': value,
						'order_no': order_no,
						'active': active,
						'remarks': remarks,
					};
					insertData = config.appendCommonFields(insertData, 'MTPARAM_ADD');
					MtParam.create(insertData, function (err, result) {
						if (err) {
							error.push(config.getErrorResponse('', 501));
							let resp = config.getResponse(res, 500, error, {}, err);
							config.logApiCall(req, res, resp);
							return callback(true);
						}
						let resp = config.getResponse(res, 100, error, { 'mt_param_list': config.getMtParamInfo(result) });
						config.logApiCall(req, res, resp);
						return callback(null);
					});
				}
			]
		);
	}
};
