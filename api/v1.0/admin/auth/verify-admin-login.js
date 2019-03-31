const config = require('../../../../config');

const Admin = require('../../model/admin');

module.exports = function(req, res) {

	let error = [];

	let params = [
		'user_id',
		'password'
	];
	if (!config.isParamsExist(req, params)) {
		error.push(config.getErrorResponse('101Z002', req));
		let resp = config.getResponse(res, 300, error, {});
		config.logApiCall(req, res, resp);
		return;
	}

	let userId = req.body['user_id'];
	let password = req.body['password'];

	if (config.isEmpty(userId)) {
		error.push(config.getErrorResponse('101Y001', req));
	}
	if (config.isEmpty(password)) {
		error.push(config.getErrorResponse('101Y002', req));
	}
	if (error && error.length > 0) {
		let resp = config.getResponse(res, 200, error, {});
		config.logApiCall(req, res, resp);
	} else {
		verifyAdminLogin();
	}

	function verifyAdminLogin() {
		password = config.hashSHA256(password + config.GLOBAL['ADMIN_TMP_SECRET']);
		Admin.findOne({ 'admin_user_id': userId }, function(err, result) {
			if (err) {
				error.push(config.getErrorResponse('101Z012s', req));
				let resp = config.getResponse(res, 500, error, {}, err);
				config.logApiCall(req, res, resp);
				return;
			}
			if (result) {
				let pwd = result['admin_password'];
				let invalidAttempts = result['invalid_attempts'];
				if (invalidAttempts && invalidAttempts >= 5) {
					error.push(config.getErrorResponse('101Y004', req));
					let resp = config.getResponse(res, 200, error, {});
					config.logApiCall(req, res, resp);
					return;
				}
				if (pwd && password == pwd) {
					result = config.getAdminInfo(result);
					req.session['adminLoginToken'] = config.getNewToken(result['admin_user_id']);
					req.session['adminUsername'] = result['admin_username'];
					req.session['adminProfileImg'] = result['profile_img'];
					let resp = config.getResponse(res, 100, error, { 'admin_info': result });
					config.logApiCall(req, res, resp);
					return;
				} else {
					if (invalidAttempts) {
						invalidAttempts += 1;
					} else {
						invalidAttempts = 1;
					}
					updateAdmin(invalidAttempts);
				}
			}
			error.push(config.getErrorResponse('101Y003', req));
			let resp = config.getResponse(res, 200, error, {});
			config.logApiCall(req, res, resp);
		});
	}

	function updateAdmin(invalidAttempts) {
		let replacement = {
			'invalid_attempts': invalidAttempts
		};
		replacement = config.appendUpdatedDate(replacement, false);
		let query = {
			'admin_user_id': userId
		};
		let set = { $set: replacement };
		let options = { upsert: false, returnNewDocument: true, returnOriginal: false, new: true };
		Admin.findOneAndUpdate(query, set, options, function(err, result) {
			return;
		});
	}
};
