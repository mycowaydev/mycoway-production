
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
		adminUpdateProfileImg(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};
	data.admin_user_id = req.session.adminUserid;
	data.profile_img = req.body['profile_img'];

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(data.admin_user_id)) {
		error.push(config.getErrorResponse('101A011', req));
	}
	if (config.isEmpty(data.profile_img)) {
		error.push(config.getErrorResponse('101A012', req));
	}

	return error;
}

function getReplacement(data, imageUrl) {
	let replacement = {
		'profile_img': imageUrl,
	};

	replacement = config.appendCommonFields(replacement, 'ADMIN_UPD_PROFILE_IMG', data.admin_user_id);
	return replacement;
}

function getQuery(data) {
	let query = {
		'admin_user_id': data.admin_user_id
	};
	return query;
}

function adminUpdateProfileImg(req, res, error, data) {
	let imageUrl;
	async.series(
		[
			function (callback) {
				let image = data.profile_img;
				if (typeof image !== 'undefined') {
					let tmpPath = image.path;
					let indexOfSeparator = tmpPath.lastIndexOf("/");
					if (indexOfSeparator <= 0) {
						indexOfSeparator = tmpPath.lastIndexOf("\\");
					}
					let indexOfDot = tmpPath.lastIndexOf(".");
					if (indexOfDot <= 0) {
						indexOfDot = tmpPath.length;
					}
					let filename = tmpPath.substring(indexOfSeparator + 1, tmpPath.length - (tmpPath.length - indexOfDot));
					cloudinary.v2.uploader.upload(tmpPath, { public_id: config.GLOBAL['APP_NAME'].toLowerCase() + '/profile-img/' + filename }, function (err, result) {
						if (err) {
							error.push(config.getErrorResponse('101Z012', req));
							let resp = config.getResponse(res, 500, error, {}, err);
							config.logApiCall(req, res, resp);
							return callback(true);
						}
						imageUrl = result['secure_url'];
						return callback(null);
					});
				} else {
					return callback(null);
				}
			},
			function (callback) {
				let query = getQuery(data);
				let set = { $set: getReplacement(data, imageUrl) };

				let options = { upsert: false, returnNewDocument: true, returnOriginal: false, new: true };
				Admin.findOneAndUpdate(query, set, options, function (err, result) {
					if (err) {
						error.push(config.getErrorResponse('101Z012', req));
						let resp = config.getResponse(res, 500, error, {}, err);
						config.logApiCall(req, res, resp);
						return callback(true);
					}
					let resp = config.getResponse(res, 100, error, imageUrl);
					config.logApiCall(req, res, resp);
					return callback(null);
				});
			}
		]
	);
}

