const config = require('../../../config');
const mongoose = require('mongoose');
const schema = mongoose.Schema({
    ip: String,
    date: Number,
    access_to: String,
    os: String,
    os_version: String,
    browser: String,
    browser_version: String,
    device: String,
    device_version: String
});
module.exports = mongoose.model('PublicAccessLog', schema, config.DB['TBL_PUBLIC_ACCESS_LOG']);
