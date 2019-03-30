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
    publish_date: timestamp,
    unpublish_date: timestamp,
    remark: String,
    create_by: String,
    create_date: timestamp,
    opr: String,
    opr_date: timestamp,
    opr_func: String
    
});
module.exports = mongoose.model('ProductMaster', schema, config.DB['TBL_PRODUCT_MASTER']);
