"use strict";

// const config = require('../../../config');
// const async = require('async');
// const cloudinary = require('cloudinary');

// const ProductMaster = require('../../../api/v1.0/model/product-master');

//  module.exports = function(req, res) {
	window.onload = function() {
		alert("here")
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


	
		// ProductMaster.find({ 'image': image }, function(err, result) {
		// 	if (err) {
		// 		error.push(config.getErrorResponse('', 501));
		// 		let resp = config.getResponse(res, 500, error, {}, err);
		// 		config.logApiCall(req, res, resp);
		// 		return;
		// 	}
		// 	if (result) {
		// 			result = config.getImage(result);
		// 			req.session['publicImage'] = result['image'];
		// 			let resp = config.getResponse(res, 100, error, { 'image_info': result });
		// 			config.logApiCall(req, res, resp);
		// 			return;
		// 	}
		// 	error.push(config.getErrorResponse(config.API['VERIFY_ADMIN_LOGIN'], 203));
		// 	let resp = config.getResponse(res, 200, error, {});
		// 	config.logApiCall(req, res, resp);
		// });
	


// }

