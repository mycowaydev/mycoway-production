// const config = require('../../../config');

const ProductMaster = require('../model/product-master');

module.exports = function(req, res) {
	console.log("here")

	// let id = req.body['id'];
	// let image = req.body['image'];

	ProductMaster.find({ 'id': 1 }, function(err, result) {
		if (err) {
			error.push(config.getErrorResponse('101Z012s', req));
			let resp = config.getResponse(res, 500, error, {}, err);
			config.logApiCall(req, res, resp);
			return;
		}

		result = config.getImage(result);
		console.log(result);
		req.session['publicProductImage'] = result['image'];

	});
}