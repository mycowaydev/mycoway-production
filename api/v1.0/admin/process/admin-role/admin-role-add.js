
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

	let error = [];

	//console.log(req);
	let name = req.body['name'];
	let desc = req.body['desc'] || '';
	let menu_id = req.body['menu_id'] || '';
	let remarks = req.body['remarks'] || '';

	if (config.isEmpty(name)) {
		error.push(config.getErrorResponse('101A012', req));
	}
	if (config.isEmpty(desc)) {
		error.push(config.getErrorResponse('101A012', req));
	}
	if (config.isEmpty(menu_id)) {
		error.push(config.getErrorResponse('101A012', req));
	}

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		adminAddAdminRole();
	}

	function adminAddAdminRole() {
		async.series(
			[
				function (callback) {
					let insertAdminRoleData = {
						'name': name,
						'desc': desc,
						'menu_id': menu_id,
						'status': 'A',
						'remarks': remarks,
					};

					insertAdminRoleData = config.appendCommonFields(insertAdminRoleData, 'ADD_ROLE', req.session.adminUserid, true);
					AdminRole.create(insertAdminRoleData, function (err, result) {
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
