const config = require('./../../../config');
const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    first_line: String,
    second_line: String,
    third_line: String,
    city: String,
    postcode: String,
    state: String,
    country: String
});

const schema = mongoose.Schema({
    email: String,
    image_ic: String,
    image_card: String,
    image_signature: String,
    phone_no: String,
    emergency_no: String,
    address: addressSchema,
    order_product: Array,
    order_date: { type: Number, default: config.getCurrentTimestamp() },
    status: String,
    remarks: String,
    created_by: String,
    created_date: { type: Number, default: config.getCurrentTimestamp() },
    opr_by: String,
    opr_date: { type: Number, default: config.getCurrentTimestamp() },
    opr_func: String

});
module.exports = mongoose.model('Order', schema, config.DB['TBL_ORDER']);
