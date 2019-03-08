
const config = require('./config');
const express = require('express');
const path = require('path');

module.exports = function(apiVersion) {
	let router = express.Router();
	return router;
};
