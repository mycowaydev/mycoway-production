
"use strict";
const config = require('../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const Admin = require('../../model/admin');
const AdminPass = require('../../model/admin-pass');

module.exports = function (req, res) {

	cloudinary.config({
		cloud_name: config.CDN['NAME'],
		api_key: config.CDN['API_KEY'],
		api_secret: config.CDN['API_SECRET']
	});

	let error = [];

	//console.log(req);
	let admin_user_id = req.body['admin_user_id'];
	let admin_username = req.body['admin_username'];
	let role = req.body['role'] || '';
	let email = req.body['email'] || '';
	let phone_no = req.body['phone_no'] || '';
	let profile_img = req.body['profile_img'] || '';
	let level = req.body['level'] || '';
	let group = req.body['group'] || '';
	let superior = req.body['superior'] || '';
	let valid_until = req.body['valid_until'] || '';
	let status = req.body['status'] || '';
	let remarks = req.body['remarks'] || '';

	if (config.isEmpty(admin_user_id)) {
		error.push(config.getErrorResponse('101A011', req));
	}
	if (config.isEmpty(admin_username)) {
		error.push(config.getErrorResponse('101A012', req));
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminAddAdmin();
	}

	function adminAddAdmin() {
		async.series(
			[
				function (callback) {
					let insertAdminData = {
						'admin_user_id': admin_user_id,
						'admin_username': admin_username,
						'role': role,
						'email': email,
						'phone_no': phone_no,
						'profile_img': profile_img,
						'level': level,
						'group': group,
						'superior': superior,
						'valid_until': valid_until,
						'invalid_attempts': 0,
						'status': status,
						'remarks': remarks,
					};

					insertAdminData = config.appendCommonFields(insertAdminData, 'SUPERADMIN_ADD_ADMIN', req.session.adminUserid, true);
					Admin.create(insertAdminData, function (err, result) {
						if (err) {
							error.push(config.getErrorResponse('101Z012', req));
							let resp = config.getResponse(res, 500, error, {}, err);
							config.logApiCall(req, res, resp);
							return callback(true);
						}

						// Add Password
						let password = config.GLOBAL['ADMIN_DEF_PASS'];
						let salt = config.genRandomString(16); /** Gives us salt of length 16 */
						let hash_password = config.sha512(password, salt);

						let insertAdminPass = {
							'admin_user_id': admin_user_id,
							'salt_value': hash_password.salt,
							'hash_password': hash_password.passwordHash,
							'otp_flag': '',
							'expiry_flag': '',
							'expiry_date': '',
						};
						insertAdminPass = config.appendCommonFields(insertAdminPass, 'SUPERADMIN_ADD_ADMIN_PASS');
						AdminPass.create(insertAdminPass, function (err, result) {
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
