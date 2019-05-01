
"use strict";
const config = require('../../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const Admin = require('../../../model/admin');

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
		adminUpdateAdminPass(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};
	data.admin_user_id = req.body['admin_user_id'];
	data.admin_username = req.body['admin_username'];
	data.email = req.body['email'] || '';
	data.phone_no = req.body['phone_no'] || '';
	data.profile_img = req.body['profile_img'] || '';
	data.role = req.body['role'] || '';
	data.level = req.body['level'] || '';
	data.group = req.body['group'] || '';
	data.superior = req.body['superior'] || '';
	data.valid_until = req.body['valid_until'] || '';
	data.status = req.body['status'] || '';
	data.remarks = req.body['remarks'] || '';

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(data.admin_user_id)) {
		error.push(config.getErrorResponse('101A011', req));
	}
	if (config.isEmpty(data.admin_username)) {
		error.push(config.getErrorResponse('101A012', req));
	}
	if (config.isEmpty(data.status)) {
		error.push(config.getErrorResponse('101A018', req));
	}

	return error;
}

function getReplacement(data) {
	let replacement = {
		'admin_username': data.admin_username,
		'email': data.email,
		'phone_no': data.phone_no,
		'profile_img': data.profile_img,
		'role': data.role,
		'level': data.level,
		'group': data.group,
		'superior': data.superior,
		'valid_until': data.valid_until,
		'status': data.status,
		'remarks': data.remarks,
	};

	replacement = config.appendCommonFields(replacement, 'SUPERADMIN_UPD_ADMIN_INFO', data.admin_user_id);
	return replacement;
}

function getQuery(data) {
	let query = {
		'admin_user_id': data.admin_user_id
	};
	return query;
}

function adminUpdateAdminPass(req, res, error, data) {
	async.series(
		[
			function (callback) {
				let query = getQuery(data);
				let set = { $set: getReplacement(data) };

				let options = { upsert: false, returnNewDocument: true, returnOriginal: false, new: true };
				Admin.findOneAndUpdate(query, set, options, function (err, result) {
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
