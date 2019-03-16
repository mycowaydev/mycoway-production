
const config = require('./config');
const express = require('express');
const path = require('path');

const _apiTest = '/' + config.API['_TEST'];
const apiVerifyIsAdminExists = '/' + config.API['VERIFY_IS_ADMIN_EXISTS'];
const apiVerifyAdminLogin = '/' + config.API['VERIFY_ADMIN_LOGIN'];
const apiLogoutAdmin = '/' + config.API['LOGOUT_ADMIN'];
const apiAdminGetHealthyTipList = '/' + config.API['ADMIN_GET_HEALTHY_TIP_LIST'];
const apiAdminGetHealthyTipInfo = '/' + config.API['ADMIN_GET_HEALTHY_TIP_INFO'];
const apiAdminAddHealthyTip = '/' + config.API['ADMIN_ADD_HEALTHY_TIP'];
const apiAdminUpdateHealthyTip = '/' + config.API['ADMIN_UPDATE_HEALTHY_TIP'];
const apiAdminRemoveHealthyTip = '/' + config.API['ADMIN_REMOVE_HEALTHY_TIP'];

const apiAdminGetAppParamList = '/' + config.API['ADMIN_GET_APP_PARAM_LIST'];
const apiAdminGetAppParamInfo = '/' + config.API['ADMIN_GET_APP_PARAM_INFO'];
const apiAdminAddAppParam = '/' + config.API['ADMIN_ADD_APP_PARAM'];
const apiAdminUpdateAppParam = '/' + config.API['ADMIN_UPDATE_APP_PARAM'];
const apiAdminRemoveAppParam = '/' + config.API['ADMIN_REMOVE_APP_PARAM'];

module.exports = function(apiVersion) {
	
	let router = express.Router();
	let apiVersionPrefix = './api/' + apiVersion;
	let apiVerifyIsAdminExistsRoute = require(apiVersionPrefix + apiVerifyIsAdminExists);

	if (!config.GLOBAL['IS_PRODUCTION']) {
		router.post(_apiTest, require('./api/' + _apiTest));
	}
	
	router.post(apiVerifyAdminLogin, require(apiVersionPrefix + apiVerifyAdminLogin));
	router.post(apiLogoutAdmin, require(apiVersionPrefix + apiLogoutAdmin));
	
	router.post(apiAdminGetHealthyTipList, apiVerifyIsAdminExistsRoute.isAuthorized, require(apiVersionPrefix + apiAdminGetHealthyTipList));
	router.post(apiAdminGetHealthyTipInfo, apiVerifyIsAdminExistsRoute.isAuthorized, require(apiVersionPrefix + apiAdminGetHealthyTipInfo));
	router.post(apiAdminAddHealthyTip, apiVerifyIsAdminExistsRoute.isAuthorized, require(apiVersionPrefix + apiAdminAddHealthyTip));
	router.post(apiAdminUpdateHealthyTip, apiVerifyIsAdminExistsRoute.isAuthorized, require(apiVersionPrefix + apiAdminUpdateHealthyTip));
	router.post(apiAdminRemoveHealthyTip, apiVerifyIsAdminExistsRoute.isAuthorized, require(apiVersionPrefix + apiAdminRemoveHealthyTip));
	router.post(apiAdminGetAppParamList, apiVerifyIsAdminExistsRoute.isAuthorized, require(apiVersionPrefix + apiAdminGetAppParamList));
	router.post(apiAdminGetAppParamInfo, apiVerifyIsAdminExistsRoute.isAuthorized, require(apiVersionPrefix + apiAdminGetAppParamInfo));
	router.post(apiAdminAddAppParam, apiVerifyIsAdminExistsRoute.isAuthorized, require(apiVersionPrefix + apiAdminAddAppParam));
	router.post(apiAdminUpdateAppParam, apiVerifyIsAdminExistsRoute.isAuthorized, require(apiVersionPrefix + apiAdminUpdateAppParam));
	router.post(apiAdminRemoveAppParam, apiVerifyIsAdminExistsRoute.isAuthorized, require(apiVersionPrefix + apiAdminRemoveAppParam));

	router.get('/adminer', function(req, res) {
		res.redirect('/adminer/login');
	});
	router.get('/adminer/login', function(req, res) {
		if (req.session && req.session['adminUsername']) {
			res.redirect('/adminer/healthy-tip');
		} else {
			res.render(path.join(__dirname, '/web/admin/login'), { title: 'Admin Login', app_name: ' | ' + config.GLOBAL['APP_NAME'] });
		}
	});
	router.get('/adminer/*', function(req, res) {
		let page = req.params[0];
		if (req.session && req.session['adminUsername']) {
			// Local variables to be pass to the view
			let localVar = {
				app_name: ' | ' + config.GLOBAL['APP_NAME'],
				name: req.session['adminUsername'],
				profile_pic: req.session['adminProfileImg']
			};
			// Logged in and navigate to the page requested 
			switch(page) {
				case 'healthy-tip':
					localVar['title'] = 'Healthy Tip List';
					localVar['success'] = req.query['success'];
					localVar['remove_success'] = req.query['remove_success'];
					res.render(path.join(__dirname, '/web/admin/healthy-tip'), localVar);
					break;
				case 'add-healthy-tip':
					localVar['title'] = 'Add Healthy Tip';
					res.render(path.join(__dirname, '/web/admin/add-healthy-tip'), localVar);
					break;
				case 'edit-healthy-tip':
					localVar['title'] = 'Edit Healthy Tip';
					localVar['healthy_tips_id'] = req.query['healthy_tips_id'];
					res.render(path.join(__dirname, '/web/admin/edit-healthy-tip'), localVar);
					break;
				case 'product':
					localVar['title'] = 'Product list';
					res.render(path.join(__dirname, '/web/admin/product'), localVar);
				break;
				case 'add-product':
					localVar['title'] = 'Add Product';
					res.render(path.join(__dirname, '/web/admin/add-product'), localVar);
				break;
				case 'app-param':
					localVar['title'] = 'App Param List';
					localVar['success'] = req.query['success'];
					localVar['remove_success'] = req.query['remove_success'];
					res.render(path.join(__dirname, '/web/admin/app-param'), localVar);
				break;
				case 'add-app-param':
					localVar['title'] = 'Add App Param';
					res.render(path.join(__dirname, '/web/admin/add-app-param'), localVar);
				break;
				case 'edit-app-param':
				localVar['title'] = 'Edit App Param';
				localVar['key'] = req.query['key'];
				res.render(path.join(__dirname, '/web/admin/edit-app-param'), localVar);
				break;
				case 'mt-param':
					localVar['title'] = 'MT Param';
					res.render(path.join(__dirname, '/web/admin/mt-param'), localVar);
				break;
				default:
					res.redirect('/404');
			}
		} else {
			// No logged in so redirect to login page 
			switch(page) {
				default:
					res.redirect('/adminer/login');
			}
		}
	});

	router.get('/404', function(req, res) {
		res.sendFile(path.join(__dirname, '/web/public/404.html'));
	});
	router.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '/web/public/index.html'));
	});
	router.get('*', function(req, res) {
		res.redirect('/404');
	});
	router.post('*', function(req, res) {
		res.contentType('application/json');
		let error = [];
		error.push(config.getErrorResponse('', 404));
		config.getResponse(res, 400, error, {}, null);
	});

	return router;

};
