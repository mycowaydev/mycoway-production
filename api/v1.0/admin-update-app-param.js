
"use strict";

const config = require('./../../config');
const async = require('async');
const cloudinary = require('cloudinary');

const AppParam = require('./model/app-param');

module.exports = function(req, res) {

	cloudinary.config({
		cloud_name: config.CDN['NAME'],
		api_key: config.CDN['API_KEY'],
		api_secret: config.CDN['API_SECRET']
	});

	res.contentType('application/json');

	config.setLocalizeFromReq(req);

	let imageUrl;
	let error = [];

	let params = [
		'key',
		'value',
		'remarks',
	];
	if (!config.isParamsExist(req, params)) {
		error.push(config.getErrorResponse('', 302));
		let resp = config.getResponse(res, 300, error, {}, null);
		config.logApiCall(req, res, resp);
		return;
	}

	let key = req.body['key'];
	let value = req.body['value'];
	let remarks = req.body['remarks'];

	let image = req.files['image'];

	if (config.isEmpty(key)) {
		error.push(config.getErrorResponse(config.API['ADMIN_UPDATE_APP_PARAM'], 201));
	}
	if (config.isEmpty(value)) {
		error.push(config.getErrorResponse(config.API['ADMIN_UPDATE_APP_PARAM'], 202));
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminUpdateAppParam();
	}

	function adminUpdateAppParam() {
		async.series(
			[
				function(callback) {
					// if (typeof image !== 'undefined') {
					// 	let tmpPath = image.path;
					// 	let indexOfSeparator = tmpPath.lastIndexOf("/");
					// 	if (indexOfSeparator <= 0) {
					// 		indexOfSeparator = tmpPath.lastIndexOf("\\");
					// 	}
					// 	let indexOfDot = tmpPath.lastIndexOf(".");
					// 	if (indexOfDot <= 0) {
					// 		indexOfDot = tmpPath.length;
					// 	}
					// 	let filename = tmpPath.substring(indexOfSeparator + 1, tmpPath.length - (tmpPath.length - indexOfDot));
					// 	cloudinary.v2.uploader.upload(tmpPath, { public_id: config.GLOBAL['APP_NAME'].toLowerCase() + '/healthy-tips/' + filename }, function(err, result) {
					// 		if (err) {
					// 			error.push(config.getErrorResponse('', 501));
					// 			let resp = config.getResponse(res, 500, error, {}, err);
					// 			config.logApiCall(req, res, resp);
					// 			return callback(true);
					// 		}
					// 		imageUrl = result['secure_url'];
					// 		return callback(null);
					// 	});
					// } else {
						return callback(null);
					// }
				},
				function(callback) {
					let replacement = {
						'value': value,
						'remarks': remarks
					};
				
					replacement = config.appendCommonFields(replacement,'APPPARAM_UPD');
					let query = {
						'key': key
					};
					let set = { $set: replacement };
					let options = { upsert: false, returnNewDocument: true, returnOriginal: false, new: true };
					AppParam.findOneAndUpdate(query, set, options, function(err, result) {
						if (err) {
							error.push(config.getErrorResponse('', 501));
							let resp = config.getResponse(res, 500, error, {}, err);
							config.logApiCall(req, res, resp);
							return callback(true);
						}
						let resp = config.getResponse(res, 100, error, { 'app_param_info': config.getAppParamInfo(result) });
						config.logApiCall(req, res, resp);
						return callback(null);
					});
				}
			]
		);
	}
	
};
