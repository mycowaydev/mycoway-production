
"use strict";
const config = require('../../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const Admin = require('../../../model/admin');
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
		superadminAddAdmin(req, res, error, data);
	}

	function getParam(req) {
		var data = {};
		data.admin_user_id = req.body['admin_user_id'];
		data.admin_username = req.body['admin_username'];
		data.role = req.body['role'] || '';
		data.email = req.body['email'] || '';
		data.phone_no = req.body['phone_no'] || '';
		data.profile_img = req.body['profile_img'] || '';
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
		return error;
	}

	function getAdminInfoData(data) {
		let insertAdminData = {
			'admin_user_id': data.admin_user_id,
			'admin_username': data.admin_username,
			'role': data.role,
			'email': data.email,
			'phone_no': data.phone_no,
			'profile_img': data.profile_img,
			'level': data.level,
			'group': data.group,
			'superior': data.superior,
			'valid_until': data.valid_until,
			'invalid_attempts': 0,
			'status': data.status,
			'remarks': data.remarks,
		};

		insertAdminData = config.appendCommonFields(insertAdminData, 'SUPERADMIN_ADD_ADMIN', data.admin_user_id, true);
		return insertAdminData;
	}

	function getAdminPassData(data) {
		// Add Password
		let password = config.GLOBAL['ADMIN_DEF_PASS'];
		let salt = config.genRandomString(16); /** Gives us salt of length 16 */
		let hash_password = config.sha512(password, salt);

		let insertAdminPass = {
			'admin_user_id': data.admin_user_id,
			'salt_value': hash_password.salt,
			'hash_password': hash_password.passwordHash,
			'otp_flag': '',
			'expiry_flag': '',
			'expiry_date': '',
		};

		insertAdminPass = config.appendCommonFields(insertAdminPass, 'SUPERADMIN_ADD_ADMIN_PASS', data.admin_user_id, true);
		return insertAdminPass;
	}

	function superadminAddAdmin(req, res, error, data) {
		async.series(
			[
				function (callback) {

					Admin.create(getAdminInfoData(data), function (err, result) {
						if (err) {
							error.push(config.getErrorResponse('101Z012', req));
							let resp = config.getResponse(res, 500, error, {}, err);
							config.logApiCall(req, res, resp);
							return callback(true);
						}

						AdminPass.create(getAdminPassData(data), function (err, result) {
							if (err) {
								error.push(config.getErrorResponse('101Z012', req));
								let resp = config.getResponse(res, 500, error, {}, err);
								config.logApiCall(req, res, resp);
								return callback(true);
							}
							let resp = config.getResponse(res, 100, error, { 'admin_info': config.getAdminPass(result) });
							config.logApiCall(req, res, resp);
							return callback(null);
						});

					});
				}
			]
		);
	}
};
