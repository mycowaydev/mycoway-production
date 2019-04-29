
"use strict";

const config = require('../../../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const AdminRole = require('../../../model/admin-role');

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
		updateAdminRole(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};

	data.id = req.body['id'] || '';
	data.name = req.body['name'] || '';
	data.desc = req.body['desc'] || '';
	data.menu_id = req.body['menu_id'] || '';
	data.remarks = req.body['remarks'] || '';
	data.adminUserid = req.session.adminUserid;

	return data;
}

function validateParam(req, data) {
	let error = [];

	if (config.isEmpty(data.id)) {
		error.push(config.getErrorResponse('101A008', req));
	}
	if (config.isEmpty(data.name)) {
		error.push(config.getErrorResponse('101A005', req));
	}
	if (config.isEmpty(data.desc)) {
		error.push(config.getErrorResponse('101A005', req));
	}
	if (config.isEmpty(data.menu_id)) {
		error.push(config.getErrorResponse('101A005', req));
	}

	return error;
}

function getReplacement(data) {
	let replacement = {
		'name': data.name,
		'desc': data.desc,
		'menu_id': data.menu_id,
		'remarks': data.remarks,
	};
	replacement = config.appendCommonFields(replacement, 'UPD_ROLE', data.adminUserid);
	return replacement;
}

function getQuery(data) {
	let query = {
		'_id': data.id
	};
	return query;
}

function updateAdminRole(req, res, error, data) {
	async.series(
		[
			function (callback) {
				return callback(null);
			},
			function (callback) {
				let query = getQuery(data);
				let set = { $set: getReplacement(data) };

				let options = { upsert: false, returnNewDocument: true, returnOriginal: false, new: true };
				AdminRole.findOneAndUpdate(query, set, options, function (err, result) {
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