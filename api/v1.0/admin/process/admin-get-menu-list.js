
"use strict";

const config = require('../../../../config');
const Menu = require('../../model/menu');

module.exports = function (req, res) {
    let error = [];

    if (error && error.length > 0) {
        let resp = config.getResponse(res, 200, error, {}, null);
        config.logApiCall(req, res, resp);
    } else {
        adminGetMenuList(req, res);
    }
}

function adminGetMenuList(req, res) {
    let error = [];

    getChild()
        .then(result => {
            let resp = config.getResponse(res, 100, error, {
                'menu_list': arrangeSubFolder(result, '')
            });
            config.logApiCall(req, res, resp);
            return;
        })
        .catch(err => {
            error.push(config.getErrorResponse('101Z012', req));
            let resp = config.getResponse(res, 500, error, {}, err);
            config.logApiCall(req, res, resp);
            return;
        });
}

function getChild() {
    return new Promise((resolve, reject) => {
        Menu.find({ status: 'A' }, function (error, data) {
            if (error) {
                return reject(error);
            } else {
                return resolve(data);
            }
        });
    });
}

function arrangeSubFolder(data, parent_id) {
    var stack = [];

    for (var row = 0; row < data.length; row++) {
        if (data[row].parent_id == parent_id) {
            stack.push({
                id: data[row]._id,
                title: data[row].title,
                type: data[row].type,
                value: data[row].value,
                status: data[row].status,
                remarks: data[row].remarks,
                opr_by: data[row].opr_by,
                opr_date: data[row].opr_date,
                opr_func: data[row].opr_func,
                sub_folder: arrangeSubFolder(data, data[row]._id)
            });
        }
    }

    return stack;
}