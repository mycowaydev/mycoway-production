const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name: String,
    desc: String,
    price: Double,
    compare_price: Double,
    status: String,
    remarks: String,
    created_by: String,
    created_date: { type: Number, default: config.getCurrentTimestamp() },
    opr_by: String,
    opr_date: { type: Number, default: config.getCurrentTimestamp() },
    opr_func: String
});
module.exports = mongoose.model('ProductDetail', schema, config.DB['TBL_PRODUCT_DETAIL']);
