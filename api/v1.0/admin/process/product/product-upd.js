
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

	// let imageList = data.image;
	// console.log("all_image_list :: " + all_image_list);

	// if (typeof imageList !== 'undefined') {
	// 	for (let a = 0; a < imageList.length; a++) {

	// 		let image = imageList[a];
	// 		if (typeof image == 'undefined') {
	// 			continue;
	// 		}

	// 		let tmpPath = image.path;
	// 		let indexOfSeparator = tmpPath.lastIndexOf("/");
	// 		if (indexOfSeparator <= 0) {
	// 			indexOfSeparator = tmpPath.lastIndexOf("\\");
	// 		}
	// 		let indexOfDot = tmpPath.lastIndexOf(".");
	// 		if (indexOfDot <= 0) {
	// 			indexOfDot = tmpPath.length;
	// 		}
	// 		let filename = tmpPath.substring(indexOfSeparator + 1, tmpPath.length - (tmpPath.length - indexOfDot));

	// 		cloudinary.v2.uploader.upload(tmpPath, { public_id: config.GLOBAL['APP_NAME'].toLowerCase() + '/product/' + filename }, function (err, result) {
	// 			if (err) {
	// 				error.push(config.getErrorResponse('101Z012', req));
	// 				let resp = config.getResponse(res, 500, error, {}, err);
	// 				config.logApiCall(req, res, resp);
	// 				return callback(true);
	// 			}
	// 			imageUrl = result['secure_url'];
	// 			all_image_list.push(imageUrl);
	// 			console.log('imageUrl :: ' + imageUrl);
	// 		});
	// 	}
	// }
	// data.image = all_image_list;

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		updateProduct(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};
	data.admin_user_id = req.session.adminUserid;
	data.id = req.body['id'] || '';
	data.name = req.body['name'];
	data.status = req.body['status'];

	// Detail
	data.product_type = req.body['product_type'];
	data.publish_date = req.body['publish_date'];
	data.unpublish_date = req.body['unpublish_date'];

	// Image
	data.product_img_list_old = req.body['product_img_list_old'];
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

	// if (config.isEmpty(data.key)) {
	// 	error.push(config.getErrorResponse('101A008', req));
	// }
	// if (config.isEmpty(data.value)) {
	// 	error.push(config.getErrorResponse('101A005', req));
	// }

	return error;
}

function getReplacement(data) {
	var price = {
		original_price: data.original_price,
		rental_price: data.rental_price,
		retail_price: data.retail_price,
	};

	let replacement = {
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
	replacement = config.appendCommonFields(replacement, 'PRODUCT_UPD', data.admin_user_id);
	return replacement;
}

function getQuery(data) {
	let query = {
		'_id': data.id
	};
	return query;
}

function updateProduct(req, res, error, data) {

	let all_image_list = data.product_img_list_old.split(",");
	async.series(
		[
			function (callback) {
				let imageList = data.image;
				let imageUrl;
				if (typeof imageList == 'undefined') {
					return callback(null);
				}

				for (let a = 0; a < imageList.length; a++) {
					let image = imageList[a];
					if (typeof image == 'undefined') {
						if (a == imageList.length - 1) {
							return callback(null);
						}
						continue;
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
							return callback(true);
						}
						imageUrl = result['secure_url'];
						all_image_list.push(imageUrl);

						if (a == imageList.length - 1) {
							return callback(null);
						}
					});
				}

			},
			function (callback) {

				data.image = all_image_list;
				let query = getQuery(data);
				let set = { $set: getReplacement(data) };

				let options = { upsert: false, returnNewDocument: true, returnOriginal: false, new: true };
				Product.findOneAndUpdate(query, set, options, function (err, result) {
					if (err) {
						console.log("err :: " + JSON.stringify(err));
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