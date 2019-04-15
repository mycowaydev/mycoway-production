
"use strict";
const config = require('../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');

const Admin = require('../../model/admin');

module.exports = function (req, res) {

	cloudinary.config({
		cloud_name: config.CDN['NAME'],
		api_key: config.CDN['API_KEY'],
		api_secret: config.CDN['API_SECRET']
	});

	let error = [];

	let admin_user_id = req.session.adminUserid
	let admin_username = req.body['admin_username'];
	let email = req.body['email'] || '';
	let phone_no = req.body['phone_no'] || '';
	let profile_img = req.body['profile_img'] || '';

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
					};

					replacement = config.appendCommonFields(replacement, 'ADMIN_UPD_INFO', admin_user_id, false);
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
