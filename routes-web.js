
const config = require('./config');
const express = require('express');
const path = require('path');

module.exports = function (apiVersion) {
	let router = express.Router();

	//Will remove soon
	// ---------------------------------------- Start ----------------------------------------
	router.get('/adminer/*', function (req, res) {
		let page = req.params[0];
		if (req.session && req.session['adminUsername']) {
			// Local variables to be pass to the view
			let localVar = {
				app_name: ' | ' + config.GLOBAL['APP_NAME'],
				name: req.session['adminUsername'],
				profile_pic: req.session['adminProfileImg']
			};
			// Logged in and navigate to the page requested 
			switch (page) {
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
			switch (page) {
				default:
					res.redirect('/adminer/login');
			}
		}
	});
	// ---------------------------------------- End ----------------------------------------

	router.get('/admin', function (req, res) {
		res.redirect('/admin/login');
	});

	router.get('/admin/login', function (req, res) {
		if (req.session && req.session['adminUsername']) {
			res.redirect('/admin/dashboard');
		} else {
			res.render(path.join(__dirname, '/web/admin/login'), { title: 'Admin Login', app_name: ' | ' + config.GLOBAL['APP_NAME'] });
		}
	});

	router.get('/admin/dashboard', function (req, res) {
		let localVar = {
			app_name: ' | ' + config.GLOBAL['APP_NAME'],
			name: req.session['adminUsername'],
			profile_pic: req.session['adminProfileImg']
		};
		res.sendFile(path.join(__dirname, '/web/admin/master/index.html'), localVar);
	});

	router.get('/admin/*', function (req, res) {
		console.log(`admin -> ${req.url}`);
		let localVar = {
			app_name: ' | ' + config.GLOBAL['APP_NAME'],
			name: req.session['adminUsername'],
			profile_pic: req.session['adminProfileImg']
		};
		res.sendFile(path.join(__dirname, `/web/${req.url}`), localVar);
	});

	router.get('/404', function (req, res) {
		res.sendFile(path.join(__dirname, '/web/public/404.html'));
	});

	router.get('/', function (req, res) {
		res.sendFile(path.join(__dirname, '/web/public/index.html'));
	});

	router.get('*', function (req, res) {
		res.redirect('/404');
	});

	router.post('*', function (req, res) {
		res.contentType('application/json');
		let error = [];
		error.push(config.getErrorResponse('101Z011', req));
		config.getResponse(res, 400, error, {}, null);
	});

	return router;
};
