
const config = require('./config');
const express = require('express');
const path = require('path');
const fs = require('fs');

const apiTest = '/' + config.API['_TEST'];
const apiVerifyIsAdminExists = '/' + config.API['VERIFY_IS_ADMIN_EXISTS'];

module.exports = function (apiVersion) {
	let router = express.Router();
	let apiVersionPrefix = './api/' + apiVersion;

	if (!config.GLOBAL['IS_PRODUCTION']) {
		router.post(apiTest, require('./api/' + apiTest));
	}

	router = defineRouterPostValue(apiVersionPrefix + '/auth/', router);
	router = defineRouterPostValueAuth(apiVersionPrefix, apiVersionPrefix + '/process/', router);

	return router;
};

function defineRouterPostValue(folder, router) {
	fs.readdir(folder, (err, files) => {
		files.forEach(file => {
			if (path.parse(file).ext === '.js') {
				var value = path.parse(file).name;
				router.post('/' + value, require(folder + value));
			}
		});
	});

	return router;
}

function defineRouterPostValueAuth(api, folder, router) {
	let apiVerifyIsAdminExistsRoute = require(api + apiVerifyIsAdminExists);

	fs.readdir(folder, (err, files) => {
		files.forEach(file => {
			if (path.parse(file).ext === '.js') {
				var value = path.parse(file).name;
				console.log(folder + value);
				router.post('/' + value, apiVerifyIsAdminExistsRoute.isAuthorized, require(folder + value));
			}
		});
	});

	return router;
}