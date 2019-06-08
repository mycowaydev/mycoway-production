
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
		addProduct(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};

	data.admin_user_id = req.session.adminUserid;
	data.name = req.body['name'];
	data.status = req.body['status'];

	// Detail
	data.product_type = req.body['product_type'];
	data.publish_date = req.body['publish_date'];
	data.unpublish_date = req.body['unpublish_date'];

	// Image
	data.image = req.body['image'];

	// Gallery
	data.gallery = req.body['gallery'];

	// Payment & Price
	data.payment_type = req.body['payment_type'];
	data.original_price = req.body['original_price'];
	data.rental_price = req.body['rental_price'];
	data.retail_price = req.body['retail_price'];

	data.desc = req.body['desc'];

	data.remarks = req.body['remarks'];

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(data.admin_user_id)) {
		error.push(config.getErrorResponse('101A011', req));
	}

	if (config.isEmpty(data.name)) {
		error.push(config.getErrorResponse('105A001', req));
	}

	if (config.isEmpty(data.status)) {
		error.push(config.getErrorResponse('105A002', req));
	}

	if (config.isEmpty(data.product_type)) {
		error.push(config.getErrorResponse('105A003', req));
	}

	if (config.isEmpty(data.publish_date)) {
		error.push(config.getErrorResponse('105A004', req));
	}

	if (config.isEmpty(data.unpublish_date)) {
		error.push(config.getErrorResponse('105A005', req));
	}

	if (typeof data.image == 'undefined') {
		error.push(config.getErrorResponse('105A006', req));
	}

	if (config.isEmpty(data.payment_type)) {
		error.push(config.getErrorResponse('105A007', req));
	}

	if (config.isEmpty(data.rental_price)) {
		error.push(config.getErrorResponse('105A008', req));
	}

	return error;
}

function getProductData(data) {
	var price = {
		original_price: data.original_price,
		rental_price: data.rental_price,
		retail_price: data.retail_price,
	};

	let insertData = {
		'name': data.name,
		'product_type': data.product_type,
		'price': price,
		'payment_type': data.payment_type.split(","),
		'image': data.image,
		'gallery': data.gallery,
		'desc': data.desc,
		'publish_date': data.publish_date,
		'unpublish_date': data.unpublish_date,
		'status': data.status,
		'remarks': data.remarks,
	};

	insertData = config.appendCommonFields(insertData, 'PRODUCT_ADD', data.admin_user_id, true);
	return insertData;
}

function processImg(rawImage, callback) {

	let all_image_list = [];
	let uploadCount = 0;

	let rawImageList = rawImage;
	if (typeof rawImageList == 'undefined') {
		return callback(null);
	}

	try {

		for (let a = 0; a < rawImageList.length; a++) {
			let image = rawImageList[a];
			if (typeof image == 'undefined') {
				return callback(null);
			}

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

			cloudinary.v2.uploader.upload(tmpPath, { public_id: config.GLOBAL['APP_NAME'].toLowerCase() + '/product/' + filename }, function (err, result) {
				if (err) {
					error.push(config.getErrorResponse('101Z012', req));
					let resp = config.getResponse(res, 500, error, {}, err);
					config.logApiCall(req, res, resp);
					console.log('cloudinary error :: ' + JSON.stringify(err));
					return callback(true);
				}

				all_image_list[a] = result['secure_url'];
				uploadCount++;

				if (uploadCount == rawImageList.length) {
					return callback(all_image_list);
				}

			});
		}
	} catch (err) {
		console.log("err: " + err);
	}
}

function addProduct(req, res, error, data) {

	async.series(
		[
			function (callback) {

				processImg(data.image, function (imageUrlList) {
					data.image = imageUrlList;
					return callback(null);
				});

			},
			function (callback) {
				Product.create(getProductData(data), function (err, result) {
					if (err) {
						console.log('Product.create error :: ' + JSON.stringify(err));
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