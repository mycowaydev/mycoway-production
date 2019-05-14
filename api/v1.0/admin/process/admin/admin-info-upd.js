
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
	data.admin_user_id = req.session.adminUserid;
	data.admin_username = req.body['admin_username'];
	data.email = req.body['email'] || '';
	data.phone_no = req.body['phone_no'] || '';

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

	return error;
}

function getReplacement(data) {
	let replacement = {
		'admin_username': data.admin_username,
		'email': data.email,
		'phone_no': data.phone_no,
	};

	replacement = config.appendCommonFields(replacement, 'ADMIN_UPD_INFO', data.admin_user_id);
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

