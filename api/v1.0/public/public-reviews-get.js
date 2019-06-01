"use strict";

const config = require('../../../config');
const async = require('async');
const Review = require('../model/review');

module.exports = function (req, res) {
	let data = getParam(req);
	let error = validateParam(req, data);

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		action(req, res, error, data);
	}
}

function getParam(req) {
	var data = {};
	return data;
}

function validateParam(req, data) {
	let error = [];
	return error;
}

function getQuery(data) {
	let query = { 'status': 'A' };
	return query;
}

function action(req, res, error, data) {
	Review.find(getQuery(data), function (err, result) {
        if (err) {
            error.push(config.getErrorResponse('101Z012', req));
            let resp = config.getResponse(res, 500, error, {}, err);
            config.logApiCall(req, res, resp);
            return;
        }
        let resp = config.getResponse(res, 100, error, result);
        config.logApiCall(req, res, resp);
        return;
    });
}