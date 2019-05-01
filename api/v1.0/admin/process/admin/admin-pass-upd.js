
"use strict";
const config = require('../../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const AdminPass = require('../../../model/admin-pass');

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
		verifyAdminPass(data, function (isVerify) {
			adminUpdateAdminPass(req, res, error, data, isVerify);
		});
	}
}

function getParam(req) {
	var data = {};
	data.admin_user_id = req.session.adminUserid;
	data.password_old = req.body['password_old'];
	data.password = req.body['password_new'];
	data.password_confirm = req.body['password_new_confirm'];
	data.isVerify = false;

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(data.admin_user_id)) {
		error.push(config.getErrorResponse('101A011', req));
	}
	if (config.isEmpty(data.password_old)) {
		error.push(config.getErrorResponse('101A013', req));
	}
	if (config.isEmpty(data.password)) {
		error.push(config.getErrorResponse('101A014', req));
	}
	if (config.isEmpty(data.password_confirm)) {
		error.push(config.getErrorResponse('101A015', req));
	}
	if (data.password != data.password_confirm) {
		error.push(config.getErrorResponse('101A016', req));
	}
	if (data.password_old == data.password) {
		error.push(config.getErrorResponse('101A017', req));
	}

	return error;
}

function verifyAdminPass(data, callback) {
	AdminPass.aggregate([
		{
			$project: {
				'_id': 0,
			},
		},
		{ $match: { 'admin_user_id': data.admin_user_id } },
		{ $sort: { 'opr_date': -1 } },
		{ $limit: 1 },
	], function (err, results) {
		if (err) {
			error.push(config.getErrorResponse('101Z012', req));
			let resp = config.getResponse(res, 500, error, {}, err);
			config.logApiCall(req, res, resp);
			return;
		}
		let isVerify = false;
		if (results && results.length > 0) {
			for (let i = 0; i < results.length; i++) {
				results[i] = config.getAdminPass(results[i]);
			}
			console.log( "result :: "+ JSON.stringify(results[0]));
			let hash_password_db = results[0]['hash_password'];
			let salt_db = results[0]['salt_value'];
			let hash_password = config.sha512(data.password_old, salt_db);

			if (hash_password_db == hash_password.passwordHash) {
				isVerify = true;
			}
		} else {
			results = [];
		}

		callback(isVerify);
	});
}

function getAdminPassData(data) {
	var salt = config.genRandomString(16); /** Gives us salt of length 16 */
	var hash_password = config.sha512(data.password, salt);

	let insertAdminPass = {
		'admin_user_id': data.admin_user_id,
		'salt_value': hash_password.salt,
		'hash_password': hash_password.passwordHash,
		'otp_flag': '',
		'expiry_flag': '',
		'expiry_date': '',
	};

	insertAdminPass = config.appendCommonFields(insertAdminPass, 'ADMIN_UPD_PASS', data.admin_user_id, true);
	return insertAdminPass;
}

function adminUpdateAdminPass(req, res, error, data, isVerify) {
	async.series(
		[
			function () {
				if (!isVerify) {
					error.push(config.getErrorResponse('101Y005', req));
					let resp = config.getResponse(res, 200, error, {}, null);
					config.logApiCall(req, res, resp);
					return true;
				}
				else {
					AdminPass.create(getAdminPassData(data), function (err, result) {
						if (err) {
							error.push(config.getErrorResponse('101Z012', req));
							let resp = config.getResponse(res, 500, error, {}, err);
							config.logApiCall(req, res, resp);
							return true;
						}
						let resp = config.getResponse(res, 100, error, {});
						config.logApiCall(req, res, resp);
						return null;
					});
				}
			}
		]
	);
}
