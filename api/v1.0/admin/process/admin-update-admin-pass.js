
"use strict";
const config = require('../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');

const AdminPass = require('../../model/admin-pass');

module.exports = function (req, res) {

	cloudinary.config({
		cloud_name: config.CDN['NAME'],
		api_key: config.CDN['API_KEY'],
		api_secret: config.CDN['API_SECRET']
	});

	let error = [];

	let admin_user_id = req.session.adminUserid;
	let password_old = req.body['password_old'];
	let password = req.body['password'];
	let password_confirm = req.body['password_confirm'];
	let isVerify = false;

	if (config.isEmpty(admin_user_id)) {
		error.push(config.getErrorResponse('101A011', req));
	}

	if (config.isEmpty(password_old)) {
		error.push(config.getErrorResponse('101A013', req));
	}

	if (config.isEmpty(password)) {
		error.push(config.getErrorResponse('101A014', req));
	}

	if (config.isEmpty(password_confirm)) {
		error.push(config.getErrorResponse('101A015', req));
	}

	if (password != password_confirm) {
		error.push(config.getErrorResponse('101A016', req));
	}

	if (password_old == password) {
		error.push(config.getErrorResponse('101A017', req));
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		verifyAdminPass(function () {
			adminUpdateAdminPass();
		});
	}

	function verifyAdminPass(callback) {
		AdminPass.aggregate([
			{
				$project: {
					'_id': 0,
				},
			},
			{ $match: { 'admin_user_id': admin_user_id } },
			{ $sort: { 'opr_date': -1 } },
			{ $limit: 1 },
		], function (err, results) {
			if (err) {
				error.push(config.getErrorResponse('101Z012', req));
				let resp = config.getResponse(res, 500, error, {}, err);
				config.logApiCall(req, res, resp);
				return;
			}
			if (results && results.length > 0) {
				for (let i = 0; i < results.length; i++) {
					results[i] = config.getAdminPass(results[i]);
				}
			} else {
				results = [];
			}

			let hash_password_db = results[0]['hash_password'];
			let salt_db = results[0]['salt_value'];
			let hash_password = config.sha512(password_old, salt_db);

			if (hash_password_db == hash_password.passwordHash) {
				isVerify = true;
			}
			callback();
		});
	}

	function adminUpdateAdminPass() {
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
						var salt = config.genRandomString(16); /** Gives us salt of length 16 */
						var hash_password = config.sha512(password, salt);

						let insertAdminPass = {
							'admin_user_id': admin_user_id,
							'salt_value': salt,
							'hash_password': hash_password.passwordHash,
							'otp_flag': '',
							'expiry_flag': '',
							'expiry_date': '',
						};

						insertAdminPass = config.appendCommonFields(insertAdminPass, 'ADMIN_UPD_PASS', admin_user_id);
						AdminPass.create(insertAdminPass, function (err, result) {
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
};
