
"use strict";
const config = require('../../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const Product = require('../../../model/product-master');

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
		processImg(req, data, error, function (imageUrl, err) {
			addProduct(req, res, err, data, imageUrl);
		});
	}
}

function getParam(req) {
	var data = {};
	data.admin_user_id = req.session.adminUserid;
	data.name = req.body['name'];
	data.type = req.body['type'];
	data.detail = req.body['detail'];
	data.image = req.files['image'];
	data.service = req.body['service'];
	data.desc = req.body['desc'];
	data.publish_date = req.body['publish_date'];
	data.unpublish_date = req.body['unpublish_date'];
	data.status = req.body['status'];
	data.remarks = req.body['remarks'];

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(data.name)) {
		error.push(config.getErrorResponse('101A008', req));
	}
	if (config.isEmpty(data.type)) {
		error.push(config.getErrorResponse('101A005', req));
	}
	if (config.isEmpty(data.detail)) {
		error.push(config.getErrorResponse('101A005', req));
	}
	// if (config.isEmpty(data.image)) {
	// 	error.push(config.getErrorResponse('101A005', req));
	// }
	if (config.isEmpty(data.publish_date)) {
		error.push(config.getErrorResponse('101A005', req));
	}
	if (config.isEmpty(data.unpublish_date)) {
		error.push(config.getErrorResponse('101A005', req));
	}
	if (config.isEmpty(data.status)) {
		error.push(config.getErrorResponse('101A005', req));
	}

	return error;
}

function processImg(req, data, error, callback) {
	let imageUrl;
	let image = data.image;
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
		console.log('filename :: ' + filename);
		cloudinary.v2.uploader.upload(tmpPath, { public_id: config.GLOBAL['APP_NAME'].toLowerCase() + '/product/' + filename }, function (err, result) {
			if (err) {
				error.push(config.getErrorResponse('101Z012', req));
				let resp = config.getResponse(res, 500, error, {}, err);
				config.logApiCall(req, res, resp);
				return callback(true);
			}
			imageUrl = result['secure_url'];
			console.log('imageUrl :: ' + imageUrl);
			return callback(null);
		});
	} else {
		return callback(null);
	}
	callback(imageUrl, error);
}

function addProduct(req, res, error, data, imageUrl) {
	async.series(
		[
			function (callback) {
				return callback(null);
			},
			function (callback) {
				let insertData = config.appendCommonFields(data, 'PRODUCT_ADD', data.admin_user_id, true);
				Product.create(insertData, function (err, result) {
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