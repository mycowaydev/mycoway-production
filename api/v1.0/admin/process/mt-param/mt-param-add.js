
"use strict";
const config = require('../../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const MtParam = require('../../../model/mt-param');

module.exports = function (req, res) {
	cloudinary.config({
		cloud_name: config.CDN['NAME'],
		api_key: config.CDN['API_KEY'],
		api_secret: config.CDN['API_SECRET']
	});

	let data = getParam(req);
	let error = validateParam(req, data);

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		addMtParam(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};
	data.admin_user_id = req.session.adminUserid;
	data.group = req.body['group'];
	data.code = req.body['code'];
	data.value = req.body['value'];
	data.order_no = req.body['order_no'];
	data.status = req.body['status'];
	data.remarks = req.body['remarks'];

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(data.group)) {
		error.push(config.getErrorResponse('101A003', req));
	}
	if (config.isEmpty(data.code)) {
		error.push(config.getErrorResponse('101A004', req));
	}
	if (config.isEmpty(data.value)) {
		error.push(config.getErrorResponse('101A005', req));
	}
	if (config.isEmpty(data.order_no)) {
		error.push(config.getErrorResponse('101A006', req));
	}
	if (config.isEmpty(data.status)) {
		error.push(config.getErrorResponse('101A007', req));
	}

	return error;
}

function addMtParam(req, res, error, data) {
	async.series(
		[
			function (callback) {
				return callback(null);
			},
			function (callback) {
				let insertData = config.appendCommonFields(data, 'MTPARAM_ADD', data.admin_user_id, true);
				MtParam.create(insertData, function (err, result) {
					if (err) {
						error.push(config.getErrorResponse('101Z012', req));
						let resp = config.getResponse(res, 500, error, {}, err);
						config.logApiCall(req, res, resp);
						return callback(true);
					}
					let resp = config.getResponse(res, 100, error, {});
					config.logApiCall(req, res, resp);
					return callback(null);
				});
			}
		]
	);
}
