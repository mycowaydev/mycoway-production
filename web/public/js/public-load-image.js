"use strict";

// const config = require('../../../config');
// const async = require('async');
// const cloudinary = require('cloudinary');

// const ProductMaster = require('./model/product-master');

//  module.exports = function(req, res) {
	// let image = "https://res.cloudinary.com/dp1opv9ke/image/upload/v1553603677/coway/healthy-tips/jH35AEN2sVRFp23ta1nwXMae.png";
	// ProductMaster.findOne({ 'image': image }, function(err, result) {
	// result = config.getImage(result);
	// req.session['publicProductImg'] = result['image'];
	// let resp = config.getResponse(res, 100, error, { 'img_info': result });
	// config.logApiCall(req, res, resp);

	// });
	// var imgInfo = result.data.img_info;
	// document.cookie = 'image=' + imgInfo.publicProductImg + ';path=/';

	window.onload = function() {

		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');


		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					fileDisplayArea.innerHTML = "";

					var img = new Image();
					img.src = reader.result;

					fileDisplayArea.appendChild(img);
				}

				reader.readAsDataURL(file);	
			} else {
				fileDisplayArea.innerHTML = "File not supported!"
			}
		});

}

// }

