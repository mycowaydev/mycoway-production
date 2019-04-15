
const config = require('./config');
const express = require('express');
const path = require('path');
const fs = require('fs');

const apiTest = '/_test';
const apiVerifyIsAdminExists = '/verify-is-admin-exists';

const routeTypes = {
	'PROCESS_COMMON': 1,
	'PROCESS_AUTHORIZATION': 2,
}

module.exports = function (apiVersion) {

	let router = express.Router();
	let apiVersionPrefix = './api/' + apiVersion;

	if (!config.GLOBAL['IS_PRODUCTION']) {
		router.post(apiTest, require('./api/' + apiTest));
	}

	router = defineRouterPostValue(routeTypes['PROCESS_COMMON'], apiVersionPrefix, apiVersionPrefix + '/admin/auth/', router);
	router = defineRouterPostValue(routeTypes['PROCESS_AUTHORIZATION'], apiVersionPrefix, apiVersionPrefix + '/admin/process/', router);
	return router;

};

function defineRouterPostValue(routeType, apiVersionPrefix, folder, router) {
	let apiVerifyIsAdminExistsRoute = require(apiVersionPrefix + apiVerifyIsAdminExists);
	fs.readdir(folder, (err, files) => {
		files.forEach(file => {
			if (path.parse(file).ext === '.js') {
				let value = path.parse(file).name;
				switch(routeType) {
					case routeTypes['PROCESS_AUTHORIZATION']:
						router.post('/' + value, apiVerifyIsAdminExistsRoute.processAuthorization, require(folder + value));
						break;
					default:
						router.post('/' + value, apiVerifyIsAdminExistsRoute.processCommon, require(folder + value));
				}
			}
		});
	});
	return router;
}
