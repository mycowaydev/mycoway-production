
"use strict";
const config = require('../../../../config');
const PublicAccessLog = require('../../model/public-access-log');

module.exports = function (req, res) {
	let error = [];
	let query = getParam(req);

	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {}, null);
		config.logApiCall(req, res, resp);
	} else {
		getTrafficAgg(req, res, error, query);
	}
}

function getParam(req) {
	var data = {};
	data.month_range = req.body['month_range'] || 6;
	return data;
}

function getTrafficAgg(req, res, error, query) {

    var now = new Date();
    var backward = new Date(now.setMonth(now.getMonth() - query.month_range + 1 ));
    var firstDay = new Date(now.getFullYear(), backward.getMonth(), 1);

    PublicAccessLog.aggregate([
        {
            $match: {
                "date" : { $gt: firstDay },
                "ip" : { $ne: '::1' }
            }
        },
        {
            $project: {
                month: { $month: "$date" },
                year: { $year: "$date" },
                ip: "$ip"
            }
        },
        {
            $group : {
                _id: {
                    year: "$year",
                    month: "$month",
                    ip: "$ip"
                }
            }
        },
        {
            $group : {
                _id: {
                    year: "$_id.year",
                    month: "$_id.month"
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ], function (err, result) {
        if (err) {
            console.log(err)
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