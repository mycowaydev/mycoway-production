const config = require('./../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
    ID: String,
    NAME: String,
    TYPE: String,
    STATUS: String,
    DETAIL: Array,
    IMAGE: Array,
    SERVICE: Array,
    DESC: String,
    PUBLISH_DATE: timestamp,
    UNPUBLISH_DATE: timestamp,
    REMARK: String,
    CREATE_BY: String,
    CREATE_DATE: timestamp,
    OPR: String,
    OPR_DATE: timestamp,
    OPR_FUNC: String,
    
});
module.exports = mongoose.model('ProductMaster', schema, config.DB['TBL_PRODUCT_MASTER']);