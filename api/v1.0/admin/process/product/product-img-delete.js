"use strict";
const config = require('../../../../../config');

module.exports = function (req, res) {

	console.log("req :: " + JSON.stringify(req.body));
	let resp = getResponse2(res, 100);
	config.logApiCall(req, res, resp);
}

function getResponse2(res, statusCode) {

	var response = {};
	response['status_code'] = statusCode;
	var jsonResponse = JSON.stringify(response);
	res.send(jsonResponse);
}

