
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

	let error = [];

	let admin_user_id = req.body['admin_user_id'];
	let admin_username = req.body['admin_username'];
	let email = req.body['email'] || '';
	let phone_no = req.body['phone_no'] || '';
	let profile_img = req.body['profile_img'] || '';

	let role = req.body['role'] || '';
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
	if (config.isEmpty(status)) {
		error.push(config.getErrorResponse('101A018', req));
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminUpdateAdminPass();
	}

	function adminUpdateAdminPass() {
		async.series(
			[
				function (callback) {
					let replacement = {
						'admin_username': admin_username,
						'email': email,
						'phone_no': phone_no,
						'profile_img': profile_img,
						'role': role,
						'level': level,
						'group': group,
						'superior': superior,
						'valid_until': valid_until,
						'status': status,
						'remarks': remarks,
					};

					replacement = config.appendCommonFields(replacement, 'SUPERADMIN_UPD_ADMIN_INFO', req.session.adminUserid, false);
					let query = {
						'admin_user_id': admin_user_id
					};
					let set = { $set: replacement };
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
};
