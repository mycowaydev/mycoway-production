const config = require('./../../../config');
const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
    original_price: Number,
    rental_price: Number,
    retail_price: Number
});

const schema = mongoose.Schema({
    name: String,
    product_type: String,
    price: Object,
    payment_type: Array,
    image: Array,
    gallery: Array,
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
