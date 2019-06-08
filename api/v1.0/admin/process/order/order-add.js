
"use strict";
const config = require('../../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const Order = require('../../../model/order');

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
		addOrder(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};

	data.admin_user_id = req.session.adminUserid;
	data.id = req.body['id'];
	data.order_date = req.body['order_date'];
	data.status = req.body['status'];

	// Detail
	data.email = req.body['email'];
	data.phone_no = req.body['phone_no'];
	data.emergency_no = req.body['emergency_no'];

	// Document
	data.image_ic = req.body['image_ic'];
	data.image_card = req.body['image_card'];
	data.image_signature = req.body['image_signature'];

	// Address
	data.first_line = req.body['first_line'];
	data.second_line = req.body['second_line'];
	data.third_line = req.body['third_line'];
	data.city = req.body['city'];
	data.postcode = req.body['postcode'];
	data.state = req.body['state'];
	data.country = req.body['country'];

	// Remarks
	data.remarks = req.body['remarks'];

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(data.admin_user_id)) {
		error.push(config.getErrorResponse('101A011', req));
	}

	if (config.isEmpty(data.email)) {
		error.push(config.getErrorResponse('104A001', req));
	}

	if (config.isEmpty(data.status)) {
		error.push(config.getErrorResponse('104A002', req));
	}

	if (typeof data.image_ic == 'undefined') {
		error.push(config.getErrorResponse('104A003', req));
	}

	if (typeof data.image_card == 'undefined') {
		error.push(config.getErrorResponse('104A004', req));
	}

	if (typeof data.image_signature == 'undefined') {
		error.push(config.getErrorResponse('104A005', req));
	}

	return error;
}

function getOrderData(data) {
	var address = {
		first_line: data.first_line,
		second_line: data.second_line,
		third_line: data.third_line,
		city: data.city,
		postcode: data.postcode,
		state: data.state,
		country: data.country,
	};

	let insertData = {
		'email': data.email,
		'image_ic': data.image_ic,
		'image_card': data.image_card,
		'image_signature': data.image_signature,
		'phone_no': data.phone_no,
		'emergency_no': data.emergency_no,
		'address': address,
		'order_product': data.order_product,
		'order_date': data.order_date,
		'status': data.status,
		'remarks': data.remarks,
	};

	insertData = config.appendCommonFields(insertData, 'ORDER_ADD', data.admin_user_id, true);
	return insertData;
}

function processImg(rawImage, callback) {

	if (typeof rawImage == 'undefined') {
		return callback('');
	}
	let image = rawImage;
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

	cloudinary.v2.uploader.upload(tmpPath, { public_id: config.GLOBAL['APP_NAME'].toLowerCase() + '/order/' + filename }, function (err, result) {
		if (err) {
			error.push(config.getErrorResponse('101Z012', req));
			let resp = config.getResponse(res, 500, error, {}, err);
			config.logApiCall(req, res, resp);
			return callback('');
		}
		return callback(result['secure_url']);
	});

}

function addOrder(req, res, error, data) {
	async.series(
		[
			function (callback) {

				processImg(data.image_ic, function (imageUrl) {
					data.image_ic = imageUrl;
					processImg(data.image_card, function (imageUrl) {
						data.image_card = imageUrl;
						processImg(data.image_signature, function (imageUrl) {
							data.image_signature = imageUrl;
							return callback(null);
						});
					});
				});
			},
			function (callback) {
				Order.create(getOrderData(data), function (err, result) {
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