const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
    id: String,
    name: String,
    type: String,
    status: String,
    detail: Array,
    image: Array,
    service: Array,
    desc: String,
    publish_date: { type: Number, default: config.getCurrentTimestamp() },
    unpublish_date: { type: Number, default: config.getCurrentTimestamp() },
    remark: String,
    create_by: String,
    create_date: { type: Number, default: config.getCurrentTimestamp() },
    opr: String,
    opr_date: { type: Number, default: config.getCurrentTimestamp() },
    opr_func: String
    
});
module.exports = mongoose.model('ProductMaster', schema, config.DB['TBL_PRODUCT_MASTER']);
