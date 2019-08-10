
"use strict";

const config = require('../../../config');
const async = require('async');
const cloudinary = require('cloudinary');
const Order = require('../model/order');
const MtParam = require('../model/mt-param');

const nodemailer = require("nodemailer");
const handlebars = require('handlebars');
const fs = require('fs');

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

module.exports = function (req, res) {
	cloudinary.config({
		cloud_name: config.CDN['NAME'],
		api_key: config.CDN['API_KEY'],
		api_secret: config.CDN['API_SECRET']
	});

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

	data.email = req.body['email'];
	data.image_ic = req.body['image_ic'];
	data.image_card = req.body['image_card'];
	data.image_signature = req.body['image_signature'];
	data.phone_no = req.body['phone_no'];
	data.emergency_no = req.body['emergency_no'];
	data.address = req.body['address'];
	data.order_product = req.body['order_product'];
	data.voucher_code = req.body['voucher_code'];
	data.order_date = config.getCurrentTimestamp();
	data.status = req.body['status'];
	data.remarks = req.body['remarks'];

	return data;
}

function validateParam(req, data) {
	let error = [];
    if (config.isEmpty(data.email)) {
        error.push(config.getErrorResponse('101A008 email', req));
    }
    if (config.isEmpty(data.image_ic)) {
        error.push(config.getErrorResponse('101A008 image_ic', req));
    }
    if (config.isEmpty(data.image_card)) {
        error.push(config.getErrorResponse('101A008 image_card', req));
    }
    if (config.isEmpty(data.image_signature)) {
        error.push(config.getErrorResponse('101A008 image_signature', req));
    }
    if (config.isEmpty(data.phone_no)) {
        error.push(config.getErrorResponse('101A008 phone_no', req));
    }
    if (config.isEmpty(data.address)) {
        error.push(config.getErrorResponse('101A008 address', req));
    }
    if (config.isEmpty(data.order_product)) {
        error.push(config.getErrorResponse('101A008 order_product', req));
    }
    if (config.isEmpty(data.order_date)) {
        error.push(config.getErrorResponse('101A008 order_date', req));
    }
    if (config.isEmpty(data.status)) {
        error.push(config.getErrorResponse('101A008 status', req));
    }
	return error;
}

async function sendEmail(returnedObj){
    let transporter;
    var order_detail = returnedObj.order;
    var payment_type_map = returnedObj.payment_type.reduce(function(map, obj) {
        map[obj.code] = obj.value;
        return map;
    }, {});

    order_detail.order_product.forEach(obj => {
        obj['payment_type_value'] = payment_type_map[obj.payment_type];
    });

    if (config.MAIL['SERVICE']=='gmail'){
        transporter = nodemailer.createTransport({
            host: config.MAIL['HOST'], //smtp.gmail.com
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: config.MAIL['USER'],
                clientId : config.MAIL['CLIENT_ID'],
                clientSecret: config.MAIL['CLIENT_SECRET'],
                refreshToken: config.MAIL['CLIENT_REFRESH_TOKEN']
            }
        });
    } else {
        transporter = nodemailer.createTransport({
            host: config.MAIL['HOST'], // smtp-mail.outlook.com
            secureConnection: false,
            port: 587,
            auth: {
                user: config.MAIL['USER'],
                pass: config.MAIL['PASSWORD']
            },
            tls: {
                ciphers:'SSLv3'
            }
        });
    }

    readHTMLFile(__dirname + '/order-confirmation-mail.html', function(err, html) {
        var date_str = new Date(Number(order_detail.order_date)*1000)
        var template = handlebars.compile(html);
        var replacements = {
             order_num: order_detail._id,
             date: date_str,
             phone_no: order_detail.phone_no,
             emergency_phone_no: order_detail.emergency_no,
             email: order_detail.email,
             first_line: order_detail.address.first_line,
             second_line: order_detail.address.second_line,
             third_line: order_detail.address.third_line,
             city: order_detail.address.city,
             postcode: order_detail.address.postcode,
             state: order_detail.address.state,
             country: order_detail.address.country,
             product_list: order_detail.order_product,
             order_status_url: config.MAIL['DOMAIN_SITE'] + 'order-status?id=' + order_detail._id
        };
        var htmlToSend = template(replacements);

        var mailOptions = {
            from: config.MAIL['USER'],
            to: order_detail.email,
            subject: "Coway Order Confirmation",
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else if(response.messageId){
                console.log("Message sent: %s", response.messageId);
            }
        });
    });
}

function action(req, res, error, data) {
    var returnVal = {};
    let insertData = config.appendCommonFields(data, 'ORDER_ADD', 'user', true);
	async.series(
		[
			function (callback) {
                var image = data.image_ic;
                if (typeof image !== 'undefined') {
                    let tmpPath = image.path;
                    let indexOfSeparator = tmpPath.lastIndexOf("/");
                    if (indexOfSeparator <= 0) {
                        indexOfSeparator = tmpPath.lastIndexOf("\\");
                    }
                    let indexOfDot = tmpPath.lastIndexOf(".");
                    if (indexOfDot <= 0) {
                        indexOfDot = tmpPath.length;
                    }
                    let filename = tmpPath.substring(indexOfSeparator + 1, tmpPath.length - (tmpPath.length - indexOfDot));
                    cloudinary.v2.uploader.upload(tmpPath,
                        {
                            public_id: config.GLOBAL['APP_NAME'].toLowerCase() + '/order/' + filename,
                            resource_type: "auto"
                        },
                        function(err, result) {
                        if (err) {
                            error.push(config.getErrorResponse('101Z012', req));
                            let resp = config.getResponse(res, 500, error, {}, err);
                            config.logApiCall(req, res, resp);
                            return callback(true);
                        }
                        insertData['image_ic'] = result['secure_url'];
                        return callback(null);
                    });
                } else {
                    return callback(null);
                }
			},
			function (callback) {
                var image = data.image_card;
                if (typeof image !== 'undefined') {
                    let tmpPath = image.path;
                    let indexOfSeparator = tmpPath.lastIndexOf("/");
                    if (indexOfSeparator <= 0) {
                        indexOfSeparator = tmpPath.lastIndexOf("\\");
                    }
                    let indexOfDot = tmpPath.lastIndexOf(".");
                    if (indexOfDot <= 0) {
                        indexOfDot = tmpPath.length;
                    }
                    let filename = tmpPath.substring(indexOfSeparator + 1, tmpPath.length - (tmpPath.length - indexOfDot));
                    cloudinary.v2.uploader.upload(tmpPath,
                        {
                            public_id: config.GLOBAL['APP_NAME'].toLowerCase() + '/order/' + filename,
                            resource_type: "auto"
                        },
                        function(err, result) {
                        if (err) {
                            error.push(config.getErrorResponse('101Z012', req));
                            let resp = config.getResponse(res, 500, error, {}, err);
                            config.logApiCall(req, res, resp);
                            return callback(true);
                        }
                        insertData['image_card'] = result['secure_url'];
                        return callback(null);
                    });
                } else {
                    return callback(null);
                }
			},
			function (callback) {
                var image = data.image_signature;
                if (typeof image !== 'undefined') {
                    let tmpPath = image.path;
                    let indexOfSeparator = tmpPath.lastIndexOf("/");
                    if (indexOfSeparator <= 0) {
                        indexOfSeparator = tmpPath.lastIndexOf("\\");
                    }
                    let indexOfDot = tmpPath.lastIndexOf(".");
                    if (indexOfDot <= 0) {
                        indexOfDot = tmpPath.length;
                    }
                    let filename = tmpPath.substring(indexOfSeparator + 1, tmpPath.length - (tmpPath.length - indexOfDot));
                    cloudinary.v2.uploader.upload(tmpPath,
                        {
                            public_id: config.GLOBAL['APP_NAME'].toLowerCase() + '/order/' + filename,
                            resource_type: "auto"
                        },
                        function(err, result) {
                        if (err) {
                            error.push(config.getErrorResponse('101Z012', req));
                            let resp = config.getResponse(res, 500, error, {}, err);
                            config.logApiCall(req, res, resp);
                            return callback(true);
                        }
                        insertData['image_signature'] = result['secure_url'];
                        return callback(null);
                    });
                } else {
                    return callback(null);
                }
            },
			function (callback) {
				Order.create(insertData, function (err, result) {
					if (err) {
						error.push(config.getErrorResponse('101Z012', req));
						let resp = config.getResponse(res, 500, error, {}, err);
						config.logApiCall(req, res, resp);
						return callback(true);
					}
					returnVal['order'] = result;
                    MtParam.find({'group': 'PRODUCT_PAYMENT'} , function (err, result) {
                        if (err) {
                            error.push(config.getErrorResponse('101Z012', req));
                            let resp = config.getResponse(res, 500, error, {}, err);
                            config.logApiCall(req, res, resp);
                            return;
                        }
                        returnVal['payment_type'] = result;
                        let resp = config.getResponse(res, 100, error, returnVal);
                        config.logApiCall(req, res, resp);
                        sendEmail(returnVal).catch(console.error);
                        return;
                    });
				});
			}
		]
	);
}