
const config = require('./config');
const express = require('express');
const path = require('path');
const fs = require('fs')

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
			res.redirect('/admin/main');
		} else {
			res.sendFile(path.join(__dirname, `/web/admin/login.html`));
		}
	});

	router.get('/admin/main', function (req, res) {
		if (req.session && req.session['adminUsername']) {
			let localVar = {
				app_name: ' | ' + config.GLOBAL['APP_NAME'],
				name: req.session['adminUsername'],
				profile_pic: req.session['adminProfileImg']
			};
			res.sendFile(path.join(__dirname, '/web/admin/master/index.html'), localVar);
		} else {
			res.sendFile(path.join(__dirname, `/web/admin/master/end-session.html`));
		}
	});

	router.get('/admin/*', function (req, res) {
		if (req.session && req.session['adminUsername']) {
			let reqFile = path.join(__dirname, `/web${req.url}`);

			try {
				if (fs.existsSync(reqFile)) {
					let localVar = {
						app_name: ' | ' + config.GLOBAL['APP_NAME'],
						name: req.session['adminUsername'],
						profile_pic: req.session['adminProfileImg']
					};
					res.sendFile(reqFile, localVar);
				} else {
					res.sendFile(path.join(__dirname, `/web/admin/master/404.html`));
				}
			} catch (err) {
				console.error(err)
			}
		} else {
			res.sendFile(path.join(__dirname, `/web/admin/master/end-session.html`));
		}
	});

	let localVar = {
        selected_tab: '',
        getJsonFile: '',
        order_id: ''
    };

	router.get('/404', function (req, res) {
		res.render(path.join(__dirname, '/web/public/404'), localVar);
	});

	router.get('/', function (req, res) {
        localVar['selected_tab'] = 'tab-home';
        res.render(path.join(__dirname, '/web/public/index'), localVar);
    });

	router.get('/order-status?*', function (req, res) {
	    localVar['order_id'] = req.query.id;
		res.render(path.join(__dirname, '/web/public/order-status'), localVar);
	});

	router.get('/*', function (req, res) {
		let page = req.params[0];

		switch (page) {
			case 'index':
				localVar['selected_tab'] = 'tab-home';
				break;
			case 'air-purifier':
				req.url = "/product";
				localVar['selected_tab'] = 'tab-shop';
				localVar['getJsonFile'] = 'res/air-purifier.json';
				break;
			case 'product':
			case 'water-purifier':
				req.url = "/product";
				localVar['selected_tab'] = 'tab-shop';
				localVar['getJsonFile'] = 'res/water-purifier.json';
				break;
			case 'promotion':
				req.url = "/product";
				localVar['selected_tab'] = 'tab-promotion';
				localVar['getJsonFile'] = 'res/promotion.json';
				break;
			case 'product-detail':
				req.url = "/product-detail";
				localVar['selected_tab'] = 'tab-shop';
				localVar['getJsonFile'] = '';
				break;
			case 'order-tracking':
				localVar['selected_tab'] = 'tab-tracking';
				break;
			case 'faq':
				localVar['selected_tab'] = 'tab-faq';
				break;
            case 'cart':
                localVar['selected_tab'] = 'tab-cart';
                break;
            case 'review':
                localVar['selected_tab'] = 'tab-review';
                break;
			default:
				break;
		}

		let reqFile = path.join(__dirname, `/web/public${req.url}.html`);
		let reqFileReal = path.join(__dirname, `/web/public${req.url}`);

		try {
			if (fs.existsSync(reqFile)) {
				res.render(reqFileReal, localVar);
			} else {
				res.render(path.join(__dirname, `/web/public/404`));
			}
		} catch (err) {
			console.error(err)
		}
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
