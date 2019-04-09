const config = require('../../../config');

const ProductMaster = require('../model/product-master');

module.exports = function(req, res) {
	let error = [];
	
		ProductMaster.findOne({ id : {$gt : 0}}, function(err, result) {
		if (err) {
			error.push(config.getErrorResponse('101Z012s', req));
			let resp = config.getResponse(res, 500, error, {}, err);
			config.logApiCall(req, res, resp);
			return;
		}
		if (result) {
		result = config.getImage(result);
		console.log(result);
		req.session['publicProductImage'] = result['image'];	
		// console.log("log" + req.session['publicProductImage']);
		let resp = config.getResponse(res, 100, error, { 'image_info': result });
		config.logApiCall(req, res, resp);
		return;
		
		}
		error.push(config.getErrorResponse('101Y003', req));
		let resp = config.getResponse(res, 200, error, {});
		config.logApiCall(req, res, resp);
	});
}