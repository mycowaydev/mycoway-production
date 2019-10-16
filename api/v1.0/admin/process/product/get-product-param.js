"use strict";

const config = require('../../../../../config');
const Product = require('../../../model/product-master');

module.exports = function (req, res) {
	let error = [];
	// let  = req.body ? req.body : [];

	// if (.length <= 0) {
	// 	return;
	// }

	adminGetProduct(req, res, error);
}

function getQuery() {
	let query = {
		'status': 'A'
	};
	return query;
}

function adminGetProduct(req, res, error) {
	Product.find(getQuery()).sort({ product_type: 1, name: 1 }).exec(function (err, results) {
		if (err) {
			error.push(config.getErrorResponse('101Z012', req));
			let resp = config.getResponse(res, 500, error, {}, err);
			config.logApiCall(req, res, resp);
			console.log(err)
			return;
		}
		//console.log('results :: ' + JSON.stringify(results));
		if (results && results.length > 0) {
			for (let i = 0; i < results.length; i++) {
				results[i] = config.getProductInfo(results[i]);
			}
		} else {
			results = [];
		}
		let resp = config.getResponse(res, 100, error, results);
		config.logApiCall(req, res, resp);
		return;
	});
}