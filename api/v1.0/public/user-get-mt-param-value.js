"use strict";

const config = require('../../../config');
const async = require('async');
const MtParam = require('../model/mt-param');

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
	data.group = req.body['group'];
	data.code = req.body['code'];
	return data;
}

function validateParam(req, data) {
	let error = [];
    if (config.isEmpty(data.group)) {
		error.push(config.getErrorResponse('101A008', req));
	} else if (config.isEmpty(data.code)) {
        error.push(config.getErrorResponse('101A008', req));
	}
	return error;
}

function getQuery(data) {
	let query = {
	    'group': data.group,
	    'code': data.code
    };
	return query;
}

function action(req, res, error, data) {
	MtParam.findOne(getQuery(data), function (err, result) {
        if (err) {
            error.push(config.getErrorResponse('101Z012', req));
            let resp = config.getResponse(res, 500, error, {}, err);
            config.logApiCall(req, res, resp);
            return;
        }
//        console.log(Object.entries(result._doc.value))
        let resp = config.getResponse(res, 100, error, result._doc.value);
        config.logApiCall(req, res, resp);
        return;
    });
}