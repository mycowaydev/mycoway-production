"use strict";

const config = require('../../../config');
const async = require('async');
const cloudinary = require('cloudinary');

const ProductMaster = require('./model/product-master');

 module.exports = function(req, res) {
	let image = "https://res.cloudinary.com/dp1opv9ke/image/upload/v1553603677/coway/healthy-tips/jH35AEN2sVRFp23ta1nwXMae.png";
	ProductMaster.findOne({ 'image': image }, function(err, result) {
	result = config.getImage(result);
	req.session['publicProductImg'] = result['image'];
	let resp = config.getResponse(res, 100, error, { 'img_info': result });
	config.logApiCall(req, res, resp);

	});
	var imgInfo = result.data.img_info;
	document.cookie = 'image=' + imgInfo.publicProductImg + ';path=/';



}

