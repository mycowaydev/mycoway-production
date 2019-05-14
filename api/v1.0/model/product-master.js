const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name: String,
    type: String,
    detail: Array,
    image: Array,
    service: Array,
    desc: String,
    publish_date: { type: Number, default: config.getCurrentTimestamp() },
    unpublish_date: { type: Number, default: config.getCurrentTimestamp() },
    status: String,
    remarks: String,
    created_by: String,
    created_date: { type: Number, default: config.getCurrentTimestamp() },
    opr_by: String,
    opr_date: { type: Number, default: config.getCurrentTimestamp() },
    opr_func: String
});
module.exports = mongoose.model('ProductMaster', schema, config.DB['TBL_PRODUCT_MASTER']);
