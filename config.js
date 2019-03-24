
require('dotenv').config();

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const version = 'v1.0';
const deploymentType = { development: 1, staging: 2, production: 3 };
const isProduction = (process.env['DEPLOYMENT_TYPE'] || deploymentType['development']) == deploymentType['production'];
const locales = { en: 'en' };
const defaultLocale = locales['en'];

const Log = require('./api/' + version + '/model/log');
const Localize = require('./api/' + version + '/lang/localize');
const HashIds = require('hashids');
const Locale = new Localize(defaultLocale);

module.exports = Object.freeze({
	GLOBAL: {
		IS_PRODUCTION: isProduction,
		API_VERSION: version,
		APP_NAME: 'Coway',
		ADMIN_TMP_SECRET: process.env['ADMIN_TMP_SECRET'],
		SIGNATURE_SECRET: process.env['SIGNATURE_SECRET'],
		ENCRYPTION_KEY: process.env['ENCRYPTION_KEY'],
		HASH_IDS_KEY: process.env['HASH_IDS_KEY'],
		AUTH_TOKEN_SECRET: process.env['AUTH_TOKEN_SECRET'],
		AUTH_TOKEN_EXPIRES: isProduction ? (60 * 60 * 24 * 365) : (60 * 60 * 24 * 7), // 1 year : 1 week
		WEB_SESSION_EXPIRES: new Date(Date.now() + (60 * 60 * 24 * 7 * 1000)), // 1 week
		WEB_SESSION_SECRET: process.env['WEB_SESSION_SECRET'],
		PAGE_SIZE: 10
	},
	CDN: {
		NAME: isProduction ? process.env['CDN_NAME_PRODUCTION'] : process.env['CDN_NAME'],
		API_KEY: isProduction ? process.env['CDN_API_KEY_PRODUCTION'] : process.env['CDN_API_KEY'],
		API_SECRET: isProduction ? process.env['CDN_API_SECRET_PRODUCTION'] : process.env['CDN_API_SECRET']
	},
	DB: {
		URI: process.env['DB_URI'] || process.env['DB_DEVELOPMENT_URI'],
		TBL_ADMIN: 'tbl_admin',
		TBL_LOG: 'tbl_log',
		TBL_SESSION: 'tbl_session',
		TBL_HEALTHY_TIPS: 'tbl_healthy_tips',
		TBL_APPPARAM: 'tbl_app_param',
		TBL_MTPARAM: 'tbl_mt_param'
	},
	API: {
		_TEST: '_test',
		VERIFY_IS_ADMIN_EXISTS: 'verify-is-admin-exists',
		VERIFY_ADMIN_LOGIN: 'verify-admin-login',
		LOGOUT_ADMIN: 'logout-admin',
		ADMIN_GET_HEALTHY_TIP_LIST: 'admin-get-healthy-tip-list',
		ADMIN_GET_HEALTHY_TIP_INFO: 'admin-get-healthy-tip-info',
		ADMIN_ADD_HEALTHY_TIP: 'admin-add-healthy-tip',
		ADMIN_UPDATE_HEALTHY_TIP: 'admin-update-healthy-tip',
		ADMIN_REMOVE_HEALTHY_TIP: 'admin-remove-healthy-tip',
		ADMIN_GET_APP_PARAM_LIST: 'admin-get-app-param-list',
		ADMIN_GET_APP_PARAM_INFO: 'admin-get-app-param-info',
		ADMIN_ADD_APP_PARAM: 'admin-add-app-param',
		ADMIN_UPDATE_APP_PARAM: 'admin-update-app-param',
		ADMIN_REMOVE_APP_PARAM: 'admin-remove-app-param',
		ADMIN_GET_MT_PARAM_LIST: 'admin-get-mt-param-list',
		ADMIN_GET_MT_PARAM_INFO: 'admin-get-mt-param-info',
		ADMIN_ADD_MT_PARAM: 'admin-add-mt-param',
		ADMIN_UPDATE_MT_PARAM: 'admin-update-mt-param',
		ADMIN_REMOVE_MT_PARAM: 'admin-remove-mt-param'
	},
	setLocalizeFromReq: function(req) {
		var httpHeaders = req.headers;
		if (httpHeaders) {
			var appAcceptLanguage = httpHeaders['accept-language'];
			if (appAcceptLanguage && locales[appAcceptLanguage]) {
				return Locale.setLocalize(appAcceptLanguage);
			}
		}
		return Locale.setLocalize(defaultLocale);
	},
	translate: function(langKey, langCode) {
		return Locale.translate(langKey, langCode);
	},
	translateCode: function(langKey, langCode) {
		return Locale.translateCode(langKey, langCode);
	},
	getNewToken: function(userId) {
		return jwt.sign( 
			{ user_id: userId }, 
			new Buffer.from(this.GLOBAL['AUTH_TOKEN_SECRET'], 'base64'),
			{expiresIn: this.GLOBAL['AUTH_TOKEN_EXPIRES']}
		);
	},
	getLogInfo: function(info) {
		var newInfo = {};
		if (info) {
			newInfo['wsid'] = info['wsid'];
			newInfo['ip_address'] = info['ip_address'];
			newInfo['status_code'] = info['status_code'];
			newInfo['url_endpoint'] = info['url_endpoint'];
			try {
				var requestLog = JSON.parse(info['request']);
				newInfo['request'] = requestLog;
			} catch (ex) {
				newInfo['request'] = {};
			}
			try {
				var responseLog = JSON.parse(info['response']);
				newInfo['response'] = responseLog;
			} catch (ex) {
				newInfo['response'] = {};
			}
			newInfo['files'] = info['files'];
			newInfo['created_on'] = info['created_on'];
			newInfo['created_date'] = this.getFormattedDateTime(info['created_on'], 'YYYY-MM-DD');
		}
		return newInfo;
	},
	getFacebookInfo: function(info) {
		var newInfo = {};
		if (info) {
			newInfo['fb_id'] = info['id'];
			newInfo['name'] = info['displayName'];
			newInfo['gender'] = info['gender'];
			var name = info['name'];
			if (name) {
				newInfo['family_name'] = name['familyName'];
				newInfo['given_name'] = name['givenName'];
				newInfo['middle_name'] = name['middleName'];
			}
			var emails = info['emails'];
			if (emails && emails.length > 0) {
				newInfo['email'] = emails[0].value;
			}
			var photos = info['photos'];
			if (photos && photos.length > 0) {
				newInfo['photo'] = photos[0].value;
			}
		}
		return newInfo;
	},
	getGoogleInfo: function(info) {
		var newInfo = {};
		if (newInfo) {
			newInfo['google_id'] = info['sub'];
			newInfo['name'] = info['name'];
			newInfo['given_name'] = info['given_name'];
			newInfo['family_name'] = info['family_name'];
			newInfo['email'] = info['email'];
			newInfo['email_verified'] = info['email_verified'];
			newInfo['photo'] = info['picture'];
			newInfo['exp'] = info['exp'];
			newInfo['iss'] = info['iss'];
			newInfo['iat'] = info['iat'];
		}
		return newInfo;
	},
	getAdminInfo: function(info) {
		var newInfo = {};
		if (!this.isEmptyJsonObject(info)) {
			newInfo['admin_user_id'] = info['admin_user_id'];
			newInfo['admin_username'] = info['admin_username'];
			newInfo['profile_img'] = info['profile_img'];
			newInfo['created_on'] = info['created_on'];
			newInfo['created_date'] = this.getFormattedDateTime(info['created_on'], 'YYYY-MM-DD');
		}
		return newInfo;
	},
	getHealthyTipsInfo: function(info) {
		var newInfo = {};
		if (!this.isEmptyJsonObject(info)) {
			newInfo['healthy_tips_id'] = info['healthy_tips_id'];
			newInfo['title'] = info['title'];
			newInfo['description'] = info['description'];
			newInfo['image'] = info['image'];
			newInfo['created_on'] = info['created_on'];
			newInfo['created_date'] = this.getFormattedDateTime(info['created_on'], 'YYYY-MM-DD');
		}
		return newInfo;
	},
	getAppParamInfo: function(info) {
		var newInfo = {};
		if (!this.isEmptyJsonObject(info)) {
			newInfo['key'] = info['key'];
			newInfo['value'] = info['value'];
			newInfo['remarks'] = info['remarks'];
			newInfo['opr'] = info['opr'];
			newInfo['opr_date'] = this.getFormattedDateTime(info['opr_date'], 'YYYY-MM-DD');
			newInfo['opr_func'] = info['opr_func'];
		}
		return newInfo;
	},
	getMtParamInfo: function(info) {
		var newInfo = {};
		if (!this.isEmptyJsonObject(info)) {
			newInfo['group'] = info['group'];
			newInfo['code'] = info['code'];
			newInfo['value'] = info['value'];
			newInfo['order_no'] = info['order_no'];
			newInfo['active'] = info['active'];
			newInfo['remarks'] = info['remarks'];
			newInfo['opr'] = info['opr'];
			newInfo['opr_date'] = this.getFormattedDateTime(info['opr_date'], 'YYYY-MM-DD');
			newInfo['opr_func'] = info['opr_func'];
		}
		return newInfo;
	},
	isParamsExist: function(req, params) {
		var isEmpty = true;
		var isExists = true;
		params.push('wsid');
		params.push('signature');
		for (var p in req.body) {
			if (isEmpty) {
				isEmpty = false;
			}
			if (params.indexOf(p) < 0) {
				isExists = false;
				break;
			}
		}
		if (isEmpty) {
			isExists = false;
		}
		return isExists;
	},
	zeroPad: function(num, places) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join('0') + num;
	},
	getUniqueHashId: function(value) {
		var hashids = new HashIds(this.GLOBAL['HASH_IDS_KEY']);
		if (value) {
			value = this.hashSHA256(value, true);
		}
		return hashids.encodeHex(value);
	},
	hashSHA256: function(value, isHex) {
		try {
			return require('crypto').createHash('sha256').update(value).digest(isHex ? 'hex' : 'base64');
		} catch(ex) {
			return '';
		}
	},
	hashSHA1: function(value, isHex) {
		try {
			return require('crypto').createHash('sha1').update(value).digest(isHex ? 'hex' : 'base64');
		} catch(ex) {
			return '';
		}
	},
	concatString: function(...value) {
		var result = '';
		for (let v of value) {
			if (v) {
				result += v;
			}
		}
		return result;
	},
	getMaskedValue: function(value) {
		return value ? value.replace(/\w(?=\w{4})/g, '*') : value;
	},
	getFormattedDateTime: function(timestamp, dateTimeFormat) {
		return String(moment(timestamp * 1000).format(dateTimeFormat));
	},
	getCurrentTimestamp: function() {
		return Math.floor(Date.now() / 1000);
	},
	getString: function(value) {
		return value && value.length > 0 ? value : '-';
	},
	getPage: function(page) {
		try {
			page = parseInt(page) - 1;
			if (!page || page < 0) {
				page = 0;
			}
		} catch(ex) {
			page = 0;
		}
		return page;
	},
	hasJsonValue: function(jsonObj, value) {
		try {
			for (var key in jsonObj) {
				if (jsonObj[key] == value) {
					return true;
				}
			}
		} catch(ex) {}
		return false;
	},
	hasArrayValue: function(jsonObj, value) {
		try {
			let array = Object.values(jsonObj);
			return value.every(e => array.includes(e))
		} catch(ex) {}
		return false;
	},
	isEmpty: function(value) {
		return !value || String(value).trim().length <= 0;
	},
	isEmptyJsonObject: function(value) {
		try {
			for (var key in value) {
				if (value.hasOwnProperty(key)) {
					return false;
				}
			}
		} catch(ex) {}
		return true;
	},
	isValidEmail: function(value) {
		value = String(value).trim().toLowerCase();
		var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(value);
	},
	isValidContact: function(value) {
		value = String(value).trim();
		return value.length >= 9 && value.length <= 15 && this.isContainsDigitOnly(value);
	},
	isValidPassword: function(value) {
		// value = String(value).trim();
		return value.length >= 6 && this.isContainsAlphanumeric(value);
	},
	isValidUrl: function(value) {
		// value = String(value).trim();
		return /^http(s)?:\/\/(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value);
	},
	isContainsDigitOnly: function(value) {
		return /^\d+$/.test(value);
	},
	isContainsAlphanumeric: function(value) {
		return /^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i.test(value);
	},
	capitalizeFirstLetter: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	appendUpdatedDate: function(obj) {
		obj['updated_on'] = this.getCurrentTimestamp();
		obj['updated_date'] = new Date().toISOString();
		return obj;
	},
	appendCommonFields: function(obj, opr_func) {
		obj['opr_date'] = this.getCurrentTimestamp();
		obj['opr_func'] = opr_func;
		return obj;
	},
	logApiCall: function(req, res, resp) {
		var obj = {
			'wsid': req.body['wsid'],
			'ip_address': req.connection['remoteAddress'],
			'status_code': res['statusCode'],
			'url_endpoint': req['originalUrl'],
			'request': JSON.stringify(req.body),
			'response': resp,
			'files': JSON.stringify(req.files),
			'created_on': this.getCurrentTimestamp(),
			'created_date': new Date().toISOString()
		};
		Log.create(obj);
	},
	getResponse: function(res, statusCode, error, data, err, ignoreResSend) {

		var response = {};

		response['status_code'] = statusCode;
		response['error'] = error;
		response['data'] = data;

		var jsonResponse = JSON.stringify(response);
		if (!ignoreResSend) {
			res.send(jsonResponse);
		}

		if (err) {
			response['err_log'] = err;
			response['err_msg'] = err['message'];
			jsonResponse = JSON.stringify(response);
		}

		return jsonResponse;

	},
	getErrorResponse: function(module, code) {
		var resCode = code;
		var resMessage = '';
		switch(module) {
			case this.API['VERIFY_ADMIN_LOGIN']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_admin_login_user_id_empty'); break; }
					case 202: { resMessage = this.translate('error_admin_login_password_empty'); break; }
					case 203: { resMessage = this.translate('error_admin_login_user_id_password_invalid'); break; }
					case 204: { resMessage = this.translate('error_admin_login_acc_blocked'); break; }
				}
				break;
			}
			case this.API['ADMIN_GET_HEALTHY_TIP_INFO']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_healthy_tips_id_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_ADD_HEALTHY_TIP']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_title_empty'); break; }
					case 202: { resMessage = this.translate('error_description_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_UPDATE_HEALTHY_TIP']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_healthy_tips_id_empty'); break; }
					case 202: { resMessage = this.translate('error_title_empty'); break; }
					case 203: { resMessage = this.translate('error_description_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_REMOVE_HEALTHY_TIP']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_healthy_tips_id_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_GET_APP_PARAM_INFO']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_app_param_id_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_ADD_APP_PARAM']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_app_param_id_empty'); break; }
					case 202: { resMessage = this.translate('error_value_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_UPDATE_APP_PARAM']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_app_param_id_empty'); break; }
					case 202: { resMessage = this.translate('error_value_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_REMOVE_APP_PARAM']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_app_param_id_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_GET_MT_PARAM_INFO']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_group_empty'); break; }
					case 202: { resMessage = this.translate('error_code_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_ADD_MT_PARAM']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_group_empty'); break; }
					case 202: { resMessage = this.translate('error_code_empty'); break; }
					case 203: { resMessage = this.translate('error_value_empty'); break; }
					case 204: { resMessage = this.translate('error_order_no_empty'); break; }
					case 205: { resMessage = this.translate('error_active_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_UPDATE_MT_PARAM']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_group_empty'); break; }
					case 202: { resMessage = this.translate('error_code_empty'); break; }
					case 203: { resMessage = this.translate('error_value_empty'); break; }
					case 204: { resMessage = this.translate('error_order_no_empty'); break; }
					case 205: { resMessage = this.translate('error_active_empty'); break; }
				}
				break;
			}
			case this.API['ADMIN_REMOVE_MT_PARAM']: {
				switch(code) {
					case 201: { resMessage = this.translate('error_group_empty'); break; }
					case 202: { resMessage = this.translate('error_code_empty'); break; }
				}
				break;
			}
			default: {
				switch(code) {
					case 301: { resMessage = this.translate('error_session_expired'); break; }
					case 302: { resMessage = this.translate('error_bad_request'); break; }
					case 303: { resMessage = this.translate('error_signature_empty'); break; }
					case 304: { resMessage = this.translate('error_signature_invalid'); break; }
					case 305: { resMessage = this.translate('error_account_deactivated'); break; }
					case 306: { resMessage = this.translate('error_admin_session_expired'); break; }
					case 307: { resMessage = this.translate('error_account_been_used'); break; }
					case 308: { resMessage = this.translate('error_account_blocked'); break; }
					case 309: { resMessage = this.translate('error_account_suspended'); break; }
					case 401: { resMessage = this.translate('error_unauthorized_access'); break; }
					case 404: { resMessage = this.translate('error_page_not_found'); break; }
					case 501: { resMessage = this.translate('error_server_error'); break; }
				}
				break;
			}
		}
		return { 'code': resCode, 'message': resMessage };
	}
});