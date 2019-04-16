
"use strict";

const config = require('../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const Review = require('../../model/review');

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
		adminAddReview(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};

	data.name = req.body['name'];
	data.status = req.body['status'];
	data.email_address = req.body['email_address'];
	data.rate = req.body['rate'];
	data.desc = req.body['desc'];
	data.remarks = req.body['remarks'];
	data.review_date = config.getCurrentTimestamp();

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

function adminAddReview(req, res, error, data) {
	async.series(
		[
			function (callback) {
				return callback(null);
			},
			function (callback) {
				var insertData = config.appendCommonFields(data, 'REVIEW_ADD');
				Review.create(insertData, function (err, result) {
					if (err) {
						console.log(err)
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
