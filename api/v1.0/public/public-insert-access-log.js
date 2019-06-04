
"use strict";
const config = require('../../../config');
const async = require('async');
const useragent = require('useragent');
const PublicAccessLog = require('../model/public-access-log');

module.exports = function (req, res, accessTo) {
	addAccessLog(req, res, accessTo);
}

function addAccessLog(req, res, accessTo) {
	var agent = useragent.parse(req.headers['user-agent']);

	var data = {};
    data.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    data.date = config.getCurrentTimestamp();
    data.access_to = accessTo;
	data.os = agent.os.toString();
    data.os_version = agent.os.toVersion();
    data.browser = agent.toAgent();
    data.browser_version = agent.toVersion();
    data.device = agent.device.toString();
    data.device_version = agent.device.toVersion();

	async.series(
		[
			function (callback) {
				return callback(null);
			},
			function (callback) {
				PublicAccessLog.create(data, function (err, result) {

				});
			}
		]
	);
}
