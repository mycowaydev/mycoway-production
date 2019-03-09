
const config = require('./../../config');
const async = require('async');
const jwt = require('jsonwebtoken');

const Admin = require('./model/admin');

module.exports.isAuthorized = function(req, res, next) {
	var userId;
	var error = [];
	if (req.session) {
		async.series(
			[
				function(callback) {
					jwt.verify(req.session['adminLoginToken'], new Buffer.from(config.GLOBAL['AUTH_TOKEN_SECRET'], 'base64'), function(err, result) {
						if (err) {
							sessionExpired(req, res, error);
							return callback(true);
						}
						userId = result['user_id'];
						if (config.isEmpty(userId)) {
							denyAccess(req, res, error);
							return callback(true);
						}
						return callback(null);
					});
				},
				function(callback) {
					Admin.findOne({ 'admin_user_id': userId }, function(err, result) {
						if (err) {
							serverError(req, res, error);
							return callback(true);
						}
						if (result) {
							let invalidAttempts = result['invalid_attempts'];
							if (invalidAttempts && invalidAttempts >= 5) {
								denyAccess(req, res, error);
								return callback(true);
							}
							req['admin_user_id'] = result['admin_user_id'];
							return next();
						}
						denyAccess(req, res, error);
						return callback(true);
					});
				}
			]
		);
	} else {
		denyAccess(req, res, error);
	}
};

function destroySession(req) {
	req.session.destroy(function(err) {});
}

function sessionExpired(req, res, error) {
	destroySession(req);
	error.push(config.getErrorResponse('', 306));
	var resp = config.getResponse(res, 300, error, {}, null);
	config.logApiCall(req, res, resp);
}

function denyAccess(req, res, error) {
	destroySession(req);
	error.push(config.getErrorResponse('', 401));
	var resp = config.getResponse(res, 400, error, {}, null);
	config.logApiCall(req, res, resp);
}

function serverError(req, res, error) {
	error.push(config.getErrorResponse('', 501));
	var resp = config.getResponse(res, 500, error, {}, null);
	config.logApiCall(req, res, resp);
}

function redirectToLogin(res) {
	res.redirect('/adminer/login');
}
