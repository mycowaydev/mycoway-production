
"use strict";
const config = require('../../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const AdminRole = require('../../../model/admin-role');

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
		adminAddAdminRole(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};

	data.admin_user_id = req.body['admin_user_id'];
	data.name = req.body['name'];
	data.desc = req.body['desc'] || '';
	data.menu_id = req.body['menu_id'] || '';
	data.remarks = req.body['remarks'] || '';

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(name)) {
		error.push(config.getErrorResponse('101A012', req));
	}
	if (config.isEmpty(desc)) {
		error.push(config.getErrorResponse('101A012', req));
	}
	if (config.isEmpty(menu_id)) {
		error.push(config.getErrorResponse('101A012', req));
	}
	return error;
}

function getInsertData(data) {
	let insertAdminRoleData = {
		'name': data.name,
		'desc': data.desc,
		'menu_id': data.menu_id,
		'status': 'A',
		'remarks': data.remarks,
	};

	insertAdminRoleData = config.appendCommonFields(insertAdminRoleData, 'ADD_ROLE', data.admin_user_id, true);
	return insertAdminRoleData;
}

function adminAddAdminRole(req, res, error, data) {
	async.series(
		[
			function (callback) {
				AdminRole.create(getInsertData(data), function (err, result) {
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